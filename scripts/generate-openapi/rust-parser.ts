import fs from 'fs';
import path from 'path';
import type { Route, RustHandlerInfo, RustStruct, RustStructField, JsonSchema } from './types.js';

function tagFromPath(p: string): string {
  const segments = p.split('/').filter(s => s && !s.startsWith('{'));
  return segments[0] ?? 'default';
}

// Map Rust HTTP method to uppercase string
function rustMethodToHttp(method: string): string {
  return method.toUpperCase();
}

// Rust type → JSON Schema
export function rustTypeToJsonSchema(rustType: string): JsonSchema {
  const t = rustType.trim();

  // Malformed / truncated types from parser edge cases — return opaque
  if (!t || t.startsWith('(') || (t.endsWith('>') && !t.includes('<'))) return {};

  // For simple non-generic types, strip module path prefix early so primitive
  // checks work (e.g. "crate::FlexibleI64" → "FlexibleI64")
  if (!t.includes('<') && t.includes('::')) {
    return rustTypeToJsonSchema(t.split('::').pop()!);
  }

  if (t === 'String' || t === '&str' || t === 'str' || t.startsWith("&'") && t.endsWith('str')) return { type: 'string' };
  if (t === 'i64' || t === 'i32' || t === 'i8' || t === 'u64' || t === 'u32' || t === 'usize' ||
      t === 'u8' || t === 'u16' || t === 'FlexibleI64' || t === 'StatusCode') {
    return { type: 'integer' };
  }
  if (t === 'f64' || t === 'f32' || t === 'Decimal') return { type: 'number' };
  if (t === 'bool') return { type: 'boolean' };
  if (t === 'serde_json::Value' || t === 'Value' || t === 'JsonValue') return {};
  if (t.startsWith('Box<')) {
    const inner = t.slice(4, -1);
    return rustTypeToJsonSchema(inner);
  }
  if (t.startsWith('Option<')) {
    const inner = t.slice(7, -1);
    return { ...rustTypeToJsonSchema(inner), nullable: true };
  }
  if (t.startsWith('Vec<')) {
    const inner = t.slice(4, -1);
    return { type: 'array', items: rustTypeToJsonSchema(inner) };
  }
  if (t.startsWith('HashMap<') || t.startsWith('BTreeMap<') || t.startsWith('IndexMap<')) {
    return { type: 'object', additionalProperties: true };
  }
  if (t === 'DateTime<Utc>' || t === 'NaiveDateTime' || t === 'NaiveDate') {
    return { type: 'string', format: 'date-time' };
  }
  if (t === 'Uuid') return { type: 'string', format: 'uuid' };

  // Generic type parameter (single capital letter) — opaque
  if (/^[A-Z]$/.test(t)) return {};

  // Known type aliases (use → as type alias in handler files)
  const typeAliases: Record<string, string> = {
    'WebhookEndpointDto': 'WebhookEndpoint',
  };
  if (typeAliases[t]) return { $ref: `#/components/schemas/${typeAliases[t]}` };

  // Infrastructure/internal types that are not part of the public API schema
  const infraTypes = new Set(['S3Client', 'NatsClient', 'NatsJetStream', 'WachtClient',
    'Sonyflake', 'RedisClient', 'TextProcessingService', 'DbRouter', 'Client',
    'AppState', 'Arc', 'Mutex', 'RwLock']);
  if (infraTypes.has(t)) return {};

  // Strip module path prefix (e.g., models::webhook::Foo → Foo)
  const typeName = t.includes('::') ? t.split('::').pop()! : t;
  // If stripping left a malformed name (e.g., "Foo>"), fall back to opaque
  if (typeName.includes('<') || typeName.includes('>') || typeName.startsWith('(')) return {};
  return { $ref: `#/components/schemas/${typeName}` };
}

// Build a map of fn_name → routes by parsing all .rs files in router dir
function buildRouterFunctionMap(routerDir: string): Map<string, Route[]> {
  const fnMap = new Map<string, Route[]>();

  function readAllFiles(dir: string): string[] {
    const files: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) files.push(...readAllFiles(fullPath));
      else if (entry.name.endsWith('.rs')) files.push(fullPath);
    }
    return files;
  }

  for (const file of readAllFiles(routerDir)) {
    const content = fs.readFileSync(file, 'utf-8');
    extractFunctionRoutes(content, fnMap);
  }

  return fnMap;
}

// Extract all pub/private fn definitions and their direct .route() calls from a file
function extractFunctionRoutes(content: string, fnMap: Map<string, Route[]>) {
  // Match function definitions — capture name and body (up to the final closing brace)
  // We use a simple brace-counting approach
  const fnRe = /(?:pub(?:\(super\))?\s+)?fn\s+(\w+)\s*\([^)]*\)[^{]*\{/g;
  let m: RegExpExecArray | null;

  while ((m = fnRe.exec(content)) !== null) {
    const fnName = m[1];
    const bodyStart = m.index + m[0].length - 1; // position of opening {
    const body = extractBraceBlock(content, bodyStart);
    if (!body) continue;

    const routes: Route[] = [];
    parseRustRouterFile(body, routes);
    if (routes.length > 0) {
      const existing = fnMap.get(fnName) ?? [];
      fnMap.set(fnName, [...existing, ...routes]);
    }
  }
}

// Collect routes reachable from a set of entry function names by following .merge(fn()) calls
function collectRoutes(
  entryFns: string[],
  fnMap: Map<string, Route[]>,
  allContent: string,
): Route[] {
  const visited = new Set<string>();
  const routes: Route[] = [];

  function visit(fnName: string) {
    if (visited.has(fnName)) return;
    visited.add(fnName);

    // Add direct routes
    const direct = fnMap.get(fnName) ?? [];
    routes.push(...direct);

    // Follow .merge(sub_fn()) and sub_fn() calls within this function's body
    // Find the function body in allContent
    const fnBodyRe = new RegExp(`fn\\s+${fnName}\\s*\\([^)]*\\)[^{]*\\{`);
    const fnMatch = fnBodyRe.exec(allContent);
    if (!fnMatch) return;

    const body = extractBraceBlock(allContent, fnMatch.index + fnMatch[0].length - 1);
    if (!body) return;

    // Find all merge(fn_name()) or fn_name() calls
    const mergeRe = /(?:\.merge\(|^|\s)(\w+)\(\)/gm;
    let mergeMatch: RegExpExecArray | null;
    while ((mergeMatch = mergeRe.exec(body)) !== null) {
      const calledFn = mergeMatch[1];
      if (calledFn !== fnName && fnMap.has(calledFn)) {
        visit(calledFn);
      }
    }

    // Also follow super::fn_name() and super::module::fn_name() calls
    const superRe = /super::(?:\w+::)*(\w+)\(\)/g;
    while ((mergeMatch = superRe.exec(body)) !== null) {
      const calledFn = mergeMatch[1];
      if (calledFn !== fnName && fnMap.has(calledFn)) {
        visit(calledFn);
      }
    }
  }

  for (const fn of entryFns) visit(fn);
  return routes;
}

// Extract the content of a brace-delimited block starting at the opening brace position
function extractBraceBlock(content: string, openBracePos: number): string | null {
  if (content[openBracePos] !== '{') return null;
  let depth = 0;
  let i = openBracePos;
  while (i < content.length) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) return content.slice(openBracePos + 1, i);
    }
    i++;
  }
  return null;
}

// Entry point for backend API routes only
export function parseRustRoutes(platformApiDir: string, routerSubpath = 'platform/src/application/router'): Route[] {
  const routerDir = path.join(platformApiDir, routerSubpath);
  if (!fs.existsSync(routerDir)) return [];

  // Build map of fn → routes across all router files
  const fnMap = buildRouterFunctionMap(routerDir);

  // Read all router content for body tracing
  const allContent = fs.readdirSync(routerDir, { withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith('.rs'))
    .map(e => fs.readFileSync(path.join(routerDir, e.name), 'utf-8'))
    .join('\n');

  // Backend router entry point merges: base_deployment_routes, ai_routes, backend_specific_routes
  const backendEntryFns = ['base_deployment_routes', 'ai_routes', 'backend_specific_routes'];
  const routes = collectRoutes(backendEntryFns, fnMap, allContent);

  // Deduplicate
  const seen = new Set<string>();
  return routes.filter(r => {
    const key = `${r.method}:${r.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseRustRouterFile(content: string, routes: Route[]) {
  const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
  const routeStartRe = /\.route\(\s*"([^"]+)"\s*,\s*/g;
  let m: RegExpExecArray | null;

  while ((m = routeStartRe.exec(content)) !== null) {
    const routePath = m[1];
    const handlersStart = m.index + m[0].length;

    // Extract balanced content inside .route("path", HERE) by counting parens
    let depth = 1;
    let i = handlersStart;
    while (i < content.length && depth > 0) {
      if (content[i] === '(') depth++;
      else if (content[i] === ')') depth--;
      i++;
    }
    const handlersExpr = content.slice(handlersStart, i - 1);

    // Find all method(handler) pairs — handles chained: get(fn).post(fn2).patch(fn3)
    const methodRe = new RegExp(`(${httpMethods.join('|')})\\(([^)]+)\\)`, 'g');
    let mm: RegExpExecArray | null;
    while ((mm = methodRe.exec(handlersExpr)) !== null) {
      const method = rustMethodToHttp(mm[1]);
      const handlerFull = mm[2].trim();
      const handlerFn = handlerFull.split('::').pop()!;
      routes.push({
        method,
        path: routePath,
        handlerFn,
        tag: tagFromPath(routePath),
        rawPath: routePath,
      });
    }
  }
}

export function parseRustHandlers(platformApiDir: string, apiSubpath = 'platform/src/api'): Map<string, RustHandlerInfo> {
  const handlers = new Map<string, RustHandlerInfo>();
  const apiDir = path.join(platformApiDir, apiSubpath);

  if (!fs.existsSync(apiDir)) return handlers;

  function walkDir(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walkDir(fullPath);
      else if (entry.name.endsWith('.rs')) {
        parseRustHandlerFile(fs.readFileSync(fullPath, 'utf-8'), handlers);
      }
    }
  }

  walkDir(apiDir);
  return handlers;
}

function parseRustHandlerFile(content: string, handlers: Map<string, RustHandlerInfo>) {
  // Match async fn handler_name(...) -> ApiResult<T>
  // Handles nested generics like PaginatedResponse<Foo> by allowing one level of <> inside
  const fnRe = /pub\s+async\s+fn\s+(\w+)\s*\(([^{]*?)\)\s*->\s*ApiResult<((?:[^<>]|<[^<>]*>)*)>/gs;
  let m: RegExpExecArray | null;

  while ((m = fnRe.exec(content)) !== null) {
    const fnName = m[1];
    const params = m[2];
    const responseType = m[3].trim();

    const info: RustHandlerInfo = { responseType };

    // Json<T>
    const jsonMatch = params.match(/Json\([^)]*\)\s*:\s*Json<([^>]+)>/);
    if (jsonMatch) info.jsonBodyType = jsonMatch[1].trim();

    // QueryParams<T> or Query<T>
    const queryMatch = params.match(/(?:QueryParams|Query)\([^)]*\)\s*:\s*(?:QueryParams|Query)<([^>]+)>/);
    if (queryMatch) info.queryParamsType = queryMatch[1].trim();

    // Path<T>
    const pathMatch = params.match(/Path\([^)]*\)\s*:\s*Path<([^>]+)>/);
    if (pathMatch) info.pathParamsType = pathMatch[1].trim();

    // Multipart
    if (params.includes('Multipart') || params.includes('multipart')) {
      info.hasMultipart = true;
    }

    handlers.set(fnName, info);
  }
}

export function parseRustDTOs(
  platformApiDir: string,
  dtoSubpath = 'dto/src',
  modelsSubpath = 'models/src',
  extraSubpaths: string[] = [],
): Map<string, RustStruct> {
  const structs = new Map<string, RustStruct>();

  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walkDir(fullPath);
      else if (entry.name.endsWith('.rs')) {
        parseRustFile(fs.readFileSync(fullPath, 'utf-8'), structs);
      }
    }
  }

  // Scan all known source directories
  for (const subpath of [dtoSubpath, modelsSubpath, ...extraSubpaths]) {
    walkDir(path.join(platformApiDir, subpath));
  }

  return structs;
}

function parseRustFile(content: string, structs: Map<string, RustStruct>) {
  // Match struct definitions — (?:<[^>]*>)? handles generic params like <T>
  const structRe = /(?:#\[derive[^\]]*\][\s\n]*)*pub\s+struct\s+(\w+)(?:<[^>]*>)?\s*\{([^}]*)\}/g;
  let m: RegExpExecArray | null;

  while ((m = structRe.exec(content)) !== null) {
    const name = m[1];
    const body = m[2];
    const fields = parseRustStructFields(body);
    structs.set(name, { name, fields });
  }

  // Match enum definitions — capture serde attr to extract rename_all
  const enumRe = /(?:#\[derive[^\]]*\][\s\n]*)*(#\[serde\(([^)]*)\)\][\s\n]*)?pub\s+enum\s+(\w+)(?:<[^>]*>)?\s*\{([^}]*)\}/g;
  while ((m = enumRe.exec(content)) !== null) {
    const serdeAttrContent = m[2] ?? '';
    const name = m[3];
    const body = m[4];
    const renameAllMatch = serdeAttrContent.match(/rename_all\s*=\s*"([^"]+)"/);
    const renameAll = renameAllMatch?.[1];
    const variants = parseRustEnumVariants(body, renameAll);
    structs.set(name, { name, fields: [], enumVariants: variants, isEnum: true });
  }
}

function parseRustStructFields(body: string): RustStructField[] {
  const fields: RustStructField[] = [];
  // Match: (optional serde attr) pub field_name: <type starts here>
  const fieldStartRe = /(?:#\[serde\(([^)]*)\)\]\s*)?pub\s+(\w+)\s*:\s*/g;
  let m: RegExpExecArray | null;

  while ((m = fieldStartRe.exec(body)) !== null) {
    const serdeAttr = m[1] ?? '';
    const fieldName = m[2];
    if (fieldName === '_' || fieldName.startsWith('_phantom')) continue;

    // Extract type with angle-bracket + paren depth tracking so commas inside
    // generics/tuples (e.g. Option<(Vec<u8>, String)>) don't truncate the type.
    let depth = 0;
    let i = m.index + m[0].length;
    const typeStart = i;
    while (i < body.length) {
      const ch = body[i];
      if (ch === '<' || ch === '(') depth++;
      else if (ch === '>' || ch === ')') depth--;
      else if ((ch === ',' || ch === '\n') && depth === 0) break;
      i++;
    }
    const rustType = body.slice(typeStart, i).trim().replace(/,$/, '');
    if (!rustType) continue;

    const required = !rustType.startsWith('Option<');
    const renameMatch = serdeAttr.match(/rename\s*=\s*"([^"]+)"/);
    const serdeRename = renameMatch?.[1];

    fields.push({ name: fieldName, rustType, required, serdeRename });
  }
  return fields;
}

function applyRenameAll(name: string, renameAll: string): string {
  switch (renameAll) {
    case 'snake_case':
      return name.replace(/([A-Z])/g, (c, _, i) => (i > 0 ? '_' : '') + c.toLowerCase());
    case 'camelCase':
      return name.charAt(0).toLowerCase() + name.slice(1);
    case 'lowercase':
      return name.toLowerCase();
    case 'UPPERCASE':
      return name.toUpperCase();
    case 'SCREAMING_SNAKE_CASE':
      return name.replace(/([A-Z])/g, (c, _, i) => (i > 0 ? '_' : '') + c).toUpperCase();
    case 'kebab-case':
      return name.replace(/([A-Z])/g, (c, _, i) => (i > 0 ? '-' : '') + c.toLowerCase());
    default:
      return name;
  }
}

function parseRustEnumVariants(body: string, renameAll?: string): string[] {
  const variants: string[] = [];
  const lines = body.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) continue;
    const variantMatch = trimmed.match(/^(\w+)\s*[,{(]?/);
    if (variantMatch) {
      const variant = variantMatch[1];
      variants.push(renameAll ? applyRenameAll(variant, renameAll) : variant);
    }
  }
  return variants;
}

export function rustStructToJsonSchema(
  typeName: string,
  structs: Map<string, RustStruct>,
  visited = new Set<string>(),
): JsonSchema {
  if (visited.has(typeName)) return { $ref: `#/components/schemas/${typeName}` };

  const struct = structs.get(typeName);
  if (!struct) return { $ref: `#/components/schemas/${typeName}` };

  visited.add(typeName);

  if (struct.isEnum && struct.enumVariants) {
    return { type: 'string', enum: struct.enumVariants };
  }

  const properties: Record<string, JsonSchema> = {};
  const required: string[] = [];

  for (const field of struct.fields) {
    const key = field.serdeRename ?? field.name;
    properties[key] = rustTypeToJsonSchema(field.rustType);
    if (field.required) required.push(key);
  }

  return {
    type: 'object',
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}
