import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const apiKeysBackendDocs: BackendDoc[] = [
{
        slug: 'list-api-auth-apps',
        path: ['api-keys', 'list-api-auth-apps'],
        title: 'listApiAuthApps()',
        description: 'List API auth apps in the current deployment.',
        intro:
          'Returns API auth apps configured for the deployment. The SDK unwraps the backend list envelope and returns only the app array.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listApiApps() {
  const client = await wachtClient();
  return client.apiKeys.listApiAuthApps({ include_inactive: true });
}`,
        signature: `function listApiAuthApps(
  options?: {
    include_inactive?: boolean;
  },
): Promise<ApiAuthApp[]>`,
        params: [
          {
            name: 'include_inactive',
            type: 'boolean | undefined',
            description: 'When `true`, includes inactive apps in the result.',
          },
        ],
        api: [
          {
            name: 'deployment_id',
            type: 'string',
            description: 'Deployment that owns the app.',
          },
          {
            name: 'app_slug',
            type: 'string',
            description: 'Stable app slug used in app-scoped API auth routes.',
          },
          {
            name: 'name',
            type: 'string',
            description: 'Display name.',
          },
          {
            name: 'key_prefix',
            type: 'string',
            description: 'Key prefix for keys issued under the app.',
          },
          {
            name: 'is_active',
            type: 'boolean',
            description: 'Whether the app is active.',
          },
          {
            name: 'permissions',
            type: 'string[]',
            description: 'App permissions used by API auth authorization.',
          },
          {
            name: 'resources',
            type: 'string[]',
            description: 'Resource patterns attached to the app.',
          },
          {
            name: 'rate_limits',
            type: 'RateLimit[]',
            description: 'Effective app rate-limit rules.',
            children: [
              { name: 'unit', type: `'second' | 'minute' | 'hour' | 'day'`, description: 'Rate-limit window unit.' },
              { name: 'duration', type: 'number', description: 'Window duration count in `unit`.' },
              { name: 'max_requests', type: 'number', description: 'Maximum allowed requests per window.' },
            ],
          },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Lists API auth apps in the deployment.',
              '`include_inactive` expands results to include inactive apps.',
            ],
          },
          {
            title: 'Operational usage',
            points: [
              'Use app slugs from this response for key management and audit methods.',
              'Call this first when building app-level admin pages.',
            ],
          },
        ],
        examples: [
          {
            title: 'List active apps',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listActiveApiApps() {
  const client = await wachtClient();
  return client.apiKeys.listApiAuthApps();
}`,
            lang: 'ts',
          },
          {
            title: 'List active and inactive apps',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listAllApiApps() {
  const client = await wachtClient();
  return client.apiKeys.listApiAuthApps({ include_inactive: true });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'create-api-auth-app',
        path: ['api-keys', 'create-api-auth-app'],
        title: 'createApiAuthApp()',
        description: 'Create a new API auth app.',
        intro:
          'Creates the API auth app container that owns API keys. This request also controls app scope and authorization metadata when you provide those fields.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createApiAuthApp() {
  const client = await wachtClient();

  return client.apiKeys.createApiAuthApp({
    app_slug: 'internal-api',
    name: 'Internal API',
    key_prefix: 'wacht_internal',
    description: 'API access for internal services',
    rate_limit_scheme_slug: 'internal-defaults',
    permissions: ['users:read', 'users:write'],
    resources: ['users/*'],
  });
}`,
        signature: `function createApiAuthApp(
  request: CreateApiAuthAppRequest,
): Promise<ApiAuthApp>`,
        paramsTitle: 'CreateApiAuthAppRequest',
        params: [
          {
            name: 'app_slug',
            type: 'string',
            description: 'Stable slug used in app-scoped API auth routes.',
          },
          {
            name: 'name',
            type: 'string',
            description: 'Display name for the API auth app.',
          },
          {
            name: 'key_prefix',
            type: 'string',
            description: 'Prefix applied to keys issued under this app.',
          },
          {
            name: 'description',
            type: 'string | undefined',
            description: 'Optional description for admins.',
          },
          {
            name: 'user_id',
            type: 'string | number | undefined',
            description: 'Optional owner user id. When set, the backend rejects `permissions` and `resources` in the same request.',
          },
          {
            name: 'organization_id',
            type: 'string | number | undefined',
            description: 'Optional organization scope id.',
          },
          {
            name: 'workspace_id',
            type: 'string | number | undefined',
            description: 'Optional workspace scope id.',
          },
          {
            name: 'rate_limit_scheme_slug',
            type: 'string | undefined',
            description: 'Optional preconfigured rate-limit scheme slug.',
          },
          {
            name: 'permissions',
            type: 'string[] | undefined',
            description: 'Optional permissions list for app-level authorization.',
          },
          {
            name: 'resources',
            type: 'string[] | undefined',
            description: 'Optional resource patterns for app-level authorization.',
          },
        ],
        api: [
          {
            name: 'deployment_id',
            type: 'string',
            description: 'Deployment that owns the app.',
          },
          {
            name: 'app_slug',
            type: 'string',
            description: 'Stable app slug.',
          },
          {
            name: 'name',
            type: 'string',
            description: 'Display name.',
          },
          {
            name: 'key_prefix',
            type: 'string',
            description: 'Key prefix for app keys.',
          },
          {
            name: 'is_active',
            type: 'boolean',
            description: 'Whether the app is active.',
          },
          {
            name: 'permissions',
            type: 'string[]',
            description: 'Effective permissions stored on the app.',
          },
          {
            name: 'resources',
            type: 'string[]',
            description: 'Effective resources stored on the app.',
          },
          {
            name: 'rate_limits',
            type: 'RateLimit[]',
            description: 'Effective rate-limit rules on the app.',
            children: [
              { name: 'unit', type: `'second' | 'minute' | 'hour' | 'day'`, description: 'Rate-limit window unit.' },
              { name: 'duration', type: 'number', description: 'Window duration count in `unit`.' },
              { name: 'max_requests', type: 'number', description: 'Maximum allowed requests per window.' },
            ],
          },
          {
            name: 'rate_limit_scheme_slug',
            type: 'string | undefined',
            description: 'Attached scheme slug when one is configured.',
          },
        ],
        sections: [
          {
            title: 'Backend behavior',
            paragraphs: [
              'API auth app creation is restricted to Growth plan deployments.',
              'If `user_id` is provided, the backend rejects requests that also include `permissions` or `resources`.',
            ],
          },
        ],
        examples: [
          {
            title: 'Create an app with explicit permissions and resources',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createServiceApp() {
  const client = await wachtClient();

  return client.apiKeys.createApiAuthApp({
    app_slug: 'billing-sync',
    name: 'Billing Sync',
    key_prefix: 'wacht_billing',
    permissions: ['invoices:read', 'invoices:write'],
    resources: ['invoices/*'],
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Create a user-attached app',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createUserOwnedApp(userId: string) {
  const client = await wachtClient();

  return client.apiKeys.createApiAuthApp({
    app_slug: 'user-export',
    name: 'User Export',
    key_prefix: 'wacht_export',
    user_id: userId,
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'list-rate-limit-schemes',
        path: ['api-keys', 'list-rate-limit-schemes'],
        title: 'listRateLimitSchemes()',
        description: 'List API auth rate limit schemes in the current deployment.',
        intro:
          'Returns all configured API auth rate limit schemes from the deployment-scoped route used by the console compatibility layer.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listRateLimitSchemes() {
  const client = await wachtClient();
  return client.apiKeys.listRateLimitSchemes();
}`,
        signature: `function listRateLimitSchemes(): Promise<RateLimitScheme[]>`,
        api: [
          { name: 'slug', type: 'string', description: 'Unique rate-limit scheme slug.' },
          { name: 'name', type: 'string', description: 'Rate-limit scheme display name.' },
          { name: 'description', type: 'string | undefined', description: 'Optional scheme description.' },
          {
            name: 'rules',
            type: 'RateLimit[]',
            description: 'Rate-limit rules in this scheme.',
            children: [
              { name: 'unit', type: `'second' | 'minute' | 'hour' | 'day'`, description: 'Rate-limit window unit.' },
              { name: 'duration', type: 'number', description: 'Window duration count in `unit`.' },
              { name: 'max_requests', type: 'number', description: 'Maximum allowed requests per window.' },
            ],
          },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Returns all reusable API auth rate-limit schemes configured in the deployment.',
              'Use these slugs when creating or updating API auth apps.',
            ],
          },
        ],
      },
{
        slug: 'get-rate-limit-scheme',
        path: ['api-keys', 'get-rate-limit-scheme'],
        title: 'getRateLimitScheme()',
        description: 'Get one API auth rate limit scheme by slug.',
        intro:
          'Returns the full rate limit scheme object, including all rule definitions.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getRateLimitScheme(slug: string) {
  const client = await wachtClient();
  return client.apiKeys.getRateLimitScheme(slug);
}`,
        signature: `function getRateLimitScheme(
  slug: string,
): Promise<RateLimitScheme>`,
        params: [{ name: 'slug', type: 'string', description: 'Target rate-limit scheme slug.' }],
        api: [
          { name: 'slug', type: 'string', description: 'Unique rate-limit scheme slug.' },
          { name: 'name', type: 'string', description: 'Rate-limit scheme display name.' },
          { name: 'description', type: 'string | undefined', description: 'Optional scheme description.' },
          {
            name: 'rules',
            type: 'RateLimit[]',
            description: 'Rate-limit rules in this scheme.',
            children: [
              { name: 'unit', type: `'second' | 'minute' | 'hour' | 'day'`, description: 'Rate-limit window unit.' },
              { name: 'duration', type: 'number', description: 'Window duration count in `unit`.' },
              { name: 'max_requests', type: 'number', description: 'Maximum allowed requests per window.' },
            ],
          },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Loads one scheme by slug with all rule details.',
              'Use this for read-before-update flows in admin tooling.',
            ],
          },
        ],
      },
{
        slug: 'create-rate-limit-scheme',
        path: ['api-keys', 'create-rate-limit-scheme'],
        title: 'createRateLimitScheme()',
        description: 'Create an API auth rate limit scheme.',
        intro:
          'Creates a reusable rate limit scheme that can be attached to API auth apps.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createRateLimitScheme() {
  const client = await wachtClient();

  return client.apiKeys.createRateLimitScheme({
    slug: 'default-api-limits',
    name: 'Default API Limits',
    rules: [{ unit: 'minute', duration: 1, max_requests: 120 }],
  });
}`,
        signature: `function createRateLimitScheme(
  request: CreateRateLimitSchemeRequest,
): Promise<RateLimitScheme>`,
        paramsTitle: 'CreateRateLimitSchemeRequest',
        params: [
          { name: 'slug', type: 'string', description: 'Unique scheme slug.' },
          { name: 'name', type: 'string', description: 'Scheme display name.' },
          { name: 'description', type: 'string | undefined', description: 'Optional scheme description.' },
          {
            name: 'rules',
            type: 'RateLimit[]',
            description: 'Rate-limit rules for this scheme.',
            children: [
              { name: 'unit', type: `'second' | 'minute' | 'hour' | 'day'`, description: 'Rate-limit window unit.' },
              { name: 'duration', type: 'number', description: 'Window duration count in `unit`.' },
              { name: 'max_requests', type: 'number', description: 'Maximum allowed requests per window.' },
            ],
          },
        ],
        api: [
          { name: 'slug', type: 'string', description: 'Created rate-limit scheme slug.' },
          { name: 'name', type: 'string', description: 'Created scheme display name.' },
          { name: 'description', type: 'string | undefined', description: 'Created scheme description.' },
          { name: 'rules', type: 'RateLimit[]', description: 'Persisted scheme rules.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Creates a new resource and returns the created object from the backend.',
          'Validate required fields before calling to avoid predictable request failures.',
        ],
      },
    ],
  },
{
        slug: 'update-rate-limit-scheme',
        path: ['api-keys', 'update-rate-limit-scheme'],
        title: 'updateRateLimitScheme()',
        description: 'Update an API auth rate limit scheme by slug.',
        intro:
          'Updates the name, description, or rules for an existing scheme.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateRateLimitScheme(slug: string) {
  const client = await wachtClient();

  return client.apiKeys.updateRateLimitScheme(slug, {
    name: 'Updated API Limits',
    rules: [{ unit: 'minute', duration: 1, max_requests: 200 }],
  });
}`,
        signature: `function updateRateLimitScheme(
  slug: string,
  request: UpdateRateLimitSchemeRequest,
): Promise<RateLimitScheme>`,
        paramsTitle: 'UpdateRateLimitSchemeRequest',
        params: [
          { name: 'slug', type: 'string', description: 'Target scheme slug.' },
          { name: 'name', type: 'string | undefined', description: 'Updated scheme display name.' },
          { name: 'description', type: 'string | undefined', description: 'Updated scheme description.' },
          {
            name: 'rules',
            type: 'RateLimit[] | undefined',
            description: 'Updated scheme rules.',
            children: [
              { name: 'unit', type: `'second' | 'minute' | 'hour' | 'day'`, description: 'Rate-limit window unit.' },
              { name: 'duration', type: 'number', description: 'Window duration count in `unit`.' },
              { name: 'max_requests', type: 'number', description: 'Maximum allowed requests per window.' },
            ],
          },
        ],
        api: [
          { name: 'slug', type: 'string', description: 'Updated scheme slug.' },
          { name: 'name', type: 'string', description: 'Updated scheme display name.' },
          { name: 'description', type: 'string | undefined', description: 'Updated scheme description.' },
          { name: 'rules', type: 'RateLimit[]', description: 'Updated scheme rules.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Applies a partial update and returns the server-side updated resource.',
          'Treat omitted optional fields as unchanged unless explicitly documented otherwise.',
        ],
      },
    ],
  },
{
        slug: 'delete-rate-limit-scheme',
        path: ['api-keys', 'delete-rate-limit-scheme'],
        title: 'deleteRateLimitScheme()',
        description: 'Delete an API auth rate limit scheme by slug.',
        intro:
          'Removes the scheme from the current deployment.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function deleteRateLimitScheme(slug: string) {
  const client = await wachtClient();
  await client.apiKeys.deleteRateLimitScheme(slug);
}`,
        signature: `function deleteRateLimitScheme(
  slug: string,
): Promise<void>`,
    sections: [
      {
        title: 'Behavior',
        points: [
          'Performs a destructive operation against the target resource.',
          'Callers should treat this as irreversible unless a separate restore flow exists.',
        ],
      },
    ],
  },
{
        slug: 'list-api-keys',
        path: ['api-keys', 'list-api-keys'],
        title: 'listApiKeys()',
        description: 'List the keys already issued for one API auth app.',
        intro:
          'Lists persisted key metadata for one API auth app. Like app listing, the SDK unwraps the backend list envelope and returns only the key array.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listKeys(appName: string) {
  const client = await wachtClient();
  return client.apiKeys.listApiKeys(appName, { include_inactive: true });
}`,
        signature: `function listApiKeys(
  appName: string,
  options?: {
    include_inactive?: boolean;
  },
): Promise<ApiKey[]>`,
        params: [
          {
            name: 'appName',
            type: 'string',
            description: 'Slug of the app whose keys should be listed.',
          },
          {
            name: 'include_inactive',
            type: 'boolean | undefined',
            description: 'When `true`, includes revoked/inactive keys in the response.',
          },
        ],
        api: [
          {
            name: 'id',
            type: 'string',
            description: 'Stable key identifier.',
          },
          {
            name: 'app_slug',
            type: 'string',
            description: 'App slug this key belongs to.',
          },
          {
            name: 'name',
            type: 'string',
            description: 'Display name of the key.',
          },
          {
            name: 'key_prefix',
            type: 'string',
            description: 'Public key prefix.',
          },
          {
            name: 'key_suffix',
            type: 'string',
            description: 'Public key suffix.',
          },
          {
            name: 'permissions',
            type: 'string[]',
            description: 'Permissions attached to the key.',
          },
          {
            name: 'is_active',
            type: 'boolean',
            description: 'Whether the key is active.',
          },
          {
            name: 'revoked_at',
            type: 'string | undefined',
            description: 'Revocation timestamp when the key has been revoked.',
          },
        ],
        
        examples: [
          {
            title: 'List active keys for one app',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listActiveKeys(appName: string) {
  const client = await wachtClient();
  return client.apiKeys.listApiKeys(appName);
}`,
            lang: 'ts',
          },
          {
            title: 'Include revoked keys for audit screens',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listAllKeys(appName: string) {
  const client = await wachtClient();
  return client.apiKeys.listApiKeys(appName, { include_inactive: true });
}`,
            lang: 'ts',
          },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Returns a backend-scoped list response for this resource.',
          'Use pagination and filters from this method to build admin list views.',
        ],
      },
    ],
  },
{
        slug: 'create-api-key',
        path: ['api-keys', 'create-api-key'],
        title: 'createApiKey()',
        description: 'Issue a new API key under an API auth app.',
        intro:
          'Creates a key for one API auth app and returns the one-time secret. The backend binds the created key to the app slug from the URL, not from the request body.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function issueApiKey() {
  const client = await wachtClient();

  return client.apiKeys.createApiKey('internal-api', {
    name: 'Primary production key',
    permissions: ['users:read', 'users:write'],
    metadata: { owner: 'backend-service' },
  });
}`,
        signature: `function createApiKey(
  appName: string,
  request: CreateApiKeyRequest,
): Promise<ApiKeyWithSecret>`,
        paramsTitle: 'CreateApiKeyRequest',
        params: [
          {
            name: 'appName',
            type: 'string',
            description: 'Slug of the API auth app that should own the key.',
          },
          {
            name: 'name',
            type: 'string',
            description: 'Human-readable key name used in audit and admin views.',
          },
          {
            name: 'permissions',
            type: 'string[] | undefined',
            description: 'Optional permission list attached to this key.',
          },
          {
            name: 'metadata',
            type: 'Record<string, unknown> | undefined',
            description: 'Optional metadata object stored with the key record.',
            children: [
              { name: 'owner', type: 'string | undefined', description: 'Owning service or team identifier.' },
              { name: 'environment', type: 'string | undefined', description: 'Environment tag (for example `production`).' },
            ],
          },
          {
            name: 'expires_at',
            type: 'string | undefined',
            description: 'Optional expiration timestamp (ISO-8601 string).',
          },
        ],
        api: [
          {
            name: 'key',
            type: 'ApiKey',
            description: 'Persisted API key record metadata.',
            children: [
              { name: 'id', type: 'string', description: 'Stable key id.' },
              { name: 'app_slug', type: 'string', description: 'Owning app slug.' },
              { name: 'name', type: 'string', description: 'Key display name.' },
              { name: 'key_prefix', type: 'string', description: 'Public key prefix.' },
              { name: 'key_suffix', type: 'string', description: 'Public key suffix.' },
              { name: 'permissions', type: 'string[]', description: 'Permissions attached to the key.' },
            ],
          },
          {
            name: 'secret',
            type: 'string',
            description: 'Newly issued secret value. This is only returned once.',
          },
        ],
        sections: [
          {
            title: 'What the backend enforces',
            paragraphs: [
              'The backend resolves the target app by `appName` and creates the key inside that app boundary.',
              'Only fields supported by `CreateApiKeyRequest` are accepted for this call. Membership scope fields are not part of this endpoint contract.',
            ],
          },
        ],
        examples: [
          {
            title: 'Issue an expiring key for one app',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function issueTemporaryKey() {
  const client = await wachtClient();

  return client.apiKeys.createApiKey('internal-api', {
    name: 'temporary-import-key',
    permissions: ['users:read'],
    expires_at: '2026-12-31T23:59:59Z',
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'rotate-api-key',
        path: ['api-keys', 'rotate-api-key'],
        title: 'rotateApiKey()',
        description: 'Rotate one API key inside one API auth app.',
        intro:
          'Rotates an existing key using the app-scoped route and returns a new one-time secret.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function rotateKey(appName: string, keyId: string) {
  const client = await wachtClient();
  return client.apiKeys.rotateApiKey(appName, keyId);
}`,
        signature: `function rotateApiKey(
  appName: string,
  keyId: string,
): Promise<ApiKeyWithSecret>`,
        params: [
          {
            name: 'appName',
            type: 'string',
            description: 'Slug of the app that owns the key.',
          },
          {
            name: 'keyId',
            type: 'string',
            description: 'Identifier of the key to rotate.',
          },
        ],
        api: [
          {
            name: 'key',
            type: 'ApiKey',
            description: 'Updated key record after rotation.',
            children: [
              { name: 'id', type: 'string', description: 'Stable key id.' },
              { name: 'app_slug', type: 'string', description: 'Owning app slug.' },
              { name: 'name', type: 'string', description: 'Key display name.' },
              { name: 'key_prefix', type: 'string', description: 'Public key prefix.' },
              { name: 'key_suffix', type: 'string', description: 'Public key suffix.' },
              { name: 'permissions', type: 'string[]', description: 'Permissions attached to the key.' },
            ],
          },
          {
            name: 'secret',
            type: 'string',
            description: 'New secret value returned once.',
          },
        ],
        
        examples: [
          {
            title: 'Rotate a compromised key',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function rotateCompromisedKey() {
  const client = await wachtClient();
  return client.apiKeys.rotateApiKey('internal-api', '12345');
}`,
            lang: 'ts',
          },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Wraps the corresponding backend endpoint for this capability.',
          'Use the returned payload as canonical backend state for follow-up operations.',
        ],
      },
    ],
  },
{
        slug: 'revoke-api-key',
        path: ['api-keys', 'revoke-api-key'],
        title: 'revokeApiKey()',
        description: 'Revoke one API key inside one API auth app.',
        intro:
          'Revokes an API key using the app-scoped backend route so that key can no longer authorize requests.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function revokeKey(appName: string, keyId: string) {
  const client = await wachtClient();

  await client.apiKeys.revokeApiKey(appName, keyId, {
    reason: 'Compromised credential',
  });
}`,
        signature: `function revokeApiKey(
  appName: string,
  keyId: string,
  options?: RevokeApiKeyOptions,
): Promise<void>`,
        paramsTitle: 'RevokeApiKeyOptions',
        params: [
          {
            name: 'appName',
            type: 'string',
            description: 'Slug of the app that owns the key.',
          },
          {
            name: 'keyId',
            type: 'string',
            description: 'Identifier of the key to revoke.',
          },
          {
            name: 'reason',
            type: 'string | undefined',
            description: 'Optional revocation reason stored with the revocation event.',
          },
        ],
        
        examples: [
          {
            title: 'Revoke a retired key',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function revokeRetiredKey() {
  const client = await wachtClient();
  await client.apiKeys.revokeApiKey('internal-api', '12345', {
    reason: 'Service decommissioned',
  });
}`,
            lang: 'ts',
          },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Performs a destructive operation against the target resource.',
          'Callers should treat this as irreversible unless a separate restore flow exists.',
        ],
      },
    ],
  },
];
