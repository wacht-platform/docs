import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const foundationBackendDocs: BackendDoc[] = [
{
        slug: 'overview',
        title: 'Backend SDK',
        description: 'Use the universal backend client to call Wacht from server-side code.',
        intro:
          'The backend SDK is the shared server-side surface behind the framework adapters and the standalone Node package. It is the universal JavaScript runtime SDK for privileged Wacht operations such as user management, organization and workspace management, API keys, webhooks, AI resources, notifications, OAuth, and utility endpoints.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export default async function Example() {
  const client = await wachtClient();
  const users = await client.users.listUsers({ limit: 10 });

  return <pre>{JSON.stringify(users.data, null, 2)}</pre>;
}`,
        sections: [
          {
            title: 'What it is',
            paragraphs: [
              'This is not a React hook surface. It is the backend management client your server code uses to call Wacht directly with an API key.',
              'In Next.js, React Router, and TanStack Router, that client is exposed through `wachtClient()` and `createWachtServerClient()`. In the standalone backend package, the same underlying client is available directly through `WachtClient` plus the global helpers like `initClient()` and `getClient()`.',
            ],
          },
          {
            title: 'Built for any JavaScript runtime',
            paragraphs: [
              'The backend client is designed to work anywhere you can run JavaScript on the server side. In modern runtimes with global `fetch`, it works directly. In runtimes that do not provide `fetch`, you can pass your own implementation through the client config.',
              'That is why the same underlying client works across plain Node.js services, scripts, workers, serverless environments, and framework adapters.',
            ],
          },
          {
            title: 'How to think about the packages',
            paragraphs: [
              '`@wacht/backend` is the core backend SDK. It owns the client, the resource groups, the shared models, and the global client helpers.',
              'The framework server packages are thin access layers over that same backend client. They mainly add environment lookup and a cached `wachtClient()` helper so framework code can get to the same universal backend surface more ergonomically.',
            ],
          },
        ],
        examples: [
          {
            title: 'Use the backend SDK directly in a JavaScript runtime',
            code: `import { WachtClient } from '@wacht/backend';

const client = new WachtClient({
  apiKey: process.env.WACHT_API_KEY!,
});

export async function checkHealth() {
  return client.health.healthCheck();
}`,
            lang: 'ts',
          },
          {
            title: 'Provide fetch explicitly in a custom runtime',
            code: `import { WachtClient } from '@wacht/backend';

export function createClient(fetchImpl: typeof fetch) {
  return new WachtClient({
    apiKey: process.env.WACHT_API_KEY!,
    fetch: fetchImpl,
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'initialize-client',
        title: 'Initialize the client',
        description: 'Create a backend client in a framework adapter or in Node.',
        intro:
          'The backend client is created a little differently depending on where your server code runs, but the client surface after that point is the same. The framework adapters give you `wachtClient()` and `createWachtServerClient()`, while the standalone backend package gives you `WachtClient`, `initClient()`, and the global client store helpers.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export default async function Example() {
  const client = await wachtClient();
  const health = await client.health.healthCheck();

  return <pre>{JSON.stringify(health, null, 2)}</pre>;
}`,
        signature: `type WachtServerClientOptions = {
  apiKey?: string;
  apiUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
  name?: string;
};

declare function createWachtServerClient(options?: WachtServerClientOptions): WachtServerClient;
declare function wachtClient(options?: WachtServerClientOptions): Promise<WachtServerClient>;`,
        api: [
          {
            name: 'apiKey',
            type: 'string | undefined',
            description: 'Explicit API key. When omitted in the framework adapters, the client falls back to `WACHT_API_KEY`.',
          },
          {
            name: 'apiUrl',
            type: 'string | undefined',
            description: 'Override the backend API base URL.',
          },
          {
            name: 'timeout',
            type: 'number | undefined',
            description: 'Request timeout in milliseconds.',
          },
          {
            name: 'headers',
            type: 'Record<string, string> | undefined',
            description: 'Extra headers to attach to every request.',
          },
          {
            name: 'fetch',
            type: 'typeof fetch | undefined',
            description: 'Custom fetch implementation for runtimes that need one.',
          },
          {
            name: 'name',
            type: 'string | undefined',
            description: 'Optional logical client name. In the standalone backend package, a named client can also be registered into a `WachtClientStore`.',
          },
          {
            name: 'createClientStore',
            type: '() => WachtClientStore',
            description: 'Create an explicit client registry when you want to keep several named backend clients alive at once.',
          },
          {
            name: 'initClient',
            type: '(config: WachtConfig) => void',
            description: 'Initialize the global backend client used by the standalone helper modules in `@wacht/backend`.',
          },
          {
            name: 'getClient',
            type: '() => WachtClient',
            description: 'Read the global backend client. This throws until `initClient()` has run.',
          },
          {
            name: 'isClientInitialized',
            type: '() => boolean',
            description: 'Check whether the global backend client has already been initialized.',
          },
        ],
        sections: [
          {
            title: 'Framework adapters',
            paragraphs: [
              'In Next.js, React Router, and TanStack Router, the server package exposes `createWachtServerClient()` and `wachtClient()`. `createWachtServerClient()` always creates a fresh backend client. `wachtClient()` caches and reuses a default client when you call it without options.',
              'That makes `wachtClient()` the right default for most server code paths, while `createWachtServerClient()` is the better fit when you need an alternate API key, a different base URL, or request-specific headers.',
            ],
          },
          {
            title: 'Standalone backend usage',
            paragraphs: [
              'In the standalone backend package, you can instantiate `new WachtClient(...)` directly, or you can initialize a global client with `initClient()` and then use the exported resource modules through `getClient()` behind the scenes.',
              'That global style is useful in scripts and long-running JavaScript services where you want one process-wide client. If you need more than one backend client at the same time, use `createClientStore()` and register named clients instead of mutating the global singleton.',
            ],
          },
          {
            title: 'Runtime requirements',
            paragraphs: [
              'The backend client expects a JavaScript runtime with `fetch`, or a `fetch` implementation passed explicitly through config. That keeps the same client usable across Node.js, Bun, edge-style runtimes, and other server-side JavaScript environments.',
              '`wachtClient()` in the framework adapters resolves `WACHT_API_KEY` for you when you do not pass `apiKey`, and it throws early if no API key can be found. The cached path is only used when you call it without options.',
            ],
          },
        ],
        examples: [
          {
            title: 'Create a named client with explicit config',
            code: `import { createWachtServerClient } from '@wacht/nextjs/server';

export default async function Example() {
  const client = createWachtServerClient({
    apiKey: process.env.WACHT_API_KEY,
    timeout: 10_000,
    name: 'admin-console',
  });

  const users = await client.users.listUsers({ limit: 5 });
  return <pre>{JSON.stringify(users.data, null, 2)}</pre>;
}`,
            lang: 'tsx',
          },
          {
            title: 'Initialize the standalone backend package once',
            code: `import { initClient, users } from '@wacht/backend';

initClient({
  apiKey: process.env.WACHT_API_KEY!,
});

export async function listRecentUsers() {
  return users.listUsers({ limit: 10 });
}`,
            lang: 'ts',
          },
          {
            title: 'Keep multiple named backend clients',
            code: `import { WachtClient, createClientStore } from '@wacht/backend';

const store = createClientStore();

const primary = new WachtClient({
  apiKey: process.env.WACHT_PRIMARY_API_KEY!,
  name: 'primary',
  store,
});

const staging = new WachtClient({
  apiKey: process.env.WACHT_STAGING_API_KEY!,
  baseUrl: 'https://staging-api.wacht.io',
  name: 'staging',
  store,
});

export async function compareHealth() {
  const primaryHealth = await primary.health.healthCheck();
  const stagingHealth = await store.get('staging').health.healthCheck();

  return { primaryHealth, stagingHealth };
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'client-access',
        path: ['foundation', 'client-access'],
        title: 'Client access',
        description: 'Access the backend client across framework adapters and standalone JavaScript runtimes.',
        intro:
          'The backend SDK exposes a small set of client-access helpers. Which one you use depends on whether you are in a framework adapter or in standalone JavaScript code, and whether you want a cached client, a fresh client, or a global singleton.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listUsers() {
  const client = await wachtClient();
  return client.users.listUsers({ limit: 10 });
}`,
        sections: [
          {
            title: 'Framework adapters',
            paragraphs: [
              'In Next.js, React Router, and TanStack Router, the main helpers are `wachtClient()` and `createWachtServerClient()`.',
              '`wachtClient()` is the default entrypoint. It returns a cached backend client when you call it without options. `createWachtServerClient()` always creates a fresh backend client and is the better fit when you need explicit config for one code path.',
            ],
          },
          {
            title: 'Standalone JavaScript usage',
            paragraphs: [
              'In `@wacht/backend`, you can create a client directly with `new WachtClient(...)`, or you can initialize a global singleton with `initClient()` and read it later with `getClient()`.',
              'The global pattern is useful in scripts, CLIs, jobs, and long-running services where one process-wide backend client is enough.',
            ],
          },
          {
            title: 'How to choose',
            paragraphs: [
              'Use `wachtClient()` for ordinary framework-backed server calls. Use `createWachtServerClient()` when you need custom API keys, headers, base URLs, or a custom `fetch` implementation.',
              'Use `initClient()` and `getClient()` only in standalone JavaScript code where the global-client pattern is actually helpful. If you need several clients in the same process, create `WachtClient` instances directly or use `createClientStore()` instead of relying on the singleton.',
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
          {
            title: 'Standalone backend package: initialize once and reuse',
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
      },
];
