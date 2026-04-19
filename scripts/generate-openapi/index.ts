#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { config } from './config.js';
import { parseGoRoutes, parseGoHandlers, parseGoSchemas } from './go-parser.js';
import { parseTypeScriptSchemas } from './ts-schema.js';
import { parseRustRoutes, parseRustHandlers, parseRustDTOs } from './rust-parser.js';
import { buildFrontendApiSpec, buildPlatformApiSpec, tagToSlug, operationToSlug } from './openapi-builder.js';
import type { OpenAPISpec } from './types.js';

function log(msg: string) {
  console.log(`[openapi-gen] ${msg}`);
}

async function main() {
  fs.mkdirSync(config.output.dir, { recursive: true });

  // ── Frontend API ──────────────────────────────────────────────────────────

  log('Parsing Go router files...');
  const goRoutes = parseGoRoutes(path.join(config.frontendApi.dir, config.frontendApi.routerDir));
  log(`  Found ${goRoutes.length} routes`);

  log('Parsing Go schema types...');
  const goSchemas = parseGoSchemas(path.join(config.frontendApi.dir, config.frontendApi.handlerDir));
  // Also scan model package for types referenced from handler responses
  const goModelSchemas = parseGoSchemas(path.join(config.frontendApi.dir, config.frontendApi.modelDir));
  for (const [name, schema] of goModelSchemas) {
    if (!goSchemas.has(name)) goSchemas.set(name, schema);
  }
  log(`  Found ${goSchemas.size} Go schema types (handlers + models)`);

  log('Parsing Go handler files...');
  const goHandlers = parseGoHandlers(path.join(config.frontendApi.dir, config.frontendApi.handlerDir), goSchemas);
  log(`  Found ${goHandlers.size} handlers`);

  log('Parsing TypeScript types from React SDK...');
  const tsSchemas = parseTypeScriptSchemas(config.reactSdk.typesDir);
  log(`  Found ${tsSchemas.size} TypeScript types`);

  log('Building Frontend API spec...');
  const frontendSpec = buildFrontendApiSpec(goRoutes, goHandlers, goSchemas, tsSchemas);

  const frontendOut = path.join(config.output.dir, config.output.frontendApi);
  fs.writeFileSync(frontendOut, JSON.stringify(frontendSpec, null, 2));
  log(`  Written to ${frontendOut}`);
  log(`  Paths: ${Object.keys(frontendSpec.paths).length}, Schemas: ${Object.keys(frontendSpec.components.schemas).length}`);

  // ── Platform API ──────────────────────────────────────────────────────────

  log('Parsing Rust router files...');
  const rustRoutes = parseRustRoutes(config.platformApi.dir, config.platformApi.routerSubpath);
  log(`  Found ${rustRoutes.length} routes`);

  log('Parsing Rust handler signatures...');
  const rustHandlers = parseRustHandlers(config.platformApi.dir, config.platformApi.apiSubpath);
  log(`  Found ${rustHandlers.size} handlers`);

  log('Parsing Rust DTO types...');
  const rustStructs = parseRustDTOs(config.platformApi.dir, config.platformApi.dtoSubpath, config.platformApi.modelsSubpath, config.platformApi.extraStructSubpaths);
  log(`  Found ${rustStructs.size} structs/enums`);

  log('Building Platform API spec...');
  const platformSpec = buildPlatformApiSpec(rustRoutes, rustHandlers, rustStructs);

  const platformOut = path.join(config.output.dir, config.output.platformApi);
  fs.writeFileSync(platformOut, JSON.stringify(platformSpec, null, 2));
  log(`  Written to ${platformOut}`);
  log(`  Paths: ${Object.keys(platformSpec.paths).length}, Schemas: ${Object.keys(platformSpec.components.schemas).length}`);

  // ── Manifests (for sidebar navigation) ───────────────────────────────────────

  const frontendManifestOut = path.join(config.output.dir, 'frontend-api-manifest.json');
  fs.writeFileSync(frontendManifestOut, JSON.stringify(buildManifest(frontendSpec), null, 2));
  log(`  Frontend manifest written to ${frontendManifestOut}`);

  const platformManifestOut = path.join(config.output.dir, 'platform-api-manifest.json');
  fs.writeFileSync(platformManifestOut, JSON.stringify(buildManifest(platformSpec), null, 2));
  log(`  Platform manifest written to ${platformManifestOut}`);

  log('Done!');
}

function camelToKebab(s: string): string {
  return s.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

function buildManifest(spec: OpenAPISpec) {
  const httpMethods = ['get', 'post', 'put', 'patch', 'delete'];

  const tagOps: Record<string, { name: string; slug: string; method: string; path: string }[]> = {};
  for (const tag of spec.tags ?? []) {
    tagOps[tag.name] = [];
  }

  // Track used slugs per tag to avoid collisions
  const usedSlugs: Record<string, Set<string>> = {};

  for (const [routePath, pathItem] of Object.entries(spec.paths)) {
    for (const [method, op] of Object.entries(pathItem as Record<string, any>)) {
      if (!httpMethods.includes(method)) continue;
      const opTags: string[] = op.tags ?? ['Default'];
      for (const tagName of opTags) {
        if (!tagOps[tagName]) tagOps[tagName] = [];
        if (!usedSlugs[tagName]) usedSlugs[tagName] = new Set();

        const summary: string = op.summary ?? op.operationId ?? `${method} ${routePath}`;
        // Use operationId (camelCase → kebab) as slug for uniqueness
        let slug = op.operationId ? camelToKebab(op.operationId) : operationToSlug(summary);
        // Deduplicate within a tag by appending method if needed
        if (usedSlugs[tagName].has(slug)) {
          slug = `${method}-${slug}`;
        }
        usedSlugs[tagName].add(slug);

        tagOps[tagName].push({
          name: summary,
          slug,
          method: method.toUpperCase(),
          path: routePath,
        });
      }
    }
  }

  return {
    tags: (spec.tags ?? []).map(tag => ({
      name: tag.name,
      slug: tagToSlug(tag.name),
      operations: tagOps[tag.name] ?? [],
    })),
  };
}

main().catch(err => {
  console.error('[openapi-gen] Error:', err);
  process.exit(1);
});
