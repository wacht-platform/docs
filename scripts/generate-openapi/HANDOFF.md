# OpenAPI Generation — Handoff

This document explains how the OpenAPI generation scripts work, how to run them, how to extend them, and where things break.

---

## What it does

The script reads source code from the Wacht monorepo and produces two OpenAPI 3.1.0 specs:

- `public/openapi/frontend-api.json` — the Go-based frontend/runtime API
- `public/openapi/platform-api.json` — the Rust-based platform/management API

It also produces two sidebar manifests used by the docs site navigation:

- `public/openapi/frontend-api-manifest.json`
- `public/openapi/platform-api-manifest.json`

No annotations, decorators, or doc comments are required in the source code. The script infers everything from routing files, handler function signatures, and struct/DTO definitions.

---

## How to run

```bash
pnpm generate:openapi
```

This runs `tsx scripts/generate-openapi/index.ts`. It expects the wacht monorepo to be the parent directory of `wacht-docs` (i.e., `wacht-docs` lives at `wacht/wacht-docs`).

---

## File map

```
scripts/generate-openapi/
├── index.ts          Entry point — orchestrates parsing and writing
├── config.ts         Monorepo paths and output paths
├── types.ts          Shared TypeScript types (Route, OpenAPISpec, etc.)
├── go-parser.ts      Parses Go router files and handler signatures (Frontend API)
├── rust-parser.ts    Parses Rust router, handlers, and DTO structs (Platform API)
├── ts-schema.ts      Parses TypeScript interfaces/types from react-sdk
├── openapi-builder.ts  Assembles the final OpenAPI specs from parsed data
└── HANDOFF.md        This document
```

---

## Pipeline overview

### Frontend API (Go + Fiber)

```
go-parser: parseGoRoutes()     → Route[]          (method, path, handlerFn, tag)
go-parser: parseGoSchemas()    → Map<name, schema> (struct definitions)
go-parser: parseGoHandlers()   → Map<fn, info>     (query params, body fields, response type)
ts-schema: parseTypeScriptSchemas() → Map<name, schema> (react-sdk type definitions)
                                         ↓
openapi-builder: buildFrontendApiSpec() → OpenAPISpec
```

### Platform API (Rust + Axum)

```
rust-parser: parseRustRoutes()   → Route[]          (method, path, handlerFn, tag)
rust-parser: parseRustHandlers() → Map<fn, info>     (body type, query type, response type)
rust-parser: parseRustDTOs()     → Map<name, struct> (DTO and model struct definitions)
                                         ↓
openapi-builder: buildPlatformApiSpec() → OpenAPISpec
```

---

## Go parser (`go-parser.ts`)

**Route parsing** (`parseGoRoutes`):
- Reads every `.go` file in the `router/` directory
- Resolves group chains: `v1 := app.Group("/v1")`, `auth := v1.Group("/auth")` → `/v1/auth`
- Converts Fiber path params (`:id`) to OpenAPI format (`{id}`)
- Infers the tag from the first meaningful path segment (`/users/...` → `users`)

**Handler parsing** (`parseGoHandlers`):
- Reads every `.go` file in the `handler/` directory
- For each function matching a known route handler name, extracts:
  - `c.Query("key")` calls → query parameters
  - `c.Params("key")` calls → path parameters (fallback if not already inferred from path)
  - `handler.Validate[TypeName](c)` → the request body type
  - `c.Bind().Body(&struct{...})` → inline body fields
  - `c.FormValue("key")` / `c.FormFile("key")` → form fields and file uploads
  - `SendSuccess(c, TypeName{})` → response type name

**Schema parsing** (`parseGoSchemas`):
- Reads Go structs from handler and model files
- Extracts fields with their `json:` tags, types, and `omitempty` (→ optional)
- Converts Go types to JSON Schema primitives:
  - `string`, `bool`, `int`/`int64`/`uint*` → string/boolean/integer
  - `float64` → number
  - `time.Time` → `{ type: string, format: date-time }`
  - `[]T` → `{ type: array, items: ... }`
  - `map[string]T` → `{ type: object, additionalProperties: ... }`
  - `*T` → nullable ref
  - `interface{}` / `JSONMap` / `JSONB` → `{ type: object }`

---

## Rust parser (`rust-parser.ts`)

**Route parsing** (`parseRustRoutes`):
- Reads `.rs` files in the router subpath
- Resolves nested `Router::new().nest("/prefix", sub_router)` chains
- Also handles function-based routers: `fn routes() -> Router` that call `.route("/path", method(handler))`
- Converts Axum path params (`:id`) to OpenAPI format (`{id}`)

**Handler parsing** (`parseRustHandlers`):
- Reads `.rs` files in the API subpath
- For each `async fn handler_name(...)` it extracts extractor types:
  - `Json(body): Json<TypeName>` → `jsonBodyType`
  - `Query(params): Query<TypeName>` → `queryParamsType`
  - `Path(params): Path<TypeName>` → `pathParamsType`
  - `Multipart` → `hasMultipart: true`
- Extracts the response type from the return type annotation or from explicit type use in the function body

**DTO parsing** (`parseRustDTOs`):
- Scans multiple subpaths: `dto/src`, `models/src`, and `extraStructSubpaths` from config
- For each `.rs` file, extracts:
  - Structs with their fields, Rust types, and serde attributes (`rename`, `rename_all`, `skip`, `default`)
  - Enums with their variants (applying `rename_all` casing: `snake_case`, `camelCase`, etc.)
  - `Option<T>` fields → `required: false`
- `rustTypeToJsonSchema()` converts Rust types to JSON Schema:
  - All integer variants (`i64`, `u32`, `FlexibleI64`, `StatusCode`, etc.) → integer
  - `Decimal` → number
  - `Uuid` → `{ type: string, format: uuid }`
  - `DateTime<Utc>` / `NaiveDate` → `{ type: string, format: date-time }`
  - `Vec<T>` → array, `Option<T>` → nullable, `HashMap<K,V>` → object
  - Unknown named types → `$ref` to `#/components/schemas/TypeName`
  - Infrastructure types (`AppState`, `S3Client`, etc.) → ignored / opaque `{}`

---

## OpenAPI builder (`openapi-builder.ts`)

`buildFrontendApiSpec` and `buildPlatformApiSpec` both follow the same pattern:

1. **Build operations** — for each route, look up the handler info and assemble an `OperationObject` with parameters, request body, and response schemas
2. **Collect schemas** — every struct/DTO referenced by a route goes into `components.schemas`
3. **Fill dangling refs** (`fillDanglingRefs`) — any `$ref` in the assembled spec that points to a missing schema gets stubbed as `{ type: object }` so the spec remains valid
4. **Prune unreachable schemas** (`pruneSchemas`) — BFS walk from all operation schemas to collect reachable refs; anything not reachable is removed
5. **Security** — operations get `security: []` on public routes; all others inherit from the spec-level default

**Response wrapping**: Go API responses are wrapped in the `SendSuccess` envelope: `{ status, message, data, session, errors }`. The builder applies this automatically via `wrapInEnvelope()`.

**Tag display names**: The `TAG_DISPLAY_OVERRIDES` map in `openapi-builder.ts` controls how raw tag slugs appear (e.g., `api-auth` → `API Auth`). Add entries here for any new tags that need special casing.

---

## Configuration (`config.ts`)

All paths are relative to the monorepo root (resolved from `wacht-docs`'s position in the repo):

```ts
export const config = {
  frontendApi: {
    dir: '<monorepo>/frontend-api',
    routerDir: 'router',      // Go router files
    handlerDir: 'handler',    // Go handler files
    modelDir: 'model',        // Go model/type files
  },
  platformApi: {
    dir: '<monorepo>/platform-api',
    routerSubpath: 'platform/src/application/router',
    apiSubpath: 'platform/src/api',
    dtoSubpath: 'dto/src',
    modelsSubpath: 'models/src',
    extraStructSubpaths: [    // Additional paths scanned for struct definitions
      'queries/src',
      'platform/src/api',
      'platform/src/application',
      'commands/src',
      'common/src',
    ],
  },
  reactSdk: {
    typesDir: '<monorepo>/react-sdk/wacht-types/src',
  },
  output: {
    dir: 'public/openapi',
    frontendApi: 'frontend-api.json',
    platformApi: 'platform-api.json',
  },
};
```

If the monorepo directory structure changes, update paths here. The `MONOREPO_ROOT` resolution assumes `wacht-docs` is one level inside the monorepo root (`wacht/wacht-docs`).

---

## Adding new routes

### Go (Frontend API)

New routes are picked up automatically as long as they:
- Are registered in a file inside `frontend-api/router/`
- Follow the `routerVar.Method("path", ...handler)` pattern
- Have a handler function in `frontend-api/handler/`

The handler function is matched by name. If the handler uses `SendSuccess(c, SomeType{})` for its response, the response schema is inferred. If it uses `c.JSON(...)` directly, the response is marked as raw JSON.

### Rust (Platform API)

New routes are picked up automatically as long as they:
- Are registered in a file inside `platform/src/application/router/`
- Use `.route("/path", method(handler_fn))` syntax
- Have a corresponding `async fn handler_fn(...)` in `platform/src/api/`

New DTO types used as `Json<T>`, `Query<T>`, or response types are resolved from the DTO/models scan. If a new DTO lives in a directory not currently in `extraStructSubpaths`, add that path to `config.platformApi.extraStructSubpaths`.

---

## Common failure modes

### Missing schema (`$ref` to undefined type)

**Symptom**: `fillDanglingRefs` stubs the type as `{ type: object }` — the schema appears in the spec but is empty.

**Cause**: The struct lives in a directory not scanned by the parser, the type name doesn't match exactly (e.g., module path prefix not stripped), or the type is a generic that couldn't be resolved.

**Fix**: Add the directory to `extraStructSubpaths` in config, or add an explicit alias in `rustTypeToJsonSchema`'s `typeAliases` map.

### Handler not matched

**Symptom**: An operation shows no parameters or request body.

**Cause (Go)**: The handler function name in the router doesn't match the function name in the handler file. Often happens with method receivers (`handler.Method` vs `Method`).

**Cause (Rust)**: The handler function lives in a file not under `apiSubpath`, or the async function signature uses unusual extractor patterns.

**Fix**: Check the parsed handler map by adding a temporary `console.log` in `index.ts` after the handler parsing step.

### Wrong tag or missing operation

**Symptom**: An operation appears under the wrong tag, or doesn't appear at all.

**Cause**: The tag is inferred from the first path segment. A path like `/internal/users` gets tag `internal`, not `users`.

**Fix**: The tag is set at the `Route` level. For the Go parser it comes from `tagFromPath()` — override it per-file if needed. For Rust, same function in `rust-parser.ts`.

### Enum variants in wrong case

**Symptom**: Enum values appear as `PascalCase` instead of `snake_case` or `camelCase`.

**Cause**: The serde `rename_all` attribute on the Rust enum wasn't picked up.

**Fix**: Check that the enum's serde attribute block is being parsed. The regex in `parseRustEnumVariants` looks for `#[serde(...)]` on the enum definition line. Multi-line attribute blocks may not be captured.

---

## What the script cannot infer

- **Descriptions and summaries**: Operation summaries are derived from the handler function name. There is no way to add a richer description without annotating the source. Future work: support a `// openapi: description` comment convention.
- **Deprecation**: Not inferred. Would need source annotation.
- **Examples**: Not generated. The fumadocs-openapi UI generates curl/JS/Python examples from the schema automatically.
- **Enum descriptions**: Variant meaning is not inferred — only the value itself.
- **Conditional / polymorphic schemas**: `oneOf` / `anyOf` are only generated for TypeScript union types. Rust enums with data (e.g., `enum Foo { Bar(T), Baz(U) }`) are not fully supported — they fall back to `{ type: object }`.

---

## Regenerating after source changes

Run after any of the following:
- New routes added to `frontend-api/router/` or the platform router
- New handler functions added or existing signatures changed
- New DTO structs or fields added to `dto/src` or `models/src`
- New TypeScript types added to `react-sdk/wacht-types/src`

The specs and manifests are checked into the repo under `public/openapi/`. Commit the regenerated files alongside your source changes.
