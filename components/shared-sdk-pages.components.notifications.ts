import type { SharedGroup } from './shared-sdk-pages.types';

export const notificationsComponentGroup: SharedGroup = {
    label: 'Notifications',
    docs: [
      {
        slug: 'notification-bell',
        title: 'NotificationBell',
        description: 'Render the compact unread indicator and notification trigger.',
        importName: 'NotificationBell',
        intro:
          '`NotificationBell` is the compact header trigger for unread notifications. It reads the unread count, shows the badge when needed, and opens the notification popover.',
        example: `export default function Header() {
  return (
    <header className="flex items-center justify-end gap-3 border-b border-border px-6 py-4">
      <NotificationBell />
    </header>
  );
}`,
        points: [
          'Use it when the user needs a small notification entry point in the app shell.',
          'It already knows how to read scoped unread counts.',
        ],
        sections: [
          {
            title: 'Behavior',
            paragraphs: [
              'The bell reads the unread count for the selected scope and toggles the popover open and closed from the same trigger.',
              'The badge is hidden when there are no unread items, and it collapses to a dot when the unread count is small.',
            ],
          },
          {
            title: 'Scope',
            paragraphs: [
              'The scope determines which unread bucket the bell reads from. The same trigger can represent all notifications, user notifications, organization notifications, or workspace notifications.',
            ],
          },
        ],
      },
      {
        slug: 'notification-popover',
        title: 'NotificationPopover',
        description: 'Render the dropdown-style notification surface.',
        importName: 'NotificationPopover',
        intro:
          '`NotificationPopover` is the dropdown-sized notification surface. It is the same content as the panel, just mounted as a floating popover instead of a full-width page block.',
        example: `export default function Header() {
  return (
    <div className="relative">
      <NotificationPopover scope="all" />
    </div>
  );
}`,
        points: [
          'Use it when the popover should be controlled by your own trigger or layout.',
          'This is a surface component, not a data hook.',
        ],
        sections: [
          {
            title: 'Behavior',
            paragraphs: [
              'The popover is just a positioned shell around `NotificationPanel`. It keeps the panel width constrained and lets the panel handle the actual notification content.',
            ],
          },
          {
            title: 'Positioning',
            paragraphs: [
              'You can pass the popover position when you need to anchor it to a custom trigger. The popover takes care of the floating container and scroll boundary, not the notification logic itself.',
            ],
          },
        ],
      },
      {
        slug: 'notification-panel',
        title: 'NotificationPanel',
        description: 'Render the full inline notification panel.',
        importName: 'NotificationPanel',
        intro:
          '`NotificationPanel` is the full notification surface. It shows the inbox tabs, unread filter, bulk actions, and the notification list itself.',
        example: `export default function NotificationsPage() {
  return <NotificationPanel fullWidth />;
}`,
        points: [
          'Use it when notifications need more room than a popover can provide.',
          'This is the shared surface to reuse on a dedicated notifications page.',
        ],
        signature: `type NotificationPanelProps = {
  scope?: NotificationListParams['scope'];
  onAction?: (payload: any) => void;
  fullWidth?: boolean;
  maxHeight?: string;
  className?: string;
};`,
        api: [
          {
            name: 'scope',
            type: "NotificationListParams['scope']",
            description: 'Limits the notifications to a single scope or shows the aggregate inbox.',
          },
          {
            name: 'onAction',
            type: '(payload: any) => void',
            description: 'Called when the panel emits an action from a notification CTA.',
          },
          {
            name: 'fullWidth',
            type: 'boolean',
            description: 'Expands the panel to fill the available width instead of using the compact popover width.',
          },
          {
            name: 'maxHeight',
            type: 'string',
            description: 'Controls the maximum panel height when you embed it in a fixed surface.',
          },
          {
            name: 'className',
            type: 'string',
            description: 'Optional class name for custom styling.',
          },
        ],
        sections: [
          {
            title: 'Behavior',
            paragraphs: [
              'The panel owns the inbox tabs, the unread filter, the settings menu, and the list actions. It is the full notification workspace, not just a list renderer.',
              'It keeps the active tab and unread-only filter locally so the user can move around without losing the current view.',
            ],
          },
          {
            title: 'Tabs',
            paragraphs: [
              'The panel starts with inbox, archive, and starred tabs. The current tab controls the query used to fetch notification items.',
              'The settings menu can toggle unread-only mode without changing the current scope.',
            ],
          },
          {
            title: 'Actions',
            paragraphs: [
              'The panel can mark notifications as read or unread, archive them, star them, and bulk-handle all unread items that match the current query.',
            ],
          },
        ],
      },
    ],
  };
