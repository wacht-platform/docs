import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const webhooksBackendDocs: BackendDoc[] = [
{
        slug: 'list-webhook-apps',
        path: ['webhooks', 'list-webhook-apps'],
        title: 'listWebhookApps()',
        description: 'List webhook apps in the current deployment.',
        intro:
          'Returns webhook apps as a paginated result. This endpoint supports `limit`, `offset`, and `include_inactive`.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listWebhookApps() {
  const client = await wachtClient();
  return client.webhooks.listWebhookApps({
    limit: 20,
    offset: 0,
    include_inactive: true,
  });
}`,
        signature: `function listWebhookApps(
  options?: {
    limit?: number;
    offset?: number;
    include_inactive?: boolean;
  },
): Promise<PaginatedResponse<WebhookApp>>`,
        params: [
          {
            name: 'limit',
            type: 'number | undefined',
            description: 'Maximum number of webhook apps to return for this page.',
          },
          {
            name: 'offset',
            type: 'number | undefined',
            description: 'Number of webhook apps to skip before returning results.',
          },
          {
            name: 'include_inactive',
            type: 'boolean | undefined',
            description: 'When `true`, includes inactive apps in the page results.',
          },
        ],
        api: [
          {
            name: 'data',
            type: 'WebhookApp[]',
            description: 'Webhook apps in the current page.',
            children: [
              { name: 'deployment_id', type: 'string', description: 'Deployment that owns the webhook app.' },
              { name: 'app_slug', type: 'string', description: 'Stable app slug used in webhook app routes.' },
              { name: 'name', type: 'string', description: 'Display name of the webhook app.' },
              { name: 'description', type: 'string | null | undefined', description: 'Optional webhook app description.' },
              { name: 'signing_secret', type: 'string', description: 'Current signing secret used for webhook signatures.' },
              { name: 'failure_notification_emails', type: 'string[] | undefined', description: 'Configured notification emails for failed deliveries.' },
              { name: 'event_catalog_slug', type: 'string | null | undefined', description: 'Assigned event catalog slug when one exists.' },
              { name: 'is_active', type: 'boolean', description: 'Whether the webhook app is active.' },
              { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
              { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
            ],
          },
          {
            name: 'has_more',
            type: 'boolean',
            description: 'Whether another page exists after the current page.',
          },
          {
            name: 'limit',
            type: 'number | undefined',
            description: 'Effective page size reflected by the backend response.',
          },
          {
            name: 'offset',
            type: 'number | undefined',
            description: 'Effective offset reflected by the backend response.',
          },
        ],
        
        examples: [
          {
            title: 'List active apps with default pagination',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listActiveWebhookApps() {
  const client = await wachtClient();
  return client.webhooks.listWebhookApps();
}`,
            lang: 'ts',
          },
          {
            title: 'Fetch one page for admin UI',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listWebhookAppsPage(page: number, pageSize = 25) {
  const client = await wachtClient();

  return client.webhooks.listWebhookApps({
    limit: pageSize,
    offset: page * pageSize,
    include_inactive: true,
  });
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
        slug: 'create-webhook-app',
        path: ['webhooks', 'create-webhook-app'],
        title: 'createWebhookApp()',
        description: 'Create a webhook app in the current deployment.',
        intro:
          'Creates a webhook app container used by endpoints, deliveries, and analytics routes. You can provide an explicit `app_slug`, or let the backend generate one.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createWebhookApp() {
  const client = await wachtClient();

  return client.webhooks.createWebhookApp({
    name: 'Billing Webhooks',
    app_slug: 'billing-webhooks',
    description: 'Webhook app for billing events',
    failure_notification_emails: ['ops@example.com'],
  });
}`,
        signature: `function createWebhookApp(
  request: CreateWebhookAppRequest,
): Promise<WebhookApp>`,
        paramsTitle: 'CreateWebhookAppRequest',
        params: [
          {
            name: 'name',
            type: 'string',
            description: 'Display name for the webhook app.',
          },
          {
            name: 'app_slug',
            type: 'string | undefined',
            description: 'Optional app slug. If omitted, the backend generates one.',
          },
          {
            name: 'description',
            type: 'string | undefined',
            description: 'Optional description for the webhook app.',
          },
          {
            name: 'failure_notification_emails',
            type: 'string[] | undefined',
            description: 'Optional email list used for failure notifications.',
          },
          {
            name: 'event_catalog_slug',
            type: 'string | undefined',
            description: 'Optional event catalog slug to attach at creation time.',
          },
        ],
        api: [
          {
            name: 'deployment_id',
            type: 'string',
            description: 'Deployment that owns the webhook app.',
          },
          {
            name: 'app_slug',
            type: 'string',
            description: 'Resolved app slug (provided by request or generated by backend).',
          },
          {
            name: 'name',
            type: 'string',
            description: 'Webhook app display name.',
          },
          {
            name: 'description',
            type: 'string | null | undefined',
            description: 'Webhook app description when configured.',
          },
          {
            name: 'signing_secret',
            type: 'string',
            description: 'Current signing secret for webhook signatures.',
          },
          {
            name: 'failure_notification_emails',
            type: 'string[] | undefined',
            description: 'Configured notification emails for failed deliveries.',
          },
          {
            name: 'event_catalog_slug',
            type: 'string | null | undefined',
            description: 'Assigned event catalog slug when one is set.',
          },
          {
            name: 'is_active',
            type: 'boolean',
            description: 'Whether the webhook app is active.',
          },
          {
            name: 'created_at',
            type: 'string',
            description: 'Creation timestamp.',
          },
          {
            name: 'updated_at',
            type: 'string',
            description: 'Last update timestamp.',
          },
        ],
        sections: [
          {
            title: 'Backend behavior',
            paragraphs: [
              'If you do not send `app_slug`, the backend generates a slug before storing the app.',
              'Create the app first, then configure endpoints and event subscriptions as separate operations.',
            ],
          },
        ],
        examples: [
          {
            title: 'Create with an explicit slug',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createBillingWebhookApp() {
  const client = await wachtClient();

  return client.webhooks.createWebhookApp({
    name: 'Billing Webhooks',
    app_slug: 'billing-webhooks',
    description: 'Webhook app for billing events',
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Create and let backend generate slug',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createGeneratedSlugApp() {
  const client = await wachtClient();

  return client.webhooks.createWebhookApp({
    name: 'General Events',
    failure_notification_emails: ['ops@example.com'],
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'list-webhook-event-catalogs',
        path: ['webhooks', 'list-webhook-event-catalogs'],
        title: 'listWebhookEventCatalogs()',
        description: 'List webhook event catalogs in the current deployment.',
        intro:
          'Returns event catalogs as a paginated response from the shared catalog route.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listWebhookEventCatalogs() {
  const client = await wachtClient();
  return client.webhooks.listWebhookEventCatalogs();
}`,
        signature: `function listWebhookEventCatalogs(
  options?: { limit?: number; offset?: number },
): Promise<PaginatedResponse<WebhookEventCatalog>>`,
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
        slug: 'get-webhook-event-catalog',
        path: ['webhooks', 'get-webhook-event-catalog'],
        title: 'getWebhookEventCatalog()',
        description: 'Get one webhook event catalog by slug.',
        intro:
          'Returns one catalog object including its event definitions.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getWebhookEventCatalog(slug: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookEventCatalog(slug);
}`,
        signature: `function getWebhookEventCatalog(
  slug: string,
): Promise<WebhookEventCatalog>`,
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
        slug: 'create-webhook-event-catalog',
        path: ['webhooks', 'create-webhook-event-catalog'],
        title: 'createWebhookEventCatalog()',
        description: 'Create a webhook event catalog.',
        intro:
          'Creates a reusable event catalog that webhook apps can attach via `event_catalog_slug`.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createWebhookEventCatalog() {
  const client = await wachtClient();

  return client.webhooks.createWebhookEventCatalog({
    slug: 'default-events',
    name: 'Default Events',
    events: [{ name: 'user.created', description: 'Triggered when a user is created' }],
  });
}`,
        signature: `function createWebhookEventCatalog(
  request: CreateWebhookEventCatalogRequest,
): Promise<WebhookEventCatalog>`,
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
        slug: 'update-webhook-event-catalog',
        path: ['webhooks', 'update-webhook-event-catalog'],
        title: 'updateWebhookEventCatalog()',
        description: 'Update a webhook event catalog by slug.',
        intro:
          'Updates catalog metadata for an existing event catalog.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateWebhookEventCatalog(slug: string) {
  const client = await wachtClient();

  return client.webhooks.updateWebhookEventCatalog(slug, {
    name: 'Updated Catalog Name',
  });
}`,
        signature: `function updateWebhookEventCatalog(
  slug: string,
  request: UpdateWebhookEventCatalogRequest,
): Promise<WebhookEventCatalog>`,
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
        slug: 'list-webhook-endpoints',
        path: ['webhooks', 'list-webhook-endpoints'],
        title: 'listWebhookEndpoints()',
        description: 'List webhook endpoints for one webhook app.',
        intro:
          'Returns webhook endpoints for one app as a paginated response, including endpoint subscription records for each endpoint.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listWebhookEndpoints(appSlug: string) {
  const client = await wachtClient();

  return client.webhooks.listWebhookEndpoints(appSlug, {
    limit: 25,
    offset: 0,
    include_inactive: true,
  });
}`,
        signature: `function listWebhookEndpoints(
  appSlug: string,
  options?: {
    limit?: number;
    offset?: number;
    include_inactive?: boolean;
  },
): Promise<PaginatedResponse<WebhookEndpoint>>`,
        params: [
          {
            name: 'appSlug',
            type: 'string',
            description: 'Slug of the webhook app whose endpoints should be listed.',
          },
          {
            name: 'limit',
            type: 'number | undefined',
            description: 'Maximum number of endpoints to return for this page.',
          },
          {
            name: 'offset',
            type: 'number | undefined',
            description: 'Number of endpoints to skip before returning results.',
          },
          {
            name: 'include_inactive',
            type: 'boolean | undefined',
            description: 'When `true`, includes inactive endpoints in page results.',
          },
        ],
        api: [
          {
            name: 'data',
            type: 'WebhookEndpoint[]',
            description: 'Endpoints returned for the current page.',
            children: [
              { name: 'id', type: 'string', description: 'Stable endpoint identifier.' },
              { name: 'deployment_id', type: 'string', description: 'Deployment that owns the endpoint.' },
              { name: 'app_slug', type: 'string', description: 'App slug that owns the endpoint.' },
              { name: 'url', type: 'string', description: 'Destination URL for webhook deliveries.' },
              { name: 'description', type: 'string | null | undefined', description: 'Endpoint description when configured.' },
              { name: 'headers', type: 'Record<string, string> | null | undefined', description: 'Custom headers configured for delivery requests.' },
              { name: 'is_active', type: 'boolean', description: 'Whether the endpoint is active.' },
              { name: 'max_retries', type: 'number', description: 'Maximum retry attempts for failed deliveries.' },
              { name: 'timeout_seconds', type: 'number', description: 'Delivery timeout in seconds.' },
              { name: 'failure_count', type: 'number', description: 'Current failure counter for this endpoint.' },
              { name: 'last_failure_at', type: 'string | null | undefined', description: 'Timestamp of the latest failure when one exists.' },
              { name: 'auto_disabled', type: 'boolean', description: 'Whether endpoint auto-disable has been triggered.' },
              { name: 'auto_disabled_at', type: 'string | null | undefined', description: 'Timestamp of auto-disable when one exists.' },
              { name: 'rate_limit_config', type: 'RateLimitConfig | null | undefined', description: 'Optional per-endpoint rate limit configuration.' },
              {
                name: 'subscriptions',
                type: 'EventSubscription[]',
                description: 'Event subscriptions attached to the endpoint.',
                children: [
                  { name: 'event_name', type: 'string', description: 'Subscribed event name.' },
                  {
                    name: 'filter_rules',
                    type: 'Record<string, unknown> | null | undefined',
                    description: 'Optional filter rules for the event subscription.',
                    children: [
                      { name: 'changed', type: 'string[] | undefined', description: 'Example rule: only include specific changed fields.' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'has_more',
            type: 'boolean',
            description: 'Whether another page exists after this one.',
          },
          {
            name: 'limit',
            type: 'number | undefined',
            description: 'Effective page size reflected by backend response.',
          },
          {
            name: 'offset',
            type: 'number | undefined',
            description: 'Effective offset reflected by backend response.',
          },
        ],
        
        examples: [
          {
            title: 'List active endpoints',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listActiveEndpoints(appSlug: string) {
  const client = await wachtClient();
  return client.webhooks.listWebhookEndpoints(appSlug);
}`,
            lang: 'ts',
          },
          {
            title: 'Paginate endpoint list for an admin table',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listEndpointsPage(appSlug: string, page: number, pageSize = 20) {
  const client = await wachtClient();

  return client.webhooks.listWebhookEndpoints(appSlug, {
    limit: pageSize,
    offset: page * pageSize,
    include_inactive: true,
  });
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
        slug: 'create-webhook-endpoint',
        path: ['webhooks', 'create-webhook-endpoint'],
        title: 'createWebhookEndpoint()',
        description: 'Create a webhook endpoint under one webhook app.',
        intro:
          'Creates a webhook endpoint for one app slug. The SDK injects `app_slug` into the backend request payload from the method argument.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createWebhookEndpoint(appSlug: string) {
  const client = await wachtClient();

  return client.webhooks.createWebhookEndpoint(appSlug, {
    url: 'https://example.com/webhooks/wacht',
    subscriptions: [
      { event_name: 'user.created' },
      { event_name: 'user.updated' },
    ],
    max_retries: 5,
    timeout_seconds: 15,
  });
}`,
        signature: `function createWebhookEndpoint(
  appSlug: string,
  request: CreateWebhookEndpointRequest,
): Promise<WebhookEndpoint>`,
        paramsTitle: 'CreateWebhookEndpointRequest',
        params: [
          {
            name: 'appSlug',
            type: 'string',
            description: 'Slug of the webhook app that will own the endpoint.',
          },
          {
            name: 'url',
            type: 'string',
            description: 'Destination URL for webhook deliveries.',
          },
          {
            name: 'subscriptions',
            type: 'EventSubscription[]',
            description: 'Event subscription list for this endpoint.',
            children: [
              { name: 'event_name', type: 'string', description: 'Event name to subscribe this endpoint to.' },
              {
                name: 'filter_rules',
                type: 'Record<string, unknown> | null | undefined',
                description: 'Optional filtering rules evaluated before delivery.',
                children: [
                  { name: 'changed', type: 'string[] | undefined', description: 'Example rule: only deliver when specific fields changed.' },
                ],
              },
            ],
          },
          {
            name: 'headers',
            type: 'Record<string, string> | undefined',
            description: 'Optional static headers added to webhook delivery requests.',
            children: [
              { name: 'x-source', type: 'string | undefined', description: 'Example static header key/value sent with each delivery.' },
            ],
          },
          {
            name: 'description',
            type: 'string | undefined',
            description: 'Optional endpoint description.',
          },
          {
            name: 'max_retries',
            type: 'number | undefined',
            description: 'Optional retry limit override.',
          },
          {
            name: 'timeout_seconds',
            type: 'number | undefined',
            description: 'Optional request timeout override in seconds.',
          },
          {
            name: 'rate_limit_config',
            type: 'RateLimitConfig | null | undefined',
            description: 'Optional per-endpoint rate limit configuration.',
            children: [
              { name: 'enabled', type: 'boolean | undefined', description: 'Enable endpoint-level delivery throttling.' },
              { name: 'requests_per_minute', type: 'number | undefined', description: 'Maximum deliveries per minute for this endpoint.' },
            ],
          },
        ],
        
        examples: [
          {
            title: 'Create a basic endpoint',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createEndpoint(appSlug: string) {
  const client = await wachtClient();

  return client.webhooks.createWebhookEndpoint(appSlug, {
    url: 'https://example.com/webhooks/wacht',
    subscriptions: [{ event_name: 'user.created' }],
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Create endpoint with filters and custom headers',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createFilteredEndpoint(appSlug: string) {
  const client = await wachtClient();

  return client.webhooks.createWebhookEndpoint(appSlug, {
    url: 'https://example.com/webhooks/wacht-critical',
    headers: {
      'x-source': 'wacht',
    },
    subscriptions: [
      {
        event_name: 'user.updated',
        filter_rules: { changed: ['email'] },
      },
    ],
  });
}`,
            lang: 'ts',
          },
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
        slug: 'list-webhook-deliveries',
        path: ['webhooks', 'list-webhook-deliveries'],
        title: 'listWebhookDeliveries()',
        description: 'List webhook deliveries for one webhook app.',
        intro:
          'Returns delivery attempts for a webhook app as a paginated list of delivery records.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listWebhookDeliveries(appSlug: string) {
  const client = await wachtClient();

  return client.webhooks.listWebhookDeliveries(appSlug, {
    limit: 50,
    offset: 0,
    status: 'failed',
    event_name: 'user.created',
  });
}`,
        signature: `function listWebhookDeliveries(
  appSlug: string,
  options?: {
    limit?: number;
    offset?: number;
    endpoint_id?: number;
    event_name?: string;
    status?: string;
    since?: string;
    until?: string;
  },
): Promise<PaginatedResponse<WebhookDelivery>>`,
        params: [
          {
            name: 'appSlug',
            type: 'string',
            description: 'Webhook app slug to scope delivery results.',
          },
          {
            name: 'status',
            type: 'string | undefined',
            description: 'Optional delivery status filter (for example `failed`, `delivered`, `pending`).',
          },
          {
            name: 'event_name',
            type: 'string | undefined',
            description: 'Optional event name filter.',
          },
          {
            name: 'endpoint_id',
            type: 'number | undefined',
            description: 'Optional endpoint id filter.',
          },
          {
            name: 'limit',
            type: 'number | undefined',
            description: 'Maximum deliveries to return for this page.',
          },
          {
            name: 'offset',
            type: 'number | undefined',
            description: 'Number of deliveries to skip before returning results.',
          },
          {
            name: 'since',
            type: 'string | undefined',
            description: 'Optional lower timestamp bound (ISO-8601 string).',
          },
          {
            name: 'until',
            type: 'string | undefined',
            description: 'Optional upper timestamp bound (ISO-8601 string).',
          },
        ],
        api: [
          {
            name: 'data',
            type: 'WebhookDelivery[]',
            description: 'Delivery rows for the current page.',
            children: [
              { name: 'delivery_id', type: 'string', description: 'Stable delivery identifier.' },
              { name: 'deployment_id', type: 'string', description: 'Deployment identifier.' },
              { name: 'app_slug', type: 'string', description: 'Webhook app slug for this delivery.' },
              { name: 'endpoint_id', type: 'string', description: 'Endpoint identifier that handled the delivery.' },
              { name: 'event_name', type: 'string', description: 'Delivered event name.' },
              { name: 'status', type: 'string', description: 'Current delivery status.' },
              { name: 'http_status_code', type: 'number | null | undefined', description: 'HTTP response status code when one exists.' },
              { name: 'response_time_ms', type: 'number | null | undefined', description: 'Measured response time in milliseconds when available.' },
              { name: 'attempt_number', type: 'number', description: 'Current attempt number for this delivery.' },
              { name: 'max_attempts', type: 'number', description: 'Maximum allowed attempts for this delivery.' },
              { name: 'timestamp', type: 'string', description: 'Delivery timestamp.' },
            ],
          },
          {
            name: 'has_more',
            type: 'boolean',
            description: 'Whether another page exists after this one.',
          },
          {
            name: 'limit',
            type: 'number | undefined',
            description: 'Effective page size reflected by backend response.',
          },
          {
            name: 'offset',
            type: 'number | undefined',
            description: 'Effective offset reflected by backend response.',
          },
        ],
        
        examples: [
          {
            title: 'List recent failed deliveries',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listFailedDeliveries(appSlug: string) {
  const client = await wachtClient();

  return client.webhooks.listWebhookDeliveries(appSlug, {
    status: 'failed',
    limit: 25,
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Paginate deliveries in an admin screen',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listDeliveryPage(appSlug: string, page: number, pageSize = 50) {
  const client = await wachtClient();

  return client.webhooks.listWebhookDeliveries(appSlug, {
    limit: pageSize,
    offset: page * pageSize,
  });
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
        slug: 'get-webhook-delivery',
        path: ['webhooks', 'get-webhook-delivery'],
        title: 'getWebhookDelivery()',
        description: 'Load one webhook delivery record with detail fields.',
        intro:
          'Loads a single webhook delivery detail record by id, including payload and response metadata when available.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getWebhookDelivery(appSlug: string, deliveryId: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookDelivery(appSlug, deliveryId);
}`,
        signature: `function getWebhookDelivery(
  appSlug: string,
  deliveryId: string,
  options?: {
    status?: string;
  },
): Promise<WebhookDeliveryDetails>`,
        params: [
          {
            name: 'appSlug',
            type: 'string',
            description: 'Webhook app slug that owns the delivery.',
          },
          {
            name: 'deliveryId',
            type: 'string',
            description: 'Delivery identifier to fetch.',
          },
          {
            name: 'status',
            type: 'string | undefined',
            description: 'Optional status hint. Use `pending` to force lookup from pending-delivery storage.',
          },
        ],
        api: [
          {
            name: 'delivery_id',
            type: 'string',
            description: 'Stable delivery identifier.',
          },
          {
            name: 'deployment_id',
            type: 'string',
            description: 'Deployment identifier.',
          },
          {
            name: 'app_slug',
            type: 'string',
            description: 'Webhook app slug for this delivery.',
          },
          {
            name: 'endpoint_id',
            type: 'string',
            description: 'Endpoint identifier that processed the delivery.',
          },
          {
            name: 'event_name',
            type: 'string',
            description: 'Delivered event name.',
          },
          {
            name: 'status',
            type: 'string',
            description: 'Delivery status.',
          },
          {
            name: 'http_status_code',
            type: 'number | null | undefined',
            description: 'HTTP response status code when available.',
          },
          {
            name: 'response_time_ms',
            type: 'number | null | undefined',
            description: 'Measured response time when available.',
          },
          {
            name: 'attempt_number',
            type: 'number',
            description: 'Current attempt number.',
          },
          {
            name: 'max_attempts',
            type: 'number',
            description: 'Maximum allowed attempts.',
          },
          {
            name: 'payload',
            type: 'unknown | null | undefined',
            description: 'Delivered payload body when available.',
            children: [
              { name: 'id', type: 'string | undefined', description: 'Common payload identifier field when present.' },
              { name: 'event', type: 'string | undefined', description: 'Event-type marker field when present.' },
            ],
          },
          {
            name: 'response_body',
            type: 'string | null | undefined',
            description: 'Raw webhook response body when available.',
          },
          {
            name: 'response_headers',
            type: 'Record<string, unknown> | null | undefined',
            description: 'Response headers when available.',
            children: [
              { name: 'content-type', type: 'string | undefined', description: 'Destination response content type header when returned.' },
              { name: 'x-request-id', type: 'string | undefined', description: 'Destination request-trace header when returned.' },
            ],
          },
          {
            name: 'timestamp',
            type: 'string',
            description: 'Delivery timestamp.',
          },
        ],
        
        examples: [
          {
            title: 'Load one delivery detail',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function loadDelivery(appSlug: string, deliveryId: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookDelivery(appSlug, deliveryId);
}`,
            lang: 'ts',
          },
          {
            title: 'Inspect a pending delivery',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function loadPendingDelivery(appSlug: string, deliveryId: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookDelivery(appSlug, deliveryId, {
    status: 'pending',
  });
}`,
            lang: 'ts',
          },
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
        slug: 'replay-webhook-delivery',
        path: ['webhooks', 'replay-webhook-delivery'],
        title: 'replayWebhookDelivery()',
        description: 'Replay one webhook delivery for a webhook app.',
        intro:
          'Queues a replay task for one delivery id by calling the replay endpoint with a single-item `delivery_ids` payload.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function replayDelivery(appSlug: string, deliveryId: string) {
  const client = await wachtClient();
  return client.webhooks.replayWebhookDelivery(appSlug, deliveryId);
}`,
        signature: `function replayWebhookDelivery(
  appSlug: string,
  deliveryId: string,
  options?: {
    idempotency_key?: string;
  },
): Promise<ReplayWebhookDeliveryResponse>`,
        params: [
          {
            name: 'appSlug',
            type: 'string',
            description: 'Webhook app slug that owns the delivery.',
          },
          {
            name: 'deliveryId',
            type: 'string',
            description: 'Delivery id to replay.',
          },
          {
            name: 'idempotency_key',
            type: 'string | undefined',
            description: 'Optional idempotency key for replay de-duplication.',
          },
        ],
        api: [
          {
            name: 'status',
            type: 'string',
            description: 'Replay task state returned by backend (for example `queued`).',
          },
          {
            name: 'message',
            type: 'string',
            description: 'Human-readable replay status message.',
          },
          {
            name: 'task_id',
            type: 'string | null | undefined',
            description: 'Replay task id when one is created/resolved.',
          },
        ],
        
        examples: [
          {
            title: 'Replay one failed delivery',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function replayFailedDelivery(appSlug: string, deliveryId: string) {
  const client = await wachtClient();
  return client.webhooks.replayWebhookDelivery(appSlug, deliveryId);
}`,
            lang: 'ts',
          },
          {
            title: 'Replay with explicit idempotency key',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function replayWithIdempotency(appSlug: string, deliveryId: string) {
  const client = await wachtClient();
  return client.webhooks.replayWebhookDelivery(appSlug, deliveryId, {
    idempotency_key: 'replay-user-created-12345',
  });
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
        slug: 'get-webhook-analytics',
        path: ['webhooks', 'get-webhook-analytics'],
        title: 'getWebhookAnalytics()',
        description: 'Load aggregated webhook analytics for one app.',
        intro:
          'Returns aggregated delivery analytics for one webhook app, including totals, latency metrics, top events, endpoint performance, and failure reasons.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getWebhookAnalytics(appSlug: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookAnalytics(appSlug, {
    endpoint_id: 123,
    start_date: '2026-04-01T00:00:00Z',
    end_date: '2026-04-17T23:59:59Z',
  });
}`,
        signature: `function getWebhookAnalytics(
  appSlug: string,
  options?: {
    endpoint_id?: number;
    start_date?: string;
    end_date?: string;
  },
): Promise<WebhookAnalytics>`,
        params: [
          {
            name: 'appSlug',
            type: 'string',
            description: 'Webhook app slug to scope analytics.',
          },
          {
            name: 'endpoint_id',
            type: 'number | undefined',
            description: 'Optional endpoint id filter.',
          },
          {
            name: 'start_date',
            type: 'string | undefined',
            description: 'Optional analytics start timestamp (ISO-8601 string).',
          },
          {
            name: 'end_date',
            type: 'string | undefined',
            description: 'Optional analytics end timestamp (ISO-8601 string).',
          },
        ],
        api: [
          { name: 'total_events', type: 'number', description: 'Total event count in the selected range.' },
          { name: 'total_deliveries', type: 'number', description: 'Total delivery attempts in the selected range.' },
          { name: 'successful_deliveries', type: 'number', description: 'Count of successful deliveries.' },
          { name: 'failed_deliveries', type: 'number', description: 'Count of failed deliveries.' },
          { name: 'filtered_deliveries', type: 'number', description: 'Count of filtered deliveries.' },
          { name: 'avg_response_time_ms', type: 'number | null | undefined', description: 'Average response time in milliseconds.' },
          { name: 'p50_response_time_ms', type: 'number | null | undefined', description: 'P50 response time in milliseconds.' },
          { name: 'p95_response_time_ms', type: 'number | null | undefined', description: 'P95 response time in milliseconds.' },
          { name: 'p99_response_time_ms', type: 'number | null | undefined', description: 'P99 response time in milliseconds.' },
          { name: 'success_rate', type: 'number', description: 'Success rate percentage.' },
          { name: 'top_events', type: 'WebhookAnalyticsEventCount[]', description: 'Top events by volume.' },
          { name: 'endpoint_performance', type: 'WebhookAnalyticsEndpointPerformance[]', description: 'Per-endpoint performance rollups.' },
          { name: 'failure_reasons', type: 'WebhookAnalyticsFailureReason[]', description: 'Failure reason breakdown.' },
        ],
        
        examples: [
          {
            title: 'Read overall app analytics',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function loadAppAnalytics(appSlug: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookAnalytics(appSlug);
}`,
            lang: 'ts',
          },
          {
            title: 'Filter analytics to one endpoint',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function loadEndpointAnalytics(appSlug: string, endpointId: number) {
  const client = await wachtClient();
  return client.webhooks.getWebhookAnalytics(appSlug, {
    endpoint_id: endpointId,
  });
}`,
            lang: 'ts',
          },
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
        slug: 'get-webhook-stats',
        path: ['webhooks', 'get-webhook-stats'],
        title: 'getWebhookStats()',
        description: 'Load current webhook delivery stats for one app.',
        intro:
          'Returns a compact webhook stats summary for one app slug from the stats endpoint.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getWebhookStats(appSlug: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookStats(appSlug);
}`,
        signature: `function getWebhookStats(
  appSlug: string,
): Promise<WebhookStats>`,
        params: [
          {
            name: 'appSlug',
            type: 'string',
            description: 'Webhook app slug to scope stats.',
          },
        ],
        api: [
          {
            name: 'total_deliveries',
            type: 'number',
            description: 'Total delivery attempts tracked for the app.',
          },
          {
            name: 'success_rate',
            type: 'number',
            description: 'Current success rate percentage for the app.',
          },
          {
            name: 'active_endpoints',
            type: 'number',
            description: 'Number of currently active endpoints under the app.',
          },
          {
            name: 'failed_deliveries_24h',
            type: 'number',
            description: 'Failed deliveries counted in the last 24 hours.',
          },
        ],
        
        examples: [
          {
            title: 'Load app stats',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function loadWebhookStats(appSlug: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookStats(appSlug);
}`,
            lang: 'ts',
          },
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
        slug: 'get-webhook-timeseries',
        path: ['webhooks', 'get-webhook-timeseries'],
        title: 'getWebhookTimeseries()',
        description: 'Load webhook metrics timeseries for one app.',
        intro:
          'Returns a timeseries result object with `data` points and the resolved interval for one webhook app.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getWebhookTimeseries(appSlug: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookTimeseries(appSlug, {
    interval: 'hour',
    start_date: '2026-04-10T00:00:00Z',
    end_date: '2026-04-17T23:59:59Z',
  });
}`,
        signature: `function getWebhookTimeseries(
  appSlug: string,
  options?: {
    interval?: 'minute' | 'hour' | 'day' | 'week' | 'month';
    endpoint_id?: number;
    start_date?: string;
    end_date?: string;
  },
): Promise<WebhookTimeseriesResult>`,
        params: [
          {
            name: 'appSlug',
            type: 'string',
            description: 'Webhook app slug to scope timeseries.',
          },
          {
            name: 'interval',
            type: "'minute' | 'hour' | 'day' | 'week' | 'month' | undefined",
            description: 'Optional timeseries interval. Backend defaults to day when omitted.',
          },
          {
            name: 'endpoint_id',
            type: 'number | undefined',
            description: 'Optional endpoint id filter.',
          },
          {
            name: 'start_date',
            type: 'string | undefined',
            description: 'Optional timeseries start timestamp (ISO-8601 string).',
          },
          {
            name: 'end_date',
            type: 'string | undefined',
            description: 'Optional timeseries end timestamp (ISO-8601 string).',
          },
        ],
        api: [
          {
            name: 'data',
            type: 'WebhookTimeseriesData[]',
            description: 'Timeseries metric points for the selected range.',
            children: [
              { name: 'timestamp', type: 'string', description: 'Bucket timestamp.' },
              { name: 'total_events', type: 'number', description: 'Total events in the bucket.' },
              { name: 'total_deliveries', type: 'number', description: 'Total deliveries in the bucket.' },
              { name: 'successful_deliveries', type: 'number', description: 'Successful deliveries in the bucket.' },
              { name: 'failed_deliveries', type: 'number', description: 'Failed deliveries in the bucket.' },
              { name: 'filtered_deliveries', type: 'number', description: 'Filtered deliveries in the bucket.' },
              { name: 'avg_response_time_ms', type: 'number | null | undefined', description: 'Average response time for the bucket.' },
              { name: 'success_rate', type: 'number', description: 'Success rate percentage for the bucket.' },
            ],
          },
          {
            name: 'interval',
            type: 'string',
            description: 'Resolved interval returned by backend.',
          },
        ],
        
        examples: [
          {
            title: 'Load default timeseries',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function loadTimeseries(appSlug: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookTimeseries(appSlug);
}`,
            lang: 'ts',
          },
          {
            title: 'Load hourly timeseries for one endpoint',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function loadEndpointTimeseries(appSlug: string, endpointId: number) {
  const client = await wachtClient();
  return client.webhooks.getWebhookTimeseries(appSlug, {
    interval: 'hour',
    endpoint_id: endpointId,
  });
}`,
            lang: 'ts',
          },
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
];
