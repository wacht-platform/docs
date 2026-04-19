import type { GeneratedBackendCoverageDoc } from '@/components/shared-backend-coverage';

export type BackendCoverageGroup = {
  label: string;
  pathGroup: string;
};

export const backendCoverageGroupOrder: string[] = [
  'Foundation',
  'Users',
  'Invitations',
  'Sessions',
  'Organizations',
  'Workspaces',
  'API auth apps',
  'API auth keys',
  'API auth audit',
  'API auth rate limits',
  'Webhooks apps',
  'Webhook endpoints',
  'Webhook deliveries',
  'Webhook catalogs',
  'Webhook analytics',
  'AI configuration',
  'AI runtime',
  'OAuth apps',
  'OAuth clients',
  'OAuth scopes',
  'OAuth grants',
  'Settings',
  'Segments',
  'Utility',
];

const defaultCoverageGroup: BackendCoverageGroup = {
  label: 'Utility',
  pathGroup: 'operations',
};

export function classifyBackendCoverageDoc(entry: GeneratedBackendCoverageDoc): BackendCoverageGroup {
  const endpointPath = entry.endpoint.path;

  if (endpointPath.startsWith('/users/')) {
    return { label: 'Users', pathGroup: 'users' };
  }
  if (endpointPath.startsWith('/invitations') || endpointPath.startsWith('/waitlist')) {
    return { label: 'Invitations', pathGroup: 'invitations' };
  }
  if (endpointPath.startsWith('/session/tickets')) {
    return { label: 'Sessions', pathGroup: 'sessions' };
  }

  if (endpointPath.startsWith('/organizations/')) {
    return { label: 'Organizations', pathGroup: 'organizations' };
  }
  if (endpointPath.startsWith('/workspaces/')) {
    return { label: 'Workspaces', pathGroup: 'workspaces' };
  }

  if (endpointPath.startsWith('/api-auth/rate-limit-schemes')) {
    return { label: 'API auth rate limits', pathGroup: 'api-auth-rate-limits' };
  }
  if (endpointPath.startsWith('/api-auth/apps/') && endpointPath.includes('/audit/')) {
    return { label: 'API auth audit', pathGroup: 'api-auth-audit' };
  }
  if (endpointPath.startsWith('/api-auth/apps/') && endpointPath.includes('/keys')) {
    return { label: 'API auth keys', pathGroup: 'api-auth-keys' };
  }
  if (endpointPath.startsWith('/api-auth/apps')) {
    return { label: 'API auth apps', pathGroup: 'api-auth-apps' };
  }

  if (endpointPath.startsWith('/webhooks/event-catalogs')) {
    return { label: 'Webhook catalogs', pathGroup: 'webhook-catalogs' };
  }
  if (endpointPath.includes('/deliveries')) {
    return { label: 'Webhook deliveries', pathGroup: 'webhook-deliveries' };
  }
  if (endpointPath.includes('/endpoints') || endpointPath.startsWith('/webhooks/endpoints/')) {
    return { label: 'Webhook endpoints', pathGroup: 'webhook-endpoints' };
  }
  if (
    endpointPath.endsWith('/stats') ||
    endpointPath.endsWith('/analytics') ||
    endpointPath.endsWith('/timeseries')
  ) {
    return { label: 'Webhook analytics', pathGroup: 'webhook-analytics' };
  }
  if (endpointPath.startsWith('/webhooks/apps')) {
    return { label: 'Webhooks apps', pathGroup: 'webhooks-apps' };
  }

  if (endpointPath.startsWith('/ai/actor-projects') || endpointPath.startsWith('/ai/actor-project-threads')) {
    return { label: 'AI runtime', pathGroup: 'ai-runtime' };
  }
  if (endpointPath.startsWith('/ai/actor-mcp-servers')) {
    return { label: 'AI runtime', pathGroup: 'ai-runtime' };
  }
  if (endpointPath.startsWith('/ai/')) {
    return { label: 'AI configuration', pathGroup: 'ai-configuration' };
  }

  if (endpointPath.includes('/clients/') && endpointPath.includes('/grants')) {
    return { label: 'OAuth grants', pathGroup: 'oauth-grants' };
  }
  if (endpointPath.includes('/clients')) {
    return { label: 'OAuth clients', pathGroup: 'oauth-clients' };
  }
  if (endpointPath.includes('/scopes/')) {
    return { label: 'OAuth scopes', pathGroup: 'oauth-scopes' };
  }
  if (endpointPath.startsWith('/oauth/apps')) {
    return { label: 'OAuth apps', pathGroup: 'oauth-apps' };
  }

  if (endpointPath.startsWith('/segments')) {
    return { label: 'Segments', pathGroup: 'segments' };
  }
  if (endpointPath.startsWith('/settings/') || endpointPath === '/settings') {
    return { label: 'Settings', pathGroup: 'settings' };
  }
  if (endpointPath === '/' || endpointPath.startsWith('/jwt-templates')) {
    return { label: 'Settings', pathGroup: 'settings' };
  }

  return defaultCoverageGroup;
}

