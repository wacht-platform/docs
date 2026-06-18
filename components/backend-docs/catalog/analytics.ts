import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const analyticsBackendDocs: BackendDoc[] = [
  {
    slug: 'get-token-usage',
    path: ['analytics', 'get-token-usage'],
    title: 'getTokenUsage()',
    description: 'Get token-usage time series for the deployment.',
    intro: 'Returns token-usage buckets for the requested time window and granularity.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getTokenUsage() {
  const client = await wachtClient();
  return client.analytics.getTokenUsage({
    from: '2026-04-01T00:00:00Z',
    to: '2026-04-18T23:59:59Z',
    granularity: 'day',
  });
}`,
    signature: `function getTokenUsage(
  options: AnalyticsUsageOptions,
): Promise<TokenUsageResponse>`,
    paramsTitle: 'AnalyticsUsageOptions',
    params: [
      { name: 'from', type: 'string', description: 'Window start timestamp (ISO-8601).' },
      { name: 'to', type: 'string', description: 'Window end timestamp (ISO-8601).' },
      { name: 'granularity', type: 'string | undefined', description: 'Bucket size: `minute` (default), `hour`, or `day`.' },
      { name: 'tz', type: 'string | undefined', description: 'IANA timezone for bucket boundaries. Defaults to UTC.' },
    ],
    api: [
      {
        name: 'buckets',
        type: 'TokenUsageBucket[]',
        description: 'Token-usage buckets for the requested window.',
        children: [
          { name: 'bucket', type: 'string', description: 'Bucket start timestamp.' },
          { name: 'input_tokens', type: 'number', description: 'Input token count for the bucket.' },
          { name: 'cached_tokens', type: 'number', description: 'Cached token count for the bucket.' },
          { name: 'output_tokens', type: 'number', description: 'Output token count for the bucket.' },
          { name: 'total_tokens', type: 'number', description: 'Total token count for the bucket.' },
          { name: 'request_count', type: 'number', description: 'Request count for the bucket.' },
        ],
      },
    ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Returns a time-series breakdown for the requested window.',
          'Use `granularity` and `tz` to control bucket size and boundaries.',
        ],
      },
    ],
  },
  {
    slug: 'get-token-usage-by-model',
    path: ['analytics', 'get-token-usage-by-model'],
    title: 'getTokenUsageByModel()',
    description: 'Get token usage aggregated per model.',
    intro: 'Returns token-usage totals grouped by model for the requested time window.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getTokenUsageByModel() {
  const client = await wachtClient();
  return client.analytics.getTokenUsageByModel({
    from: '2026-04-01T00:00:00Z',
    to: '2026-04-18T23:59:59Z',
  });
}`,
    signature: `function getTokenUsageByModel(
  options: AnalyticsUsageOptions,
): Promise<TokenUsageByModelResponse>`,
    paramsTitle: 'AnalyticsUsageOptions',
    params: [
      { name: 'from', type: 'string', description: 'Window start timestamp (ISO-8601).' },
      { name: 'to', type: 'string', description: 'Window end timestamp (ISO-8601).' },
      { name: 'granularity', type: 'string | undefined', description: 'Bucket size: `minute` (default), `hour`, or `day`.' },
      { name: 'tz', type: 'string | undefined', description: 'IANA timezone for bucket boundaries. Defaults to UTC.' },
    ],
    api: [
      {
        name: 'models',
        type: 'TokenUsageByModel[]',
        description: 'Per-model token-usage totals for the requested window.',
        children: [
          { name: 'model', type: 'string', description: 'Model identifier.' },
          { name: 'input_tokens', type: 'number', description: 'Input token count for the model.' },
          { name: 'cached_tokens', type: 'number', description: 'Cached token count for the model.' },
          { name: 'output_tokens', type: 'number', description: 'Output token count for the model.' },
          { name: 'total_tokens', type: 'number', description: 'Total token count for the model.' },
          { name: 'request_count', type: 'number', description: 'Request count for the model.' },
        ],
      },
    ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Returns usage totals grouped by model for the requested window.',
          'Use this to attribute token spend across models.',
        ],
      },
    ],
  },
  {
    slug: 'get-webhook-usage',
    path: ['analytics', 'get-webhook-usage'],
    title: 'getWebhookUsage()',
    description: 'Get webhook-delivery usage time series for the deployment.',
    intro: 'Returns webhook-delivery buckets for the requested time window and granularity.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getWebhookUsage() {
  const client = await wachtClient();
  return client.analytics.getWebhookUsage({
    from: '2026-04-01T00:00:00Z',
    to: '2026-04-18T23:59:59Z',
    granularity: 'hour',
  });
}`,
    signature: `function getWebhookUsage(
  options: AnalyticsUsageOptions,
): Promise<WebhookUsageResponse>`,
    paramsTitle: 'AnalyticsUsageOptions',
    params: [
      { name: 'from', type: 'string', description: 'Window start timestamp (ISO-8601).' },
      { name: 'to', type: 'string', description: 'Window end timestamp (ISO-8601).' },
      { name: 'granularity', type: 'string | undefined', description: 'Bucket size: `minute` (default), `hour`, or `day`.' },
      { name: 'tz', type: 'string | undefined', description: 'IANA timezone for bucket boundaries. Defaults to UTC.' },
    ],
    api: [
      {
        name: 'buckets',
        type: 'WebhookUsageBucket[]',
        description: 'Webhook-delivery buckets for the requested window.',
        children: [
          { name: 'bucket', type: 'string', description: 'Bucket start timestamp.' },
          { name: 'total_deliveries', type: 'number', description: 'Total deliveries in the bucket.' },
          { name: 'successful_deliveries', type: 'number', description: 'Successful deliveries in the bucket.' },
          { name: 'failed_deliveries', type: 'number', description: 'Failed deliveries in the bucket.' },
          { name: 'filtered_deliveries', type: 'number', description: 'Filtered deliveries in the bucket.' },
          { name: 'success_rate', type: 'number', description: 'Delivery success rate for the bucket.' },
        ],
      },
    ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Returns a delivery time-series breakdown for the requested window.',
          'Use `granularity` and `tz` to control bucket size and boundaries.',
        ],
      },
    ],
  },
  {
    slug: 'get-gateway-usage',
    path: ['analytics', 'get-gateway-usage'],
    title: 'getGatewayUsage()',
    description: 'Get gateway-authorization usage time series for the deployment.',
    intro: 'Returns gateway-authorization buckets for the requested time window and granularity.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getGatewayUsage() {
  const client = await wachtClient();
  return client.analytics.getGatewayUsage({
    from: '2026-04-01T00:00:00Z',
    to: '2026-04-18T23:59:59Z',
    granularity: 'hour',
  });
}`,
    signature: `function getGatewayUsage(
  options: AnalyticsUsageOptions,
): Promise<GatewayUsageResponse>`,
    paramsTitle: 'AnalyticsUsageOptions',
    params: [
      { name: 'from', type: 'string', description: 'Window start timestamp (ISO-8601).' },
      { name: 'to', type: 'string', description: 'Window end timestamp (ISO-8601).' },
      { name: 'granularity', type: 'string | undefined', description: 'Bucket size: `minute` (default), `hour`, or `day`.' },
      { name: 'tz', type: 'string | undefined', description: 'IANA timezone for bucket boundaries. Defaults to UTC.' },
    ],
    api: [
      {
        name: 'buckets',
        type: 'GatewayUsageBucket[]',
        description: 'Gateway-authorization buckets for the requested window.',
        children: [
          { name: 'bucket', type: 'string', description: 'Bucket start timestamp.' },
          { name: 'total_requests', type: 'number', description: 'Total authorization requests in the bucket.' },
          { name: 'allowed_requests', type: 'number', description: 'Allowed authorization requests in the bucket.' },
          { name: 'blocked_requests', type: 'number', description: 'Blocked authorization requests in the bucket.' },
        ],
      },
    ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Returns an authorization time-series breakdown for the requested window.',
          'Use `granularity` and `tz` to control bucket size and boundaries.',
        ],
      },
    ],
  },
];
