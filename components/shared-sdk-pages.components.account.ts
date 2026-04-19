import type { SharedGroup } from './shared-sdk-pages.types';

export const accountComponentGroup: SharedGroup = {
    label: 'Account',
    docs: [
      {
        slug: 'user-button',
        title: 'UserButton',
        description: 'Render the signed-in account trigger and its dropdown actions.',
        importName: 'UserButton',
        intro:
          '`UserButton` is the compact account trigger for signed-in users. It shows the current account, opens the account menu, and adapts its actions to the current session and deployment settings.',
        example: `<SignedIn>
  <UserButton showName={false} />
</SignedIn>`,
        points: [
          'This is the shared component most apps place in the top-right corner.',
          'It is the lightest way to add account controls without mounting the full account surface inline.',
        ],
        signature: `type UserButtonProps = {
  showName?: boolean;
};

declare function UserButton(props: UserButtonProps): JSX.Element;`,
        api: [
          {
            name: 'showName',
            type: 'boolean',
            description: 'Whether the active user name is shown next to the avatar trigger.',
          },
        ],
        sections: [
          {
            title: 'Behavior',
            paragraphs: [
              'Use it when you want a compact signed-in control in the header or account area. The component renders the avatar trigger and, optionally, the account name beside it.',
              'It is the smaller alternative to mounting the full account surface inline.',
            ],
          },
          {
            title: 'Account menu',
            paragraphs: [
              'Clicking the trigger opens a floating menu with the current account, the manage-account action, and the sign-out action for the active sign-in.',
              'The menu uses the current session state, so it reflects the active user rather than a static profile snapshot.',
            ],
          },
          {
            title: 'Multi-session behavior',
            paragraphs: [
              'When multi-session support is enabled, the menu sorts sign-ins so the active account stays at the top and the other accounts remain available to switch to.',
              'If more than one sign-in exists, the menu also exposes a way to sign out of all accounts instead of only the active one.',
            ],
          },
          {
            title: 'Actions',
            paragraphs: [
              'The manage-account action opens the fuller account settings dialog.',
              'The sign-out action respects the current session mode, so one-sign-in sign-out and full-session sign-out are handled separately.',
            ],
          },
        ],
        examples: [
          {
            title: 'Compact header control',
            code: `<SignedIn>
  <UserButton showName={false} />
</SignedIn>`,
          },
          {
            title: 'Header control with name',
            code: `<SignedIn>
  <UserButton showName />
</SignedIn>`,
          },
        ],
      },
      {
        slug: 'user-controls',
        title: 'UserControls',
        description: 'Render the stock signed-in controls cluster.',
        importName: 'UserControls',
        intro:
          '`UserControls` is the small signed-in cluster that combines the account trigger with the notification bell. It gives you the stock header setup without wiring the pieces together yourself.',
        example: `<SignedIn>
  <UserControls />
</SignedIn>`,
        points: [
          'Use it when the default account-plus-notification cluster is enough.',
          'Split it apart when you need the account trigger or notification bell in different places.',
        ],
        sections: [
          {
            title: 'Behavior',
            paragraphs: [
              'Mount it in a header or top bar when you want the standard signed-in controls together in one place. It is a thin composition layer over `UserButton` and `NotificationBell`, not a separate account system.',
            ],
          },
          {
            title: 'Composition',
            paragraphs: [
              'The control cluster renders the notification bell first when notifications are enabled, then the user button with the current account state. If notifications are turned off, only the account trigger remains.',
            ],
          },
        ],
        examples: [
          {
            title: 'Signed-in header cluster',
            code: `<SignedIn>
  <UserControls />
</SignedIn>`,
          },
          {
            title: 'Split controls',
            code: `<SignedIn>
  <NotificationBell />
  <UserButton />
</SignedIn>`,
          },
        ],
      },
      {
        slug: 'manage-account',
        title: 'ManageAccount',
        description: 'Render the built-in account management surface.',
        importName: 'ManageAccount',
        intro:
          '`ManageAccount` is the fuller account settings surface. It covers profile details, security, sessions, and other user-owned settings.',
        example: `<ManageAccount />`,
        points: [
          'Use it on a dedicated account page or in an account-focused modal flow.',
          'Reach for this when `UserButton` is too compact and the user needs full settings access.',
        ],
        sections: [
          {
            title: 'Overview',
            paragraphs: [
              'Mount it on a dedicated account page or inside a dialog when the user needs the full account management surface instead of the compact menu from `UserButton`.',
              'The component is not just a profile form. It is the complete account workspace for the signed-in user, built out of several tabs that appear or disappear based on deployment settings.',
            ],
          },
          {
            title: 'Behavior',
            paragraphs: [
              'The component waits for the user data to load, then renders tabbed sections for profile, email, phone, social connections, security, and sessions based on the deployment settings. Tabs only appear when the current deployment actually supports them, so the surface stays aligned with the current auth configuration.',
              'Each tab is backed by a separate section component, which is why the page can stay compact at the top and still cover a large account surface without turning into one long form.',
              'The active tab lives in local component state, so the user can move between sections without losing the values they already changed in the current tab.',
            ],
          },
          {
            title: 'Profile',
            paragraphs: [
              'The profile section handles the user’s name, username, and profile picture. It is the first section the component opens because it is the most common account edit path.',
            ],
          },
          {
            title: 'Email',
            paragraphs: [
              'The email section is shown only when email is enabled for the deployment. It manages the user’s email addresses and the verification flow around them.',
            ],
          },
          {
            title: 'Phone',
            paragraphs: [
              'The phone section appears only when phone auth is enabled. It follows the same pattern as email: show the data, manage the verification state, and keep the user inside the same account surface.',
            ],
          },
          {
            title: 'Connections',
            paragraphs: [
              'The connections section only appears when the deployment has social connections turned on. It is where linked external identities are shown and managed.',
            ],
          },
          {
            title: 'Security',
            paragraphs: [
              'The security section is conditional on the deployment’s password, authenticator, phone OTP, or backup-code settings. It is where the account’s password and second-factor controls live.',
            ],
          },
          {
            title: 'Sessions',
            paragraphs: [
              'The sessions section is always available. It exposes the active session list so the user can review or end browser sessions from the same page.',
            ],
          },
          {
            title: 'Notes',
            paragraphs: [
              'If the deployment disables a feature, the corresponding tab never appears. That keeps the page honest about what the current app can actually manage.',
              'The page is intentionally split across sections because the implementation is split the same way.',
            ],
          },
        ],
      },
    ],
  };
