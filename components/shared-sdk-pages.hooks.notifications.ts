import type { SharedGroup } from './shared-sdk-pages.types';

export const notificationsHookGroup: SharedGroup = {
    label: 'Notifications',
    docs: [
      {
        slug: 'use-notifications',
        title: 'useNotifications',
        description: 'Read notification records for the current user.',
        importName: 'useNotifications',
        intro:
          '`useNotifications()` is the main notification list hook. It is the same stateful surface that powers `NotificationPanel`, including pagination, optimistic read and archive actions, and live inserts from the notification stream.',
        example: `export default function Inbox() {
  const {
    loading,
    notifications,
    hasMore,
    markAsRead,
    archiveNotification,
    loadMore,
  } = useNotifications({
    scope: 'all',
    is_archived: false,
  });

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {notifications.map((notification) => (
          <li key={notification.id} className="rounded-xl border p-4">
            <div className="font-medium">{notification.title}</div>
            <p className="text-sm text-muted-foreground">{notification.body}</p>
            <div className="mt-3 flex gap-2">
              {!notification.is_read ? (
                <button onClick={() => markAsRead(notification.id)}>Mark as read</button>
              ) : null}
              <button onClick={() => archiveNotification(notification.id)}>
                {notification.is_archived ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {hasMore ? <button onClick={loadMore}>Load more</button> : null}
    </div>
  );
}`,
        points: [],
        signature: `type UseNotificationsReturnType =
  | {
      loading: true;
      notifications: Notification[];
      hasMore: boolean;
      markAsRead: never;
      markAllAsRead: never;
      archiveAllRead: never;
      archiveNotification: never;
      starNotification: never;
      markAsUnread: never;
      error: Error | null;
      refetch: () => Promise<void>;
      loadMore: () => Promise<void>;
    }
  | {
      loading: false;
      error: Error | null;
      notifications: Notification[];
      hasMore: boolean;
      markAsRead: (notificationId: string) => Promise<void>;
      markAllAsRead: () => Promise<void>;
      archiveAllRead: () => Promise<void>;
      archiveNotification: (notificationId: string) => Promise<void>;
      starNotification: (notificationId: string) => Promise<void>;
      markAsUnread: (notificationId: string) => Promise<void>;
      refetch: () => Promise<void>;
      loadMore: () => Promise<void>;
    };`,
        sections: [
          {
            title: 'Overview',
            paragraphs: [
              'The hook keeps a paginated notification list in sync with the current filter, then flattens the loaded pages into a single `notifications` array. The list is refreshed on focus, polled periodically, and updated in place when a live notification arrives through `useNotificationStream()`.',
            ],
          },
          {
            title: 'Filtering',
            paragraphs: [
              'The same params drive both the REST query and the live stream subscription. Scope, channel, organization, workspace, read state, archive state, starred state, severity, limit, and cursor all map into the list query. The hook itself manages the cursor for later pages, so you usually pass filters, not a manual pagination state.',
            ],
          },
          {
            title: 'Updates',
            paragraphs: [
              'The mutation methods all apply an optimistic cache update first, send the request, and then refetch the list. That keeps the panel responsive without leaving the cache permanently stale if the backend response changes the final state.',
              'Incoming stream messages are prepended to the first loaded page only when the notification is not already present in the cached list. If you pass `onNotification`, it is called only for those newly inserted live notifications.',
            ],
          },
        ],
        api: [
          {
            name: 'params',
            type: 'UseNotificationsOptions | undefined',
            description: 'Optional list filters and stream options. `UseNotificationsOptions` extends `NotificationListParams` and also accepts `onNotification`.',
            children: [
              {
                name: 'limit',
                type: 'number | undefined',
                description: 'Page size for each fetch.',
              },
              {
                name: 'cursor',
                type: 'string | undefined',
                description: 'Explicit cursor for the first page when you need to start from a known notification boundary.',
              },
              {
                name: 'scope',
                type: "'all' | 'current' | 'user' | 'organization' | 'workspace' | undefined",
                description: 'High-level notification scope. This also influences which stream channels are subscribed when `channels` is not passed explicitly.',
              },
              {
                name: 'channels',
                type: "('user' | 'organization' | 'workspace' | 'current' | 'all')[] | undefined",
                description: 'Optional channel filter for the list query. When present, these channels are also used for the stream subscription.',
              },
              {
                name: 'organization_ids',
                type: 'string[] | undefined',
                description: 'Restricts the list to specific organizations.',
              },
              {
                name: 'workspace_ids',
                type: 'string[] | undefined',
                description: 'Restricts the list to specific workspaces.',
              },
              {
                name: 'is_read',
                type: 'boolean | undefined',
                description: 'Filters by read state.',
              },
              {
                name: 'is_archived',
                type: 'boolean | undefined',
                description: 'Filters by archived state. This also changes how `archiveNotification()` updates the local list.',
              },
              {
                name: 'is_starred',
                type: 'boolean | undefined',
                description: 'Filters by starred state.',
              },
              {
                name: 'severity',
                type: "'info' | 'success' | 'warning' | 'error' | undefined",
                description: 'Filters by notification severity.',
              },
              {
                name: 'onNotification',
                type: '((notification: NotificationMessage) => void) | undefined',
                description: 'Runs when a newly streamed notification is inserted into the cached list.',
              },
            ],
          },
          {
            name: 'loading',
            type: 'boolean',
            description: 'Stays `true` until the client and the first list page are ready. While loading is true, the action methods are not usable yet.',
          },
          {
            name: 'notifications',
            type: 'Notification[]',
            description: 'The flattened notification list for the current query.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Notification identifier.',
              },
              {
                name: 'deployment_id',
                type: 'string',
                description: 'Deployment that owns the notification.',
              },
              {
                name: 'user_id',
                type: 'string',
                description: 'User that the notification belongs to.',
              },
              {
                name: 'organization_id',
                type: 'string | undefined',
                description: 'Organization scope for the notification when it was emitted in an organization context.',
              },
              {
                name: 'workspace_id',
                type: 'string | undefined',
                description: 'Workspace scope for the notification when it was emitted in a workspace context.',
              },
              {
                name: 'title',
                type: 'string',
                description: 'Short notification title.',
              },
              {
                name: 'body',
                type: 'string',
                description: 'Notification body text.',
              },
              {
                name: 'ctas',
                type: '{ label: string; payload: any }[] | undefined',
                description: 'Optional call-to-action metadata attached to the notification.',
                children: [
                  {
                    name: 'label',
                    type: 'string',
                    description: 'CTA label shown to the user.',
                  },
                  {
                    name: 'payload',
                    type: 'any',
                    description: 'Opaque CTA payload emitted with the notification.',
                  },
                ],
              },
              {
                name: 'severity',
                type: "'info' | 'success' | 'warning' | 'error'",
                description: 'Severity level for styling and filtering.',
              },
              {
                name: 'is_read',
                type: 'boolean',
                description: 'Read state.',
              },
              {
                name: 'read_at',
                type: 'string | undefined',
                description: 'Timestamp for when the notification was marked as read.',
              },
              {
                name: 'is_archived',
                type: 'boolean',
                description: 'Archived state.',
              },
              {
                name: 'archived_at',
                type: 'string | undefined',
                description: 'Timestamp for when the notification was archived.',
              },
              {
                name: 'is_starred',
                type: 'boolean',
                description: 'Starred state.',
              },
              {
                name: 'metadata',
                type: 'Record<string, any> | undefined',
                description: 'Optional notification metadata.',
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
              {
                name: 'expires_at',
                type: 'string | undefined',
                description: 'Expiry timestamp when the notification is time-bound.',
              },
            ],
          },
          {
            name: 'hasMore',
            type: 'boolean',
            description: 'Whether the hook still has another page of notifications to fetch.',
          },
          {
            name: 'error',
            type: 'Error | null',
            description: 'The SWR loading error for the list query, if one occurred.',
          },
          {
            name: 'markAsRead',
            type: '(notificationId: string) => Promise<void>',
            description: 'Marks one notification as read with an optimistic cache update, then revalidates the list.',
          },
          {
            name: 'markAllAsRead',
            type: '() => Promise<void>',
            description: 'Marks every notification in the current query as read with the current filters applied.',
          },
          {
            name: 'archiveAllRead',
            type: '() => Promise<void>',
            description: 'Archives the read notifications in the current filtered view and then reloads the list.',
          },
          {
            name: 'archiveNotification',
            type: '(notificationId: string) => Promise<void>',
            description: 'Archives one notification, or removes it from the current archived view when `is_archived` is already part of the filter.',
          },
          {
            name: 'starNotification',
            type: '(notificationId: string) => Promise<void>',
            description: 'Toggles the starred state on a single notification with an optimistic update.',
          },
          {
            name: 'markAsUnread',
            type: '(notificationId: string) => Promise<void>',
            description: 'Marks one notification as unread with an optimistic cache update, then revalidates the list.',
          },
          {
            name: 'refetch',
            type: '() => Promise<void>',
            description: 'Revalidates the current paginated list.',
          },
          {
            name: 'loadMore',
            type: '() => Promise<void>',
            description: 'Loads the next page unless a page load is already in progress or there is no next page.',
          },
        ],
        examples: [
          {
            title: 'Unread organization inbox',
            code: `import { useNotifications } from '@wacht/nextjs';

export default function OrganizationInbox() {
  const { loading, notifications, markAsRead } = useNotifications({
    scope: 'organization',
    is_read: false,
  });

  if (loading) {
    return <div>Loading…</div>;
  }

  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>
          <strong>{notification.title}</strong>
          <button onClick={() => markAsRead(notification.id)}>Read</button>
        </li>
      ))}
    </ul>
  );
}`,
            lang: 'tsx',
          },
          {
            title: 'React to live inserts',
            code: `import { useNotifications } from '@wacht/nextjs';

export default function LiveInbox() {
  const { notifications } = useNotifications({
    scope: 'all',
    onNotification(notification) {
      console.log('new notification', notification.title);
    },
  });

  return <div>{notifications.length} notifications</div>;
}`,
            lang: 'tsx',
          },
        ],
      },
      {
        slug: 'use-notification-stream',
        title: 'useNotificationStream',
        description: 'Subscribe to live notification updates.',
        importName: 'useNotificationStream',
        intro:
          '`useNotificationStream()` manages the live websocket connection for notification updates. It is the low-level stream hook that `useNotifications()` uses to prepend new notifications into the cached list, but you can also use it directly when you need connection state or custom live handling.',
        example: `import { useNotificationStream } from '@wacht/nextjs';

export default function NotificationConnectionStatus() {
  const { isConnected, connectionError, reconnect } = useNotificationStream({
    channels: ['user', 'organization'],
  });

  return (
    <div>
      <div>{isConnected ? 'Connected' : 'Disconnected'}</div>
      {connectionError ? <p>{connectionError}</p> : null}
      <button onClick={reconnect}>Reconnect</button>
    </div>
  );
}`,
        points: [],
        signature: `type UseNotificationStreamOptions = {
  enabled?: boolean;
  channels?: string[];
  organizationIds?: number[];
  workspaceIds?: number[];
  onNotification?: (notification: NotificationMessage) => void;
  onError?: (error: string) => void;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
};

declare function useNotificationStream(
  options?: UseNotificationStreamOptions,
): {
  isConnected: boolean;
  connectionError: string | null;
  disconnect: () => void;
  reconnect: () => void;
};`,
        sections: [
          {
            title: 'Overview',
            paragraphs: [
              'The hook waits until both the current session and the deployment are ready, then opens a websocket connection against the deployment backend. It keeps the connection alive with a ping interval, reconnects with exponential backoff when the connection drops unexpectedly, and tears everything down again when the component unmounts or the connection inputs change.',
            ],
          },
          {
            title: 'Filtering',
            paragraphs: [
              'The stream can be narrowed by channel, organization, and workspace. Those values are converted into websocket query params before the connection opens. If you change them later, the hook reconnects with the new filter set so the live feed matches the current screen.',
            ],
          },
          {
            title: 'Connection management',
            paragraphs: [
              'The connection is disabled automatically while the session or deployment is still loading, or when `enabled` is false. In staging mode, the hook also forwards the stored `__dev_session__` value so the websocket can authenticate the same way as the frontend API.',
              'Unexpected disconnects trigger exponential backoff until `maxReconnectAttempts` is reached. Manual `disconnect()` stops the current socket immediately, while `reconnect()` resets the retry counter and starts a fresh connection attempt.',
            ],
          },
        ],
        api: [
          {
            name: 'enabled',
            type: 'boolean',
            description: 'Turns the stream on or off. Defaults to `true`.',
          },
          {
            name: 'channels',
            type: 'string[]',
            description: 'Limits the live feed to the selected channels.',
          },
          {
            name: 'organizationIds',
            type: 'number[]',
            description: 'Scopes the stream to specific organizations.',
          },
          {
            name: 'workspaceIds',
            type: 'number[]',
            description: 'Scopes the stream to specific workspaces.',
          },
          {
            name: 'onNotification',
            type: '(notification: NotificationMessage) => void',
            description: 'Called whenever a live notification event arrives.',
          },
          {
            name: 'onError',
            type: '(error: string) => void',
            description: 'Called when the websocket stream reports an error.',
          },
          {
            name: 'reconnectDelay',
            type: 'number',
            description: 'Base reconnect delay in milliseconds. Defaults to `1000` and then doubles on each failed reconnect attempt.',
          },
          {
            name: 'maxReconnectAttempts',
            type: 'number',
            description: 'Maximum number of reconnect attempts before the hook stops retrying. Defaults to `5`.',
          },
          {
            name: 'isConnected',
            type: 'boolean',
            description: 'Whether the websocket is currently open.',
          },
          {
            name: 'connectionError',
            type: 'string | null',
            description: 'The latest connection error, if the stream failed or exhausted its reconnect attempts.',
          },
          {
            name: 'disconnect',
            type: '() => void',
            description: 'Closes the current socket and stops the keepalive timer.',
          },
          {
            name: 'reconnect',
            type: '() => void',
            description: 'Clears the retry counter and starts a fresh connection attempt.',
          },
          {
            name: 'NotificationMessage',
            type: '{ id: number; user_id: number; deployment_id: number; title: string; body: string; severity: string; ctas?: { label: string; payload: any }[]; created_at: string }',
            description: 'Shape of the live notification payload passed to `onNotification`.',
            children: [
              {
                name: 'id',
                type: 'number',
                description: 'Notification identifier in the live stream payload.',
              },
              {
                name: 'user_id',
                type: 'number',
                description: 'Numeric user identifier for the notification recipient.',
              },
              {
                name: 'deployment_id',
                type: 'number',
                description: 'Numeric deployment identifier for the emitting deployment.',
              },
              {
                name: 'title',
                type: 'string',
                description: 'Notification title.',
              },
              {
                name: 'body',
                type: 'string',
                description: 'Notification body text.',
              },
              {
                name: 'severity',
                type: 'string',
                description: 'Severity emitted by the stream payload.',
              },
              {
                name: 'ctas',
                type: '{ label: string; payload: any }[] | undefined',
                description: 'Optional CTA payloads included with the live message.',
                children: [
                  {
                    name: 'label',
                    type: 'string',
                    description: 'CTA label.',
                  },
                  {
                    name: 'payload',
                    type: 'any',
                    description: 'Opaque CTA payload.',
                  },
                ],
              },
              {
                name: 'created_at',
                type: 'string',
                description: 'Creation timestamp for the streamed notification.',
              },
            ],
          },
        ],
        examples: [
          {
            title: 'Listen for organization notifications only',
            code: `import { useNotificationStream } from '@wacht/nextjs';

export default function OrganizationStream() {
  useNotificationStream({
    channels: ['organization'],
    organizationIds: [42],
    onNotification(notification) {
      console.log(notification.title);
    },
  });

  return null;
}`,
            lang: 'tsx',
          },
          {
            title: 'Show connection state',
            code: `import { useNotificationStream } from '@wacht/nextjs';

export default function StreamHealth() {
  const { isConnected, connectionError } = useNotificationStream();

  return (
    <div>
      <span>{isConnected ? 'Live' : 'Offline'}</span>
      {connectionError ? <p>{connectionError}</p> : null}
    </div>
  );
}`,
            lang: 'tsx',
          },
        ],
      },
      {
        slug: 'use-notification-unread-count',
        title: 'useNotificationUnreadCount',
        description: 'Read unread counts for a notification scope.',
        importName: 'useNotificationUnreadCount',
        intro:
          '`useNotificationUnreadCount()` is the lightweight unread-count hook behind `NotificationBell` and other summary UI. Use it when you only need the unread total for a scope and do not need the full notification list.',
        example: `import { useNotificationUnreadCount } from '@wacht/nextjs';

export default function NotificationBadge() {
  const { loading, count } = useNotificationUnreadCount({ scope: 'current' });

  if (loading || count === 0) {
    return null;
  }

  return <span>{count}</span>;
}`,
        points: [],
        signature: `type UseScopeUnreadReturnType =
  | {
      loading: true;
      count: number;
      error: Error | null;
      refetch: () => Promise<void>;
    }
  | {
      loading: false;
      count: number;
      error: Error | null;
      refetch: () => Promise<void>;
    };`,
        sections: [
          {
            title: 'Overview',
            paragraphs: [
              'The hook fetches only the unread count for the current filter instead of loading notification records. It refreshes on focus and polls periodically, which makes it a better fit for badges, nav items, and other small summary surfaces than `useNotifications()`.',
            ],
          },
          {
            title: 'Filtering',
            paragraphs: [
              'It accepts the same `NotificationListParams` filter shape as the notification list hook. That means the unread count can be scoped by channel, organization, workspace, read state, archive state, starred state, severity, and the top-level notification scope.',
            ],
          },
        ],
        api: [
          {
            name: 'params',
            type: 'NotificationListParams | undefined',
            description: 'Optional unread-count filters.',
            children: [
              {
                name: 'limit',
                type: 'number | undefined',
                description: 'Accepted for consistency with the shared notification params shape, though the unread-count response itself is still a single number.',
              },
              {
                name: 'cursor',
                type: 'string | undefined',
                description: 'Accepted by the shared params shape, though the unread-count response is not paginated.',
              },
              {
                name: 'scope',
                type: "'all' | 'current' | 'user' | 'organization' | 'workspace' | undefined",
                description: 'High-level notification scope for the unread count.',
              },
              {
                name: 'channels',
                type: "('user' | 'organization' | 'workspace' | 'current' | 'all')[] | undefined",
                description: 'Optional channel filter.',
              },
              {
                name: 'organization_ids',
                type: 'string[] | undefined',
                description: 'Restricts the unread count to specific organizations.',
              },
              {
                name: 'workspace_ids',
                type: 'string[] | undefined',
                description: 'Restricts the unread count to specific workspaces.',
              },
              {
                name: 'is_read',
                type: 'boolean | undefined',
                description: 'Filters by read state.',
              },
              {
                name: 'is_archived',
                type: 'boolean | undefined',
                description: 'Filters by archived state.',
              },
              {
                name: 'is_starred',
                type: 'boolean | undefined',
                description: 'Filters by starred state.',
              },
              {
                name: 'severity',
                type: "'info' | 'success' | 'warning' | 'error' | undefined",
                description: 'Filters by severity.',
              },
            ],
          },
          {
            name: 'loading',
            type: 'boolean',
            description: 'Stays `true` until the client and the unread-count query are ready.',
          },
          {
            name: 'count',
            type: 'number',
            description: 'The unread count for the requested scope.',
          },
          {
            name: 'error',
            type: 'Error | null',
            description: 'The loading error, if the unread count request failed.',
          },
          {
            name: 'refetch',
            type: '() => Promise<void>',
            description: 'Refreshes the unread count.',
          },
        ],
        examples: [
          {
            title: 'Show an organization unread badge',
            code: `import { useNotificationUnreadCount } from '@wacht/nextjs';

export default function OrganizationUnreadBadge() {
  const { loading, count } = useNotificationUnreadCount({
    scope: 'organization',
  });

  if (loading || count === 0) {
    return null;
  }

  return <span>{count}</span>;
}`,
            lang: 'tsx',
          },
          {
            title: 'Refetch the count after a manual action',
            code: `import { useNotificationUnreadCount } from '@wacht/nextjs';

export default function RefreshUnreadCount() {
  const { count, refetch } = useNotificationUnreadCount({ scope: 'all' });

  return (
    <button onClick={refetch}>
      Refresh unread count ({count})
    </button>
  );
}`,
            lang: 'tsx',
          },
        ],
      },
    ],
  };
