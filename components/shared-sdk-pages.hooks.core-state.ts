import type { SharedGroup } from './shared-sdk-pages.types';
import { deploymentUiSettingsFields } from './shared-sdk-pages.catalog';

export const coreStateHookGroup: SharedGroup = {
    label: 'State and context',
    docs: [
      {
        slug: 'use-deployment',
        title: 'useDeployment',
        description: 'Read the resolved deployment and the adapter context.',
        importName: 'useDeployment',
        intro:
          '`useDeployment` is the root hook for the shared client layer. It reads the deployment context created by `DeploymentProvider` and gives the rest of the client hooks their deployment-aware behavior.',
        example: `export default function DeploymentDebug() {
  const { deployment, loading, adapter } = useDeployment();

  if (loading) {
    return <div>Loading deployment...</div>;
  }

  return (
    <div>
      <p>{deployment.ui_settings.app_name}</p>
      <p>{deployment.frontend_host}</p>
      <p>{adapter.useNavigate() ? 'Adapter ready' : 'No adapter'}</p>
    </div>
  );
}`,
        points: [
          'Use it when a component needs deployment settings, frontend URLs, or adapter behavior.',
          'It throws if you call it outside `DeploymentProvider`.',
        ],
        signature: `type UseDeploymentResult = {
  loading: boolean;
  deployment: Deployment | null;
  adapter: PlatformAdapter;
};

declare function useDeployment(): UseDeploymentResult;`,
        api: [
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the deployment request is still in flight.',
          },
          {
            name: 'deployment',
            type: 'Deployment | null',
            required: true,
            description: 'The resolved deployment object from `DeploymentProvider`.',
            children: [
              {
                name: 'backend_host',
                type: 'string',
                description: 'The backend host resolved from the public key and used for client requests.',
              },
              {
                name: 'frontend_host',
                type: 'string',
                description: 'The frontend host configured for the deployment.',
              },
              {
                name: 'mode',
                type: '"production" | "staging"',
                description: 'The deployment mode, used for staging-only behaviors like the development session handshake.',
              },
              {
                name: 'auth_settings',
                type: 'AuthSettings',
                description: 'The deployment-level authentication settings that drive the shared auth UI and flows.',
                children: [
                  {
                    name: 'first_factor',
                    type: 'FirstFactor',
                    description: 'The default first-factor strategy for sign-in.',
                  },
                  {
                    name: 'second_factor_policy',
                    type: 'SecondFactorPolicy',
                    description: 'Whether second-factor auth is disabled, optional, or enforced.',
                  },
                  {
                    name: 'multi_session_support',
                    type: 'MultiSessionSupport',
                    description: 'Controls whether the deployment allows multiple signed-in accounts in one session.',
                    children: [
                      {
                        name: 'enabled',
                        type: 'boolean',
                        description: 'Whether multi-session support is enabled.',
                      },
                      {
                        name: 'max_accounts_per_session',
                        type: 'number',
                        description: 'The maximum number of accounts allowed in one browser session.',
                      },
                    ],
                  },
                  {
                    name: 'passkey',
                    type: 'PasskeySettings',
                    description: 'Passkey availability and prompting rules.',
                    children: [
                      {
                        name: 'enabled',
                        type: 'boolean',
                        description: 'Whether passkeys are enabled for the deployment.',
                      },
                      {
                        name: 'prompt_registration_on_auth',
                        type: 'boolean',
                        description: 'Whether users are prompted to register a passkey after signing in.',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'b2b_settings',
                type: 'B2BSettings',
                description: 'The deployment-level organization and workspace settings.',
                children: [
                  {
                    name: 'organizations_enabled',
                    type: 'boolean',
                    description: 'Whether organizations are enabled for the deployment.',
                  },
                  {
                    name: 'workspaces_enabled',
                    type: 'boolean',
                    description: 'Whether workspaces are enabled under organizations.',
                  },
                  {
                    name: 'allow_users_to_create_orgs',
                    type: 'boolean',
                    description: 'Whether end users can create organizations without operator intervention.',
                  },
                  {
                    name: 'custom_org_role_enabled',
                    type: 'boolean',
                    description: 'Whether custom organization roles are enabled.',
                  },
                  {
                    name: 'custom_workspace_role_enabled',
                    type: 'boolean',
                    description: 'Whether custom workspace roles are enabled.',
                  },
                  {
                    name: 'enterprise_sso_enabled',
                    type: 'boolean',
                    description: 'Whether enterprise SSO is enabled for organizations.',
                  },
                ],
              },
              {
                name: 'ui_settings',
                type: 'DeploymentUISettings',
                description: 'The UI settings for hosted routes, redirects, and embedded auth configuration.',
                children: deploymentUiSettingsFields,
              },
            ],
          },
          {
            name: 'adapter',
            type: 'PlatformAdapter',
            required: true,
            description: 'The adapter object injected by the framework package. This is what gives the shared hooks framework-aware navigation.',
          },
        ],
        details: [
          'The hook itself is small. It reads the value from `DeploymentContext`, then enforces the two invariants the rest of the shared client layer depends on: the hook must be inside `DeploymentProvider`, and once loading is finished there must be a deployment object.',
          'The provider does the real work. It decodes the backend host from the public key, loads `/deployment`, applies any `uiOverwrites`, and persists the staging `__dev_session__` handshake when the deployment is in test mode.',
          'Because every other shared client hook depends on that same context, `useDeployment()` is the cleanest way to inspect what the client layer thinks the current deployment looks like.',
        ],
        examples: [
          {
            title: 'Read app branding from the deployment',
            code: `export default function AppHeader() {
  const { deployment, loading } = useDeployment();

  if (loading) {
    return null;
  }

  return <h1>{deployment.ui_settings.app_name}</h1>;
}`,
          },
          {
            title: 'Use deployment settings to branch UI',
            code: `export default function WorkspaceGate() {
  const { deployment, loading } = useDeployment();

  if (loading) {
    return null;
  }

  return deployment.b2b_settings.workspaces_enabled ? (
    <div>Workspace-enabled deployment</div>
  ) : (
    <div>Organizations only</div>
  );
}`,
          },
        ],
      },
      {
        slug: 'use-client',
        title: 'useClient',
        description: 'Read the low-level client instance used by the shared hooks.',
        importName: 'useClient',
        intro:
          '`useClient` gives you the low-level fetch wrapper that the shared hooks use for browser-side API calls. It builds requests from the current deployment instead of from a separate client configuration layer.',
        example: `export default function PrivateData() {
  const { client, loading } = useClient();

  async function load() {
    const response = await client('/me');
    const data = await response.json();
    console.log(data);
  }

  if (loading) {
    return null;
  }

  return <button onClick={load}>Load profile</button>;
}`,
        points: [
          'Use it for advanced calls that are not already wrapped by a higher-level hook.',
          'If a domain-specific hook already exists, prefer that instead.',
        ],
        signature: `type UseClientResult = {
  client: Client;
  loading: boolean;
};

declare function useClient(): UseClientResult;`,
        api: [
          {
            name: 'client',
            type: 'Client',
            required: true,
            description: 'A deployment-aware fetch function that prefixes the backend host, merges headers, and applies the correct environment-specific request behavior.',
          },
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the deployment is still loading. While this is true, the client will throw if you try to call it.',
          },
        ],
        details: [
          'The hook does not create a separate client singleton or context. It reads `deployment` and `loading` from `useDeployment()`, then memoizes a `client(url, options)` function around that state.',
          'That client automatically prefixes the deployment backend host, preserves any caller-provided headers, and chooses the default request mode from the deployment. In production it sends `credentials: "include"`, and in staging it appends the stored `__dev_session__` token to the query string instead.',
          'If a staging response returns `x-development-session`, the hook persists that value so later requests keep using the same development session.',
          'If you call the client before the deployment is ready, it throws `Deployment is loading` instead of guessing how to build the request.',
        ],
        examples: [
          {
            title: 'Call a backend route directly',
            code: `export default function ProfileLoader() {
  const { client, loading } = useClient();

  async function loadProfile() {
    const response = await client('/me');
    const result = await response.json();
    console.log(result);
  }

  if (loading) {
    return null;
  }

  return <button onClick={loadProfile}>Load profile</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-session',
        title: 'useSession',
        description: 'Read and mutate the current session state.',
        importName: 'useSession',
        intro:
          '`useSession` is the core auth-state hook. It exposes the current session object plus the mutations that change active sign-ins, change organization or workspace scope, sign out, exchange tickets, and fetch session tokens.',
        example: `export default function SessionSummary() {
  const { session, loading } = useSession();

  if (loading) {
    return null;
  }

  return <div>{session.active_signin?.user.email_address}</div>;
}`,
        points: [
          'Use this when the app needs to know which sign-in is active.',
          'This is also where account switching and token reads live on the client side.',
        ],
        signature: `type UseSessionResult = {
  loading: boolean;
  error?: unknown;
  refetch: () => Promise<void>;
  session?: Session;
  switchSignIn: (signInId: string) => Promise<void>;
  switchOrganization: (organizationId?: string) => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  signOut: (signInId?: string) => Promise<void>;
  getToken: (template?: string) => Promise<string>;
  exchangeTicket: (ticket: string) => Promise<void>;
};

declare function useSession(): UseSessionResult;`,
        api: [
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the session request is still in flight.',
          },
          {
            name: 'error',
            type: 'unknown',
            description: 'The session-loading error, if one occurred.',
          },
          {
            name: 'refetch',
            type: '() => Promise<void>',
            required: true,
            description: 'Revalidate the current session state.',
          },
          {
            name: 'session',
            type: 'Session',
            description: 'The loaded session object. This is only available once loading has completed successfully.',
            children: [
              {
                name: 'active_signin',
                type: 'SignIn | null',
                description: 'The sign-in currently active in the session.',
                children: [
                  {
                    name: 'id',
                    type: 'string',
                    description: 'The active sign-in identifier.',
                  },
                  {
                    name: 'active_organization_membership_id',
                    type: 'string',
                    description: 'The active organization membership attached to this sign-in.',
                  },
                  {
                    name: 'active_workspace_membership_id',
                    type: 'string',
                    description: 'The active workspace membership attached to this sign-in.',
                  },
                  {
                    name: 'expiresAt',
                    type: 'string',
                    description: 'When the current sign-in expires.',
                  },
                  {
                    name: 'lastActiveAt',
                    type: 'string',
                    description: 'When the sign-in was last active.',
                  },
                  {
                    name: 'user',
                    type: 'CurrentUser',
                    description: 'The current user attached to the active sign-in.',
                    children: [
                      {
                        name: 'id',
                        type: 'string',
                        description: 'The current user identifier.',
                      },
                      {
                        name: 'first_name',
                        type: 'string',
                        description: 'The user first name.',
                      },
                      {
                        name: 'last_name',
                        type: 'string',
                        description: 'The user last name.',
                      },
                      {
                        name: 'username',
                        type: 'string',
                        description: 'The username if one is set.',
                      },
                      {
                        name: 'primary_email_address',
                        type: 'UserEmailAddress',
                        description: 'The primary email address for the current user.',
                        children: [
                          {
                            name: 'email',
                            type: 'string',
                            description: 'The email address value.',
                          },
                          {
                            name: 'verified',
                            type: 'boolean',
                            description: 'Whether the primary email address has been verified.',
                          },
                        ],
                      },
                      {
                        name: 'primary_phone_number',
                        type: 'UserPhoneNumber',
                        description: 'The primary phone number when one is available.',
                        children: [
                          {
                            name: 'phone_number',
                            type: 'string',
                            description: 'The phone number value.',
                          },
                          {
                            name: 'verified',
                            type: 'boolean',
                            description: 'Whether the primary phone number has been verified.',
                          },
                        ],
                      },
                      {
                        name: 'has_password',
                        type: 'boolean',
                        description: 'Whether the current user has a password set.',
                      },
                      {
                        name: 'has_passkeys',
                        type: 'boolean',
                        description: 'Whether the current user has registered passkeys.',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'signins',
                type: 'SignIn[]',
                description: 'All sign-ins attached to the current session, including inactive ones in multi-session mode.',
              },
              {
                name: 'signin_attempts',
                type: 'SigninAttempt[]',
                description: 'Incomplete or resumable sign-in attempts attached to the current session.',
                children: [
                  {
                    name: 'id',
                    type: 'string',
                    description: 'The sign-in attempt identifier.',
                  },
                  {
                    name: 'method',
                    type: 'SignInMethod',
                    description: 'The current sign-in method for the attempt.',
                  },
                  {
                    name: 'current_step',
                    type: 'CurrentSessionStep',
                    description: 'The current step that still needs to be completed.',
                  },
                  {
                    name: 'completed',
                    type: 'boolean',
                    description: 'Whether the sign-in attempt has completed.',
                  },
                  {
                    name: 'second_method_authentication_required',
                    type: 'boolean',
                    description: 'Whether a second factor is still required.',
                  },
                  {
                    name: 'available_2fa_methods',
                    type: 'string[]',
                    description: 'The second-factor methods available to this attempt.',
                  },
                  {
                    name: 'requires_completion',
                    type: 'boolean',
                    description: 'Whether the attempt still needs profile completion.',
                  },
                  {
                    name: 'missing_fields',
                    type: 'string[]',
                    description: 'The fields still missing from an incomplete profile.',
                  },
                  {
                    name: 'profile_completion_data',
                    type: 'ProfileCompletionData',
                    description: 'The profile fields that can be prefilled during completion.',
                    children: [
                      {
                        name: 'first_name',
                        type: 'string',
                        description: 'The suggested first name.',
                      },
                      {
                        name: 'last_name',
                        type: 'string',
                        description: 'The suggested last name.',
                      },
                      {
                        name: 'username',
                        type: 'string',
                        description: 'The suggested username.',
                      },
                      {
                        name: 'email',
                        type: 'string',
                        description: 'The suggested email address.',
                      },
                      {
                        name: 'phone_number',
                        type: 'string',
                        description: 'The suggested phone number.',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'signup_attempts',
                type: 'SignupAttempt[]',
                description: 'Incomplete or resumable sign-up attempts attached to the current session.',
                children: [
                  {
                    name: 'id',
                    type: 'string',
                    description: 'The sign-up attempt identifier.',
                  },
                  {
                    name: 'current_step',
                    type: 'SignupAttemptStep',
                    description: 'The verification step the sign-up attempt is currently on.',
                  },
                  {
                    name: 'remaining_steps',
                    type: 'SignupAttemptStep[]',
                    description: 'The verification steps that still remain.',
                  },
                  {
                    name: 'completed',
                    type: 'boolean',
                    description: 'Whether the sign-up attempt has completed.',
                  },
                  {
                    name: 'required_fields',
                    type: 'string[]',
                    description: 'The fields the sign-up flow requires.',
                  },
                  {
                    name: 'missing_fields',
                    type: 'string[]',
                    description: 'The required fields still missing from the sign-up attempt.',
                  },
                ],
              },
            ],
          },
          {
            name: 'switchSignIn',
            type: '(signInId: string) => Promise<void>',
            description: 'Switch the active account inside a multi-sign-in session.',
          },
          {
            name: 'switchOrganization',
            type: '(organizationId?: string) => Promise<void>',
            description: 'Change the active organization scope in the current session.',
          },
          {
            name: 'switchWorkspace',
            type: '(workspaceId: string) => Promise<void>',
            description: 'Change the active workspace scope in the current session.',
          },
          {
            name: 'signOut',
            type: '(signInId?: string) => Promise<void>',
            description: 'Sign out one sign-in when an ID is provided, or sign out the entire session when it is omitted.',
          },
          {
            name: 'getToken',
            type: '(template?: string) => Promise<string>',
            description: 'Read a bearer token for the current session. Tokens are cached by template until expiry and cleared when session state changes.',
          },
          {
            name: 'exchangeTicket',
            type: '(ticket: string) => Promise<void>',
            description: 'Exchange a ticket for session state during redirect or handshake flows.',
          },
        ],
        details: [
          'The hook fetches the current session with SWR and keeps it warm with a periodic refresh instead of rebuilding session state separately inside each auth surface.',
          'The return value is split into a loading branch and a loaded branch. While the session is still loading, the mutation methods are intentionally unavailable.',
          'Session mutations clear the shared token cache and invalidate related organization, workspace, and notification state where needed.',
          'Calling `switchSignIn()` also refreshes organization and workspace memberships, because the active account can change the available scopes completely.',
          'Calling `signOut(signInId)` signs out one sign-in. Calling `signOut()` signs out the whole session and then follows the deployment-configured post-sign-out URL when one is set.',
          'Calling `getToken()` without a live session throws instead of returning an empty token. Successful token reads are cached per template until the token expires.',
        ],
        examples: [
          {
            title: 'Read active session state',
            code: `export default function SessionSummary() {
  const { session, loading } = useSession();

  if (loading) {
    return null;
  }

  return <div>{session.active_signin?.user.email_address}</div>;
}`,
          },
          {
            title: 'Switch accounts in a multi-session app',
            code: `export default function AccountSwitcher() {
  const { session, loading, switchSignIn } = useSession();

  if (loading || !session.signins?.length) {
    return null;
  }

  return session.signins.map((signin) => (
    <button key={signin.id} onClick={() => switchSignIn(signin.id)}>
      {signin.user.email_address}
    </button>
  ));
}`,
          },
          {
            title: 'Read a bearer token for an authenticated request',
            code: `export default function PrivateRequestButton() {
  const { getToken, loading } = useSession();

  async function callPrivateApi() {
    const token = await getToken();

    await fetch('/api/private', {
      headers: {
        Authorization: \`Bearer \${token}\`,
      },
    });
  }

  if (loading) {
    return null;
  }

  return <button onClick={callPrivateApi}>Call private API</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-user',
        title: 'useUser',
        description: 'Read and mutate the active user record.',
        importName: 'useUser',
        intro:
          '`useUser` is the broadest user-management hook in the shared client layer. It owns the current user record together with the mutations for profile updates, contact methods, authenticators, backup codes, passwords, social connections, and passkeys.',
        example: `export default function ProfileSettings() {
  const { user, loading, updateProfile } = useUser();

  if (loading) {
    return null;
  }

  async function save() {
    await updateProfile({
      first_name: user.first_name,
      last_name: user.last_name,
    });
  }

  return <button onClick={save}>Save profile</button>;
}`,
        points: [
          'Use it when you need profile data or user-level mutations.',
          'This is a broader surface than `useSession`, which is focused on the session rather than the profile.',
        ],
        signature: `type UseUserResult = {
  user: (CurrentUser & { refetch: () => Promise<CurrentUser | undefined> }) | undefined;
  loading: boolean;
  error: Error | null;
  updateProfile: (data: ProfileUpdateData) => Promise<ApiResult<unknown>>;
  getEmailAddresses: () => Promise<ApiResult<unknown>>;
  getEmailAddress: (id: string) => Promise<ApiResult<unknown>>;
  createEmailAddress: (email: string) => Promise<ApiResult<UserEmailAddress>>;
  deleteEmailAddress: (id: string) => Promise<ApiResult<unknown>>;
  prepareEmailVerification: (id: string) => Promise<ApiResult<unknown>>;
  attemptEmailVerification: (id: string, otp: string) => Promise<ApiResult<unknown>>;
  makeEmailPrimary: (id: string) => Promise<ApiResult<unknown>>;
  createPhoneNumber: (phoneNumber: string, countryCode: string) => Promise<ApiResult<UserPhoneNumber>>;
  deletePhoneNumber: (id: string) => Promise<ApiResult<unknown>>;
  preparePhoneVerification: (id: string) => Promise<ApiResult<unknown>>;
  attemptPhoneVerification: (id: string, otp: string) => Promise<ApiResult<unknown>>;
  makePhonePrimary: (id: string) => Promise<ApiResult<unknown>>;
  setupAuthenticator: () => Promise<UserAuthenticator>;
  verifyAuthenticator: (id: string, codes: string[]) => Promise<ApiResult<unknown>>;
  deleteAuthenticator: (id: string) => Promise<ApiResult<unknown>>;
  generateBackupCodes: () => Promise<string[]>;
  regenerateBackupCodes: () => Promise<string[]>;
  updateProfilePicture: (file: File) => Promise<ApiResult<unknown>>;
  disconnectSocialConnection: (id: string) => Promise<ApiResult<unknown>>;
  connectSocialAccount: (params: { provider: string; redirectUri?: string }) => Promise<ApiResult<{ oauth_url: string }>>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<ApiResult<unknown>>;
  removePassword: (currentPassword: string) => Promise<ApiResult<unknown>>;
  deleteAccount: (password: string) => Promise<ApiResult<unknown>>;
  getPasskeys: () => Promise<ApiResult<UserPasskey[]>>;
  registerPasskey: (name?: string) => Promise<ApiResult<unknown>>;
  deletePasskey: (id: string) => Promise<ApiResult<unknown>>;
  renamePasskey: (id: string, name: string) => Promise<ApiResult<unknown>>;
};

declare function useUser(): UseUserResult;`,
        api: [
          {
            name: 'user',
            type: 'CurrentUser & { refetch: () => Promise<CurrentUser | undefined> }',
            required: true,
            description: 'The current user record together with a `refetch()` helper from the underlying SWR cache.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'The current user identifier.',
              },
              {
                name: 'first_name',
                type: 'string',
                description: 'The user first name.',
              },
              {
                name: 'last_name',
                type: 'string',
                description: 'The user last name.',
              },
              {
                name: 'username',
                type: 'string',
                description: 'The username when one is set.',
              },
              {
                name: 'primary_email_address',
                type: 'UserEmailAddress',
                description: 'The primary email address record.',
                children: [
                  {
                    name: 'email',
                    type: 'string',
                    description: 'The email address value.',
                  },
                  {
                    name: 'verified',
                    type: 'boolean',
                    description: 'Whether the email address has been verified.',
                  },
                ],
              },
              {
                name: 'primary_phone_number',
                type: 'UserPhoneNumber',
                description: 'The primary phone number record when one exists.',
                children: [
                  {
                    name: 'phone_number',
                    type: 'string',
                    description: 'The phone number value.',
                  },
                  {
                    name: 'verified',
                    type: 'boolean',
                    description: 'Whether the phone number has been verified.',
                  },
                ],
              },
              {
                name: 'user_email_addresses',
                type: 'UserEmailAddress[]',
                description: 'All email addresses attached to the current user.',
              },
              {
                name: 'user_phone_numbers',
                type: 'UserPhoneNumber[]',
                description: 'All phone numbers attached to the current user.',
              },
              {
                name: 'social_connections',
                type: 'SocialConnection[]',
                description: 'The currently linked social accounts.',
              },
              {
                name: 'user_authenticator',
                type: 'UserAuthenticator',
                description: 'The current authenticator record when one exists.',
              },
              {
                name: 'backup_codes_generated',
                type: 'boolean',
                description: 'Whether backup codes have already been generated.',
              },
              {
                name: 'has_password',
                type: 'boolean',
                description: 'Whether the current user has a password set.',
              },
              {
                name: 'has_passkeys',
                type: 'boolean',
                description: 'Whether the current user has passkeys registered.',
              },
              {
                name: 'refetch',
                type: '() => Promise<CurrentUser | undefined>',
                description: 'Refreshes the current user record.',
              },
            ],
          },
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the user record is still loading.',
          },
          {
            name: 'error',
            type: 'Error | null',
            required: true,
            description: 'The user-loading error, if one occurred.',
          },
          {
            name: 'updateProfile',
            type: '(data: ProfileUpdateData) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Updates the core profile fields, primary contact IDs, second-factor policy, or profile-picture removal flag.',
            children: [
              {
                name: 'first_name',
                type: 'string',
                description: 'The new first name.',
              },
              {
                name: 'last_name',
                type: 'string',
                description: 'The new last name.',
              },
              {
                name: 'username',
                type: 'string',
                description: 'The new username.',
              },
              {
                name: 'primary_email_address_id',
                type: 'string',
                description: 'The email address to make primary.',
              },
              {
                name: 'primary_phone_number_id',
                type: 'string',
                description: 'The phone number to make primary.',
              },
              {
                name: 'second_factor_policy',
                type: '"none" | "optional" | "enforced"',
                description: 'The second-factor policy for the current user.',
              },
              {
                name: 'remove_profile_picture',
                type: 'boolean',
                description: 'Whether the current profile picture should be removed.',
              },
            ],
          },
          {
            name: 'getEmailAddresses',
            type: '() => Promise<ApiResult<UserEmailAddress[]>>',
            required: true,
            description: 'Loads all email addresses attached to the current user.',
            children: [
              {
                name: '[].id',
                type: 'string',
                description: 'Email-address record identifier.',
              },
              {
                name: '[].email',
                type: 'string',
                description: 'Email address value.',
              },
              {
                name: '[].is_primary',
                type: 'boolean',
                description: 'Whether the address is currently primary.',
              },
              {
                name: '[].verified',
                type: 'boolean',
                description: 'Whether the address has been verified.',
              },
              {
                name: '[].verified_at',
                type: 'string',
                description: 'Verification timestamp when the address has been verified.',
              },
              {
                name: '[].verification_strategy',
                type: '"otp" | "oath_google" | "oath_github" | "oauth_microsoft" | "oauth_facebook" | "oauth_linkedin" | "oauth_discord" | "oauth_apple"',
                description: 'Verification strategy attached to the address.',
              },
            ],
          },
          {
            name: 'getEmailAddress',
            type: '(id: string) => Promise<ApiResult<UserEmailAddress>>',
            required: true,
            description: 'Loads one specific email-address record for the current user.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Email-address record identifier.',
              },
              {
                name: 'email',
                type: 'string',
                description: 'Email address value.',
              },
              {
                name: 'is_primary',
                type: 'boolean',
                description: 'Whether the address is currently primary.',
              },
              {
                name: 'verified',
                type: 'boolean',
                description: 'Whether the address has been verified.',
              },
              {
                name: 'verified_at',
                type: 'string',
                description: 'Verification timestamp when the address has been verified.',
              },
              {
                name: 'verification_strategy',
                type: '"otp" | "oath_google" | "oath_github" | "oauth_microsoft" | "oauth_facebook" | "oauth_linkedin" | "oauth_discord" | "oauth_apple"',
                description: 'Verification strategy attached to the address.',
              },
            ],
          },
          {
            name: 'createEmailAddress',
            type: '(email: string) => Promise<ApiResult<UserEmailAddress>>',
            required: true,
            description: 'Creates a new email address for the current user.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Email-address record identifier.',
              },
              {
                name: 'email',
                type: 'string',
                description: 'Email address value.',
              },
              {
                name: 'is_primary',
                type: 'boolean',
                description: 'Whether the address is currently primary.',
              },
              {
                name: 'verified',
                type: 'boolean',
                description: 'Whether the address has been verified.',
              },
              {
                name: 'verified_at',
                type: 'string',
                description: 'Verification timestamp when the address has been verified.',
              },
              {
                name: 'verification_strategy',
                type: '"otp" | "oath_google" | "oath_github" | "oauth_microsoft" | "oauth_facebook" | "oauth_linkedin" | "oauth_discord" | "oauth_apple"',
                description: 'Verification strategy attached to the address.',
              },
            ],
          },
          {
            name: 'deleteEmailAddress',
            type: '(id: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Deletes an existing email address.',
          },
          {
            name: 'prepareEmailVerification',
            type: '(id: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Starts verification for an email address.',
          },
          {
            name: 'attemptEmailVerification',
            type: '(id: string, otp: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Submits an email verification code.',
          },
          {
            name: 'makeEmailPrimary',
            type: '(id: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Makes an email address primary.',
          },
          {
            name: 'createPhoneNumber',
            type: '(phone_number: string, country_code: string) => Promise<ApiResult<UserPhoneNumber>>',
            required: true,
            description: 'Creates a new phone number for the current user.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Phone-number record identifier.',
              },
              {
                name: 'phone_number',
                type: 'string',
                description: 'Phone number value.',
              },
              {
                name: 'country_code',
                type: 'string',
                description: 'Phone country code stored with the number.',
              },
              {
                name: 'verified',
                type: 'boolean',
                description: 'Whether the number has been verified.',
              },
              {
                name: 'verified_at',
                type: 'string',
                description: 'Verification timestamp when the number has been verified.',
              },
            ],
          },
          {
            name: 'deletePhoneNumber',
            type: '(id: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Deletes an existing phone number.',
          },
          {
            name: 'preparePhoneVerification',
            type: '(id: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Starts verification for a phone number.',
          },
          {
            name: 'attemptPhoneVerification',
            type: '(id: string, otp: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Submits a phone verification code.',
          },
          {
            name: 'makePhonePrimary',
            type: '(id: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Makes a phone number primary.',
          },
          {
            name: 'setupAuthenticator',
            type: '() => Promise<UserAuthenticator>',
            required: true,
            description: 'Creates an authenticator enrollment and returns the TOTP setup data.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Authenticator identifier.',
              },
              {
                name: 'created_at',
                type: 'string',
                description: 'Creation timestamp for the authenticator record.',
              },
              {
                name: 'totp_secret',
                type: 'string',
                description: 'TOTP secret when the setup flow exposes it.',
              },
              {
                name: 'otp_url',
                type: 'string',
                description: 'OTP provisioning URL for authenticator apps.',
              },
            ],
          },
          {
            name: 'verifyAuthenticator',
            type: '(id: string, codes: string[]) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Verifies an authenticator using one or more codes.',
          },
          {
            name: 'deleteAuthenticator',
            type: '(id: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Deletes an authenticator enrollment.',
          },
          {
            name: 'generateBackupCodes',
            type: '() => Promise<string[]>',
            required: true,
            description: 'Generates backup codes for the current user.',
          },
          {
            name: 'regenerateBackupCodes',
            type: '() => Promise<string[]>',
            required: true,
            description: 'Regenerates backup codes for the current user.',
          },
          {
            name: 'updateProfilePicture',
            type: '(file: File) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Uploads a new profile picture for the current user.',
          },
          {
            name: 'updatePassword',
            type: '(currentPassword: string, newPassword: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Changes the current password.',
          },
          {
            name: 'removePassword',
            type: '(currentPassword: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Removes the current password when the deployment allows it.',
          },
          {
            name: 'connectSocialAccount',
            type: '(params: { provider: string; redirectUri?: string }) => Promise<ApiResult<{ oauth_url: string }>>',
            required: true,
            description: 'Starts a social-account connection flow in a new browser window.',
            children: [
              {
                name: 'oauth_url',
                type: 'string',
                description: 'Provider URL that the browser opens to continue the connection flow.',
              },
            ],
          },
          {
            name: 'disconnectSocialConnection',
            type: '(id: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Disconnects an existing social connection.',
          },
          {
            name: 'getPasskeys',
            type: '() => Promise<ApiResult<UserPasskey[]>>',
            required: true,
            description: 'Lists the registered passkeys for the current user.',
            children: [
              {
                name: '[].id',
                type: 'string',
                description: 'Passkey identifier.',
              },
              {
                name: '[].name',
                type: 'string',
                description: 'Display name for the passkey.',
              },
              {
                name: '[].created_at',
                type: 'string',
                description: 'Creation timestamp.',
              },
              {
                name: '[].last_used_at',
                type: 'string | null',
                description: 'Last-used timestamp, or `null` when the passkey has not been used yet.',
              },
              {
                name: '[].device_type',
                type: 'string',
                description: 'Device classification for the passkey.',
              },
              {
                name: '[].backed_up',
                type: 'boolean',
                description: 'Whether the passkey is backed up by the platform authenticator.',
              },
            ],
          },
          {
            name: 'registerPasskey',
            type: '(name?: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Starts and completes the browser WebAuthn registration flow for a new passkey.',
          },
          {
            name: 'renamePasskey',
            type: '(id: string, name: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Renames an existing passkey.',
          },
          {
            name: 'deletePasskey',
            type: '(id: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Deletes an existing passkey.',
          },
          {
            name: 'deleteAccount',
            type: '(password: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Deletes the current account after password confirmation.',
          },
        ],
        details: [
          'The hook keeps the current user record in SWR and then layers a large set of user-owned mutations on top of the same deployment-aware client.',
          'Not every mutation immediately mutates or revalidates the user cache. Profile updates, password removal, and a few other flows call `mutate()`, while other actions return their response and leave refresh timing to the caller.',
          'Email addresses, phone numbers, authenticators, social connections, and passkeys are all managed from this one surface because they belong to the current user rather than to the current session.',
          'Passkey registration is the most involved flow on the page. The hook begins registration with the backend, converts the returned challenge/options into WebAuthn browser types, calls `navigator.credentials.create()`, then posts the attestation payload back to finish registration.',
        ],
        examples: [
          {
            title: 'Update profile fields',
            code: `export default function ProfileSettings() {
  const { user, loading, updateProfile } = useUser();

  if (loading) {
    return null;
  }

  async function save() {
    await updateProfile({
      first_name: user.first_name,
      last_name: user.last_name,
    });
  }

  return <button onClick={save}>Save profile</button>;
}`,
          },
          {
            title: 'Add and verify an email address',
            code: `export default function EmailManager() {
  const { createEmailAddress, prepareEmailVerification, attemptEmailVerification } = useUser();

  async function addEmail() {
    const created = await createEmailAddress('new@example.com');

    if ('data' in created) {
      await prepareEmailVerification(created.data.id);
      await attemptEmailVerification(created.data.id, '123456');
    }
  }

  return <button onClick={addEmail}>Add email</button>;
}`,
          },
          {
            title: 'Add and verify a phone number',
            code: `export default function PhoneManager() {
  const { createPhoneNumber, preparePhoneVerification, attemptPhoneVerification } = useUser();

  async function addPhone() {
    const created = await createPhoneNumber('+14155550123');

    if ('data' in created) {
      await preparePhoneVerification(created.data.id);
      await attemptPhoneVerification(created.data.id, '123456');
    }
  }

  return <button onClick={addPhone}>Add phone</button>;
}`,
          },
          {
            title: 'Change the current password',
            code: `export default function PasswordSettings() {
  const { updatePassword } = useUser();

  async function changePassword() {
    await updatePassword('current-password', 'new-password');
  }

  return <button onClick={changePassword}>Change password</button>;
}`,
          },
          {
            title: 'Start a social connection flow',
            code: `export default function ConnectGithub() {
  const { connectSocialAccount } = useUser();

  async function connect() {
    const result = await connectSocialAccount({
      provider: 'github',
      redirectUri: window.location.href,
    });

    if ('data' in result) {
      window.location.href = result.data.oauth_url;
    }
  }

  return <button onClick={connect}>Connect GitHub</button>;
}`,
          },
          {
            title: 'Register a passkey',
            code: `export default function PasskeyButton() {
  const { registerPasskey } = useUser();

  async function register() {
    await registerPasskey('Laptop');
  }

  return <button onClick={register}>Register passkey</button>;
}`,
          },
          {
            title: 'Rename or remove an existing passkey',
            code: `export default function PasskeyList() {
  const { getPasskeys, renamePasskey, deletePasskey } = useUser();

  async function renameFirstPasskey() {
    const result = await getPasskeys();

    if ('data' in result && result.data.length > 0) {
      await renamePasskey(result.data[0].id, 'Main laptop');
    }
  }

  async function removeFirstPasskey() {
    const result = await getPasskeys();

    if ('data' in result && result.data.length > 0) {
      await deletePasskey(result.data[0].id);
    }
  }

  return (
    <div className="flex gap-3">
      <button onClick={renameFirstPasskey}>Rename first passkey</button>
      <button onClick={removeFirstPasskey}>Remove first passkey</button>
    </div>
  );
}`,
          },
        ],
      },
      {
        slug: 'use-navigation',
        title: 'useNavigation',
        description: 'Use adapter-aware navigation helpers for shared auth flows.',
        importName: 'useNavigation',
        intro:
          '`useNavigation()` gives shared auth components one navigation surface across Next.js, React Router, and TanStack Router. It uses the active adapter when one is available, and it builds the hosted sign-in and sign-up targets from the current deployment settings.',
        example: `export default function AuthActions() {
  const { navigateToSignIn, navigateToSignUp } = useNavigation();

  return (
    <div className="flex gap-3">
      <button onClick={() => navigateToSignIn()}>Sign in</button>
      <button onClick={() => navigateToSignUp()}>Create account</button>
    </div>
  );
}`,
        points: [],
        signature: `declare function useNavigation(): {
  navigate: (to: string, options?: { replace?: boolean; state?: any }) => void;
  navigateToSignIn: (redirectUri?: string) => void;
  navigateToAccountSelection: (redirectUri?: string) => void;
  navigateToSignUp: (redirectUri?: string) => void;
};`,
        api: [
          {
            name: 'navigate',
            type: '(to: string, options?: { replace?: boolean; state?: any }) => void',
            description:
              'Calls the adapter navigation function when the current framework exposes one. If there is no adapter navigate function, it falls back to assigning `window.location.href`.',
            children: [
              {
                name: 'replace',
                type: 'boolean | undefined',
                description: 'Replaces the current history entry when the adapter supports it.',
              },
              {
                name: 'state',
                type: 'any',
                description: 'Framework-specific navigation state passed through to the adapter.',
              },
            ],
          },
          {
            name: 'navigateToSignIn',
            type: '(redirectUri?: string) => void',
            description:
              'Sends the user to the hosted sign-in page from the deployment UI settings and carries the current redirect target forward.',
          },
          {
            name: 'navigateToAccountSelection',
            type: '(redirectUri?: string) => void',
            description:
              'Sends the user to the hosted account-selection surface on the deployment frontend host.',
          },
          {
            name: 'navigateToSignUp',
            type: '(redirectUri?: string) => void',
            description:
              'Sends the user to the hosted sign-up page from the deployment UI settings and carries the current redirect target forward.',
          },
        ],
        details: [
          'The hook is built on top of `useDeployment()`, so it is only available after `DeploymentProvider` has resolved the active deployment and adapter.',
          'Hosted redirects reuse an explicit `redirectUri` when one is passed in. If you do not pass one, the hook first checks for an existing `redirect_uri` query param on the current page and falls back to `window.location.href` only when that param is missing.',
          'That redirect precedence is what lets embedded flows hand off to hosted pages without losing the original target page.',
          'In staging, the hosted redirects append `__dev_session__` so the development session survives the round trip through the hosted pages.',
          'The generic `navigate()` helper is intentionally thin. It exists so shared auth components can navigate without caring which router adapter is active.',
        ],
        examples: [
          {
            title: 'Send unauthenticated users to sign-in',
            code: `export default function ProtectedArea() {
  const { navigateToSignIn } = useNavigation();

  return (
    <button onClick={() => navigateToSignIn()}>
      Continue to sign in
    </button>
  );
}`,
          },
          {
            title: 'Preserve an explicit return URL',
            code: `export default function CheckoutAuth() {
  const { navigateToSignIn } = useNavigation();

  return (
    <button onClick={() => navigateToSignIn('https://app.example.com/checkout')}>
      Sign in to continue
    </button>
  );
}`,
          },
          {
            title: 'Open the account-selection page',
            code: `export default function MoreAccounts() {
  const { navigateToAccountSelection } = useNavigation();

  return (
    <button onClick={() => navigateToAccountSelection()}>
      Use another account
    </button>
  );
}`,
          },
        ],
      },
    ],
  };
