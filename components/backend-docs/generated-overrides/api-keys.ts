import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const apiKeysGeneratedDocOverrides: Record<string, Partial<BackendDoc>> = {
  getApiAuthApp: {
    description: 'Get one API auth app by slug.',
    intro: 'Loads app metadata, permission/resource scope, and rate-limit bindings for one app slug.',
    signature: `function getApiAuthApp(appSlug: string): Promise<ApiAuthApp>`,
    params: [{ name: 'appSlug', type: 'string', description: 'API auth app slug.' }],
    api: [
      { name: 'app_slug', type: 'string', description: 'App slug identifier.' },
      { name: 'name', type: 'string', description: 'App display name.' },
      { name: 'is_active', type: 'boolean', description: 'Whether app is active.' },
      { name: 'permissions', type: 'string[]', description: 'Bound permission names.' },
      { name: 'resources', type: 'string[]', description: 'Bound resource patterns.' },
      { name: 'rate_limits', type: 'RateLimit[]', description: 'Resolved rate-limit rules.' },
    ],
  },
  updateApiAuthApp: {
    description: 'Update one API auth app.',
    intro: 'Patches app configuration for one app slug.',
    signature: `function updateApiAuthApp(
  appSlug: string,
  request: UpdateApiAuthAppRequest,
): Promise<ApiAuthApp>`,
    paramsTitle: 'UpdateApiAuthAppRequest',
    params: [
      { name: 'appSlug', type: 'string', description: 'API auth app slug.' },
      { name: 'name', type: 'string | undefined', description: 'Updated display name.' },
      { name: 'description', type: 'string | undefined', description: 'Updated description.' },
      { name: 'is_active', type: 'boolean | undefined', description: 'Enable or disable the app.' },
      { name: 'rate_limit_scheme_slug', type: 'string | undefined', description: 'Attach or change rate-limit scheme.' },
      { name: 'permissions', type: 'string[] | undefined', description: 'Updated permission scope.' },
      { name: 'resources', type: 'string[] | undefined', description: 'Updated resource scope.' },
    ],
  },
  deleteApiAuthApp: {
    description: 'Delete one API auth app.',
    intro: 'Removes an API auth app and invalidates future key usage for that app scope.',
    signature: `function deleteApiAuthApp(
  appName: string,
): Promise<void>`,
    params: [{ name: 'appName', type: 'string', description: 'API auth app slug to delete.' }],
  },
  getApiAuditLogs: {
    description: 'List API auth audit logs for one app.',
    intro: 'Returns audit logs with filtering and cursor options.',
    signature: `function getApiAuditLogs(
  appSlug: string,
  options?: ListApiAuditLogsOptions,
): Promise<ApiAuditLogsResponse>`,
    paramsTitle: 'ListApiAuditLogsOptions',
    params: [
      { name: 'appSlug', type: 'string', description: 'API auth app slug.' },
      { name: 'options.limit', type: 'number | undefined', description: 'Maximum records in one page.' },
      { name: 'options.offset', type: 'number | undefined', description: 'Offset-based pagination value.' },
      { name: 'options.outcome', type: 'string | undefined', description: 'Outcome filter (for example allowed/blocked).' },
      { name: 'options.key_id', type: 'string | number | undefined', description: 'Filter by key id.' },
      { name: 'options.start_date', type: 'string | undefined', description: 'Inclusive start timestamp.' },
      { name: 'options.end_date', type: 'string | undefined', description: 'Inclusive end timestamp.' },
      { name: 'options.cursor', type: 'string | undefined', description: 'Cursor token for keyset pagination.' },
    ],
    api: [
      { name: 'data', type: 'ApiAuditLog[]', description: 'Audit events for this page.' },
      { name: 'limit', type: 'number', description: 'Effective page size.' },
      { name: 'has_more', type: 'boolean', description: 'Whether more rows are available.' },
      { name: 'next_cursor', type: 'string | undefined', description: 'Cursor for the next page.' },
    ],
  },
  getApiAuditAnalytics: {
    description: 'Get aggregate API auth audit analytics for one app.',
    intro: 'Loads aggregate audit counts and optional top lists.',
    signature: `function getApiAuditAnalytics(
  appSlug: string,
  options?: GetApiAuditAnalyticsOptions,
): Promise<ApiAuditAnalyticsResponse>`,
    paramsTitle: 'GetApiAuditAnalyticsOptions',
    params: [
      { name: 'appSlug', type: 'string', description: 'API auth app slug.' },
      { name: 'options.start_date', type: 'string | undefined', description: 'Start timestamp.' },
      { name: 'options.end_date', type: 'string | undefined', description: 'End timestamp.' },
      { name: 'options.key_id', type: 'string | number | undefined', description: 'Filter analytics to one key.' },
      { name: 'options.include_top_keys', type: 'boolean | undefined', description: 'Include top key rollup.' },
      { name: 'options.include_top_paths', type: 'boolean | undefined', description: 'Include top path rollup.' },
      { name: 'options.include_blocked_reasons', type: 'boolean | undefined', description: 'Include blocked reason rollup.' },
      { name: 'options.include_rate_limits', type: 'boolean | undefined', description: 'Include rate-limit breakdown.' },
      { name: 'options.top_limit', type: 'number | undefined', description: 'Maximum size for top lists.' },
    ],
  },
  getApiAuditTimeseries: {
    description: 'Get API auth audit timeseries for one app.',
    intro: 'Loads interval-bucketed audit metrics for one app.',
    signature: `function getApiAuditTimeseries(
  appSlug: string,
  options?: GetApiAuditTimeseriesOptions,
): Promise<ApiAuditTimeseriesResponse>`,
    paramsTitle: 'GetApiAuditTimeseriesOptions',
    params: [
      { name: 'appSlug', type: 'string', description: 'API auth app slug.' },
      { name: 'options.start_date', type: 'string | undefined', description: 'Start timestamp.' },
      { name: 'options.end_date', type: 'string | undefined', description: 'End timestamp.' },
      { name: 'options.interval', type: 'string | undefined', description: 'Requested bucket interval.' },
      { name: 'options.key_id', type: 'string | number | undefined', description: 'Optional key filter.' },
    ],
    api: [
      { name: 'data', type: 'ApiAuditTimeseriesPoint[]', description: 'Timeseries points for each bucket.' },
      { name: 'interval', type: 'string', description: 'Resolved interval returned by backend.' },
    ],
  },
};
