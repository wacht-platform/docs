import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const webhooksGeneratedDocOverrides: Record<string, Partial<BackendDoc>> = {
  createWebhookEventCatalog: {
    description: 'Create a reusable webhook event catalog.',
    intro:
      'Creates an event catalog that webhook apps can reference through `event_catalog_slug` for endpoint subscription validation and event discovery.',
    signature: `function createWebhookEventCatalog(
  request: CreateWebhookEventCatalogRequest,
): Promise<WebhookEventCatalog>`,
    paramsTitle: 'CreateWebhookEventCatalogRequest',
    params: [
      { name: 'slug', type: 'string', required: true, description: 'Stable catalog slug used in app binding.' },
      { name: 'name', type: 'string', required: true, description: 'Human-readable catalog name.' },
      { name: 'description', type: 'string', required: false, description: 'Optional catalog description.' },
      {
        name: 'events',
        type: 'WebhookEventDefinition[]',
        required: true,
        description: 'Event definitions included in this catalog.',
        children: [
          { name: 'name', type: 'string', required: true, description: 'Stable event key (for example `user.created`).' },
          { name: 'description', type: 'string', required: true, description: 'Human-readable event description.' },
          { name: 'group', type: 'string', required: false, description: 'Optional grouping label used in event pickers.' },
          { name: 'schema', type: 'Record<string, unknown> | null', required: false, description: 'Optional JSON schema for payload validation.' },
          { name: 'example_payload', type: 'Record<string, unknown> | null', required: false, description: 'Optional representative event payload.' },
          { name: 'is_archived', type: 'boolean', required: false, description: 'Initial archived state for this event definition.' },
        ],
      },
    ],
    api: [
      { name: 'deployment_id', type: 'string', description: 'Deployment that owns this catalog.' },
      { name: 'slug', type: 'string', description: 'Catalog slug.' },
      { name: 'name', type: 'string', description: 'Catalog name.' },
      { name: 'description', type: 'string', description: 'Catalog description when provided.' },
      {
        name: 'events',
        type: 'WebhookEventDefinition[]',
        description: 'Resolved event definitions for this catalog.',
        children: [
          { name: 'name', type: 'string', description: 'Event key.' },
          { name: 'description', type: 'string', description: 'Event description.' },
          { name: 'group', type: 'string', description: 'Grouping label when configured.' },
          { name: 'schema', type: 'Record<string, unknown> | null', description: 'Event payload schema when configured.' },
          { name: 'example_payload', type: 'Record<string, unknown> | null', description: 'Example payload when configured.' },
          { name: 'is_archived', type: 'boolean', description: 'Archive state for this event definition.' },
        ],
      },
      { name: 'created_at', type: 'string', description: 'Catalog creation timestamp.' },
      { name: 'updated_at', type: 'string', description: 'Catalog update timestamp.' },
    ],
    examples: [
      {
        title: 'Create a catalog with multiple event definitions',
        code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createCatalog() {
  const client = await wachtClient();

  return client.webhooks.createWebhookEventCatalog({
    slug: 'default-events',
    name: 'Default Events',
    description: 'Core user and organization lifecycle events',
    events: [
      {
        name: 'user.created',
        description: 'Triggered when a user is created',
      },
      {
        name: 'organization.member_added',
        description: 'Triggered when an organization member is added',
      },
    ],
  });
}`,
        lang: 'ts',
      },
    ],
  },
  getWebhookApp: {
    description: 'Get one webhook app by slug.',
    intro: 'Loads webhook app metadata for one app slug.',
    signature: `function getWebhookApp(appSlug: string): Promise<WebhookApp>`,
    params: [{ name: 'appSlug', type: 'string', description: 'Webhook app slug.' }],
    
    examples: [
      {
        title: 'Load app configuration before endpoint changes',
        code: `import { wachtClient } from '@wacht/nextjs/server';

export async function loadAppConfig(appSlug: string) {
  const client = await wachtClient();
  return client.webhooks.getWebhookApp(appSlug);
}`,
        lang: 'ts',
      },
    ],
  },
  updateWebhookApp: {
    description: 'Update one webhook app.',
    intro: 'Patches webhook app metadata for one app slug.',
    signature: `function updateWebhookApp(
  appSlug: string,
  request: UpdateWebhookAppRequest,
): Promise<WebhookApp>`,
    paramsTitle: 'UpdateWebhookAppRequest',
    params: [
      { name: 'appSlug', type: 'string', description: 'Webhook app slug.' },
      { name: 'name', type: 'string | undefined', description: 'Updated app name.' },
      { name: 'description', type: 'string | undefined', description: 'Updated app description.' },
      { name: 'is_active', type: 'boolean | undefined', description: 'Enable or disable the app.' },
      { name: 'failure_notification_emails', type: 'string[] | undefined', description: 'Failure notification email addresses.' },
      { name: 'event_catalog_slug', type: 'string | undefined', description: 'Bound event catalog slug.' },
    ],
    
  },
  deleteWebhookApp: {
    description: 'Delete one webhook app.',
    intro: 'Deletes a webhook app container and associated app-level configuration.',
    signature: `function deleteWebhookApp(appSlug: string): Promise<void>`,
    params: [{ name: 'appSlug', type: 'string', description: 'Webhook app slug to delete.' }],
    
  },
  appendWebhookEventCatalogEvents: {
    description: 'Append events to a webhook event catalog.',
    intro: 'Adds one or more event definitions to an existing webhook event catalog.',
    
    examples: [
      {
        title: 'Append one custom event to a catalog',
        code: `import { wachtClient } from '@wacht/nextjs/server';

export async function appendCatalogEvent(slug: string) {
  const client = await wachtClient();
  return client.webhooks.appendWebhookEventCatalogEvents(slug, {
    events: [
      {
        name: 'invoice.created',
        description: 'Triggered when an invoice is created',
      },
    ],
  });
}`,
        lang: 'ts',
      },
    ],
  },
  archiveWebhookEventInCatalog: {
    description: 'Archive or unarchive one event in a webhook catalog.',
    intro: 'Toggles archived state for a named event inside a webhook event catalog.',
    
  },
  getWebhookCatalog: {
    description: 'Get the resolved webhook event catalog for an app.',
    intro: 'Returns the catalog currently bound to one webhook app.',
    signature: `function getWebhookCatalog(appSlug: string): Promise<WebhookEventCatalog>`,
    params: [{ name: 'appSlug', type: 'string', description: 'Webhook app slug.' }],
    
  },
  listWebhookEvents: {
    description: 'List webhook events exposed by one app.',
    intro: 'Returns event definitions currently available to one webhook app.',
    signature: `function listWebhookEvents(appSlug: string): Promise<WebhookAppEvent[]>`,
    params: [{ name: 'appSlug', type: 'string', description: 'Webhook app slug.' }],
    api: [
      { name: 'deployment_id', type: 'string', description: 'Owning deployment id.' },
      { name: 'app_slug', type: 'string', description: 'Webhook app slug.' },
      { name: 'event_name', type: 'string', description: 'Event identifier.' },
      { name: 'description', type: 'string | null | undefined', description: 'Event description when provided.' },
    ],
    
  },
  listWebhookReplayTasks: {
    description: 'List webhook replay tasks for one app.',
    intro: 'Reads replay task history for one webhook app.',
    signature: `function listWebhookReplayTasks(
  appSlug: string,
  options?: { limit?: number; offset?: number },
): Promise<ReplayTaskListResponse>`,
    paramsTitle: 'List options',
    params: [
      { name: 'appSlug', type: 'string', description: 'Webhook app slug.' },
      { name: 'options.limit', type: 'number | undefined', description: 'Maximum tasks per page.' },
      { name: 'options.offset', type: 'number | undefined', description: 'Result offset.' },
    ],
    api: [
      { name: 'data', type: 'ReplayTaskStatus[]', description: 'Replay tasks for this page.' },
      { name: 'has_more', type: 'boolean', description: 'Whether more replay tasks are available.' },
    ],
    
  },
  getWebhookReplayTaskStatus: {
    description: 'Get status for one replay task.',
    intro: 'Loads state for one replay task in a webhook app.',
    signature: `function getWebhookReplayTaskStatus(
  appSlug: string,
  taskId: string,
): Promise<ReplayTaskStatus>`,
    params: [
      { name: 'appSlug', type: 'string', description: 'Webhook app slug.' },
      { name: 'taskId', type: 'string', description: 'Replay task id.' },
    ],
    
  },
  cancelWebhookReplayTask: {
    description: 'Cancel an in-progress replay task.',
    intro: 'Requests cancellation for one in-progress replay task.',
    signature: `function cancelWebhookReplayTask(
  appSlug: string,
  taskId: string,
): Promise<ReplayTaskCancelResponse>`,
    params: [
      { name: 'appSlug', type: 'string', description: 'Webhook app slug.' },
      { name: 'taskId', type: 'string', description: 'Replay task id.' },
    ],
    api: [
      { name: 'status', type: 'string', description: 'Cancellation status.' },
      { name: 'message', type: 'string', description: 'Backend status message.' },
    ],
    
  },
  triggerWebhook: {
    description: 'Manually trigger a webhook event.',
    intro: 'Dispatches a manual event payload for one webhook app.',
    signature: `function triggerWebhook(
  appSlug: string,
  request: TriggerWebhookRequest,
): Promise<TriggerWebhookResponse>`,
    paramsTitle: 'TriggerWebhookRequest',
    params: [
      { name: 'appSlug', type: 'string', description: 'Webhook app slug.' },
      { name: 'event_name', type: 'string', description: 'Event name to dispatch.' },
      {
        name: 'payload',
        type: 'Record<string, unknown>',
        description: 'Event payload object.',
        children: [
          { name: 'id', type: 'string | undefined', description: 'Event entity identifier.' },
          { name: 'amount', type: 'number | undefined', description: 'Example numeric payload field.' },
        ],
      },
      {
        name: 'filter_context',
        type: 'Record<string, unknown> | undefined',
        description: 'Optional routing/filter context.',
        children: [
          { name: 'environment', type: 'string | undefined', description: 'Environment label used by routing filters.' },
        ],
      },
    ],
    api: [
      { name: 'delivery_ids', type: 'number[]', description: 'Created delivery ids.' },
      { name: 'filtered_count', type: 'number', description: 'Count filtered out before delivery.' },
      { name: 'delivered_count', type: 'number', description: 'Count accepted for delivery.' },
    ],
    
    examples: [
      {
        title: 'Trigger a synthetic event for endpoint validation',
        code: `import { wachtClient } from '@wacht/nextjs/server';

export async function triggerSyntheticEvent(appSlug: string) {
  const client = await wachtClient();
  return client.webhooks.triggerWebhook(appSlug, {
    event_name: 'invoice.created',
    payload: { id: 'inv_123', amount: 1499 },
    filter_context: { environment: 'staging' },
  });
}`,
        lang: 'ts',
      },
    ],
  },
  rotateWebhookSecret: {
    description: 'Rotate webhook app signing secret.',
    intro: 'Generates a fresh signing secret for webhook signature validation.',
    
  },
  testWebhookEndpoint: {
    description: 'Test delivery for one webhook endpoint.',
    intro: 'Runs a test delivery against one webhook endpoint and returns probe results.',
    signature: `function testWebhookEndpoint(
  appSlug: string,
  endpointId: string,
  request: TestWebhookEndpointRequest,
): Promise<TestWebhookEndpointResponse>`,
    paramsTitle: 'TestWebhookEndpointRequest',
    params: [
      { name: 'appSlug', type: 'string', description: 'Webhook app slug.' },
      { name: 'endpointId', type: 'string', description: 'Webhook endpoint id.' },
      { name: 'event_name', type: 'string', description: 'Event name used for the test dispatch.' },
      {
        name: 'payload',
        type: 'Record<string, unknown> | undefined',
        description: 'Optional test payload.',
        children: [
          { name: 'id', type: 'string | undefined', description: 'Event entity identifier used during test dispatch.' },
        ],
      },
    ],
    
  },
  updateWebhookEndpoint: {
    description: 'Update one webhook endpoint.',
    intro: 'Patches endpoint URL, headers, subscriptions, and delivery retry controls.',
    
  },
  deleteWebhookEndpoint: {
    description: 'Delete one webhook endpoint.',
    intro: 'Deletes an endpoint from a webhook app.',
    
  },
  reactivateWebhookEndpoint: {
    description: 'Reactivate an auto-disabled webhook endpoint.',
    intro: 'Reactivates one endpoint that was disabled by backend safety controls.',
    signature: `function reactivateWebhookEndpoint(
  endpointId: string,
): Promise<ReactivateWebhookEndpointResponse>`,
    params: [{ name: 'endpointId', type: 'string', description: 'Webhook endpoint id.' }],
    api: [
      { name: 'success', type: 'boolean', description: 'Whether reactivation succeeded.' },
      { name: 'message', type: 'string', description: 'Backend status message.' },
    ],
    
  },
};
