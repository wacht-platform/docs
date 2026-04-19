import type { SharedGroup } from './shared-sdk-pages.types';
import { deploymentUiSettingsFields } from './shared-sdk-pages.catalog';

export const controlComponentGroup: SharedGroup = {
    label: 'Control',
    docs: [
      {
        slug: 'deployment-provider',
        title: 'DeploymentProvider',
        description: 'Load deployment state and make the client auth context available to the rest of the app.',
        importName: 'DeploymentProvider',
        intro:
          '`DeploymentProvider` is the shared root for the frontend adapters. Under the hood the adapter-specific provider just creates the right router adapter and forwards `publicKey` and `uiOverwrites` into the shared JSX provider.',
        example: `<DeploymentProvider publicKey={PUBLIC_KEY}>
  {children}
</DeploymentProvider>`,
        points: [
          'Mount it once near the root of the app.',
          'Everything else in the shared client layer assumes this context already exists.',
          'This is also the place where `uiOverwrites` belongs when you are embedding auth screens inside your own app.',
        ],
        signature: `type DeploymentProviderProps = {
  publicKey: string;
  uiOverwrites?: Partial<DeploymentUISettings>;
  children: React.ReactNode;
};

declare function DeploymentProvider(props: DeploymentProviderProps): JSX.Element;`,
        api: [
          {
            name: 'publicKey',
            type: 'string',
            required: true,
            description: 'The publishable key for the deployment. The provider decodes this key to discover the backend host and load deployment state.',
          },
          {
            name: 'uiOverwrites',
            type: 'Partial<DeploymentUISettings>',
            description: 'Optional UI overrides applied on top of the loaded deployment UI settings. This is useful when you want hosted defaults but need in-app auth routes or redirect URLs to point somewhere else.',
            children: deploymentUiSettingsFields,
          },
          {
            name: 'children',
            type: 'React.ReactNode',
            required: true,
            description: 'The application subtree that should receive deployment, auth, and navigation context.',
          },
        ],
        details: [
          'The provider decodes the backend base URL from the public key, requests `/deployment`, and stores the result in context.',
          'In staging mode it also manages the `__dev_session__` handshake and persists the development session locally.',
          'If `uiOverwrites` is passed, the shared provider shallow-merges it into `deployment.ui_settings` after the deployment loads.',
        ],
        examples: [
          {
            title: 'Root layout',
            code: `export default function RootLayout({ children }) {
  return (
    <DeploymentProvider publicKey={process.env.NEXT_PUBLIC_WACHT_PUBLISHABLE_KEY!}>
      <DeploymentInitialized>{children}</DeploymentInitialized>
    </DeploymentProvider>
  );
}`,
          },
          {
            title: 'Embedded auth with UI overrides',
            code: `<DeploymentProvider
  publicKey={PUBLIC_KEY}
  uiOverwrites={{
    sign_in_page_url: '/sign-in',
    sign_up_page_url: '/sign-up',
  }}
>
  <SignInForm />
</DeploymentProvider>`,
          },
        ],
      },
      {
        slug: 'deployment-initialized',
        title: 'DeploymentInitialized',
        description: 'Render children only after the deployment has finished loading.',
        importName: 'DeploymentInitialized',
        intro:
          '`DeploymentInitialized` is the quiet branch. It waits for the deployment request to settle before it renders its children.',
        example: `<DeploymentProvider publicKey={PUBLIC_KEY}>
  <DeploymentInitialized>{children}</DeploymentInitialized>
</DeploymentProvider>`,
        points: [
          'Use it when you want to avoid flashing signed-out UI before the deployment context is ready.',
          'It returns `null` while deployment loading is still in progress.',
        ],
      },
      {
        slug: 'deployment-initializing',
        title: 'DeploymentInitializing',
        description: 'Render a loading fallback while the deployment is still being resolved.',
        importName: 'DeploymentInitializing',
        intro:
          '`DeploymentInitializing` is the inverse of `DeploymentInitialized`. It exists for the short loading branch before the main app can render.',
        example: `<DeploymentProvider publicKey={PUBLIC_KEY}>
  <DeploymentInitializing>Loading…</DeploymentInitializing>
  <DeploymentInitialized>{children}</DeploymentInitialized>
</DeploymentProvider>`,
        points: [
          'Use it when you want a skeleton or loader while deployment state is being fetched.',
          'Once loading finishes, it disappears completely.',
        ],
      },
      {
        slug: 'default-styles-provider',
        title: 'DefaultStylesProvider',
        description: 'Apply the shared default styling layer around embedded Wacht UI.',
        importName: 'DefaultStylesProvider',
        intro:
          '`DefaultStylesProvider` wraps the stock shared components with their default style context. It is useful when you want the built-in UI to look correct without rebuilding the styling layer yourself.',
        example: `<DefaultStylesProvider>
  <SignInForm />
</DefaultStylesProvider>`,
        points: [
          'Use it around embedded auth or account surfaces if you want the stock look.',
          'Skip it if you are deliberately replacing the shared styling with your own system.',
        ],
      },
      {
        slug: 'signed-in',
        title: 'SignedIn',
        description: 'Render children only when the current session has an active sign-in.',
        importName: 'SignedIn',
        intro:
          '`SignedIn` is the small client-side branch for authenticated UI. It waits for the session to settle and renders its children only when the current session includes an active sign-in.',
        example: `<SignedIn>
  <UserButton />
</SignedIn>`,
        points: [
          'Use it for small UI branches, not for request-level protection.',
          'If the shared session is still loading, it renders nothing.',
        ],
        sections: [
          {
            title: 'Behavior',
            paragraphs: [
              'Wrap the bits of UI that should only exist once the user is signed in. The component does not add its own layout or fallback; it simply gates its children.',
              'That makes it a good fit for header actions, account shortcuts, and small signed-in branches that would be noisy to manage manually.',
            ],
          },
          {
            title: 'Branching',
            paragraphs: [
              'The component reads `useSession()` under the hood. While the session is still loading it returns nothing, then it checks whether the session has sign-ins and an active sign-in before rendering children.',
              'If the session is empty or the active sign-in is missing, the branch stays closed.',
            ],
          },
        ],
      },
      {
        slug: 'signed-out',
        title: 'SignedOut',
        description: 'Render children only when the current session does not have an active sign-in.',
        importName: 'SignedOut',
        intro:
          '`SignedOut` is the inverse branch. It renders only when the current session does not have an active sign-in, so it is the clean way to keep sign-in prompts and hosted redirects out of the signed-in experience.',
        example: `<SignedOut>
  <button>Sign in</button>
</SignedOut>`,
        points: [
          'Use it around buttons, hosted redirects, or embedded auth entry points.',
          'It is the cleanest counterpart to `SignedIn` in small client-side branches.',
        ],
        sections: [
          {
            title: 'Behavior',
            paragraphs: [
              'Use it for login prompts, sign-in links, and redirect-only auth entry points. The component stays out of the way when the user is already signed in.',
              'It is usually paired with `SignedIn` so a page can switch between the two states without any extra conditional logic.',
            ],
          },
          {
            title: 'Branching',
            paragraphs: [
              'The component also depends on `useSession()`. It waits for loading to finish, then keeps rendering only while there is no active sign-in in the current session.',
              'If the session contains sign-ins and an active sign-in, the branch closes immediately.',
            ],
          },
        ],
      },
      {
        slug: 'navigate-to-sign-in',
        title: 'NavigateToSignIn',
        description: 'Trigger a client-side redirect to the hosted sign-in page.',
        importName: 'NavigateToSignIn',
        intro:
          '`NavigateToSignIn` is the redirect-only control component for the hosted sign-in path. It runs the navigation helper on mount and then gets out of the way.',
        example: `<SignedOut>
  <NavigateToSignIn />
</SignedOut>`,
        points: [
          'Use it when you want hosted sign-in instead of an embedded form.',
          'The target URL comes from the deployment UI settings.',
        ],
        sections: [
          {
            title: 'Behavior',
            paragraphs: [
              'Place it inside `SignedOut` when a route should immediately hand off to hosted sign-in instead of rendering its own form.',
              'It does not render visible UI on its own. The component exists only to trigger the redirect at the right time.',
            ],
          },
          {
            title: 'Redirect',
            paragraphs: [
              'The component reads the navigation helper from `useNavigation()` and calls `navigateToSignIn()` in an effect as soon as it mounts.',
              'That keeps the redirect logic in one place and lets the deployment settings decide where the hosted sign-in page lives.',
            ],
          },
        ],
      },
      {
        slug: 'require-active-tenancy',
        title: 'RequireActiveTenancy',
        description: 'Keep the app hidden until the user has a valid organization and workspace scope.',
        importName: 'RequireActiveTenancy',
        intro:
          '`RequireActiveTenancy` is the tenancy gate for apps that are organized around organizations and workspaces. It keeps scoped UI out of the way until the current session has a valid place to land.',
        example: `<RequireActiveTenancy>
  {children}
</RequireActiveTenancy>`,
        points: [
          'Use it when a page only makes sense after the user has chosen an organization or workspace.',
          'It is the guard that sits in front of the rest of the scoped app, not a settings surface on its own.',
        ],
        sections: [
          {
            title: 'What it guards',
            paragraphs: [
              'The component waits for tenancy state to load, then checks the active organization and, when workspaces are enabled, the active workspace that belongs to that organization.',
              'If the scope is valid it renders its children. If not, it opens the organization selector so the user can fix the scope before the app continues.',
            ],
          },
          {
            title: 'How it decides',
            paragraphs: [
              'The gate reads `useActiveTenancy()` under the hood. That hook combines the session, organization memberships, and workspace memberships into one tenancy check.',
              'If the current organization or workspace is restricted, missing, or out of sync with the active session, the gate stays closed and shows the selector flow instead.',
            ],
            points: [
              'When workspaces are disabled, an organization is enough.',
              'When workspaces are enabled, both the organization and workspace have to line up.',
              'The gate does not create a new tenancy; it only asks the user to pick a valid one.',
            ],
          },
          {
            title: 'When to use it',
            paragraphs: [
              'Use it around the main shell of an app that needs tenancy context before rendering anything useful. It keeps downstream pages from having to repeat the same scope check.',
              'It is especially useful when the app contains organization settings, workspace settings, or data that should never show up against the wrong tenant.',
            ],
          },
        ],
      },
    ],
};
