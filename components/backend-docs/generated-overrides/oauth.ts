import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const oauthGeneratedDocOverrides: Record<string, Partial<BackendDoc>> = {
  updateOAuthApp: {
    description: 'Update one OAuth app configuration.',
    intro: 'Patches OAuth app metadata via the backend OAuth app update route.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function renameOAuthApp(oauthAppSlug: string) {
  const client = await wachtClient();
  return client.oauth.updateOAuthApp(oauthAppSlug, {
    name: 'Updated OAuth App',
    description: 'Updated app description',
  });
}`,
    signature: `function updateOAuthApp(
  oauthAppSlug: string,
  request: UpdateOAuthAppRequest,
): Promise<OAuthApp>`,
    paramsTitle: 'UpdateOAuthAppRequest',
    params: [
      { name: 'oauthAppSlug', type: 'string', description: 'OAuth app slug.' },
      { name: 'name', type: 'string | undefined', description: 'Updated app name.' },
      { name: 'description', type: 'string | undefined', description: 'Updated app description.' },
      { name: 'fqdn', type: 'string | undefined', description: 'Updated OAuth issuer/host domain.' },
    ],
  },
  verifyOAuthAppDomain: {
    description: 'Trigger OAuth app domain verification.',
    intro: 'Calls the OAuth domain verification route and returns verification status/details.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function verifyDomain(oauthAppSlug: string) {
  const client = await wachtClient();
  return client.oauth.verifyOAuthAppDomain(oauthAppSlug);
}`,
    signature: `function verifyOAuthAppDomain(
  oauthAppSlug: string,
): Promise<OAuthDomainVerificationResponse>`,
    params: [{ name: 'oauthAppSlug', type: 'string', description: 'OAuth app slug.' }],
  },
  updateOAuthScope: {
    description: 'Update one OAuth scope definition.',
    intro: 'Patches a single scope under an OAuth app.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateScope(oauthAppSlug: string, scope: string) {
  const client = await wachtClient();
  return client.oauth.updateOAuthScope(oauthAppSlug, scope, {
    description: 'Allows reading profile metadata',
  });
}`,
    signature: `function updateOAuthScope(
  oauthAppSlug: string,
  scope: string,
  request: UpdateOAuthScopeRequest,
): Promise<OAuthApp>`,
    paramsTitle: 'UpdateOAuthScopeRequest',
    params: [
      { name: 'oauthAppSlug', type: 'string', description: 'OAuth app slug.' },
      { name: 'scope', type: 'string', description: 'Scope key to update.' },
      { name: 'description', type: 'string | undefined', description: 'Updated scope description.' },
    ],
  },
  archiveOAuthScope: {
    description: 'Archive one OAuth scope.',
    intro: 'Marks a scope archived so it is no longer active for new authorization flows.',
  },
  unarchiveOAuthScope: {
    description: 'Unarchive one OAuth scope.',
    intro: 'Re-activates a previously archived OAuth scope.',
  },
  setOAuthScopeMapping: {
    description: 'Set permission mapping for an OAuth scope.',
    intro: 'Configures backend permission mapping for one OAuth scope.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function setScopeMapping(oauthAppSlug: string, scope: string) {
  const client = await wachtClient();
  return client.oauth.setOAuthScopeMapping(oauthAppSlug, scope, {
    permission: 'users:read',
  });
}`,
    signature: `function setOAuthScopeMapping(
  oauthAppSlug: string,
  scope: string,
  request: SetOAuthScopeMappingRequest,
): Promise<OAuthApp>`,
    paramsTitle: 'SetOAuthScopeMappingRequest',
  },
  updateOAuthClient: {
    description: 'Update one OAuth client.',
    intro: 'Patches OAuth client settings for a given OAuth app.',
    signature: `function updateOAuthClient(
  oauthAppSlug: string,
  oauthClientId: string,
  request: UpdateOAuthClientRequest,
): Promise<OAuthClient>`,
    paramsTitle: 'UpdateOAuthClientRequest',
    params: [
      { name: 'oauthAppSlug', type: 'string', description: 'OAuth app slug.' },
      { name: 'oauthClientId', type: 'string', description: 'OAuth client id.' },
      { name: 'redirect_uris', type: 'string[] | undefined', description: 'Updated allowed redirect URIs.' },
      { name: 'grant_types', type: 'string[] | undefined', description: 'Updated grant type set.' },
    ],
  },
  deactivateOAuthClient: {
    description: 'Deactivate an OAuth client.',
    intro: 'Deletes/deactivates a client so it can no longer issue new authorization flows.',
    signature: `function deactivateOAuthClient(
  oauthAppSlug: string,
  oauthClientId: string,
): Promise<void>`,
  },
  rotateOAuthClientSecret: {
    description: 'Rotate OAuth client secret.',
    intro: 'Generates a new client secret for one OAuth client.',
    signature: `function rotateOAuthClientSecret(
  oauthAppSlug: string,
  oauthClientId: string,
): Promise<RotateOAuthClientSecretResponse>`,
    api: [
      { name: 'client_secret', type: 'string', description: 'Newly generated client secret.' },
      { name: 'client_id', type: 'string | undefined', description: 'OAuth client identifier.' },
    ],
  },
};
