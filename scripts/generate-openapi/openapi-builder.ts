import type {
  Route,
  GoHandlerInfo,
  RustHandlerInfo,
  RustStruct,
  JsonSchema,
  OpenAPISpec,
  OperationObject,
  ParameterObject,
  RequestBodyObject,
} from './types.js';
import { rustStructToJsonSchema, rustTypeToJsonSchema } from './rust-parser.js';
import { goSchemaToJsonSchema } from './go-parser.js';
import type { GoSchemaType } from './types.js';

// Convert snake_case or camelCase handler name to a human-readable summary
function handlerToSummary(handlerFn: string, method: string, path: string): string {
  // Rust: get_active_user_list → Get Active User List
  // Go: SignIn → Sign In, authHandler.SignIn → Sign In
  const name = handlerFn.includes('.') ? handlerFn.split('.').pop()! : handlerFn;
  const words = name
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(/\s+/);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function operationId(method: string, path: string, handlerFn: string): string {
  const name = handlerFn.includes('.') ? handlerFn.split('.').pop()! : handlerFn;
  // Normalize to camelCase
  const camel = name
    .split('_')
    .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');
  return camel;
}

const TAG_DISPLAY_OVERRIDES: Record<string, string> = {
  'ai': 'AI',
  'api-auth': 'API Auth',
  'oauth': 'OAuth',
  'scim': 'SCIM',
  '.well-known': 'Well Known',
  'jwt-templates': 'JWT Templates',
};

function capitalizeTag(tag: string): string {
  if (TAG_DISPLAY_OVERRIDES[tag]) return TAG_DISPLAY_OVERRIDES[tag];
  return tag
    .replace(/^\.+/, '')
    .split(/[-_]/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

export function operationToSlug(summary: string): string {
  return summary.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Minimal session object returned in every Go API response envelope
const sessionSummarySchema: JsonSchema = {
  type: 'object',
  nullable: true,
  properties: {
    id: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

// Wrap a data schema in the SendSuccess envelope: {status, message, data, session, errors}
function wrapInEnvelope(dataSchema: JsonSchema): JsonSchema {
  return {
    type: 'object',
    properties: {
      status: { type: 'integer' },
      message: { type: 'string' },
      data: dataSchema,
      session: sessionSummarySchema,
    },
  };
}

// Standard error response schemas
const errorResponseSchema: JsonSchema = {
  type: 'object',
  properties: {
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          code: { type: 'integer' },
        },
      },
    },
  },
};

const standardErrorResponses = {
  '400': { description: 'Bad Request', content: { 'application/json': { schema: errorResponseSchema } } },
  '401': { description: 'Unauthorized', content: { 'application/json': { schema: errorResponseSchema } } },
  '404': { description: 'Not Found', content: { 'application/json': { schema: errorResponseSchema } } },
  '500': { description: 'Internal Server Error', content: { 'application/json': { schema: errorResponseSchema } } },
};

// ─── FRONTEND API (Go) ───────────────────────────────────────────────────────

export function buildFrontendApiSpec(
  routes: Route[],
  handlers: Map<string, GoHandlerInfo>,
  goSchemas: Map<string, GoSchemaType>,
  tsSchemas: Map<string, JsonSchema>,
): OpenAPISpec {
  const allSchemas: Record<string, JsonSchema> = {};

  // Add all TypeScript schemas as components
  for (const [name, schema] of tsSchemas) {
    allSchemas[name] = schema;
  }

  // Add Go struct schemas
  for (const [name, goSchema] of goSchemas) {
    if (!allSchemas[name]) {
      allSchemas[name] = goSchemaToJsonSchema(name, goSchemas);
    }
  }

  const paths: Record<string, Record<string, OperationObject>> = {};
  const tagSet = new Set<string>();

  for (const route of routes) {
    const handlerName = route.handlerFn.includes('.')
      ? route.handlerFn.split('.').pop()!
      : route.handlerFn;

    const info = handlers.get(handlerName);
    const method = route.method.toLowerCase();
    const tag = capitalizeTag(route.tag);
    tagSet.add(tag);

    if (!paths[route.path]) paths[route.path] = {};

    const parameters: ParameterObject[] = [];

    // Path parameters from the route path
    const pathParamMatches = route.path.matchAll(/\{([^}]+)\}/g);
    for (const pm of pathParamMatches) {
      parameters.push({
        name: pm[1],
        in: 'path',
        required: true,
        schema: { type: 'string' },
      });
    }

    // Query parameters from handler
    if (info?.queryParams) {
      for (const qp of info.queryParams) {
        parameters.push({
          name: qp,
          in: 'query',
          required: false,
          schema: { type: 'string' },
        });
      }
    }

    // Request body
    let requestBody: RequestBodyObject | undefined;

    if (['post', 'put', 'patch'].includes(method)) {
      if (info?.validateType || info?.formFields?.length) {
        const typeName = info.validateType;
        let schema: JsonSchema;

        if (typeName && goSchemas.has(typeName)) {
          schema = goSchemaToJsonSchema(typeName, goSchemas);
          // Register in components
          if (!allSchemas[typeName]) {
            allSchemas[typeName] = schema;
          }
          schema = { $ref: `#/components/schemas/${typeName}` };
        } else if (info.formFields?.length) {
          const properties: Record<string, JsonSchema> = {};
          for (const f of info.formFields) {
            properties[f.jsonKey] = { type: 'string' };
          }
          schema = { type: 'object', properties };
        } else {
          schema = { type: 'object' };
        }

        const contentType = info?.hasMultipart
          ? 'multipart/form-data'
          : 'application/x-www-form-urlencoded';

        requestBody = {
          required: true,
          content: { [contentType]: { schema } },
        };
      }
    }

    // Path-specific overrides for well-known non-JSON or raw-JSON endpoints
    const pathOverrides: Record<string, JsonSchema> = {
      // SCIM DELETE endpoints return 204 No Content — no body schema
      '/scim/v2/{connectionId}/Users/{userId}:delete': { nullable: true },
      '/scim/v2/{connectionId}/Groups/{groupId}:delete': { nullable: true },
      '/.well-known/jwks.json': {
        type: 'object',
        properties: {
          keys: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                kty: { type: 'string' },
                kid: { type: 'string' },
                use: { type: 'string' },
                alg: { type: 'string' },
                n: { type: 'string' },
                e: { type: 'string' },
                x: { type: 'string' },
                y: { type: 'string' },
                crv: { type: 'string' },
              },
            },
          },
        },
      },
    };

    // Response schema — use extracted Go response type/schema, fall back to TS heuristics
    let responseSchema: JsonSchema;
    const pathOverrideKey = pathOverrides[`${route.path}:${method}`] ? `${route.path}:${method}` : route.path;
    if (pathOverrides[pathOverrideKey]) {
      responseSchema = pathOverrides[pathOverrideKey];
    } else if (info?.responseType) {
      const typeName = info.responseType;
      if (!allSchemas[typeName] && goSchemas.has(typeName)) {
        allSchemas[typeName] = goSchemaToJsonSchema(typeName, goSchemas);
      }
      responseSchema = allSchemas[typeName]
        ? { $ref: `#/components/schemas/${typeName}` }
        : { type: 'object' };
    } else if (info?.responseSchema && Object.keys(info.responseSchema).length > 0) {
      responseSchema = info.responseSchema;
    } else {
      responseSchema = inferFrontendResponseSchema(handlerName, tsSchemas, allSchemas);
    }

    // Public routes: no session required (auth initiation, well-known discovery, SCIM)
    const isPublicRoute = route.tag === '.well-known' || route.tag === 'scim' ||
      route.tag === 'auth' || route.path.startsWith('/.well-known');

    const operation: OperationObject = {
      operationId: operationId(route.method, route.path, handlerName),
      summary: handlerToSummary(handlerName, route.method, route.path),
      tags: [tag],
      ...(parameters.length > 0 ? { parameters } : {}),
      ...(requestBody ? { requestBody } : {}),
      // Override global security with [] for public routes
      ...(isPublicRoute ? { security: [] } : {}),
      responses: {
        '200': {
          description: 'Success',
          // SCIM and .well-known routes use raw c.JSON() — no SendSuccess envelope
          content: { 'application/json': { schema: (!info?.rawJsonResponse && route.tag !== 'scim' && route.tag !== '.well-known') ? wrapInEnvelope(responseSchema) : responseSchema } },
        },
        ...standardErrorResponses,
      },
    };

    paths[route.path][method] = operation;
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'Wacht Frontend API',
      version: '1.0.0',
      description: 'Frontend-facing API used by Wacht SDKs and client applications.',
    },
    servers: [{ url: 'https://{deployment_host}', description: 'Deployment frontend host' }],
    // Require session by default; public routes override with security: []
    security: [{ sessionCookie: [] }, { devSessionQuery: [] }],
    tags: Array.from(tagSet).sort().map(name => ({ name })),
    paths,
    components: {
      schemas: pruneSchemas(fillDanglingRefs(allSchemas), paths),
      securitySchemes: {
        sessionCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: '__session',
          description: 'Session JWT stored as a cookie after sign-in. Used in production environments.',
        },
        devSessionQuery: {
          type: 'apiKey',
          in: 'query',
          name: '__dev_session__',
          description: 'Session JWT passed as a query parameter. Used in non-production (staging/development) environments where cookies are not available.',
        },
      },
    },
  };
}

function inferFrontendResponseSchema(
  handlerName: string,
  tsSchemas: Map<string, JsonSchema>,
  allSchemas?: Record<string, JsonSchema>,
): JsonSchema {
  // Heuristic: map common handler names to TypeScript/Go types
  const nameMap: Record<string, string> = {
    'SignIn': 'Session',
    'SignUp': 'Session',
    'Identify': 'Session',
    'GetUser': 'CurrentUser',
    'UpdateUser': 'CurrentUser',
    'GetCurrentSession': 'Session',
    'GetDeployment': 'Deployment',
    'CreateOrganization': 'Organization',
    'CreateWorkspace': 'Workspace',
    // Delegating handlers that call SendSuccess in sub-functions
    'CompleteProfile': 'Session',
    'AttemptVerification': 'Session',
    'ExchangeTicket': 'ExchangeTicketResponse',
    'RunThread': 'ExecuteAgentResponse',
  };

  const typeName = nameMap[handlerName];
  if (typeName) {
    if (tsSchemas.has(typeName) || allSchemas?.[typeName]) {
      return { $ref: `#/components/schemas/${typeName}` };
    }
  }
  return { type: 'object' };
}

// ─── PLATFORM API (Rust) ─────────────────────────────────────────────────────

export function buildPlatformApiSpec(
  routes: Route[],
  handlers: Map<string, RustHandlerInfo>,
  structs: Map<string, RustStruct>,
): OpenAPISpec {
  const allSchemas: Record<string, JsonSchema> = {};

  // Pre-populate all known struct schemas
  for (const [name, struct] of structs) {
    allSchemas[name] = rustStructToJsonSchema(name, structs);
  }

  const paths: Record<string, Record<string, OperationObject>> = {};
  const tagSet = new Set<string>();

  for (const route of routes) {
    const info = handlers.get(route.handlerFn);
    const method = route.method.toLowerCase();
    const tag = capitalizeTag(route.tag);
    tagSet.add(tag);

    if (!paths[route.path]) paths[route.path] = {};

    const parameters: ParameterObject[] = [];

    // Path parameters from the route
    for (const pm of route.path.matchAll(/\{([^}]+)\}/g)) {
      parameters.push({
        name: pm[1],
        in: 'path',
        required: true,
        schema: { type: 'string' },
      });
    }

    // Query parameters from typed extractor
    if (info?.queryParamsType) {
      const queryStruct = structs.get(info.queryParamsType);
      if (queryStruct) {
        for (const field of queryStruct.fields) {
          const key = field.serdeRename ?? field.name;
          parameters.push({
            name: key,
            in: 'query',
            required: field.required,
            schema: rustTypeToJsonSchema(field.rustType),
          });
        }
      }
    }

    // Request body
    let requestBody: RequestBodyObject | undefined;

    if (info?.jsonBodyType) {
      const typeName = info.jsonBodyType;
      ensureSchema(typeName, structs, allSchemas);
      requestBody = {
        required: true,
        content: {
          'application/json': { schema: { $ref: `#/components/schemas/${typeName}` } },
        },
      };
    } else if (info?.hasMultipart) {
      requestBody = {
        required: true,
        content: { 'multipart/form-data': { schema: { type: 'object' } } },
      };
    }

    // Response schema
    let responseSchema: JsonSchema = { type: 'object' };
    if (info?.responseType) {
      // Strip all module path prefixes while preserving generic params
      // e.g. "PaginatedResponse<models::webhook::Foo>" → "PaginatedResponse<Foo>"
      const typeName = info.responseType.replace(/\b\w+::/g, '');

      if (typeName === '()') {
        // Unit response — no body; keep as empty object
      } else {
        const paginatedMatch = typeName.match(/^PaginatedResponse<(.+)>$/);
        const cursorPageMatch = typeName.match(/^CursorPage<(.+)>$/);
        const listRateLimitMatch = typeName.match(/^ListRateLimitSchemesResponse<(.+)>$/);

        if (paginatedMatch) {
          const inner = paginatedMatch[1];
          ensureSchema(inner, structs, allSchemas);
          const itemSchema = resolveInnerSchema(inner, structs, allSchemas);
          responseSchema = {
            type: 'object',
            properties: {
              data: { type: 'array', items: itemSchema },
              total: { type: 'integer' },
              offset: { type: 'integer' },
              limit: { type: 'integer' },
            },
          };
        } else if (cursorPageMatch) {
          const inner = cursorPageMatch[1];
          ensureSchema(inner, structs, allSchemas);
          const itemSchema = resolveInnerSchema(inner, structs, allSchemas);
          responseSchema = {
            type: 'object',
            properties: {
              data: { type: 'array', items: itemSchema },
              limit: { type: 'integer' },
              has_more: { type: 'boolean' },
              next_cursor: { type: 'string', nullable: true },
            },
          };
        } else if (listRateLimitMatch) {
          const inner = listRateLimitMatch[1];
          ensureSchema(inner, structs, allSchemas);
          const itemSchema = resolveInnerSchema(inner, structs, allSchemas);
          responseSchema = {
            type: 'object',
            properties: {
              schemes: { type: 'array', items: itemSchema },
              total: { type: 'integer' },
            },
          };
        } else if (structs.has(typeName)) {
          ensureSchema(typeName, structs, allSchemas);
          responseSchema = { $ref: `#/components/schemas/${typeName}` };
        } else {
          // Use rustTypeToJsonSchema for primitives, Option<T>, DateTime, etc.
          responseSchema = rustTypeToJsonSchema(typeName);
        }
      }
    }

    const operation: OperationObject = {
      operationId: operationId(route.method, route.path, route.handlerFn),
      summary: handlerToSummary(route.handlerFn, route.method, route.path),
      tags: [tag],
      ...(parameters.length > 0 ? { parameters } : {}),
      ...(requestBody ? { requestBody } : {}),
      responses: {
        '200': {
          description: 'Success',
          content: { 'application/json': { schema: responseSchema } },
        },
        ...standardErrorResponses,
      },
    };

    paths[route.path][method] = operation;
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'Wacht Platform API',
      version: '1.0.0',
      description: 'Server-to-server management API authenticated via API keys.',
    },
    servers: [{ url: 'https://api.wacht.dev', description: 'Wacht Platform API' }],
    // All platform API routes require a Bearer API key
    security: [{ bearerAuth: [] }],
    tags: Array.from(tagSet).sort().map(name => ({ name })),
    paths,
    components: {
      schemas: pruneSchemas(fillDanglingRefs(allSchemas), paths),
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'API key issued from the Wacht platform dashboard. Pass as a Bearer token: Authorization: Bearer <api_key>',
        },
      },
    },
  };
}

function ensureSchema(
  typeName: string,
  structs: Map<string, RustStruct>,
  allSchemas: Record<string, JsonSchema>,
) {
  if (!allSchemas[typeName] && structs.has(typeName)) {
    allSchemas[typeName] = rustStructToJsonSchema(typeName, structs);
  }
}

// Walk a JSON value and collect all $ref schema names
function collectRefs(value: unknown, out: Set<string>) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) { for (const v of value) collectRefs(v, out); return; }
  const obj = value as Record<string, unknown>;
  if (typeof obj.$ref === 'string') {
    const name = obj.$ref.replace('#/components/schemas/', '');
    out.add(name);
  }
  for (const v of Object.values(obj)) collectRefs(v, out);
}

// Remove schemas that are never referenced — directly from paths or transitively
// from other reachable schemas. This keeps the generated spec lean.
function pruneSchemas(
  allSchemas: Record<string, JsonSchema>,
  paths: Record<string, unknown>,
): Record<string, JsonSchema> {
  const reachable = new Set<string>();
  const queue: string[] = [];

  // Seed from paths
  const seedRefs = new Set<string>();
  collectRefs(paths, seedRefs);
  for (const name of seedRefs) { reachable.add(name); queue.push(name); }

  // BFS through schemas
  while (queue.length > 0) {
    const name = queue.pop()!;
    const schema = allSchemas[name];
    if (!schema) continue;
    const nested = new Set<string>();
    collectRefs(schema, nested);
    for (const n of nested) {
      if (!reachable.has(n)) { reachable.add(n); queue.push(n); }
    }
  }

  const pruned: Record<string, JsonSchema> = {};
  for (const name of reachable) {
    if (allSchemas[name]) pruned[name] = allSchemas[name];
  }
  // Fill any refs that were reachable from paths but still missing (e.g. primitives
  // accidentally emitted as $refs by the Go/TS parsers)
  fillDanglingRefs(pruned, JSON.stringify(paths));
  return pruned;
}

// Fill any $ref targets that are missing from allSchemas with empty object stubs.
// Pass extraText (e.g. serialized paths) to also catch refs defined outside schemas.
function fillDanglingRefs(allSchemas: Record<string, JsonSchema>, extraText = ''): Record<string, JsonSchema> {
  const text = JSON.stringify(allSchemas) + extraText;
  const refRe = /"#\/components\/schemas\/([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = refRe.exec(text)) !== null) {
    const name = m[1];
    if (!allSchemas[name] && !name.includes('<') && !name.includes('>')) {
      allSchemas[name] = { type: 'object' };
    }
  }
  return allSchemas;
}

// Resolve an inner type name to its items schema, going through rustTypeToJsonSchema
// so that type aliases (e.g. WebhookEndpointDto → WebhookEndpoint) are resolved.
function resolveInnerSchema(
  typeName: string,
  structs: Map<string, RustStruct>,
  allSchemas: Record<string, JsonSchema>,
): JsonSchema {
  if (allSchemas[typeName]) return { $ref: `#/components/schemas/${typeName}` };
  const resolved = rustTypeToJsonSchema(typeName);
  // If rustTypeToJsonSchema returned a $ref to a known schema, use it
  if (resolved.$ref) {
    const refName = resolved.$ref.replace('#/components/schemas/', '');
    if (allSchemas[refName]) return resolved;
    ensureSchema(refName, structs, allSchemas);
    if (allSchemas[refName]) return resolved;
  }
  return resolved;
}
