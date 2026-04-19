import fs from 'fs';
import path from 'path';
import type { Route, GoHandlerInfo, GoSchemaType, GoField } from './types.js';

// Convert Go Fiber :param to OpenAPI {param}
function normalizePath(p: string): string {
  return p.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}');
}

// Derive tag from first meaningful path segment
function tagFromPath(p: string): string {
  const segments = p.split('/').filter(Boolean);
  return segments[0] ?? 'default';
}

// Extract the actual handler name from a route call argument
// e.g. "authHandler.SignIn" → "SignIn", "middleware1, authHandler.SignIn" → "SignIn"
function extractHandlerName(args: string): string {
  const parts = args.split(',').map(s => s.trim());
  // Handler is the last argument that looks like X.Y or just a function name
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    if (p.match(/^[a-zA-Z_]\w*(\.[a-zA-Z_]\w*)+$/) || p.match(/^[a-zA-Z_]\w*$/)) {
      return p;
    }
  }
  return parts[parts.length - 1];
}

interface GroupContext {
  variable: string;
  prefix: string;
}

export function parseGoRoutes(routerDir: string): Route[] {
  const routes: Route[] = [];
  const files = fs.readdirSync(routerDir).filter(f => f.endsWith('.go'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(routerDir, file), 'utf-8');

    // Map variable name → full resolved prefix (chains parent groups correctly)
    const groupPrefixes = new Map<string, string>();

    // Scan in source order so parent groups are registered before children
    // Matches: varName := parentVar.Group("/subpath") with optional extra args
    const groupRe = /(\w+)\s*:=\s*(\w+)\.Group\("([^"]+)"[^)]*\)/g;
    let m: RegExpExecArray | null;
    while ((m = groupRe.exec(content)) !== null) {
      const varName = m[1];
      const parentVar = m[2];
      const subPath = m[3];
      const parentPrefix = groupPrefixes.get(parentVar) ?? '';
      groupPrefixes.set(varName, parentPrefix + subPath);
    }

    // Find route registrations: variable.Method("path", ...handlers)
    const routeRe = /(\w+)\.(Get|Post|Put|Patch|Delete|Head|Options)\("([^"]+)"[^)]*,([^)]+)\)/g;
    while ((m = routeRe.exec(content)) !== null) {
      const routerVar = m[1];
      const method = m[2].toUpperCase();
      const routePath = m[3];
      const handlerArgs = m[4];

      const prefix = groupPrefixes.get(routerVar) ?? '';
      const rawFull = prefix + routePath;

      // Normalize: :param → {param}, collapse duplicate slashes, strip trailing slash
      let fullPath = normalizePath(rawFull).replace(/\/+/g, '/');
      if (fullPath.length > 1 && fullPath.endsWith('/')) {
        fullPath = fullPath.slice(0, -1);
      }

      const handlerFn = extractHandlerName(handlerArgs);

      routes.push({
        method,
        path: fullPath,
        handlerFn,
        tag: tagFromPath(fullPath),
        rawPath: rawFull,
      });
    }
  }

  // Remove duplicate paths (same method+path)
  const seen = new Set<string>();
  return routes.filter(r => {
    const key = `${r.method}:${r.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Parse Go type name from a string like "string", "int64", "*model.User", etc.
function goTypeToJsonSchema(goType: string): import('./types.js').JsonSchema {
  const t = goType.trim().replace(/^\*/, ''); // strip pointer

  if (t === 'string') return { type: 'string' };
  if (t === 'int' || t === 'int64' || t === 'int32' || t === 'int16' || t === 'int8' ||
      t === 'uint' || t === 'uint64' || t === 'uint32' || t === 'uint16' || t === 'uint8' ||
      t === 'byte') {
    return { type: 'integer' };
  }
  if (t === 'float64' || t === 'float32') return { type: 'number' };
  if (t === 'bool') return { type: 'boolean' };
  if (t === 'time.Time') return { type: 'string', format: 'date-time' };
  if (t === 'json.RawMessage' || t === 'interface{}' || t === 'any') return {};
  if (t === 'JSONMap' || t === 'JsonMap' || t === 'JSONB') return { type: 'object', additionalProperties: true };
  if (t === 'StringArray' || t === 'pq.StringArray') return { type: 'array', items: { type: 'string' } };
  if (t.startsWith('[]')) return { type: 'array', items: goTypeToJsonSchema(t.slice(2)) };
  if (t.startsWith('map[')) return { type: 'object', additionalProperties: true };

  // Strip package prefix (e.g. pq.NullString → NullString, datatypes.JSON → JSON)
  const typeName = t.includes('.') ? t.split('.').pop()! : t;
  return { $ref: `#/components/schemas/${typeName}` };
}

// Parse a struct definition block into fields
function parseStructFields(block: string): GoField[] {
  const fields: GoField[] = [];
  // Match: FieldName Type `tags`
  const fieldRe = /^\s+([A-Z]\w*)\s+([\w\[\]\*\.]+)\s+`([^`]*)`/gm;
  let m: RegExpExecArray | null;
  while ((m = fieldRe.exec(block)) !== null) {
    const fieldName = m[1];
    const goType = m[2];
    const tags = m[3];

    // Extract json or form tag key
    const jsonMatch = tags.match(/json:"([^",]+)/);
    const formMatch = tags.match(/form:"([^",]+)/);
    const key = jsonMatch?.[1] ?? formMatch?.[1] ?? fieldName.toLowerCase();

    // Required if validate tag has "required"
    const required = tags.includes('validate:"required') || tags.includes(',required');
    // Optional if type starts with * or has omitempty
    const optional = goType.startsWith('*') || tags.includes('omitempty');

    if (key === '-') continue;

    fields.push({
      name: fieldName,
      jsonKey: key,
      goType,
      required: required && !optional,
      optional,
    });
  }
  return fields;
}

export function parseGoSchemas(handlerDir: string): Map<string, GoSchemaType> {
  const schemas = new Map<string, GoSchemaType>();

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.go')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        // Match struct definitions
        const structRe = /type\s+(\w+)\s+struct\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
        let m: RegExpExecArray | null;
        while ((m = structRe.exec(content)) !== null) {
          const name = m[1];
          const body = m[2];
          const fields = parseStructFields(body);
          if (fields.length > 0) {
            schemas.set(name, { name, fields });
          }
        }
      }
    }
  }

  walkDir(handlerDir);
  return schemas;
}

export function parseGoHandlers(handlerDir: string, schemas?: Map<string, GoSchemaType>): Map<string, GoHandlerInfo> {
  const handlers = new Map<string, GoHandlerInfo>();

  // Build a per-package combined content map for cross-file type lookup
  const packageContent = new Map<string, string>();

  function collectPackageContent(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let combined = '';
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile() && entry.name.endsWith('.go')) {
        combined += fs.readFileSync(fullPath, 'utf-8') + '\n';
      }
    }
    if (combined) packageContent.set(dir, combined);
    for (const entry of entries) {
      if (entry.isDirectory()) collectPackageContent(path.join(dir, entry.name));
    }
  }
  collectPackageContent(handlerDir);

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const dirContent = packageContent.get(dir) ?? '';
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.go') && !entry.name.includes('schema')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        parseHandlerFile(content, handlers, schemas, dirContent);
      }
    }
  }

  walkDir(handlerDir);
  return handlers;
}

function lookupVarType(varName: string, body: string, fileContent?: string, schemas?: Map<string, GoSchemaType>): string | null {
  // var varName []TypeName or var varName *TypeName or var varName TypeName (preserve []  prefix)
  const varDecl = new RegExp(`var\\s+${varName}\\s+(\\[\\])?(?:\\*)?(?:\\w+\\.)?(\\w+)`).exec(body);
  if (varDecl) {
    const isSlice = !!varDecl[1];
    const t = varDecl[2];
    const primitives = ['error', 'string', 'int', 'int64', 'uint64', 'bool', 'float64', 'byte'];
    if (!primitives.includes(t)) return isSlice ? `[]${t}` : t;
    if (isSlice) return `[]${t}`; // keep primitive slices like []string
  }

  // varName := make([]TypeName, n) or make([]*TypeName, n)
  const makeDecl = new RegExp(`${varName}\\s*:=\\s*make\\(\\[\\]\\*?(?:\\w+\\.)?([A-Za-z]\\w*),`).exec(body);
  if (makeDecl) {
    return `[]${makeDecl[1]}`;
  }

  // varName := TypeName{} or varName := &TypeName{} (not fiber, fmt, etc.)
  const assignDecl = new RegExp(`${varName}\\s*:=\\s*&?(?:model\\.)?(\\w+)\\{`).exec(body);
  if (assignDecl) {
    const t = assignDecl[1];
    if (t !== 'fiber' && t !== 'fmt' && t !== 'map' && t !== 'make') return t;
  }

  // varName := otherVar.FieldName (struct field assignment)
  const fieldAssignDecl = new RegExp(`${varName}\\s*:=\\s*(\\w+)\\.(\\w+)(?:[^(]|$)`).exec(body);
  if (fieldAssignDecl && schemas) {
    const parentVarName = fieldAssignDecl[1];
    const fieldName = fieldAssignDecl[2];
    const parentType = lookupVarType(parentVarName, body, fileContent); // no schemas to avoid deep recursion
    if (parentType) {
      const parentSchema = schemas.get(parentType);
      if (parentSchema) {
        const field = parentSchema.fields.find(f => f.name === fieldName);
        if (field) {
          const ft = field.goType.replace(/^\*/, '').replace(/^model\./, '');
          const primitives = ['string', 'int', 'int64', 'uint64', 'bool', 'float64'];
          if (!primitives.includes(ft)) return ft;
        }
      }
    }
  }

  // Known handler helper patterns
  const knownHelpers: Record<string, string> = {
    deployment: 'Deployment',
    session: 'Session',
    membership: 'OrganizationMembership',
    org: 'Organization',
    workspace: 'Workspace',
  };
  if (knownHelpers[varName]) return knownHelpers[varName];

  // varName, err := something.MethodName(...) — look up MethodName return type in file
  const callDecl = new RegExp(`${varName}\\s*,\\s*\\w+\\s*:=\\s*[\\w.]+\\.(\\w+)\\(`).exec(body);
  if (callDecl && fileContent) {
    const methodName = callDecl[1];
    // Handle model. package prefix in return types: (*model.TypeName, error) or ([]model.TypeName, error)
    const sigRe = new RegExp(
      `func\\s+\\([^)]+\\)\\s+${methodName}\\s*\\([^)]*\\)[^{]*\\(\\[\\]\\*?(?:\\w+\\.)?(\\w+),` +
      `|func\\s+\\([^)]+\\)\\s+${methodName}\\s*\\([^)]*\\)[^{]*\\(\\*?(?:\\w+\\.)?(\\w+),`
    );
    const sigMatch = sigRe.exec(fileContent);
    if (sigMatch) {
      const t = sigMatch[1] ?? sigMatch[2];
      if (t && t !== 'error' && t !== 'string' && t !== 'int') {
        if (sigMatch[1]) return `[]${t}`;
        return t;
      }
    }
  }

  // varName := something.MethodName(...) — single return value (no error companion)
  const singleCallDecl = new RegExp(`(?:^|\\n)\\s*${varName}\\s*:=\\s*[\\w.]+\\.(\\w+)\\(`).exec(body);
  if (singleCallDecl && fileContent) {
    const methodName = singleCallDecl[1];
    const sigRe = new RegExp(
      `func\\s+\\([^)]+\\)\\s+${methodName}\\s*\\([^)]*\\)\\s+\\*?(?:\\w+\\.)?(\\w+)\\s*\\{`
    );
    const sigMatch = sigRe.exec(fileContent);
    if (sigMatch) {
      const t = sigMatch[1];
      if (t && t !== 'error' && t !== 'string' && t !== 'int' && t !== 'bool') return t;
    }
  }

  // varName := LocalFunctionName(...) — local function call without receiver
  const localFuncDecl = new RegExp(`(?:^|\\n)\\s*${varName}\\s*:=\\s*(New\\w+|[A-Z]\\w+)\\(`).exec(body);
  if (localFuncDecl && fileContent) {
    const funcName = localFuncDecl[1];
    if (funcName !== 'make' && funcName !== 'new') {
      const sigRe = new RegExp(
        `func\\s+${funcName}\\s*\\([^)]*\\)\\s+\\*?(?:\\w+\\.)?(\\w+)\\s*\\{` +
        `|func\\s+${funcName}\\s*\\([^)]*\\)\\s+\\(\\*?(?:\\w+\\.)?(\\w+),`
      );
      const sigMatch = sigRe.exec(fileContent);
      if (sigMatch) {
        const t = sigMatch[1] ?? sigMatch[2];
        if (t && t !== 'error' && t !== 'string' && t !== 'int' && t !== 'bool') return t;
      }
    }
  }

  return null;
}

function inferValueSchema(
  value: string,
  body: string,
  schemas?: Map<string, GoSchemaType>,
  fileContent?: string,
): import('./types.js').JsonSchema {
  const v = value.trim();

  if (v === 'true' || v === 'false') return { type: 'boolean' };
  if (v === 'nil') return { nullable: true };
  if (/^"/.test(v) || /^`/.test(v)) return { type: 'string' };
  if (/^\d+$/.test(v)) return { type: 'integer' };

  // fmt.Sprintf(...) → string
  if (v.startsWith('fmt.Sprintf(') || v.startsWith('fmt.Sprint(')) return { type: 'string' };

  // time.Now()... → integer (unix millis)
  if (v.startsWith('time.')) return { type: 'integer' };

  // Named type constructor: TypeName{} or &TypeName{}
  const constructorMatch = v.match(/^&?(\w+)\{/);
  if (constructorMatch && constructorMatch[1] !== 'fiber') {
    return { $ref: `#/components/schemas/${constructorMatch[1]}` };
  }

  // Slice: []any{} or []TypeName{}
  if (v.startsWith('[]')) {
    const inner = v.slice(2).replace(/\{.*$/, '').trim();
    if (inner === 'any' || inner === 'interface{}') return { type: 'array', items: {} };
    if (inner === 'string') return { type: 'array', items: { type: 'string' } };
    if (inner === 'int' || inner === 'int64' || inner === 'uint64') return { type: 'array', items: { type: 'integer' } };
    if (inner === 'bool') return { type: 'array', items: { type: 'boolean' } };
    const typeName = inner.includes('.') ? inner.split('.').pop()! : inner;
    return { type: 'array', items: { $ref: `#/components/schemas/${typeName}` } };
  }

  // Struct field access: varName.FieldName — look up via var type + schema field type
  const fieldAccess = v.match(/^(\w+)\.(\w+)$/);
  if (fieldAccess && schemas) {
    const [, varName, fieldName] = fieldAccess;
    const varTypeName = lookupVarType(varName, body, fileContent, schemas);
    if (varTypeName) {
      const structSchema = schemas.get(varTypeName);
      if (structSchema) {
        const field = structSchema.fields.find(f => f.name === fieldName);
        if (field) return goTypeToJsonSchema(field.goType);
      }
    }
  }

  // Simple variable name — look up declaration in body
  if (/^\w+$/.test(v)) {
    const typeName = lookupVarType(v, body, fileContent, schemas);
    if (typeName) {
      if (typeName.startsWith('[]')) {
        const inner = typeName.slice(2);
        if (inner === 'string') return { type: 'array', items: { type: 'string' } };
        if (inner === 'int' || inner === 'int64' || inner === 'uint64') return { type: 'array', items: { type: 'integer' } };
        return { type: 'array', items: { $ref: `#/components/schemas/${inner}` } };
      }
      return { $ref: `#/components/schemas/${typeName}` };
    }
    // Common single-word primitives returned from function calls
    if (v === 'url' || v === 'signedToken' || v === 'authURL' || v === 'redirectURL' || v === 'csrfToken') {
      return { type: 'string' };
    }
    if (v === 'exists' || v === 'hasMore' || v === 'otp_sent') return { type: 'boolean' };
  }

  return {};
}

function extractBracedBlock(content: string, start: number): string | null {
  if (content[start] !== '{') return null;
  let depth = 0, i = start;
  while (i < content.length) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') { depth--; if (depth === 0) return content.slice(start + 1, i); }
    i++;
  }
  return null;
}

function parseFiberMapSchema(
  mapContent: string,
  body: string,
  schemas?: Map<string, GoSchemaType>,
  fileContent?: string,
): import('./types.js').JsonSchema {
  const properties: Record<string, import('./types.js').JsonSchema> = {};

  // Match "key": value pairs — value ends at comma+newline or closing brace
  const kvRe = /"([^"]+)":\s*([^\n,]+)/g;
  let m: RegExpExecArray | null;
  while ((m = kvRe.exec(mapContent)) !== null) {
    const key = m[1];
    const rawValue = m[2].trim().replace(/,$/, '').trim();
    // Nested fiber.Map — just mark as object
    if (rawValue === 'fiber.Map{' || rawValue.startsWith('fiber.Map{')) {
      properties[key] = { type: 'object' };
    } else {
      properties[key] = inferValueSchema(rawValue, body, schemas, fileContent);
    }
  }

  if (Object.keys(properties).length === 0) return {};
  return { type: 'object', properties };
}

function parseHandlerFile(content: string, handlers: Map<string, GoHandlerInfo>, schemas?: Map<string, GoSchemaType>, fileContent?: string) {
  // Match both methods: func (h *Handler) Name(c fiber.Ctx) error {
  // and plain functions: func Name(c fiber.Ctx) error {
  const handlerRe = /func\s+(?:\([^)]+\)\s+)?(\w+)\s*\([^)]*fiber\.Ctx[^)]*\)\s+error\s*\{([\s\S]*?)^\}/gm;
  let m: RegExpExecArray | null;

  while ((m = handlerRe.exec(content)) !== null) {
    const methodName = m[1];
    const body = m[2];

    const info: GoHandlerInfo = {
      queryParams: [],
      pathParams: [],
      formFields: [],
    };

    // Validate[T](c)
    const validateMatch = body.match(/handler\.Validate\[(\w+)\]\(c\)/);
    if (validateMatch) {
      info.validateType = validateMatch[1];
    }

    // c.Bind().Body(&SomeType{}) or c.Bind().Body(&body)
    const bindMatch = body.match(/c\.Bind\(\)\.Body\(&(\w+)/);
    if (bindMatch && !info.validateType) {
      info.validateType = bindMatch[1] !== 'body' ? bindMatch[1] : undefined;
    }

    // c.Query("key") or c.Query("key", "default")
    const queryRe = /c\.Query\("([^"]+)"/g;
    let qm: RegExpExecArray | null;
    while ((qm = queryRe.exec(body)) !== null) {
      if (!info.queryParams!.includes(qm[1])) {
        info.queryParams!.push(qm[1]);
      }
    }

    // fiber.Query[T](c, "key", ...)
    const fiberQueryRe = /fiber\.Query\[[\w]+\]\(c,\s*"([^"]+)"/g;
    while ((qm = fiberQueryRe.exec(body)) !== null) {
      if (!info.queryParams!.includes(qm[1])) {
        info.queryParams!.push(qm[1]);
      }
    }

    // c.Params("key")
    const paramsRe = /c\.Params\("([^"]+)"/g;
    let pm: RegExpExecArray | null;
    while ((pm = paramsRe.exec(body)) !== null) {
      if (!info.pathParams!.includes(pm[1])) {
        info.pathParams!.push(pm[1]);
      }
    }

    // c.FormValue("key")
    const formRe = /c\.FormValue\("([^"]+)"/g;
    let fm: RegExpExecArray | null;
    while ((fm = formRe.exec(body)) !== null) {
      if (!info.formFields!.find(f => f.name === fm![1])) {
        info.formFields!.push({ name: fm![1], jsonKey: fm![1], goType: 'string', required: false, optional: true });
      }
    }

    // c.FormFile("key")
    if (body.includes('c.FormFile(') || body.includes('c.MultipartForm(')) {
      info.hasFileUpload = true;
      info.hasMultipart = true;
    }

    // Detect raw c.JSON() — no SendSuccess envelope
    const hasRawJson = /\bc\.(?:Status\([^)]+\)\.)?JSON\(/.test(body);
    if (hasRawJson && !body.includes('handler.SendSuccess')) {
      info.rawJsonResponse = true;

      // Extract response type from c.JSON(varName) or c.Status(x).JSON(varName)
      const rawJsonMatch = body.match(/c\.(?:Status\([^)]+\)\.)?JSON\(([\w.]+)\)/);
      if (rawJsonMatch) {
        const expr = rawJsonMatch[1];
        const ctx = fileContent ?? content;
        const schema = inferValueSchema(expr, body, schemas, ctx);
        if (schema.$ref) {
          info.responseType = schema.$ref.replace('#/components/schemas/', '');
        } else if (schema.type === 'array') {
          info.responseSchema = schema;
        } else {
          const typeName = lookupVarType(expr, body, ctx);
          if (typeName) info.responseType = typeName;
        }
      }
    }

    // Response type detection
    // SendSuccess supports generic type param: handler.SendSuccess[T](c, ...) or handler.SendSuccess(c, ...)
    const ctx = fileContent ?? content;
    let responseDetected = false;

    // String literal: handler.SendSuccess(c, "some message")
    if (/handler\.SendSuccess(?:\[\w+\])?\(c,\s*"[^"]*"\s*\)/.test(body)) {
      info.responseSchema = { type: 'string' };
      responseDetected = true;
    }
    // nil response: handler.SendSuccess[any](c, nil)
    else if (/handler\.SendSuccess(?:\[\w+\])?\(c,\s*nil\s*\)/.test(body)) {
      info.responseSchema = { nullable: true };
      responseDetected = true;
    }
    // Pattern 1a: handler.SendSuccess(c, fiber.Map{...})
    else if (body.search(/handler\.SendSuccess(?:\[\w+\])?\(c,\s*fiber\.Map\{/) !== -1) {
      const fiberMapIdx = body.search(/handler\.SendSuccess(?:\[\w+\])?\(c,\s*fiber\.Map\{/);
      const braceIdx = body.indexOf('{', body.indexOf('fiber.Map', fiberMapIdx));
      const mapContent = extractBracedBlock(body, braceIdx);
      if (mapContent !== null) {
        info.responseSchema = parseFiberMapSchema(mapContent, body, schemas, ctx);
        responseDetected = true;
      }
    }

    if (!responseDetected) {
      // Pattern 1b: inline map literal var: varName := map[string]any{...}; handler.SendSuccess(c, varName)
      const mapVarMatch = body.match(/(\w+)\s*:=\s*(?:fiber\.Map|map\[string\](?:any|interface\{\}))\{/);
      if (mapVarMatch) {
        const mapVarName = mapVarMatch[1];
        const varUsedInSend = new RegExp(`handler\\.SendSuccess(?:\\[\\w+\\])?\\(c,\\s*${mapVarName}\\s*\\)`).test(body);
        if (varUsedInSend) {
          const braceStart = body.indexOf('{', mapVarMatch.index! + mapVarMatch[0].indexOf('{'));
          const mapContent = extractBracedBlock(body, braceStart);
          if (mapContent !== null) {
            info.responseSchema = parseFiberMapSchema(mapContent, body, schemas, ctx);
            responseDetected = true;
          }
        }
      }
    }

    if (!responseDetected) {
      // Pattern 2: handler.SendSuccess(c, TypeName{...}) or handler.SendSuccess(c, &TypeName{...})
      const namedTypeMatch = body.match(/handler\.SendSuccess(?:\[\w+\])?\(c,\s*&?(?:\w+\.)?(\w+)\{/);
      if (namedTypeMatch && namedTypeMatch[1] !== 'fiber' && namedTypeMatch[1] !== 'map') {
        info.responseType = namedTypeMatch[1];
      } else {
        // Pattern 3: handler.SendSuccess(c, expr) — bare variable or field access
        const bareVarMatch = body.match(/handler\.SendSuccess(?:\[\w+\])?\(c,\s*([\w.]+)\s*\)/);
        if (bareVarMatch) {
          const expr = bareVarMatch[1];
          const schema = inferValueSchema(expr, body, schemas, ctx);
          if (schema.$ref) {
            info.responseType = schema.$ref.replace('#/components/schemas/', '');
          } else if (schema.type === 'array' && schema.items) {
            info.responseSchema = schema;
          } else if (Object.keys(schema).length > 0 && schema.type !== 'object') {
            info.responseSchema = schema;
          } else {
            // last resort: try bare var lookup
            const typeName = lookupVarType(expr, body, ctx, schemas);
            if (typeName) {
              if (typeName.startsWith('[]')) {
                const inner = typeName.slice(2);
                if (inner === 'string') {
                  info.responseSchema = { type: 'array', items: { type: 'string' } };
                } else if (inner === 'int' || inner === 'uint64') {
                  info.responseSchema = { type: 'array', items: { type: 'integer' } };
                } else {
                  info.responseSchema = { type: 'array', items: { $ref: `#/components/schemas/${inner}` } };
                }
              } else {
                info.responseType = typeName;
              }
            }
          }
        }
      }
    }

    handlers.set(methodName, info);
  }
}

export function goSchemaToJsonSchema(
  typeName: string,
  schemas: Map<string, GoSchemaType>,
  visited = new Set<string>(),
): import('./types.js').JsonSchema {
  if (visited.has(typeName)) return { $ref: `#/components/schemas/${typeName}` };
  const schema = schemas.get(typeName);
  if (!schema) return { $ref: `#/components/schemas/${typeName}` };

  visited.add(typeName);
  const properties: Record<string, import('./types.js').JsonSchema> = {};
  const required: string[] = [];

  for (const field of schema.fields) {
    properties[field.jsonKey] = goTypeToJsonSchema(field.goType);
    if (field.required) required.push(field.jsonKey);
  }

  return {
    type: 'object',
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}
