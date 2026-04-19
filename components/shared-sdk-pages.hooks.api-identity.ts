import type { SharedGroup } from './shared-sdk-pages.types';

export const apiIdentityHookGroup: SharedGroup = {
  label: 'API Identity',
  docs: [
    {
      slug: 'use-api-auth-app-session',
      title: 'useApiAuthAppSession',
      description: 'Read the current API identity app session.',
      importName: 'useApiAuthAppSession',
      intro:
        '`useApiAuthAppSession()` is the entry hook for the API identity surface. It exchanges an optional ticket, loads the current API auth app session, and returns the app metadata that the vanity API auth provider uses to gate the overview, keys, and access-log pages.',
      example: `import { useApiAuthAppSession } from '@wacht/nextjs';

export default function ApiIdentityShell({
  ticket,
}: {
  ticket?: string | null;
}) {
  const {
    hasSession,
    sessionLoading,
    apiAuthApp,
  } = useApiAuthAppSession(ticket);

  if (sessionLoading) {
    return <div>Loading API identity...</div>;
  }

  if (!hasSession) {
    return <div>Access required</div>;
  }

  return (
    <div>
      <h1>{apiAuthApp?.name}</h1>
      <p>{apiAuthApp?.key_prefix}</p>
    </div>
  );
}`,
      points: [],
      signature: `declare function useApiAuthAppSession(ticket?: string | null): {
  hasSession: boolean;
  sessionLoading: boolean;
  sessionError: Error | null;
  sessionId: string | null;
  apiAuthApp: ApiAuthAppInfo | null;
  ticketExchanged: boolean;
  ticketLoading: boolean;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'The hook is intentionally small. It is the top-level API identity session hook, not the hook that manages keys or audit data directly. Its job is to tell the surrounding UI whether an API identity session exists and, if it does, expose the current API auth app metadata.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useApiAuthAppSession()` at the top of an API identity area, where you need to gate access to the product and expose the current app metadata to the pages underneath it. It is the hook you use when you are building your own API identity console or other personalized API management experience.',
            'That keeps the deeper hooks focused on the actual data surfaces such as keys, logs, analytics, and timeseries. If your app has a dedicated API identity console, this hook should usually live in the top-level provider for that console rather than inside a single page.',
          ],
        },
        {
          title: 'Integration pattern',
          paragraphs: [
            'A common pattern is to call `useApiAuthAppSession(ticket)` once at the layout boundary and remove the `ticket` query param after the exchange succeeds. The overview, keys, and access-log pages can then all depend on your own provider rather than doing their own session bootstrapping.',
          ],
        },
      ],
      api: [
        { name: 'ticket', type: 'string | null | undefined', description: 'Optional session ticket for the API identity surface.' },
        { name: 'hasSession', type: 'boolean', description: 'Whether the current user has a valid API identity session.' },
        { name: 'sessionLoading', type: 'boolean', description: 'True while the ticket exchange or the session fetch is still running.' },
        { name: 'sessionError', type: 'Error | null', description: 'Transport or exchange failure. A missing session is not surfaced as an error here.' },
        { name: 'sessionId', type: 'string | null', description: 'Current API identity session identifier.' },
        {
          name: 'apiAuthApp',
          type: 'ApiAuthAppInfo | null',
          description: 'Current API identity app metadata.',
          children: [
            { name: 'id', type: 'string', description: 'App identifier.' },
            { name: 'app_slug', type: 'string', description: 'App slug.' },
            { name: 'name', type: 'string', description: 'App name.' },
            { name: 'key_prefix', type: 'string', description: 'Prefix used when rendering API keys for this app.' },
            { name: 'description', type: 'string | undefined', description: 'Optional app description.' },
            { name: 'is_active', type: 'boolean', description: 'Whether the app is active.' },
            {
              name: 'rate_limits',
              type: 'RateLimit[]',
              description: 'Configured app-level rate limits.',
              children: [
                { name: 'unit', type: "'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'calendar_day' | 'month' | 'calendar_month'", description: 'Rate-limit time unit.' },
                { name: 'duration', type: 'number', description: 'Duration value for the limit window.' },
                { name: 'max_requests', type: 'number', description: 'Maximum requests allowed in that window.' },
                { name: 'mode', type: "'per_app' | 'per_key' | 'per_key_and_ip' | 'per_app_and_ip' | undefined", description: 'Scope of the rate limit.' },
              ],
            },
          ],
        },
        { name: 'ticketExchanged', type: 'boolean', description: 'Whether the supplied ticket has already been exchanged successfully.' },
        { name: 'ticketLoading', type: 'boolean', description: 'Whether the ticket exchange is still in progress.' },
        { name: 'refetch', type: '() => Promise<void>', description: 'Revalidates the current API identity session.' },
      ],
    },
    {
      slug: 'use-api-auth-keys',
      title: 'useApiAuthKeys',
      description: 'List, create, rotate, and revoke API keys.',
      importName: 'useApiAuthKeys',
      intro:
        '`useApiAuthKeys()` is the main key-management hook for the API identity surface. It lists keys for the current app, lets you filter by status, and exposes the three lifecycle mutations that the vanity keys page uses directly: create, rotate, and revoke.',
      example: `import { useState } from 'react';
import { useApiAuthKeys } from '@wacht/nextjs';

export default function KeysPage() {
  const [status, setStatus] = useState<'active' | 'revoked' | 'all'>('active');
  const { keys, loading, createKey, rotateKey, revokeKey } = useApiAuthKeys({
    status,
  });

  if (loading) {
    return <div>Loading keys...</div>;
  }

  return (
    <div>
      <button
        onClick={async () => {
          const result = await createKey({ name: 'Production Backend' });
          console.log(result.data.secret);
        }}
      >
        Create key
      </button>

      <ul>
        {keys.map((key) => (
          <li key={key.id}>
            {key.name}
            <button onClick={async () => {
              const result = await rotateKey({ key_id: key.id });
              console.log(result.data.secret);
            }}>Rotate</button>
            <button onClick={async () => {
              await revokeKey({ key_id: key.id });
            }}>Revoke</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      points: [],
      signature: `declare function useApiAuthKeys(filters?: UseApiAuthKeysFilters): {
  keys: ApiKey[];
  createKey: (input: CreateApiAuthKeyInput) => Promise<ApiResult<ApiKeyWithSecret>>;
  rotateKey: (input: RotateApiAuthKeyInput) => Promise<ApiResult<ApiKeyWithSecret>>;
  revokeKey: (input: RevokeApiAuthKeyInput) => Promise<ApiResult<void>>;
  loading: boolean;
  error: unknown;
  refetch: () => void;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'The hook is SWR-backed and keyed by the current status filter. It is intentionally narrow: it handles the key list itself plus the three key mutations, and then revalidates the list after every successful change.',
          ],
        },
        {
          title: 'Mutation behavior',
          paragraphs: [
            'The two write methods that return secrets, `createKey()` and `rotateKey()`, return `ApiResult<ApiKeyWithSecret>`, so the one-time secret is available on `result.data.secret`. That is important because the secret is only available at creation or rotation time, and the calling UI usually needs to capture it immediately.',
            '`revokeKey()` also follows the same envelope contract, but its payload does not carry a new key object. The hook still refreshes the list after the action completes.',
          ],
        },
      ],
      api: [
        {
          name: 'filters',
          type: 'UseApiAuthKeysFilters | undefined',
          description: 'Optional key-list filters.',
          children: [
            {
              name: 'status',
              type: "'active' | 'revoked' | 'all' | undefined",
              description: 'Status filter for the key list.',
            },
          ],
        },
        {
          name: 'keys',
          type: 'ApiKey[]',
          description: 'API keys for the current app under the current filter.',
          children: [
            { name: 'id', type: 'string', description: 'Key identifier.' },
            { name: 'name', type: 'string', description: 'Human-readable key name.' },
            { name: 'key_prefix', type: 'string', description: 'Public key prefix.' },
            { name: 'key_suffix', type: 'string', description: 'Public key suffix used when displaying a partially masked key.' },
            { name: 'permissions', type: 'string[]', description: 'Explicit permissions attached to the key.' },
            { name: 'org_role_permissions', type: 'string[]', description: 'Organization-role-derived permissions attached to the key.' },
            { name: 'workspace_role_permissions', type: 'string[]', description: 'Workspace-role-derived permissions attached to the key.' },
            { name: 'organization_id', type: 'string | undefined', description: 'Bound organization scope when the key is organization-scoped.' },
            { name: 'workspace_id', type: 'string | undefined', description: 'Bound workspace scope when the key is workspace-scoped.' },
            { name: 'organization_membership_id', type: 'string | undefined', description: 'Bound organization membership when the key is tied to a specific membership.' },
            { name: 'workspace_membership_id', type: 'string | undefined', description: 'Bound workspace membership when the key is tied to a specific membership.' },
            { name: 'expires_at', type: 'string | undefined', description: 'Expiry timestamp when the key is time-limited.' },
            { name: 'last_used_at', type: 'string | undefined', description: 'Last usage timestamp when available.' },
            { name: 'is_active', type: 'boolean', description: 'Whether the key is still active.' },
            { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
            { name: 'revoked_at', type: 'string | undefined', description: 'Revocation timestamp when the key has been revoked.' },
            { name: 'revoked_reason', type: 'string | undefined', description: 'Revocation reason when one was recorded.' },
          ],
        },
        {
          name: 'createKey',
          type: '(input: CreateApiAuthKeyInput) => Promise<ApiResult<ApiKeyWithSecret>>',
          description: 'Creates a new API key and returns the envelope. The one-time secret payload is available on `result.data`.',
          children: [
            {
              name: 'input.name',
              type: 'string',
              description: 'Name for the new key.',
            },
            {
              name: 'input.expires_at',
              type: 'string | undefined',
              description: 'Optional expiry timestamp in ISO format.',
            },
            {
              name: 'result.data.id',
              type: 'string',
              description: 'New key identifier.',
            },
            {
              name: 'result.data.name',
              type: 'string',
              description: 'New key name.',
            },
            {
              name: 'result.data.key_prefix',
              type: 'string',
              description: 'New key prefix.',
            },
            {
              name: 'result.data.key_suffix',
              type: 'string',
              description: 'New key suffix.',
            },
            {
              name: 'result.data.permissions',
              type: 'string[]',
              description: 'Permissions attached to the new key.',
            },
            {
              name: 'result.data.expires_at',
              type: 'string | undefined',
              description: 'Expiry timestamp when present.',
            },
            {
              name: 'result.data.last_used_at',
              type: 'string | undefined',
              description: 'Last-used timestamp when present.',
            },
            {
              name: 'result.data.is_active',
              type: 'boolean',
              description: 'Whether the newly created key is active.',
            },
            {
              name: 'result.data.created_at',
              type: 'string',
              description: 'Creation timestamp.',
            },
            {
              name: 'result.data.revoked_at',
              type: 'string | undefined',
              description: 'Revocation timestamp when present.',
            },
            {
              name: 'result.data.revoked_reason',
              type: 'string | undefined',
              description: 'Revocation reason when present.',
            },
            {
              name: 'result.data.secret',
              type: 'string',
              description: 'One-time secret value. This is the sensitive value the UI should reveal once and then discard.',
            },
          ],
        },
        {
          name: 'rotateKey',
          type: '(input: RotateApiAuthKeyInput) => Promise<ApiResult<ApiKeyWithSecret>>',
          description: 'Rotates an existing API key and returns the envelope. The replacement secret is available on `result.data`.',
          children: [
            {
              name: 'input.key_id',
              type: 'string',
              description: 'Identifier of the key to rotate.',
            },
            {
              name: 'result.data.secret',
              type: 'string',
              description: 'One-time replacement secret returned by the rotation flow.',
            },
          ],
        },
        {
          name: 'revokeKey',
          type: '(input: RevokeApiAuthKeyInput) => Promise<ApiResult<void>>',
          description: 'Revokes an API key and refreshes the list.',
          children: [
            {
              name: 'input.key_id',
              type: 'string',
              description: 'Identifier of the key to revoke.',
            },
            {
              name: 'input.reason',
              type: 'string | undefined',
              description: 'Optional revocation reason.',
            },
          ],
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Whether the list query is still loading.',
        },
        {
          name: 'error',
          type: 'unknown',
          description: 'SWR error for the key list query.',
        },
        {
          name: 'refetch',
          type: '() => void',
          description: 'Revalidates the key list.',
        },
      ],
      examples: [
        {
          title: 'Filter keys by status',
          code: `import { useState } from 'react';
import { useApiAuthKeys } from '@wacht/nextjs';

export default function KeyList() {
  const [status, setStatus] = useState<'active' | 'revoked' | 'all'>('active');
  const { keys } = useApiAuthKeys({ status });

  return (
    <div>
      <select value={status} onChange={(event) => setStatus(event.target.value as 'active' | 'revoked' | 'all')}>
        <option value="active">Active</option>
        <option value="revoked">Revoked</option>
        <option value="all">All</option>
      </select>

      <ul>
        {keys.map((key) => (
          <li key={key.id}>{key.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
          lang: 'tsx',
        },
        {
          title: 'Create a key and show the one-time secret',
          code: `import { useState } from 'react';
import { useApiAuthKeys } from '@wacht/nextjs';

export default function CreateKey() {
  const [secret, setSecret] = useState<string | null>(null);
  const { createKey } = useApiAuthKeys();

  async function handleCreate() {
    const created = await createKey({
      name: 'Production Backend',
    });

    setSecret(created.secret);
  }

  return (
    <div>
      <button onClick={handleCreate}>Create key</button>
      {secret ? <pre>{secret}</pre> : null}
    </div>
  );
}`,
          lang: 'tsx',
        },
      ],
    },
    {
      slug: 'use-api-auth-audit-logs',
      title: 'useApiAuthAuditLogs',
      description: 'Read paginated API access logs.',
      importName: 'useApiAuthAuditLogs',
      intro:
        '`useApiAuthAuditLogs()` is the paginated log hook behind the API identity access-logs page. It returns one page of audit records at a time, plus the paging metadata that the vanity logs view uses to move forward with a cursor and rebuild the query when filters change.',
      example: `import { useMemo, useState } from 'react';
import { addDays } from 'date-fns';
import { useApiAuthAuditLogs } from '@wacht/nextjs';

export default function AccessLogsPage() {
  const [page, setPage] = useState(1);
  const [cursors, setCursors] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<'all' | 'allowed' | 'blocked'>('all');

  const startDate = useMemo(() => {
    const d = addDays(new Date(), -7);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, []);

  const endDate = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }, []);

  const cursor = page > 1 ? cursors[page - 2] : undefined;

  const { logs, has_more, next_cursor, loading } = useApiAuthAuditLogs({
    limit: 25,
    cursor,
    outcome: outcome === 'all' ? undefined : outcome,
    start_date: startDate,
    end_date: endDate,
  });

  if (!loading && next_cursor && page === cursors.length + 1) {
    setCursors((prev) => [...prev, next_cursor]);
  }

  return (
    <div>
      <button onClick={() => setOutcome('blocked')}>Blocked only</button>
      <ul>
        {logs.map((log) => (
          <li key={log.request_id}>{log.path}</li>
        ))}
      </ul>
      <button disabled={!has_more} onClick={() => setPage((current) => current + 1)}>
        Next
      </button>
    </div>
  );
}`,
      points: [],
      signature: `declare function useApiAuthAuditLogs(options?: UseApiAuthAuditLogsOptions): {
  logs: ApiAuditLogsResponse['data'];
  limit: number;
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
            'The hook reads one page of API audit logs for the current query and returns the page metadata alongside the records. It is cursor-based rather than page-number-based, so the surrounding UI is responsible for keeping track of the cursors it has already seen if it wants a traditional next and previous page experience.',
          ],
        },
        {
          title: 'How vanity uses it',
          paragraphs: [
            'In `vanity-pages/src/app/api-auth/logs/page.tsx`, the logs page stores the current page number, a local array of previously seen cursors, a date range, and an outcome filter. It passes the current cursor into `useApiAuthAuditLogs()`, appends `next_cursor` to the local cursor stack when a new page arrives, and resets that local paging state whenever the filters change.',
          ],
        },
        {
          title: 'Paging model',
          paragraphs: [
            'The hook itself does not maintain a multi-page cache. Each hook call represents one current query and one current cursor. That keeps the hook small and predictable, but it also means the surrounding UI should own any back/forward page state if it wants to let the user move between pages.',
          ],
        },
      ],
      api: [
        {
          name: 'options',
          type: 'UseApiAuthAuditLogsOptions | undefined',
          description: 'Optional log-query filters.',
          children: [
            { name: 'limit', type: 'number | undefined', description: 'Maximum number of records to request.' },
            { name: 'cursor', type: 'string | undefined', description: 'Cursor for the current page.' },
            { name: 'outcome', type: "'allowed' | 'blocked' | undefined", description: 'Filters the audit logs by request outcome.' },
            { name: 'key_id', type: 'string | undefined', description: 'Filters the logs to a single API key.' },
            { name: 'start_date', type: 'string | undefined', description: 'Lower timestamp bound in ISO format.' },
            { name: 'end_date', type: 'string | undefined', description: 'Upper timestamp bound in ISO format.' },
          ],
        },
        {
          name: 'logs',
          type: 'ApiAuditLog[]',
          description: 'Current page of access-log records.',
          children: [
            { name: 'request_id', type: 'string', description: 'Request identifier.' },
            { name: 'deployment_id', type: 'number', description: 'Numeric deployment identifier.' },
            { name: 'app_slug', type: 'string', description: 'API auth app slug.' },
            { name: 'key_id', type: 'number', description: 'Numeric key identifier.' },
            { name: 'key_name', type: 'string', description: 'Key name at the time of the request.' },
            { name: 'outcome', type: 'string', description: 'Request outcome, such as allowed or blocked.' },
            { name: 'blocked_by_rule', type: 'string | undefined', description: 'Blocking rule when the request was rejected.' },
            { name: 'client_ip', type: 'string', description: 'Client IP address.' },
            { name: 'path', type: 'string', description: 'Requested path.' },
            { name: 'user_agent', type: 'string', description: 'User agent string.' },
            { name: 'rate_limits', type: 'string | undefined', description: 'Rate-limit summary when the request touched rate-limit logic.' },
            { name: 'timestamp', type: 'string', description: 'Request timestamp.' },
          ],
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Effective page size returned by the hook.',
        },
        {
          name: 'has_more',
          type: 'boolean',
          description: 'Whether another page is available after the current one.',
        },
        {
          name: 'next_cursor',
          type: 'string | undefined',
          description: 'Cursor for the next page when one exists.',
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Whether the current log query is still loading.',
        },
        {
          name: 'error',
          type: 'unknown',
          description: 'SWR error for the current log query.',
        },
        {
          name: 'refetch',
          type: '() => void',
          description: 'Revalidates the current log page.',
        },
      ],
      examples: [
        {
          title: 'Filter blocked requests only',
          code: `import { useApiAuthAuditLogs } from '@wacht/nextjs';

export default function BlockedRequests() {
  const { logs } = useApiAuthAuditLogs({
    outcome: 'blocked',
  });

  return (
    <ul>
      {logs.map((log) => (
        <li key={log.request_id}>
          {log.path} · {log.blocked_by_rule}
        </li>
      ))}
    </ul>
  );
}`,
          lang: 'tsx',
        },
        {
          title: 'Filter by date range and page forward',
          code: `import { useMemo, useState } from 'react';
import { addDays } from 'date-fns';
import { useApiAuthAuditLogs } from '@wacht/nextjs';

export default function PagedLogs() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const start = useMemo(() => {
    const d = addDays(new Date(), -7);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, []);

  const end = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  }, []);

  const { logs, has_more, next_cursor } = useApiAuthAuditLogs({
    limit: 25,
    cursor,
    start_date: start,
    end_date: end,
  });

  return (
    <div>
      <ul>
        {logs.map((log) => (
          <li key={log.request_id}>{log.path}</li>
        ))}
      </ul>
      <button disabled={!has_more} onClick={() => setCursor(next_cursor)}>
        Next
      </button>
    </div>
  );
}`,
          lang: 'tsx',
        },
      ],
    },
    {
      slug: 'use-api-auth-audit-analytics',
      title: 'useApiAuthAuditAnalytics',
      description: 'Read API identity overview metrics.',
      importName: 'useApiAuthAuditAnalytics',
      intro:
        '`useApiAuthAuditAnalytics()` is the overview analytics hook for API identity. It returns aggregate request counts and optional breakdown sections for keys, paths, blocked reasons, and rate-limit rules. In `vanity-pages`, the API identity overview uses it alongside `useApiAuthAuditTimeseries()` to power the top metrics and breakdown cards.',
      example: `import { addDays } from 'date-fns';
import { useApiAuthAuditAnalytics } from '@wacht/nextjs';

export default function ApiIdentityOverview() {
  const start = addDays(new Date(), -7).toISOString();
  const end = new Date().toISOString();

  const { analytics, loading } = useApiAuthAuditAnalytics({
    start_date: start,
    end_date: end,
    include_top_keys: true,
    include_top_paths: true,
    include_blocked_reasons: true,
    include_rate_limits: true,
  });

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div>
      <p>Total requests: {analytics?.total_requests}</p>
      <p>Success rate: {analytics?.success_rate}</p>
    </div>
  );
}`,
      points: [],
      signature: `declare function useApiAuthAuditAnalytics(options?: UseApiAuthAuditAnalyticsOptions): {
  analytics: ApiAuditAnalyticsResponse | null;
  loading: boolean;
  error: unknown;
  refetch: () => void;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'The hook returns one analytics payload for the current API identity query window. Unlike the logs hook, it is not paginated. Instead, you control which optional breakdown sections should be included in the response, and the hook returns a single aggregate object for that current filter set.',
          ],
        },
        {
          title: 'How vanity uses it',
          paragraphs: [
            'In `vanity-pages/src/app/api-auth/page.tsx`, the overview page builds a date range, calls `useApiAuthAuditAnalytics({ start_date, end_date })`, and pairs the result with `useApiAuthAuditTimeseries()` to render the metrics snapshot, charts, and rate-limit-focused summary surfaces.',
          ],
        },
      ],
      api: [
        {
          name: 'options',
          type: 'UseApiAuthAuditAnalyticsOptions | undefined',
          description: 'Optional analytics filters and include flags.',
          children: [
            { name: 'start_date', type: 'string | undefined', description: 'Lower timestamp bound in ISO format.' },
            { name: 'end_date', type: 'string | undefined', description: 'Upper timestamp bound in ISO format.' },
            { name: 'key_id', type: 'string | undefined', description: 'Restricts the analytics to one key.' },
            { name: 'include_top_keys', type: 'boolean | undefined', description: 'Requests the `top_keys` section.' },
            { name: 'include_top_paths', type: 'boolean | undefined', description: 'Requests the `top_paths` section.' },
            { name: 'include_blocked_reasons', type: 'boolean | undefined', description: 'Requests the `blocked_reasons` section.' },
            { name: 'include_rate_limits', type: 'boolean | undefined', description: 'Requests the `rate_limit_stats` section.' },
            { name: 'top_limit', type: 'number | undefined', description: 'Limits the size of the optional top lists.' },
          ],
        },
        {
          name: 'analytics',
          type: 'ApiAuditAnalyticsResponse | null',
          description: 'Aggregate analytics payload for the current query window.',
          children: [
            { name: 'total_requests', type: 'number', description: 'Total requests in the selected window.' },
            { name: 'allowed_requests', type: 'number', description: 'Allowed requests in the selected window.' },
            { name: 'blocked_requests', type: 'number', description: 'Blocked requests in the selected window.' },
            { name: 'success_rate', type: 'number', description: 'Allowed-request rate as a percentage-like number from the backend analytics response.' },
            { name: 'keys_used_24h', type: 'number', description: 'Distinct keys used in the last 24 hours.' },
            {
              name: 'top_keys',
              type: 'KeyStatsItem[] | undefined',
              description: 'Top keys section when `include_top_keys` is requested.',
              children: [
                { name: 'key_id', type: 'number', description: 'Numeric key identifier.' },
                { name: 'key_name', type: 'string', description: 'Key name.' },
                { name: 'total_requests', type: 'number', description: 'Total requests attributed to that key.' },
              ],
            },
            {
              name: 'top_paths',
              type: 'PathStatsItem[] | undefined',
              description: 'Top paths section when `include_top_paths` is requested.',
              children: [
                { name: 'path', type: 'string', description: 'Observed request path.' },
                { name: 'total_requests', type: 'number', description: 'Total requests for that path.' },
              ],
            },
            {
              name: 'blocked_reasons',
              type: 'BlockedReasonItem[] | undefined',
              description: 'Blocked reason breakdown when `include_blocked_reasons` is requested.',
              children: [
                { name: 'blocked_by_rule', type: 'string', description: 'Blocking rule identifier.' },
                { name: 'count', type: 'number', description: 'Blocked request count for that rule.' },
                { name: 'percentage', type: 'number', description: 'Percentage share for that rule.' },
              ],
            },
            {
              name: 'rate_limit_stats',
              type: 'RateLimitBreakdown | undefined',
              description: 'Rate-limit breakdown when `include_rate_limits` is requested.',
              children: [
                { name: 'total_hits', type: 'number', description: 'Total rate-limit hits.' },
                { name: 'percentage_of_blocked', type: 'number', description: 'Share of blocked requests caused by rate limits.' },
                {
                  name: 'top_rules',
                  type: 'RateLimitStatsItem[] | undefined',
                  description: 'Top triggered rate-limit rules.',
                  children: [
                    { name: 'rule', type: 'string', description: 'Rule identifier.' },
                    { name: 'hit_count', type: 'number', description: 'Number of hits for that rule.' },
                    { name: 'percentage', type: 'number', description: 'Percentage share for that rule.' },
                  ],
                },
              ],
            },
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
          title: 'Load overview analytics for a date range',
          code: `import { addDays } from 'date-fns';
import { useApiAuthAuditAnalytics } from '@wacht/nextjs';

export default function OverviewMetrics() {
  const start = addDays(new Date(), -7).toISOString();
  const end = new Date().toISOString();

  const { analytics } = useApiAuthAuditAnalytics({
    start_date: start,
    end_date: end,
  });

  return <div>{analytics?.total_requests ?? 0} total requests</div>;
}`,
          lang: 'tsx',
        },
        {
          title: 'Request top-key and path breakdowns',
          code: `import { useApiAuthAuditAnalytics } from '@wacht/nextjs';

export default function TopBreakdowns() {
  const { analytics } = useApiAuthAuditAnalytics({
    include_top_keys: true,
    include_top_paths: true,
    top_limit: 5,
  });

  return (
    <div>
      <h2>Top Keys</h2>
      <ul>
        {analytics?.top_keys?.map((item) => (
          <li key={item.key_id}>{item.key_name}</li>
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
      slug: 'use-api-auth-audit-timeseries',
      title: 'useApiAuthAuditTimeseries',
      description: 'Read chart data for API identity traffic.',
      importName: 'useApiAuthAuditTimeseries',
      intro:
        '`useApiAuthAuditTimeseries()` returns the time-bucketed request series for the API identity overview charts. It is the hook that `vanity-pages` uses to build the request activity graph, and it pairs naturally with `useApiAuthAuditAnalytics()` when you need both the aggregate metrics and the per-interval chart data for the same date range.',
      example: `import { addDays } from 'date-fns';
import { useApiAuthAuditTimeseries } from '@wacht/nextjs';

export default function ApiIdentityChart() {
  const start = addDays(new Date(), -7).toISOString();
  const end = new Date().toISOString();

  const { timeseries, interval, loading } = useApiAuthAuditTimeseries({
    start_date: start,
    end_date: end,
    interval: 'day',
  });

  if (loading) {
    return <div>Loading chart…</div>;
  }

  return (
    <div>
      <p>Interval: {interval}</p>
      <p>Points: {timeseries.length}</p>
    </div>
  );
}`,
      points: [],
      signature: `declare function useApiAuthAuditTimeseries(options?: UseApiAuthAuditTimeseriesOptions): {
  timeseries: ApiAuditTimeseriesResponse['data'];
  interval: string;
  loading: boolean;
  error: unknown;
  refetch: () => void;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'The hook returns time-bucketed request counts for the current filter window. It is not responsible for chart shaping beyond the raw backend buckets, so the UI layer is still free to collapse or re-bucket the points the way the chart needs them.',
          ],
        },
        {
          title: 'How vanity uses it',
          paragraphs: [
            'In `vanity-pages/src/app/api-auth/page.tsx`, the overview page uses `interval = "day"` and combines the returned points into a UTC day map before building the final chart rows. That extra shaping happens in the page because the hook is intentionally just the data fetch layer.',
          ],
        },
        {
          title: 'Interval behavior',
          paragraphs: [
            'If the response has no interval yet, the hook falls back to the requested interval and then to `"hour"`. That keeps the chart surface predictable even before the first successful response arrives.',
          ],
        },
      ],
      api: [
        {
          name: 'options',
          type: 'UseApiAuthAuditTimeseriesOptions | undefined',
          description: 'Optional timeseries filters.',
          children: [
            { name: 'start_date', type: 'string | undefined', description: 'Lower timestamp bound in ISO format.' },
            { name: 'end_date', type: 'string | undefined', description: 'Upper timestamp bound in ISO format.' },
            { name: 'interval', type: 'string | undefined', description: 'Requested time bucket size.' },
            { name: 'key_id', type: 'string | undefined', description: 'Restricts the series to one API key.' },
          ],
        },
        {
          name: 'timeseries',
          type: 'ApiAuditTimeseriesPoint[]',
          description: 'Time-bucketed request points for the current query.',
          children: [
            { name: 'timestamp', type: 'string', description: 'Bucket timestamp.' },
            { name: 'total_requests', type: 'number', description: 'Total requests in the bucket.' },
            { name: 'allowed_requests', type: 'number', description: 'Allowed requests in the bucket.' },
            { name: 'blocked_requests', type: 'number', description: 'Blocked requests in the bucket.' },
            { name: 'success_rate', type: 'number', description: 'Success rate for the bucket.' },
          ],
        },
        {
          name: 'interval',
          type: 'string',
          description: 'Effective interval returned by the hook.',
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Whether the current timeseries query is still loading.',
        },
        {
          name: 'error',
          type: 'unknown',
          description: 'SWR error for the timeseries query.',
        },
        {
          name: 'refetch',
          type: '() => void',
          description: 'Revalidates the current timeseries query.',
        },
      ],
      examples: [
        {
          title: 'Request daily traffic points',
          code: `import { addDays } from 'date-fns';
import { useApiAuthAuditTimeseries } from '@wacht/nextjs';

export default function DailyTraffic() {
  const start = addDays(new Date(), -7).toISOString();
  const end = new Date().toISOString();

  const { timeseries } = useApiAuthAuditTimeseries({
    start_date: start,
    end_date: end,
    interval: 'day',
  });

  return <div>{timeseries.length} daily points</div>;
}`,
          lang: 'tsx',
        },
        {
          title: 'Build a simple chart series',
          code: `import { useMemo } from 'react';
import { useApiAuthAuditTimeseries } from '@wacht/nextjs';

export default function ChartSeries() {
  const { timeseries } = useApiAuthAuditTimeseries({
    interval: 'day',
  });

  const series = useMemo(() => {
    return timeseries.map((point) => ({
      x: point.timestamp,
      total: point.total_requests,
      allowed: point.allowed_requests,
      blocked: point.blocked_requests,
    }));
  }, [timeseries]);

  return <pre>{JSON.stringify(series, null, 2)}</pre>;
}`,
          lang: 'tsx',
        },
      ],
    },
  ],
};
