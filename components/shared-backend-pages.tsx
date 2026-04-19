import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page';
import type { TOCItemType } from 'fumadocs-core/toc';
import type { ApiField } from '@/components/api-explorer';
import { allBackendGroups } from '@/components/shared-backend-pages.generated';
import { backendMeta } from '@/components/shared-backend-pages.catalog';
import type { BackendDoc, BackendFrameworkKey } from '@/components/shared-backend-pages.types';
import { docsContentRoute } from '@/lib/shared';

function replaceFrameworkImport(content: string, framework: BackendFrameworkKey) {
  if (!content) return content;
  const importPath = backendMeta[framework].importPath;
  return content.replaceAll('@wacht/nextjs/server', importPath);
}

function rewriteDocForFramework(framework: BackendFrameworkKey, doc: BackendDoc): BackendDoc {
  if (framework === 'node') return doc;

  return {
    ...doc,
    intro: replaceFrameworkImport(doc.intro, framework),
    usage: replaceFrameworkImport(doc.usage, framework),
    sections: doc.sections?.map((section) => ({
      ...section,
      paragraphs: section.paragraphs?.map((paragraph) => replaceFrameworkImport(paragraph, framework)),
      points: section.points?.map((point) => replaceFrameworkImport(point, framework)),
    })),
    examples: doc.examples?.map((example) => ({
      ...example,
      code: replaceFrameworkImport(example.code, framework),
    })),
  };
}

function customizeBackendDoc(framework: BackendFrameworkKey, doc: BackendDoc): BackendDoc {
  if (framework === 'node') {
    if ((doc.path?.join('/') ?? doc.slug) === 'foundation/client-access') {
      return {
        ...doc,
        intro:
          'The standalone backend SDK gives you direct access to the universal backend client. In plain JavaScript runtimes, the main entrypoints are `new WachtClient(...)`, `initClient()`, and `getClient()`, depending on whether you want explicit instances or a process-wide singleton.',
        usage: `import { initClient, getClient } from '@wacht/backend';

initClient({
  apiKey: process.env.WACHT_API_KEY!,
});

export async function listUsers() {
  const client = getClient();
  return client.users.listUsers({ limit: 10 });
}`,
        sections: [
          {
            title: 'Direct instances',
            paragraphs: [
              'Use `new WachtClient(...)` when you want an explicit backend client instance under your own control.',
              'This is the right fit when you need more than one client in the same process, or when you want to inject configuration like `fetch`, `baseUrl`, headers, or a client name directly at construction time.',
            ],
          },
          {
            title: 'Global client pattern',
            paragraphs: [
              'Use `initClient()` when your JavaScript runtime only needs one global backend client for the whole process. After initialization, `getClient()` returns that same client whenever another module needs it.',
              'This is useful in scripts, CLIs, workers, and long-running services where a process-wide singleton is simpler than passing a client instance around.',
            ],
          },
          {
            title: 'How to choose',
            paragraphs: [
              'Use `new WachtClient(...)` for explicit instance management. Use `initClient()` and `getClient()` when the global-client pattern is actually useful.',
              'If you need several backend clients in one process, do not rely on the singleton. Create instances directly or use `createClientStore()` instead.',
            ],
          },
        ],
        examples: [
          {
            title: 'Create a direct backend client',
            code: `import { WachtClient } from '@wacht/backend';

export function createClient(fetchImpl?: typeof fetch) {
  return new WachtClient({
    apiKey: process.env.WACHT_API_KEY!,
    fetch: fetchImpl,
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Initialize the global client once',
            code: `import { initClient, getClient } from '@wacht/backend';

initClient({
  apiKey: process.env.WACHT_API_KEY!,
});

export async function checkHealth() {
  const client = getClient();
  return client.health.healthCheck();
}`,
            lang: 'ts',
          },
        ],
      };
    }

    if (doc.slug === 'initialize-client') {
      return {
        ...doc,
        intro:
          'In the standalone backend package, you can either instantiate `new WachtClient(...)` directly or initialize the global client with `initClient()`. Both paths give you the same backend resource surface after the client exists.',
        sections: [
          {
            title: 'Direct instances',
            paragraphs: [
              'Use `new WachtClient(...)` when you want an explicit backend client instance under your own control.',
              'This is the right fit when you need more than one client in the same process, or when you want to inject configuration like `fetch`, `baseUrl`, headers, or a client name directly at construction time.',
            ],
          },
          {
            title: 'Global client pattern',
            paragraphs: [
              'Use `initClient()` when your JavaScript runtime only needs one global backend client for the whole process. After initialization, `getClient()` returns that same client whenever another module needs it.',
              'This is useful in scripts, CLIs, workers, and long-running services where a process-wide singleton is simpler than passing a client instance around.',
            ],
          },
          {
            title: 'Runtime requirements',
            paragraphs: [
              'The backend client expects a JavaScript runtime with `fetch`, or a `fetch` implementation passed explicitly through config. That keeps the same client usable across Node.js, Bun, edge-style runtimes, and other server-side JavaScript environments.',
            ],
          },
        ],
      };
    }
  }

  if ((doc.path?.join('/') ?? doc.slug) === 'foundation/client-access') {
    return {
      ...doc,
      intro:
        'The framework server SDKs expose the backend client through a small adapter layer. In Next.js, React Router, and TanStack Router, the main entrypoints are `wachtClient()` and `createWachtServerClient()`, depending on whether you want the cached default client or a fresh instance.',
      sections: [
        {
          title: 'Framework adapters',
          paragraphs: [
            'In Next.js, React Router, and TanStack Router, the main helpers are `wachtClient()` and `createWachtServerClient()`.',
            '`wachtClient()` is the default entrypoint. It returns a cached backend client when you call it without options. `createWachtServerClient()` always creates a fresh backend client and is the better fit when you need explicit config for one code path.',
          ],
        },
        {
          title: 'How to choose',
          paragraphs: [
            'Use `wachtClient()` for ordinary framework-backed server calls. Use `createWachtServerClient()` when you need custom API keys, headers, base URLs, or a custom `fetch` implementation.',
            'Both helpers access the same universal backend client surface. The difference is only how the framework package gives you that client.',
          ],
        },
      ],
      examples: [
        {
          title: 'Framework adapter: use the cached client',
          code: `import { wachtClient } from '@wacht/nextjs/server';

export async function GET() {
  const client = await wachtClient();
  const health = await client.health.healthCheck();

  return Response.json(health);
}`,
          lang: 'ts',
        },
        {
          title: 'Framework adapter: create a fresh client',
          code: `import { createWachtServerClient } from '@wacht/nextjs/server';

export function createStagingClient(fetchImpl?: typeof fetch) {
  return createWachtServerClient({
    apiKey: process.env.WACHT_STAGING_API_KEY,
    apiUrl: 'https://staging-api.wacht.io',
    fetch: fetchImpl,
    name: 'staging',
  });
}`,
          lang: 'ts',
        },
      ],
    };
  }

  return doc;
}

function detectLanguage(code: string) {
  const trimmed = code.trim();
  if (trimmed.startsWith('npm ') || trimmed.startsWith('pnpm ') || trimmed.startsWith('yarn ') || trimmed.startsWith('bun ')) return 'bash';
  if (trimmed.includes('use wacht_rs') || trimmed.includes('WachtClient::builder') || trimmed.includes('async fn')) return 'rust';
  if (trimmed.includes('export default function') || trimmed.includes('</') || trimmed.includes('<')) return 'tsx';
  return 'ts';
}

function headingId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[0.8125rem] text-foreground">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function apiFieldSignature(field: ApiField) {
  const typeLabel = field.type ?? (field.children?.length ? 'object' : 'unknown');
  const optional = field.required ? '' : '?';
  const alreadyIncludesUndefined = /\|\s*undefined\b/.test(typeLabel);
  const undefinedSuffix = field.required || alreadyIncludesUndefined ? '' : ' | undefined';
  return `${field.name}${optional}: ${typeLabel}${undefinedSuffix};`;
}

function ApiProperty({ field, depth = 0 }: { field: ApiField; depth?: number }) {
  return (
    <details className="group py-4" style={{ paddingLeft: depth ? `${depth * 20}px` : undefined }}>
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-2">
          <span className="flex shrink-0 items-center self-center text-muted-foreground transition-transform group-open:rotate-90">›</span>
          <div className="min-w-0 flex-1 rounded-md bg-muted/20 px-3 py-2">
            <div className="[&_pre]:my-0 [&_pre]:max-h-none [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:bg-transparent [&_pre]:px-0 [&_pre]:py-0 [&_pre]:text-[0.8125rem] [&_pre]:leading-6">
              <DynamicCodeBlock lang="ts" code={apiFieldSignature(field)} codeblock={{ allowCopy: false }} />
            </div>
          </div>
        </div>
      </summary>

      <div className="space-y-3 pt-3 pl-7">
        <div className="text-sm leading-7 text-muted-foreground">{field.description}</div>
        {field.children?.length ? (
          <div className="divide-y divide-border border-l border-border/70 pl-4">
            {field.children.map((child) => (
              <ApiProperty key={`${field.name}.${child.name}`} field={child} depth={depth + 1} />
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}

export function getSharedBackendDoc(framework: BackendFrameworkKey, slug: string | string[]) {
  const slugKey = Array.isArray(slug) ? slug.join('/') : slug;
  const group = allBackendGroups.find((entry) =>
    entry.docs.some((doc) => (doc.path?.join('/') ?? doc.slug) === slugKey),
  );
  const doc = group?.docs.find((entry) => (entry.path?.join('/') ?? entry.slug) === slugKey);
  if (!doc) return null;
  const customized = rewriteDocForFramework(framework, customizeBackendDoc(framework, doc));
  return { framework, group: group!.label, ...customized, slug: slugKey };
}

export function getSharedBackendDocParams() {
  const frameworks: BackendFrameworkKey[] = ['nextjs', 'react-router', 'tanstack-router', 'node'];
  const params: Array<{ slug: string[] }> = [];
  for (const framework of frameworks) {
    for (const group of allBackendGroups) {
      for (const doc of group.docs) {
        params.push({ slug: ['sdks', framework, 'backend', ...(doc.path ?? [doc.slug])] });
      }
    }
  }
  return params;
}

export function buildSharedBackendToc(doc: BackendDoc): TOCItemType[] {
  const visibleSections = doc.sections ?? [];
  const toc: TOCItemType[] = [{ title: 'Usage', url: '#usage', depth: 2 }];
  if (doc.signature) toc.push({ title: 'Signature', url: '#signature', depth: 2 });
  if (doc.params?.length) toc.push({ title: doc.paramsTitle ?? 'Parameters', url: '#parameters', depth: 2 });
  if (doc.api?.length) toc.push({ title: 'API', url: '#api', depth: 2 });
  if (visibleSections.length) {
    for (const section of visibleSections) {
      toc.push({ title: section.title, url: `#${headingId(section.title)}`, depth: 2 });
    }
  }
  if (doc.examples?.length) toc.push({ title: 'Examples', url: '#examples', depth: 2 });
  return toc;
}

export function getSharedBackendMarkdownUrl(framework: BackendFrameworkKey, slug: string) {
  return `${docsContentRoute}/sdks/${framework}/backend/${slug}/content.md`;
}

export function buildSharedBackendMarkdown({
  doc,
}: {
  doc: BackendDoc;
}) {
  const visibleSections = doc.sections ?? [];
  const blocks: string[] = [];
  blocks.push(`# ${doc.title}`);
  blocks.push('');
  blocks.push(doc.description);
  blocks.push('');
  blocks.push(doc.intro);
  blocks.push('');
  blocks.push('## Usage');
  blocks.push('');
  blocks.push('```' + detectLanguage(doc.usage));
  blocks.push(doc.usage.trim());
  blocks.push('```');
  if (doc.signature) {
    blocks.push('');
    blocks.push('## Signature');
    blocks.push('');
    blocks.push('```' + detectLanguage(doc.signature));
    blocks.push(doc.signature.trim());
    blocks.push('```');
  }
  if (doc.params?.length) {
    blocks.push('');
    blocks.push(`## ${doc.paramsTitle ?? 'Parameters'}`);
    blocks.push('');
    for (const field of doc.params) {
      blocks.push(`- **${field.name}** \`${field.type ?? 'unknown'}\``);
      blocks.push(`  - ${field.description}`);
    }
  }
  if (doc.api?.length) {
    blocks.push('');
    blocks.push('## API');
    blocks.push('');
    for (const field of doc.api) {
      blocks.push(`- **${field.name}** \`${field.type ?? 'unknown'}\``);
      blocks.push(`  - ${field.description}`);
    }
  }
  if (visibleSections.length) {
    for (const section of visibleSections) {
      blocks.push('');
      blocks.push(`## ${section.title}`);
      blocks.push('');
      if (section.paragraphs?.length) blocks.push(...section.paragraphs, '');
      if (section.points?.length) blocks.push(...section.points.map((point) => `- ${point}`), '');
    }
  }
  if (doc.examples?.length) {
    blocks.push('');
    blocks.push('## Examples');
    blocks.push('');
    for (const example of doc.examples) {
      blocks.push(`### ${example.title}`);
      blocks.push('');
      blocks.push('```' + (example.lang ?? detectLanguage(example.code)));
      blocks.push(example.code.trim());
      blocks.push('```');
      blocks.push('');
    }
  }
  return blocks.join('\n').trim() + '\n';
}

export function SharedBackendDocPage({
  framework,
  slug,
  markdownUrl,
}: {
  framework: BackendFrameworkKey;
  slug: string;
  markdownUrl?: string;
}) {
  const doc = getSharedBackendDoc(framework, slug);
  if (!doc) throw new Error(`Unknown shared backend doc: ${framework}/${slug}`);
  const meta = backendMeta[framework];
  const visibleSections = doc.sections ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-[1.5rem] font-normal leading-tight text-foreground">{doc.title}</h1>
      <div className="space-y-3">
        <div className="text-sm leading-7 text-muted-foreground">{renderInline(doc.intro)}</div>
      </div>
      {markdownUrl ? (
        <div className="flex flex-wrap items-center gap-2">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover markdownUrl={markdownUrl} />
        </div>
      ) : null}
      <section className="space-y-3">
        <h2 id="usage" className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">Usage</h2>
        <p>The following example shows a basic usage of the backend client from <code>{meta.importPath}</code>.</p>
        <DynamicCodeBlock lang={detectLanguage(doc.usage)} code={doc.usage} codeblock={{ allowCopy: true }} />
      </section>
      {doc.signature ? (
        <section className="space-y-3">
          <h2 id="signature" className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">Signature</h2>
          <div className="[&_pre]:my-0 [&_pre]:max-h-none [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:bg-transparent [&_pre]:px-0 [&_pre]:py-0 [&_pre]:text-[0.8125rem] [&_pre]:leading-6">
            <DynamicCodeBlock lang="ts" code={doc.signature} codeblock={{ allowCopy: false }} />
          </div>
        </section>
      ) : null}
      {doc.params?.length ? (
        <section className="space-y-3">
          <h2 id="parameters" className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">{doc.paramsTitle ?? 'Parameters'}</h2>
          <div className="divide-y divide-border border-y border-border">
            {doc.params.map((field) => (
              <ApiProperty key={field.name} field={field} />
            ))}
          </div>
        </section>
      ) : null}
      {doc.api?.length ? (
        <section className="space-y-3">
          <h2 id="api" className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">Return value</h2>
          <div className="divide-y divide-border border-y border-border">
            {doc.api.map((field) => (
              <ApiProperty key={field.name} field={field} />
            ))}
          </div>
        </section>
      ) : null}
      {visibleSections.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 id={headingId(section.title)} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">{section.title}</h2>
          {section.paragraphs?.length ? (
            <div className="space-y-2">
              {section.paragraphs.map((paragraph) => (
                <div key={paragraph} className="text-sm leading-7 text-muted-foreground">{renderInline(paragraph)}</div>
              ))}
            </div>
          ) : null}
          {section.points?.length ? (
            <ul className="space-y-1.5 text-sm leading-7 text-muted-foreground">
              {section.points.map((point) => (
                <li key={point}>{renderInline(point)}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      {doc.examples?.length ? (
        <section className="space-y-3">
          <h2 id="examples" className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">Examples</h2>
          <div className="space-y-5">
            {doc.examples.map((example) => (
              <div key={example.title} className="space-y-2">
                <h3 className="text-base font-medium text-foreground">{example.title}</h3>
                <DynamicCodeBlock lang={example.lang ?? detectLanguage(example.code)} code={example.code} codeblock={{ allowCopy: true }} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
