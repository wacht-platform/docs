import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const operationsBackendDocs: BackendDoc[] = [
{
        slug: 'health-check',
        path: ['operations', 'health-check'],
        title: 'healthCheck()',
        description: 'Check backend health status.',
        intro:
          'Calls the backend health endpoint and returns a simple status object.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function health() {
  const client = await wachtClient();
  return client.health.healthCheck();
}`,
        signature: `function healthCheck(): Promise<{ status: string }>`,
        api: [
          { name: 'status', type: 'string', description: 'Backend health status string (for example `ok`).' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Useful for startup probes and operational readiness checks.',
          'Returns a lightweight status payload and does not require resource parameters.',
        ],
      },
    ],
  },
{
        slug: 'create-notification',
        path: ['operations', 'create-notification'],
        title: 'createNotification()',
        description: 'Create one or more notifications.',
        intro:
          'Creates notifications and returns the created notification rows.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function sendNotice(userId: string) {
  const client = await wachtClient();
  return client.notifications.createNotification({
    user_id: userId,
    title: 'Action required',
    body: 'Please review your recent activity.',
  });
}`,
        signature: `function createNotification(
  request: CreateNotificationRequest,
): Promise<Notification[]>`,
        paramsTitle: 'CreateNotificationRequest',
        params: [
          { name: 'user_id', type: 'string', description: 'Target user id for notification delivery.' },
          { name: 'title', type: 'string', description: 'Notification title text.' },
          { name: 'body', type: 'string', description: 'Notification body text.' },
          { name: 'type', type: 'string | undefined', description: 'Optional notification type key.' },
          { name: 'action_url', type: 'string | undefined', description: 'Optional CTA/deep-link URL.' },
          {
            name: 'metadata',
            type: 'Record<string, unknown> | undefined',
            description: 'Optional metadata attached to the notification.',
            children: [
              { name: 'source', type: 'string | undefined', description: 'Source system that generated the notification.' },
              { name: 'context_id', type: 'string | undefined', description: 'Related entity id for downstream handling.' },
            ],
          },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Created notification id.' },
          { name: 'user_id', type: 'string', description: 'Target user id.' },
          { name: 'title', type: 'string', description: 'Persisted notification title.' },
          { name: 'body', type: 'string', description: 'Persisted notification body.' },
          { name: 'read', type: 'boolean | undefined', description: 'Read state when returned.' },
          { name: 'created_at', type: 'string | undefined', description: 'Creation timestamp.' },
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
        slug: 'get-analytics-summary',
        path: ['operations', 'get-analytics-summary'],
        title: 'getAnalyticsSummary()',
        description: 'Load deployment analytics for a time range.',
        intro:
          'Returns analytics metrics for a required `from`/`to` window.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getSummary() {
  const client = await wachtClient();
  return client.analytics.getAnalyticsSummary({
    from: '2026-04-01T00:00:00Z',
    to: '2026-04-18T23:59:59Z',
  });
}`,
        signature: `function getAnalyticsSummary(
  options: { from: string; to: string },
): Promise<AnalyticsStats>`,
        paramsTitle: 'AnalyticsSummaryOptions',
        params: [
          { name: 'from', type: 'string', description: 'Window start timestamp (ISO-8601).' },
          { name: 'to', type: 'string', description: 'Window end timestamp (ISO-8601).' },
        ],
        api: [
          { name: 'total_users', type: 'number | undefined', description: 'Total users in the selected window.' },
          { name: 'new_users', type: 'number | undefined', description: 'New users in the selected window.' },
          { name: 'active_users', type: 'number | undefined', description: 'Active users in the selected window.' },
          { name: 'sign_in_count', type: 'number | undefined', description: 'Sign-in count in the selected window.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Fetches a single resource by identifier or query context.',
          'Use this result as the source of truth before update, replay, or delete flows.',
        ],
      },
    ],
  },
{
        slug: 'create-session-ticket',
        path: ['operations', 'create-session-ticket'],
        title: 'createSessionTicket()',
        description: 'Create a backend session ticket.',
        intro:
          'Creates a short-lived session ticket for impersonation or scoped backend access flows.',
        usage: `import { createSessionTicket, initClient } from '@wacht/backend';

export async function createAgentAccessTicket(actorId: string, agentIds: string[]) {
  initClient({ apiKey: process.env.WACHT_API_KEY! });

  return createSessionTicket({
    ticket_type: 'agent_access',
    actor_id: actorId,
    agent_ids: agentIds,
  });
}`,
        signature: `function createSessionTicket(
  request: CreateSessionTicketRequest,
): Promise<SessionTicketResponse>`,
        paramsTitle: 'CreateSessionTicketRequest',
        params: [
          { name: 'ticket_type', type: `'impersonation' | 'agent_access' | 'webhook_app_access' | 'api_auth_access'`, description: 'Ticket mode.' },
          { name: 'user_id', type: 'string | undefined', description: 'User id for impersonation flow.' },
          { name: 'actor_id', type: 'string | undefined', description: 'Actor id for AI access flow.' },
          { name: 'agent_ids', type: 'string[] | undefined', description: 'Agent ids for agent access tickets.' },
          { name: 'webhook_app_slug', type: 'string | undefined', description: 'Webhook app scope for webhook access ticket.' },
          { name: 'api_auth_app_slug', type: 'string | undefined', description: 'API auth app scope for api-auth ticket.' },
          { name: 'expires_in', type: 'number | undefined', description: 'Optional custom expiry (seconds).' },
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
        slug: 'upload-image',
        path: ['operations', 'upload-image'],
        title: 'uploadImage()',
        description: 'Upload an image asset through backend utility routes.',
        intro:
          'Uploads a file via multipart form-data and returns a hosted image URL.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function uploadLogo(file: File) {
  const client = await wachtClient();
  return client.utility.uploadImage('logo', file);
}`,
        signature: `function uploadImage(
  imageType: 'logo' | 'favicon' | 'user-profile' | 'org-profile' | 'workspace-profile',
  file: File,
): Promise<{ url: string }>`,
        params: [
          { name: 'imageType', type: `'logo' | 'favicon' | 'user-profile' | 'org-profile' | 'workspace-profile'`, description: 'Target image category.' },
          { name: 'file', type: 'File', description: 'Image file payload (multipart upload).' },
        ],
        api: [{ name: 'url', type: 'string', description: 'Hosted CDN URL for uploaded image.' }],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Uploads multipart image content and returns a hosted URL reference.',
          'Ensure file type and size validation in caller code before sending uploads.',
        ],
      },
    ],
  },
{
        slug: 'check-authz',
        path: ['operations', 'check-authz'],
        title: 'checkAuthz()',
        description: 'Call gateway authorization check endpoint.',
        intro:
          'Posts a principal/resource authorization request to the gateway API and returns allow/deny with identity context.',
        usage: `import { checkAuthz } from '@wacht/backend';

export async function canAccessUsers(token: string) {
  return checkAuthz({
    principal: { type: 'api_key', value: token },
    resource: 'users/*',
    method: 'GET',
  });
}`,
        signature: `function checkAuthz(
  payload: AuthzCheckRequest,
  options?: GatewayCheckAuthzOptions,
): Promise<AuthzCheckResponse>`,
    sections: [
      {
        title: 'Behavior',
        points: [
          'Evaluates authorization against gateway policy and returns allow/deny context.',
          'Use this for backend enforcement, not only UI-level visibility checks.',
        ],
      },
    ],
  },
{
        slug: 'check-principal-authz',
        path: ['operations', 'check-principal-authz'],
        title: 'checkPrincipalAuthz()',
        description: 'Gateway authz helper for simplified principal payloads.',
        intro:
          'Builds and sends an authz request from flattened principal arguments.',
        usage: `import { checkPrincipalAuthz } from '@wacht/backend';

export async function canPrincipalWrite(apiKey: string) {
  return checkPrincipalAuthz({
    principalType: 'api_key',
    principalValue: apiKey,
    resource: 'users/*',
    method: 'POST',
  });
}`,
        signature: `function checkPrincipalAuthz(
  payload: GatewayPrincipalAuthzRequest,
  options?: GatewayCheckAuthzOptions,
): Promise<AuthzCheckResponse>`,
    sections: [
      {
        title: 'Behavior',
        points: [
          'Builds and evaluates a gateway authorization check for a flattened principal payload.',
          'Use this helper when callers only have principal type/value rather than a full principal object.',
        ],
      },
    ],
  },
];
