import type { SharedGroup } from './shared-sdk-pages.types';

export const webhooksHookGroup: SharedGroup = {
  label: 'Webhooks',
  docs: [
    {
      slug: 'use-webhook-app-session',
      title: 'useWebhookAppSession',
      description: 'Read the current webhook app session.',
      importName: 'useWebhookAppSession',
      intro:
        '`useWebhookAppSession()` is the entry hook for the webhook console. It resolves the current webhook app session, exposes the current webhook app, and bundles the top-level endpoint, settings, replay, and secret-rotation actions that the rest of your webhook UI can share.',
      example: `import { useWebhookAppSession } from '@wacht/nextjs';

export default function WebhookShell({
  ticket,
}: {
  ticket?: string | null;
}) {
  const {
    hasSession,
    sessionLoading,
    webhookApp,
    rotateSecret,
  } = useWebhookAppSession(ticket);

  if (sessionLoading) {
    return <div>Loading webhook app...</div>;
  }

  if (!hasSession) {
    return <div>Access required</div>;
  }

  return (
    <div>
      <h1>{webhookApp?.name}</h1>
      <button onClick={rotateSecret}>Rotate secret</button>
    </div>
  );
}`,
      points: [],
      signature: `declare function useWebhookAppSession(ticket?: string | null): {
  hasSession: boolean;
  sessionLoading: boolean;
  sessionError: Error | null;
  sessionId: string | null;
  webhookApp: WebhookAppInfo | null;
  ticketExchanged: boolean;
  ticketLoading: boolean;
  refetch: () => Promise<void>;
  createEndpoint: (options: CreateEndpointOptions) => Promise<ApiResult<EndpointWithSubscriptions>>;
  updateEndpoint: (endpointId: string, options: UpdateEndpointOptions) => Promise<ApiResult<EndpointWithSubscriptions>>;
  deleteEndpoint: (endpointId: string) => Promise<ApiResult<DeleteEndpointResponse>>;
  testEndpoint: (endpointId: string, options: TestEndpointOptions) => Promise<ApiResult<TestEndpointResponse>>;
  rotateSecret: () => Promise<ApiResult<WebhookAppInfo>>;
  updateSettings: (options: UpdateWebhookSettingsOptions) => Promise<ApiResult<WebhookSettingsResponse>>;
  replayDelivery: (options: ReplayWebhookDeliveryOptions) => Promise<ApiResult<ReplayWebhookDeliveryResponse>>;
  fetchReplayTaskStatus: (options: ReplayTaskStatusOptions) => Promise<ApiResult<ReplayTaskStatusResponse>>;
  fetchReplayTasks: (options?: ReplayTaskListOptions) => Promise<ApiResult<ReplayTaskListResponse>>;
  cancelReplayTask: (options: CancelReplayTaskOptions) => Promise<ApiResult<CancelReplayTaskResponse>>;
  fetchDeliveryDetail: (deliveryId: string) => Promise<ApiResult<WebhookDeliveryDetail[]>>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook plays the same role for the webhook surface that `useAgentSession()` plays for agents. It handles optional ticket exchange, loads the current webhook app session, and keeps the app-level mutation helpers in one place so the surrounding provider can expose a single coherent webhook context.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useWebhookAppSession()` at the entry point of a webhook management area, where you need to know whether the user can access the webhook app at all and you want one shared place to keep the top-level webhook actions. It is the hook you use when you are building your own webhook console or other personalized webhook management experience.',
            'That keeps the endpoint, deliveries, events, and notifications pages from re-implementing ticket exchange or app bootstrapping. If your UI has a dedicated webhook console, this hook belongs at that console boundary.',
          ],
        },
        {
          title: 'Integration pattern',
          paragraphs: [
            'A common pattern is to call `useWebhookAppSession(ticket)` once at the top of your webhook area, strip the ticket from the URL after a successful exchange, and then forward the returned app object and helper methods through your own context. Endpoint pages, deliveries pages, notification settings, and replay flows can then all build on top of that shared session boundary.',
          ],
        },
      ],
      api: [
        { name: 'ticket', type: 'string | null | undefined', description: 'Optional session ticket for the webhook console.' },
        { name: 'hasSession', type: 'boolean', description: 'Whether the current user has a valid webhook app session.' },
        { name: 'sessionLoading', type: 'boolean', description: 'True while the ticket exchange or session fetch is still in progress.' },
        { name: 'sessionError', type: 'Error | null', description: 'Non-session transport or exchange failure.' },
        { name: 'sessionId', type: 'string | null', description: 'Current webhook session identifier.' },
        {
          name: 'webhookApp',
          type: 'WebhookAppInfo | null',
          description: 'Current webhook app metadata.',
          children: [
            { name: 'app_slug', type: 'string', description: 'Webhook app slug.' },
            { name: 'name', type: 'string', description: 'Webhook app name.' },
            { name: 'signing_secret', type: 'string', description: 'Current webhook signing secret.' },
            { name: 'is_active', type: 'boolean', description: 'Whether the webhook app is active.' },
            { name: 'failure_notification_emails', type: 'string[] | undefined', description: 'Emails that receive webhook failure notifications.' },
          ],
        },
        { name: 'ticketExchanged', type: 'boolean', description: 'Whether the supplied ticket has already been exchanged successfully.' },
        { name: 'ticketLoading', type: 'boolean', description: 'Whether the ticket exchange is still running.' },
        { name: 'refetch', type: '() => Promise<void>', description: 'Revalidates the current webhook app session.' },
        { name: 'createEndpoint', type: '(options: CreateEndpointOptions) => Promise<ApiResult<EndpointWithSubscriptions>>', description: 'Creates a webhook endpoint for the current app. The created endpoint is available on `result.data`.' },
        { name: 'updateEndpoint', type: '(endpointId: string, options: UpdateEndpointOptions) => Promise<ApiResult<EndpointWithSubscriptions>>', description: 'Updates an existing endpoint. The updated endpoint is available on `result.data`.' },
        { name: 'deleteEndpoint', type: '(endpointId: string) => Promise<ApiResult<DeleteEndpointResponse>>', description: 'Deletes an endpoint. The delete result is available on `result.data`.' },
        { name: 'testEndpoint', type: '(endpointId: string, options: TestEndpointOptions) => Promise<ApiResult<TestEndpointResponse>>', description: 'Sends a test delivery to an endpoint. The test result is available on `result.data`.' },
        { name: 'rotateSecret', type: '() => Promise<ApiResult<WebhookAppInfo>>', description: 'Rotates the webhook signing secret. The updated app payload is available on `result.data`.' },
        { name: 'updateSettings', type: '(options: UpdateWebhookSettingsOptions) => Promise<ApiResult<WebhookSettingsResponse>>', description: 'Updates webhook app settings such as failure notification emails. The updated settings are available on `result.data`.' },
        { name: 'replayDelivery', type: '(options: ReplayWebhookDeliveryOptions) => Promise<ApiResult<ReplayWebhookDeliveryResponse>>', description: 'Starts a delivery replay job. The queued task information is available on `result.data`.' },
        { name: 'fetchReplayTaskStatus', type: '(options: ReplayTaskStatusOptions) => Promise<ApiResult<ReplayTaskStatusResponse>>', description: 'Reads the status of one replay job. The task state is available on `result.data`.' },
        { name: 'fetchReplayTasks', type: '(options?: ReplayTaskListOptions) => Promise<ApiResult<ReplayTaskListResponse>>', description: 'Lists replay jobs. The page payload is available on `result.data`.' },
        { name: 'cancelReplayTask', type: '(options: CancelReplayTaskOptions) => Promise<ApiResult<CancelReplayTaskResponse>>', description: 'Cancels a replay job. The cancellation result is available on `result.data`.' },
        { name: 'fetchDeliveryDetail', type: '(deliveryId: string) => Promise<ApiResult<WebhookDeliveryDetail[]>>', description: 'Fetches detailed delivery attempts for one delivery. The attempt list is available on `result.data`.' },
      ],
    },
    {
      slug: 'use-webhook-stats',
      title: 'useWebhookStats',
      description: 'Read top-level webhook counts.',
      importName: 'useWebhookStats',
      intro:
        '`useWebhookStats()` is the small summary hook for the webhook surface. It returns the top-level counts for endpoints, events, and pending deliveries, which makes it a good fit for dashboard cards, header metrics, and other compact overview UI.',
      example: `import { useWebhookStats } from '@wacht/nextjs';

export default function WebhookSnapshot() {
  const { stats, loading } = useWebhookStats();

  if (loading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div>
      <p>Endpoints: {stats?.endpoint_count ?? 0}</p>
      <p>Events: {stats?.event_count ?? 0}</p>
      <p>Pending deliveries: {stats?.pending_deliveries ?? 0}</p>
    </div>
  );
}`,
      points: [],
      signature: `declare function useWebhookStats(): {
  stats: WebhookStats | null;
  loading: boolean;
  error: unknown;
  refetch: () => void;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook is intentionally small. It returns the top-level webhook counters only, not the full analytics or chart data. That makes it useful for small snapshot surfaces where you want quick counts without the larger analytics payloads.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useWebhookStats()` when you need small overview counts such as active endpoints, total events, or pending deliveries. It fits naturally into dashboard cards, small summary rows, and header metrics.',
            'If you need response times, delivery success rates, or time-bucketed charts, use the analytics and timeseries hooks instead. This hook is the lightest-weight summary surface in the webhook area.',
          ],
        },
        {
          title: 'Integration pattern',
          paragraphs: [
            'A common pattern is to pair `useWebhookStats()` with `useWebhookAnalytics()` and `useWebhookTimeseries()` on the webhook overview page. The small stats hook gives you the headline counts, while the heavier hooks handle operational analytics and chart data.',
          ],
        },
      ],
      api: [
        {
          name: 'stats',
          type: 'WebhookStats | null',
          description: 'Top-level webhook counters.',
          children: [
            { name: 'endpoint_count', type: 'number', description: 'Number of configured webhook endpoints.' },
            { name: 'event_count', type: 'number', description: 'Number of known webhook events.' },
            { name: 'pending_deliveries', type: 'number', description: 'Number of deliveries that are still pending.' },
          ],
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Whether the stats query is still loading.',
        },
        {
          name: 'error',
          type: 'unknown',
          description: 'SWR error for the stats query.',
        },
        {
          name: 'refetch',
          type: '() => void',
          description: 'Revalidates the webhook stats query.',
        },
      ],
      examples: [
        {
          title: 'Use webhook stats in a snapshot row',
          code: `import { useWebhookStats } from '@wacht/nextjs';

export default function SnapshotRow() {
  const { stats } = useWebhookStats();

  return (
    <div>
      <span>{stats?.endpoint_count ?? 0} endpoints</span>
      <span>{stats?.event_count ?? 0} events</span>
    </div>
  );
}`,
          lang: 'tsx',
        },
      ],
    },
    {
      slug: 'use-webhook-endpoints',
      title: 'useWebhookEndpoints',
      description: 'List webhook endpoints for the current app.',
      importName: 'useWebhookEndpoints',
      intro:
        '`useWebhookEndpoints()` is the main list hook for the webhook endpoints surface. It returns the current endpoint list with subscriptions attached, which makes it the natural source for endpoint tables, endpoint pickers, and navigation into endpoint detail pages.',
      example: `import { useWebhookEndpoints } from '@wacht/nextjs';

export default function EndpointList() {
  const { endpoints, loading } = useWebhookEndpoints();

  if (loading) {
    return <div>Loading endpoints...</div>;
  }

  return (
    <ul>
      {endpoints.map((endpoint) => (
        <li key={endpoint.id}>
          {endpoint.url} · {endpoint.subscribed_events.length} events
        </li>
      ))}
    </ul>
  );
}`,
      points: [],
      signature: `declare function useWebhookEndpoints(): {
  endpoints: EndpointWithSubscriptions[];
  loading: boolean;
  error: unknown;
  refetch: () => void;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook returns the current webhook endpoint list for the app. It is intentionally read-focused: it does not create, edit, delete, or test endpoints itself. Those app-level mutations still live on `useWebhookAppSession()`, while this hook focuses on the read model for endpoint lists.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useWebhookEndpoints()` anywhere you need the full endpoint list: endpoint tables, selection UIs, summary cards, or route entry pages that link into endpoint detail views.',
            'If your screen is already mounted under a webhook app session boundary, this hook gives you the endpoint list without forcing you to thread the list through your own app session provider.',
          ],
        },
        {
          title: 'Integration pattern',
          paragraphs: [
            'A common pattern is to pair `useWebhookEndpoints()` with the mutation helpers from `useWebhookAppSession()`. The list hook drives the current endpoint table, while create, edit, delete, and test dialogs call the session hook helpers and then trigger `refetch()` on the list after the mutation completes.',
          ],
        },
      ],
      api: [
        {
          name: 'endpoints',
          type: 'EndpointWithSubscriptions[]',
          description: 'Webhook endpoints for the current app.',
          children: [
            { name: 'id', type: 'string', description: 'Endpoint identifier.' },
            { name: 'deployment_id', type: 'string', description: 'Deployment that owns the endpoint.' },
            { name: 'app_slug', type: 'string', description: 'Webhook app slug.' },
            { name: 'url', type: 'string', description: 'Delivery URL for the endpoint.' },
            { name: 'description', type: 'string | undefined', description: 'Optional endpoint description.' },
            { name: 'headers', type: 'Record<string, string> | undefined', description: 'Static headers sent with deliveries.' },
            { name: 'is_active', type: 'boolean', description: 'Whether the endpoint is active.' },
            { name: 'max_retries', type: 'number', description: 'Maximum retry count for deliveries.' },
            { name: 'timeout_seconds', type: 'number', description: 'Delivery timeout in seconds.' },
            { name: 'failure_count', type: 'number', description: 'Observed failure count for the endpoint.' },
            { name: 'last_failure_at', type: 'string | undefined', description: 'Timestamp of the last failure when one exists.' },
            { name: 'auto_disabled', type: 'boolean', description: 'Whether the endpoint has been auto-disabled.' },
            { name: 'auto_disabled_at', type: 'string | undefined', description: 'Timestamp when the endpoint was auto-disabled.' },
            {
              name: 'rate_limit_config',
              type: 'RateLimitConfig | null | undefined',
              description: 'Optional per-endpoint rate limit configuration.',
              children: [
                { name: 'duration_ms', type: 'number', description: 'Rate-limit window size in milliseconds.' },
                { name: 'max_requests', type: 'number', description: 'Maximum requests allowed in that window.' },
              ],
            },
            { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
            { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
            {
              name: 'subscribed_events',
              type: 'string[]',
              description: 'List of event names this endpoint subscribes to.',
            },
            {
              name: 'subscriptions',
              type: 'WebhookEventSubscription[]',
              description: 'Expanded event subscription records.',
              children: [
                { name: 'event_name', type: 'string', description: 'Subscribed event name.' },
                { name: 'filter_rules', type: 'Record<string, unknown> | undefined', description: 'Optional filter rules for that event subscription.' },
              ],
            },
          ],
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Whether the endpoint list is still loading.',
        },
        {
          name: 'error',
          type: 'unknown',
          description: 'SWR error for the endpoint query.',
        },
        {
          name: 'refetch',
          type: '() => void',
          description: 'Revalidates the endpoint list.',
        },
      ],
      examples: [
        {
          title: 'Render a simple endpoint table',
          code: `import { useWebhookEndpoints } from '@wacht/nextjs';

export default function EndpointTable() {
  const { endpoints } = useWebhookEndpoints();

  return (
    <table>
      <tbody>
        {endpoints.map((endpoint) => (
          <tr key={endpoint.id}>
            <td>{endpoint.url}</td>
            <td>{endpoint.is_active ? 'Active' : 'Inactive'}</td>
            <td>{endpoint.subscribed_events.length} events</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
          lang: 'tsx',
        },
        {
          title: 'Refetch after deleting an endpoint',
          code: `import { useWebhookAppSession, useWebhookEndpoints } from '@wacht/nextjs';

export default function EndpointActions() {
  const { endpoints, refetch } = useWebhookEndpoints();
  const { deleteEndpoint } = useWebhookAppSession();

  async function handleDelete(endpointId: string) {
    await deleteEndpoint(endpointId);
    refetch();
  }

  return (
    <ul>
      {endpoints.map((endpoint) => (
        <li key={endpoint.id}>
          {endpoint.url}
          <button onClick={() => handleDelete(endpoint.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}`,
          lang: 'tsx',
        },
      ],
    },
    {
      slug: 'use-create-webhook-endpoint',
      title: 'useCreateWebhookEndpoint',
      description: 'Create a webhook endpoint without the broader webhook session surface.',
      importName: 'useCreateWebhookEndpoint',
      intro:
        '`useCreateWebhookEndpoint()` is the narrow write hook for creating a webhook endpoint. It is useful when your screen only needs endpoint creation and does not need the broader webhook app session helpers from `useWebhookAppSession()`.',
      example: `import { useCreateWebhookEndpoint } from '@wacht/nextjs';

export default function CreateEndpointButton() {
  const { createEndpoint } = useCreateWebhookEndpoint();

  async function handleCreate() {
    await createEndpoint({
      url: 'https://example.com/webhooks',
      subscribed_events: ['user.created'],
    });
  }

  return <button onClick={handleCreate}>Create endpoint</button>;
}`,
      points: [],
      signature: `declare function useCreateWebhookEndpoint(): {
  createEndpoint: (options: CreateEndpointOptions) => Promise<ApiResult<EndpointWithSubscriptions>>;
  loading: boolean;
  error: unknown;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook exists for focused creation flows. It exposes the create action only, without the session bootstrapping, replay helpers, settings mutations, or endpoint list queries that come with `useWebhookAppSession()`.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useCreateWebhookEndpoint()` when your screen needs a single create action and little else, such as a compact onboarding step or an embedded setup flow.',
            'If your page already depends on `useWebhookAppSession()`, prefer the `createEndpoint` method there so one hook owns the whole webhook app boundary.',
          ],
        },
        {
          title: 'Request shape',
          paragraphs: [
            'The hook accepts the full `CreateEndpointOptions` shape. That includes the basic event list, as well as expanded subscriptions, static headers, and optional rate-limit settings.',
          ],
        },
      ],
      api: [
        {
          name: 'createEndpoint',
          type: '(options: CreateEndpointOptions) => Promise<ApiResult<EndpointWithSubscriptions>>',
          description: 'Creates one webhook endpoint. The created endpoint is available on `result.data`.',
          children: [
            { name: 'options.url', type: 'string', description: 'Destination URL for the webhook endpoint.' },
            { name: 'options.description', type: 'string | undefined', description: 'Optional human-readable endpoint description.' },
            { name: 'options.subscribed_events', type: 'string[]', description: 'List of event names that should be delivered to the endpoint.' },
            {
              name: 'options.subscriptions',
              type: 'WebhookEventSubscription[] | undefined',
              description: 'Expanded event subscriptions, including optional filter rules.',
              children: [
                { name: 'event_name', type: 'string', description: 'Subscribed event name.' },
                { name: 'filter_rules', type: 'Record<string, unknown> | undefined', description: 'Optional filter rules for that event.' },
              ],
            },
            { name: 'options.headers', type: 'Record<string, string> | undefined', description: 'Static headers sent with each webhook delivery.' },
            {
              name: 'options.rate_limit_config',
              type: 'RateLimitConfig | null | undefined',
              description: 'Optional per-endpoint rate limit configuration.',
              children: [
                { name: 'duration_ms', type: 'number', description: 'Rate-limit window size in milliseconds.' },
                { name: 'max_requests', type: 'number', description: 'Maximum requests allowed in that window.' },
              ],
            },
          ],
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Current implementation always returns `false` for this hook.',
        },
        {
          name: 'error',
          type: 'unknown',
          description: 'Current implementation always returns `null` for this hook.',
        },
      ],
      examples: [
        {
          title: 'Create an endpoint with headers and rate limits',
          code: `import { useCreateWebhookEndpoint } from '@wacht/nextjs';

export default function CreateEndpointForm() {
  const { createEndpoint } = useCreateWebhookEndpoint();

  async function handleCreate() {
    await createEndpoint({
      url: 'https://example.com/webhooks',
      description: 'Primary production endpoint',
      subscribed_events: ['user.created', 'user.updated'],
      headers: {
        'x-source': 'docs-example',
      },
      subscriptions: [
        {
          event_name: 'user.created',
        },
      ],
      rate_limit_config: {
        duration_ms: 60000,
        max_requests: 120,
      },
    });
  }

  return <button onClick={handleCreate}>Create endpoint</button>;
}`,
          lang: 'tsx',
        },
      ],
    },
    {
      slug: 'use-webhook-deliveries',
      title: 'useWebhookDeliveries',
      description: 'List webhook deliveries for the current app.',
      importName: 'useWebhookDeliveries',
      intro:
        '`useWebhookDeliveries()` is the main operational list hook for webhook traffic. It returns delivery rows for the current app, with optional filters for endpoint, event, status, and cursor position, which makes it the hook you use for webhook logs, endpoint delivery views, and replay selection surfaces.',
      example: `import { useState } from 'react';
import { useWebhookDeliveries } from '@wacht/nextjs';

export default function WebhookLogsPage() {
  const [status, setStatus] = useState<string>('all');
  const [eventName, setEventName] = useState<string>('all');

  const { deliveries, has_more, next_cursor, loading } = useWebhookDeliveries({
    status: status === 'all' ? undefined : status,
    event_name: eventName === 'all' ? undefined : eventName,
    limit: 30,
  });

  if (loading) {
    return <div>Loading deliveries...</div>;
  }

  return (
    <div>
      <p>{deliveries.length} deliveries</p>
      <p>{has_more ? next_cursor : 'No more pages'}</p>
    </div>
  );
}`,
      points: [],
      signature: `declare function useWebhookDeliveries(options?: UseWebhookDeliveriesOptions): {
  deliveries: WebhookDelivery[];
  has_more: boolean;
  next_cursor?: string;
  loading: boolean;
  error: unknown;
  refetch: () => void;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook gives you the delivery log for the current webhook app. It is list-oriented: it returns the current delivery page and the cursor information for the next page, but it does not load per-attempt detail and it does not replay deliveries by itself.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useWebhookDeliveries()` when you need the delivery log itself: a global webhook logs page, an endpoint-specific delivery tab, or any operational surface where a user needs to inspect recent delivery outcomes.',
            'If the user also needs to inspect individual attempts or replay deliveries, pair this hook with the app-level helpers from `useWebhookAppSession()`. The list hook stays focused on fetching the current delivery rows.',
          ],
        },
        {
          title: 'Filtering and pagination',
          paragraphs: [
            'The hook accepts four practical filters: `endpoint_id`, `status`, `event_name`, and `cursor`, plus `limit` for page size. The current implementations build cursor pagination in the page layer, usually by keeping an array of prior cursors and deriving the active cursor from the selected page.',
            'That is why the hook returns `has_more` and `next_cursor` instead of owning page state itself. It gives you the raw pagination contract and leaves the actual paging UI up to your screen.',
          ],
        },
        {
          title: 'Detail and replay flow',
          paragraphs: [
            'Each delivery row is only the summary record. If you need the per-attempt history, request and response payloads, or replay actions, fetch those separately through the app session helpers after the user expands a row or chooses a replay action.',
            'That split is intentional. The list stays lightweight enough for filtering and paging, while the expensive attempt detail loads only when the user asks for it.',
          ],
        },
      ],
      api: [
        {
          name: 'options',
          type: 'UseWebhookDeliveriesOptions | undefined',
          description: 'Optional delivery list filters.',
          children: [
            { name: 'endpoint_id', type: 'string | undefined', description: 'Restricts the list to one webhook endpoint.' },
            { name: 'status', type: 'string | undefined', description: 'Restricts the list to one delivery status such as success, failed, or filtered.' },
            { name: 'event_name', type: 'string | undefined', description: 'Restricts the list to one event name.' },
            { name: 'limit', type: 'number | undefined', description: 'Maximum number of deliveries to load in one page.' },
            { name: 'cursor', type: 'string | undefined', description: 'Opaque cursor for the next page of deliveries.' },
          ],
        },
        {
          name: 'deliveries',
          type: 'WebhookDelivery[]',
          description: 'Current page of delivery rows.',
          children: [
            { name: 'id', type: 'string', description: 'Delivery identifier.' },
            { name: 'deployment_id', type: 'string', description: 'Deployment that owns the delivery.' },
            { name: 'app_slug', type: 'string', description: 'Webhook app slug.' },
            { name: 'endpoint_id', type: 'string', description: 'Endpoint that received the delivery.' },
            { name: 'event_name', type: 'string', description: 'Event name that produced the delivery.' },
            { name: 'event_type', type: 'string', description: 'Event type label for the delivery.' },
            { name: 'status', type: 'string', description: 'Current delivery status.' },
            { name: 'http_status_code', type: 'number | undefined', description: 'HTTP status returned by the destination when available.' },
            { name: 'response_status', type: 'number | undefined', description: 'Normalized response status when one is recorded.' },
            { name: 'response_time_ms', type: 'number | undefined', description: 'Measured response time in milliseconds when available.' },
            { name: 'attempt_number', type: 'number', description: 'Current attempt number for the delivery.' },
            { name: 'max_attempts', type: 'number', description: 'Maximum number of retry attempts allowed for the delivery.' },
            { name: 'timestamp', type: 'string', description: 'Primary delivery timestamp.' },
            { name: 'created_at', type: 'string', description: 'Creation timestamp for the delivery record.' },
          ],
        },
        {
          name: 'has_more',
          type: 'boolean',
          description: 'Whether another page of deliveries is available.',
        },
        {
          name: 'next_cursor',
          type: 'string | undefined',
          description: 'Cursor token for the next delivery page.',
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Whether the current delivery query is still loading.',
        },
        {
          name: 'error',
          type: 'unknown',
          description: 'SWR error for the delivery query.',
        },
        {
          name: 'refetch',
          type: '() => void',
          description: 'Revalidates the current delivery page.',
        },
      ],
      examples: [
        {
          title: 'Render a delivery log with status filtering',
          code: `import { useState } from 'react';
import { useWebhookDeliveries } from '@wacht/nextjs';

export default function DeliveryLog() {
  const [status, setStatus] = useState<string>('all');
  const { deliveries } = useWebhookDeliveries({
    status: status === 'all' ? undefined : status,
    limit: 30,
  });

  return (
    <div>
      <button onClick={() => setStatus('failed')}>Show failed</button>
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            {delivery.event_name} · {delivery.status}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
          lang: 'tsx',
        },
        {
          title: 'Scope deliveries to one endpoint',
          code: `import { useWebhookDeliveries } from '@wacht/nextjs';

export default function EndpointDeliveries({
  endpointId,
}: {
  endpointId: string;
}) {
  const { deliveries, refetch } = useWebhookDeliveries({
    endpoint_id: endpointId,
    limit: 30,
  });

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            {delivery.event_name} · attempt {delivery.attempt_number}/{delivery.max_attempts}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
          lang: 'tsx',
        },
      ],
    },
    {
      slug: 'use-webhook-events',
      title: 'useWebhookEvents',
      description: 'Read the webhook event catalog.',
      importName: 'useWebhookEvents',
      intro:
        '`useWebhookEvents()` returns the event catalog for the current webhook app. It is the hook you use when you want to show the available event names, descriptions, schema metadata, or example payloads in your own webhook console.',
      example: `import { useWebhookEvents } from '@wacht/nextjs';

export default function EventCatalog() {
  const { events, loading } = useWebhookEvents();

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <ul>
      {events.map((event) => (
        <li key={event.event_name}>
          {event.event_name}
        </li>
      ))}
    </ul>
  );
}`,
      points: [],
      signature: `declare function useWebhookEvents(): {
  events: WebhookAppEvent[];
  loading: boolean;
  error: unknown;
  refetch: () => void;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook returns the webhook app event catalog, not delivery records. It is meant for event discovery and event documentation surfaces, where the UI needs to know which events exist and what their payloads look like.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useWebhookEvents()` when you want to build an event catalog, an event picker, or any setup surface where users need to browse the events they can subscribe to.',
            'If you are building endpoint configuration UI, this hook is the natural companion to `useWebhookEndpoints()` and the create or update endpoint actions from `useWebhookAppSession()`.',
          ],
        },
        {
          title: 'Integration pattern',
          paragraphs: [
            'A common pattern is to read the full event catalog once, then add client-side grouping, search, and expansion state in the page layer. That is how you can build event-category views, search by name or description, and show schemas or example payloads without complicating the hook itself.',
          ],
        },
        {
          title: 'Where events come from',
          paragraphs: [
            'These events are not invented inside the hook. The hook reads the webhook app event catalog that the backend resolves for the current deployment and app slug. That catalog is the source of truth for the event names, descriptions, grouping labels, schemas, and example payloads returned here.',
            'That same catalog can then drive multiple frontend surfaces: event browser pages, endpoint subscription pickers, filter configuration, schema viewers, and test-delivery payload helpers. In other words, `useWebhookEvents()` is usually the shared source behind the rest of your webhook event UI.',
          ],
        },
      ],
      api: [
        {
          name: 'events',
          type: 'WebhookAppEvent[]',
          description: 'Webhook event catalog entries.',
          children: [
            { name: 'deployment_id', type: 'string', description: 'Deployment that owns the event definition.' },
            { name: 'app_slug', type: 'string', description: 'Webhook app slug.' },
            { name: 'event_name', type: 'string', description: 'Canonical event name.' },
            { name: 'group', type: 'string | undefined', description: 'Optional grouping label for catalog UI.' },
            { name: 'description', type: 'string | undefined', description: 'Human-readable event description.' },
            { name: 'schema', type: 'Record<string, unknown> | undefined', description: 'Optional event schema object.' },
            { name: 'example_payload', type: 'Record<string, unknown> | undefined', description: 'Optional example payload for the event.' },
            { name: 'is_archived', type: 'boolean', description: 'Whether the event has been archived.' },
            { name: 'created_at', type: 'string', description: 'Creation timestamp for the event definition.' },
          ],
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Whether the event catalog is still loading.',
        },
        {
          name: 'error',
          type: 'unknown',
          description: 'SWR error for the event catalog query.',
        },
        {
          name: 'refetch',
          type: '() => void',
          description: 'Revalidates the event catalog.',
        },
      ],
      examples: [
        {
          title: 'Group events by category',
          code: `import { useMemo } from 'react';
import { useWebhookEvents } from '@wacht/nextjs';

export default function GroupedEvents() {
  const { events } = useWebhookEvents();

  const groups = useMemo(() => {
    return events.reduce<Record<string, typeof events>>((acc, event) => {
      const key = event.group || event.event_name.split('.')[0] || 'general';
      acc[key] ||= [];
      acc[key].push(event);
      return acc;
    }, {});
  }, [events]);

  return (
    <div>
      {Object.entries(groups).map(([group, items]) => (
        <section key={group}>
          <h2>{group}</h2>
          <ul>
            {items.map((event) => (
              <li key={event.event_name}>{event.event_name}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}`,
          lang: 'tsx',
        },
        {
          title: 'Show event schemas when available',
          code: `import { useWebhookEvents } from '@wacht/nextjs';

export default function EventSchemas() {
  const { events } = useWebhookEvents();

  return (
    <ul>
      {events.map((event) => (
        <li key={event.event_name}>
          <strong>{event.event_name}</strong>
          {event.schema ? <pre>{JSON.stringify(event.schema, null, 2)}</pre> : null}
        </li>
      ))}
    </ul>
  );
}`,
          lang: 'tsx',
        },
      ],
    },
    {
      slug: 'use-webhook-analytics',
      title: 'useWebhookAnalytics',
      description: 'Read aggregate webhook analytics for a date range.',
      importName: 'useWebhookAnalytics',
      intro:
        '`useWebhookAnalytics()` returns aggregate webhook metrics for a selected time window. It is the hook you use for overview cards, operational summaries, and endpoint-level performance snapshots where you need rolled-up counts and latency metrics instead of raw delivery rows.',
      example: `import { useWebhookAnalytics } from '@wacht/nextjs';

export default function WebhookOverview() {
  const { analytics, loading } = useWebhookAnalytics({
    fields: ['total_deliveries', 'successful', 'failed', 'success_rate'],
  });

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div>
      <p>Total deliveries: {analytics?.total_deliveries ?? 0}</p>
      <p>Success rate: {(analytics?.success_rate ?? 0).toFixed(1)}%</p>
    </div>
  );
}`,
      points: [],
      signature: `declare function useWebhookAnalytics(options?: UseWebhookAnalyticsOptions): {
  analytics: WebhookAnalyticsResponse | null;
  loading: boolean;
  error: unknown;
  refetch: () => void;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook returns aggregate metrics for the current webhook app over a time window. It is designed for summary surfaces, not detailed browsing. If you need individual deliveries, use `useWebhookDeliveries()` instead.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useWebhookAnalytics()` when you want summary cards or compact operational metrics, such as total deliveries, success rate, latency percentiles, or average payload size.',
            'It works well on an app-level overview page and on endpoint-specific pages where you need the rolled-up view before drilling into individual delivery rows.',
          ],
        },
        {
          title: 'Fields and query shape',
          paragraphs: [
            'The hook accepts a date range, an optional `endpoint_id`, and an optional `fields` array. The `fields` array is important because the backend only computes the metrics you ask for. That keeps overview queries smaller when your page only needs a few headline numbers.',
            'If you omit `fields`, the backend defaults to the success-rate path. If your UI expects additional values such as latency percentiles or payload size, request them explicitly.',
          ],
        },
        {
          title: 'How it fits with the rest of the webhook surface',
          paragraphs: [
            'A common pattern is to use `useWebhookAnalytics()` for the headline metrics, `useWebhookTimeseries()` for charts, and `useWebhookDeliveries()` for the underlying log. Those three hooks map cleanly to summary, trend, and inspection surfaces.',
          ],
        },
      ],
      api: [
        {
          name: 'options',
          type: 'UseWebhookAnalyticsOptions | undefined',
          description: 'Optional analytics query settings.',
          children: [
            { name: 'start_date', type: 'string | undefined', description: 'Inclusive start timestamp for the analytics window.' },
            { name: 'end_date', type: 'string | undefined', description: 'Inclusive end timestamp for the analytics window.' },
            { name: 'endpoint_id', type: 'string | undefined', description: 'Restricts the analytics query to one webhook endpoint.' },
            { name: 'fields', type: 'string[] | undefined', description: 'List of aggregate fields the backend should compute.' },
          ],
        },
        {
          name: 'analytics',
          type: 'WebhookAnalyticsResponse | null',
          description: 'Aggregate analytics payload.',
          children: [
            { name: 'total_deliveries', type: 'number', description: 'Total deliveries in the selected range when that path is requested.' },
            { name: 'total_events', type: 'number', description: 'Distinct delivery count used as the current total-events metric.' },
            { name: 'successful', type: 'number', description: 'Number of successful deliveries.' },
            { name: 'failed', type: 'number', description: 'Number of failed or permanently failed deliveries.' },
            { name: 'filtered', type: 'number', description: 'Number of filtered deliveries.' },
            { name: 'success_rate', type: 'number', description: 'Success rate for the selected time window.' },
            { name: 'avg_response_time_ms', type: 'number | undefined', description: 'Average response time in milliseconds.' },
            { name: 'p50_response_time_ms', type: 'number | undefined', description: 'Median response time in milliseconds.' },
            { name: 'p95_response_time_ms', type: 'number | undefined', description: '95th percentile response time in milliseconds.' },
            { name: 'p99_response_time_ms', type: 'number | undefined', description: '99th percentile response time in milliseconds.' },
            { name: 'avg_payload_size', type: 'number | undefined', description: 'Average payload size in bytes.' },
          ],
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Whether the analytics query is still loading.',
        },
        {
          name: 'error',
          type: 'unknown',
          description: 'SWR error for the analytics query.',
        },
        {
          name: 'refetch',
          type: '() => void',
          description: 'Revalidates the analytics query.',
        },
      ],
      examples: [
        {
          title: 'Load summary metrics for the current app',
          code: `import { useWebhookAnalytics } from '@wacht/nextjs';

export default function AnalyticsSummary() {
  const { analytics } = useWebhookAnalytics({
    fields: [
      'total_deliveries',
      'successful',
      'failed',
      'filtered',
      'success_rate',
      'avg_response_time_ms',
    ],
  });

  return (
    <div>
      <p>{analytics?.total_deliveries ?? 0} deliveries</p>
      <p>{(analytics?.success_rate ?? 0).toFixed(1)}% success</p>
    </div>
  );
}`,
          lang: 'tsx',
        },
        {
          title: 'Scope analytics to one endpoint and time range',
          code: `import { useWebhookAnalytics } from '@wacht/nextjs';

export default function EndpointAnalytics({
  endpointId,
  startDate,
  endDate,
}: {
  endpointId: string;
  startDate: string;
  endDate: string;
}) {
  const { analytics } = useWebhookAnalytics({
    endpoint_id: endpointId,
    start_date: startDate,
    end_date: endDate,
    fields: ['success_rate', 'p95_response_time_ms', 'p99_response_time_ms'],
  });

  return (
    <div>
      <p>P95: {analytics?.p95_response_time_ms ?? 0}ms</p>
      <p>P99: {analytics?.p99_response_time_ms ?? 0}ms</p>
    </div>
  );
}`,
          lang: 'tsx',
        },
      ],
    },
    {
      slug: 'use-webhook-timeseries',
      title: 'useWebhookTimeseries',
      description: 'Read bucketed webhook delivery metrics for charting.',
      importName: 'useWebhookTimeseries',
      intro:
        '`useWebhookTimeseries()` returns bucketed delivery metrics for a selected time range. It is the hook you use for webhook charts, trend views, and endpoint-level time-based dashboards where the UI needs counts grouped by hour or day rather than one aggregate snapshot.',
      example: `import { useWebhookTimeseries } from '@wacht/nextjs';

export default function DeliveryTrend({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const { timeseries, loading } = useWebhookTimeseries({
    start_date: startDate,
    end_date: endDate,
    interval: 'day',
  });

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return <div>{timeseries.length} points</div>;
}`,
      points: [],
      signature: `declare function useWebhookTimeseries(options?: UseWebhookTimeseriesOptions): {
  timeseries: TimeseriesPoint[];
  interval: string;
  loading: boolean;
  error: unknown;
  refetch: () => void;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook returns chart-friendly buckets for webhook delivery activity. Each point represents one time bucket, with totals for deliveries, successful deliveries, failed deliveries, filtered deliveries, average response time, and success rate.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useWebhookTimeseries()` for trend charts and time-based operational views. It fits naturally on overview dashboards and endpoint detail pages where you want to see whether delivery behavior is improving, degrading, or spiking over time.',
            'If you only need one current summary value, prefer `useWebhookAnalytics()` or `useWebhookStats()`. This hook is best when the time axis itself matters.',
          ],
        },
        {
          title: 'How the chart layer usually works',
          paragraphs: [
            'The hook returns the raw bucket list, and the page layer usually reshapes it into the chart library format it needs. A common pattern is to key each point by the UTC day or hour, merge or normalize buckets in the page, and then feed the final array into a bar or line chart component.',
            'That keeps the hook focused on data retrieval and leaves chart-specific formatting, labeling, zero-filling, and grouping inside your page or chart helpers.',
          ],
        },
        {
          title: 'Current event-count limitation',
          paragraphs: [
            'The current backend implementation can no longer compute distinct event counts for each bucket because the underlying schema no longer tracks `event_id`. As a result, `total_events` in the timeseries response is currently always `0`.',
            'That means the hook is still reliable for delivery trends, success and failure buckets, and response-time charts, but you should not treat `total_events` as a meaningful trend field until the backend model changes.',
          ],
        },
      ],
      api: [
        {
          name: 'options',
          type: 'UseWebhookTimeseriesOptions | undefined',
          description: 'Optional timeseries query settings.',
          children: [
            { name: 'start_date', type: 'string | undefined', description: 'Inclusive start timestamp for the chart range.' },
            { name: 'end_date', type: 'string | undefined', description: 'Inclusive end timestamp for the chart range.' },
            { name: 'interval', type: 'string | undefined', description: 'Requested time bucket size, such as `hour` or `day`.' },
            { name: 'endpoint_id', type: 'string | undefined', description: 'Restricts the chart to one webhook endpoint.' },
          ],
        },
        {
          name: 'timeseries',
          type: 'TimeseriesPoint[]',
          description: 'Bucketed delivery metrics.',
          children: [
            { name: 'timestamp', type: 'string', description: 'Start time for the returned bucket.' },
            { name: 'total_events', type: 'number', description: 'Currently always `0` in the returned timeseries payload.' },
            { name: 'total_deliveries', type: 'number', description: 'Total deliveries in the bucket.' },
            { name: 'successful_deliveries', type: 'number', description: 'Successful deliveries in the bucket.' },
            { name: 'failed_deliveries', type: 'number', description: 'Failed deliveries in the bucket.' },
            { name: 'filtered_deliveries', type: 'number', description: 'Filtered deliveries in the bucket.' },
            { name: 'avg_response_time_ms', type: 'number | undefined', description: 'Average response time in milliseconds for the bucket.' },
            { name: 'success_rate', type: 'number', description: 'Success rate for the bucket.' },
          ],
        },
        {
          name: 'interval',
          type: 'string',
          description: 'Resolved bucket interval returned by the backend.',
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Whether the timeseries query is still loading.',
        },
        {
          name: 'error',
          type: 'unknown',
          description: 'SWR error for the timeseries query.',
        },
        {
          name: 'refetch',
          type: '() => void',
          description: 'Revalidates the timeseries query.',
        },
      ],
      examples: [
        {
          title: 'Load daily delivery buckets for a dashboard',
          code: `import { useWebhookTimeseries } from '@wacht/nextjs';

export default function DailyWebhookChart({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const { timeseries } = useWebhookTimeseries({
    start_date: startDate,
    end_date: endDate,
    interval: 'day',
  });

  const chartData = timeseries.map((point) => ({
    time: point.timestamp.slice(0, 10),
    deliveries: point.total_deliveries,
    successful: point.successful_deliveries,
    failed: point.failed_deliveries,
    filtered: point.filtered_deliveries,
  }));

  return <pre>{JSON.stringify(chartData, null, 2)}</pre>;
}`,
          lang: 'tsx',
        },
        {
          title: 'Scope chart data to one endpoint',
          code: `import { useWebhookTimeseries } from '@wacht/nextjs';

export default function EndpointTrend({
  endpointId,
  startDate,
  endDate,
}: {
  endpointId: string;
  startDate: string;
  endDate: string;
}) {
  const { timeseries } = useWebhookTimeseries({
    endpoint_id: endpointId,
    start_date: startDate,
    end_date: endDate,
    interval: 'day',
  });

  return (
    <ul>
      {timeseries.map((point) => (
        <li key={point.timestamp}>
          {point.timestamp}: {point.successful_deliveries} successful
        </li>
      ))}
    </ul>
  );
}`,
          lang: 'tsx',
        },
      ],
    },
  ],
};
