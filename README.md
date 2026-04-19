# wacht-docs

Documentation site for [Wacht](https://wacht.dev) — built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev).

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Docs engine | Fumadocs (MDX + UI) |
| API reference | fumadocs-openapi |
| Styling | Tailwind CSS v4 |
| Syntax highlighting | Shiki |

## Project structure

```
app/
  docs/                        Docs layout and all content pages
    [[...slug]]/page.tsx         MDX content catch-all (SDK docs, guides, product)
    reference/
      frontend-api/[tag]/[operation]/page.tsx   Frontend API operation pages
      backend-api/[tag]/[operation]/page.tsx    Backend API operation pages
  (home)/                      Marketing / landing pages

content/
  docs/
    reference/                 Overview MDX pages for API reference sections
    sdks/                      SDK documentation (Next.js, React Router, etc.)
    guides/                    How-to guides
    product/                   Product concept docs

components/
  docs-sidebar.tsx             Custom sidebar with 3-level API reference navigation
  docs-header.tsx              Top navigation bar
  docs-container.tsx           Grid layout container

public/
  openapi/
    frontend-api.json          Generated OpenAPI spec (Frontend API)
    platform-api.json          Generated OpenAPI spec (Platform API)
    frontend-api-manifest.json Sidebar manifest (tag + operation slugs)
    platform-api-manifest.json Sidebar manifest (tag + operation slugs)

scripts/
  generate-openapi/            OpenAPI spec generation from monorepo source code
    index.ts                     Entry point
    config.ts                    Monorepo path configuration
    go-parser.ts                 Parses Go router + handler files (Frontend API)
    rust-parser.ts               Parses Rust router + handler + DTO files (Platform API)
    ts-schema.ts                 Parses TypeScript types from react-sdk
    openapi-builder.ts           Assembles OpenAPI specs from parsed data
    HANDOFF.md                   Full documentation for the generation pipeline

lib/
  openapi.ts                   Shiki + code sample setup for fumadocs-openapi
  source.ts                    Fumadocs content source adapter
```

## Generating API reference docs

The OpenAPI specs are generated from the Wacht monorepo source code — no manual annotations required. Run:

```bash
pnpm generate:openapi
```

This reads Go (Frontend API) and Rust (Platform API) source files from the sibling monorepo directories and writes the specs to `public/openapi/`. Commit the output alongside source changes.

See [`scripts/generate-openapi/HANDOFF.md`](./scripts/generate-openapi/HANDOFF.md) for full documentation on how the generation pipeline works, how to extend it, and how to debug common failures.

## Content

Documentation lives in `content/docs/` as MDX files. Fumadocs handles routing, table of contents, and search automatically.

- **SDK docs** — `content/docs/sdks/` — framework-specific guides for Next.js, React Router, TanStack Router, Node, and Rust
- **Guides** — `content/docs/guides/` — task-oriented how-to articles
- **Product** — `content/docs/product/` — concept and architecture docs
- **API reference** — `content/docs/reference/` — overview pages; individual operation pages are generated dynamically from the OpenAPI specs

## Type checking

```bash
pnpm types:check
```

## Local Orama MCP Search

The `/mcp` endpoint uses a local in-process Orama index built from docs pages.

Runtime behavior:

- `search_docs` queries the local Orama index from current docs content.
- `get_doc` returns the full page from local docs source.
- Index cache TTL is short-lived and rebuilt automatically.
