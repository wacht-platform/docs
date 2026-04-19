import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const oauthBackendDocs: BackendDoc[] = [
{
        slug: 'list-oauth-apps',
        path: ['oauth', 'list-oauth-apps'],
        title: 'listOAuthApps()',
        description: 'List OAuth apps for the current deployment.',
        intro:
          'Returns OAuth apps from the deployment-scoped OAuth app list endpoint.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listOAuthApps() {
  const client = await wachtClient();
  return client.oauth.listOAuthApps();
}`,
        signature: `function listOAuthApps(): Promise<OAuthApp[]>`,
        api: [
          { name: 'slug', type: 'string', description: 'OAuth app slug.' },
          { name: 'name', type: 'string', description: 'OAuth app display name.' },
          { name: 'description', type: 'string | undefined', description: 'OAuth app description when set.' },
          { name: 'fqdn', type: 'string | undefined', description: 'OAuth issuer/domain hostname.' },
          { name: 'supported_scopes', type: 'string[] | undefined', description: 'Supported OAuth scopes.' },
          { name: 'allow_dynamic_client_registration', type: 'boolean | undefined', description: 'Whether dynamic client registration is enabled.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Returns OAuth applications configured in the current deployment.',
              'The response includes inactive entries when the backend includes them in the list result.',
            ],
          },
          {
            title: 'When to use',
            points: [
              'Use this before listing clients or grants when you only know deployment context.',
              'Use the returned app slug as input to client- and grant-scoped methods.',
            ],
          },
        ],
      },
{
        slug: 'create-oauth-app',
        path: ['oauth', 'create-oauth-app'],
        title: 'createOAuthApp()',
        description: 'Create an OAuth app.',
        intro:
          'Creates an OAuth app using multipart form fields and returns the created app object.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createOAuthApp() {
  const client = await wachtClient();
  return client.oauth.createOAuthApp({
    slug: 'my-oauth-app',
    name: 'My OAuth App',
    fqdn: 'auth.example.com',
  });
}`,
        signature: `function createOAuthApp(
  request: CreateOAuthAppRequest,
): Promise<OAuthApp>`,
        paramsTitle: 'CreateOAuthAppRequest',
        params: [
          { name: 'slug', type: 'string', description: 'Unique OAuth app slug.' },
          { name: 'name', type: 'string', description: 'OAuth app display name.' },
          { name: 'description', type: 'string | undefined', description: 'Optional OAuth app description.' },
          { name: 'fqdn', type: 'string | undefined', description: 'OAuth issuer/domain hostname.' },
          { name: 'supported_scopes', type: 'string[] | undefined', description: 'Supported scope names for this app.' },
          { name: 'allow_dynamic_client_registration', type: 'boolean | undefined', description: 'Allow RFC-style dynamic OAuth client registration.' },
        ],
        api: [
          { name: 'slug', type: 'string', description: 'Created OAuth app slug.' },
          { name: 'name', type: 'string', description: 'Created OAuth app display name.' },
          { name: 'description', type: 'string | undefined', description: 'Created OAuth app description.' },
          { name: 'fqdn', type: 'string | undefined', description: 'Created OAuth issuer/domain hostname.' },
          { name: 'supported_scopes', type: 'string[] | undefined', description: 'Configured supported scope names.' },
          { name: 'allow_dynamic_client_registration', type: 'boolean | undefined', description: 'Whether dynamic registration is enabled.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Creates a deployment-scoped OAuth app with the provided identifiers and metadata.',
              'The returned app object is the source of truth for subsequent client and grant operations.',
            ],
          },
          {
            title: 'Validation expectations',
            points: [
              'Use a globally unique slug inside the deployment.',
              'Provide scope names that match your intended consent and permission mapping model.',
            ],
          },
        ],
      },
{
        slug: 'list-oauth-clients',
        path: ['oauth', 'list-oauth-clients'],
        title: 'listOAuthClients()',
        description: 'List OAuth clients for one OAuth app.',
        intro:
          'Returns clients under the given OAuth app slug.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listOAuthClients(oauthAppSlug: string) {
  const client = await wachtClient();
  return client.oauth.listOAuthClients(oauthAppSlug);
}`,
        signature: `function listOAuthClients(
  oauthAppSlug: string,
): Promise<OAuthClient[]>`,
        params: [{ name: 'oauthAppSlug', type: 'string', description: 'OAuth app slug.' }],
        api: [
          { name: 'id', type: 'string', description: 'OAuth client id.' },
          { name: 'client_auth_method', type: 'string | undefined', description: 'Client authentication method.' },
          { name: 'grant_types', type: 'string[] | undefined', description: 'Allowed OAuth grant types.' },
          { name: 'redirect_uris', type: 'string[] | undefined', description: 'Allowed redirect URIs.' },
          { name: 'scope', type: 'string | undefined', description: 'Default scope string when configured.' },
          { name: 'client_name', type: 'string | undefined', description: 'Client display name.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Lists OAuth clients under one OAuth app.',
              'Use the returned client ids when querying grants or revoking grants.',
            ],
          },
          {
            title: 'Scope boundaries',
            points: [
              'The `oauthAppSlug` path segment controls tenancy for this method.',
              'Only clients belonging to that app slug are returned.',
            ],
          },
        ],
      },
{
        slug: 'create-oauth-client',
        path: ['oauth', 'create-oauth-client'],
        title: 'createOAuthClient()',
        description: 'Create an OAuth client under one OAuth app.',
        intro:
          'Creates an OAuth client configuration for the specified app slug.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createOAuthClient(oauthAppSlug: string) {
  const client = await wachtClient();
  return client.oauth.createOAuthClient(oauthAppSlug, {
    client_auth_method: 'client_secret_basic',
    grant_types: ['authorization_code'],
    redirect_uris: ['https://example.com/callback'],
  });
}`,
        signature: `function createOAuthClient(
  oauthAppSlug: string,
  request: CreateOAuthClientRequest,
): Promise<OAuthClient>`,
        paramsTitle: 'CreateOAuthClientRequest',
        params: [
          { name: 'oauthAppSlug', type: 'string', description: 'Parent OAuth app slug.' },
          { name: 'client_auth_method', type: 'string', description: 'Client authentication method.' },
          { name: 'grant_types', type: 'string[]', description: 'Allowed OAuth grant types.' },
          { name: 'redirect_uris', type: 'string[]', description: 'Allowed redirect URIs.' },
          { name: 'scope', type: 'string | undefined', description: 'Optional default scope string.' },
          { name: 'client_name', type: 'string | undefined', description: 'Optional client display name.' },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Created OAuth client id.' },
          { name: 'client_auth_method', type: 'string | undefined', description: 'Configured auth method.' },
          { name: 'grant_types', type: 'string[] | undefined', description: 'Configured grant types.' },
          { name: 'redirect_uris', type: 'string[] | undefined', description: 'Configured redirect URIs.' },
          { name: 'scope', type: 'string | undefined', description: 'Configured default scope string.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Creates a client configuration bound to the specified OAuth app.',
              'The client id in the response is required for grant inspection and revocation calls.',
            ],
          },
          {
            title: 'Security notes',
            points: [
              'Make sure redirect URIs are exact and environment-specific.',
              'Choose grant types and auth method intentionally to match your deployment policy.',
            ],
          },
        ],
      },
{
        slug: 'list-oauth-grants',
        path: ['oauth', 'list-oauth-grants'],
        title: 'listOAuthGrants()',
        description: 'List OAuth grants for one OAuth client.',
        intro:
          'Returns grants for a specific OAuth client under one OAuth app.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listOAuthGrants(oauthAppSlug: string, oauthClientId: string) {
  const client = await wachtClient();
  return client.oauth.listOAuthGrants(oauthAppSlug, oauthClientId);
}`,
        signature: `function listOAuthGrants(
  oauthAppSlug: string,
  oauthClientId: string,
): Promise<OAuthGrant[]>`,
        params: [
          { name: 'oauthAppSlug', type: 'string', description: 'Parent OAuth app slug.' },
          { name: 'oauthClientId', type: 'string', description: 'OAuth client id to list grants for.' },
        ],
        api: [
          { name: 'id', type: 'string', description: 'OAuth grant id.' },
          { name: 'client_id', type: 'string | undefined', description: 'OAuth client id tied to this grant.' },
          { name: 'subject', type: 'string | undefined', description: 'Subject/user identifier for this grant.' },
          { name: 'scope', type: 'string | undefined', description: 'Granted scope string.' },
          { name: 'created_at', type: 'string | undefined', description: 'Grant creation timestamp.' },
          { name: 'revoked_at', type: 'string | undefined', description: 'Grant revocation timestamp when revoked.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Returns grants issued for one client within one OAuth app.',
              'Each grant entry identifies subject and scope so you can audit active access.',
            ],
          },
          {
            title: 'Operational usage',
            points: [
              'Use this method before revocation flows to identify exact grant ids.',
              'Treat `revoked_at` as authoritative when determining active versus revoked grants.',
            ],
          },
        ],
      },
{
        slug: 'revoke-oauth-grant',
        path: ['oauth', 'revoke-oauth-grant'],
        title: 'revokeOAuthGrant()',
        description: 'Revoke one OAuth grant.',
        intro:
          'Revokes an OAuth grant for a specific client.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function revokeOAuthGrant(
  oauthAppSlug: string,
  oauthClientId: string,
  grantId: string,
) {
  const client = await wachtClient();
  await client.oauth.revokeOAuthGrant(oauthAppSlug, oauthClientId, grantId);
}`,
        signature: `function revokeOAuthGrant(
  oauthAppSlug: string,
  oauthClientId: string,
  grantId: string,
): Promise<void>`,
        params: [
          { name: 'oauthAppSlug', type: 'string', description: 'Parent OAuth app slug.' },
          { name: 'oauthClientId', type: 'string', description: 'OAuth client id that owns the grant.' },
          { name: 'grantId', type: 'string', description: 'OAuth grant id to revoke.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Revokes the specified grant under the provided app and client scope.',
              'This method returns no payload on success.',
            ],
          },
          {
            title: 'Operational usage',
            points: [
              'Use after `listOAuthGrants()` when you need to remove a single subject grant.',
              'Use idempotent caller logic when handling repeated revoke attempts.',
            ],
          },
        ],
      },
];
