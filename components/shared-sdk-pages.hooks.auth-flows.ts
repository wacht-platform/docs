import type { SharedGroup } from './shared-sdk-pages.types';

export const authFlowsHookGroup: SharedGroup = {
    label: 'Auth flows',
    docs: [
      {
        slug: 'use-sign-in',
        title: 'useSignIn',
        description: 'Drive the sign-in flow from your own code.',
        importName: 'useSignIn',
        intro:
          '`useSignIn()` is the stateful sign-in hook behind `SignInForm`, `OtherSignInOptions`, and the rest of the embedded sign-in flow. It creates sign-in attempts, keeps the latest in-progress attempt in memory, and exposes the continuation methods that move that attempt through verification, profile completion, SSO, or passkey sign-in.',
        example: `export default function PasswordSignIn() {
  const { loading, signIn, signinAttempt } = useSignIn();

  async function submit() {
    if (loading) {
      return;
    }

    await signIn.createStrategy('email')({
      email: 'jane@example.com',
      password: 'correct horse battery staple',
    });
  }

  return (
    <div>
      <button onClick={submit}>Sign in</button>
      {signinAttempt ? <p>Current step: {signinAttempt.current_step}</p> : null}
    </div>
  );
}`,
        points: [],
        signature: `declare function useSignIn():
  | {
      loading: true;
      signIn: never;
      signinAttempt: null;
      discardSignInAttempt: () => void;
      setSignInAttempt: (attempt: SigninAttempt | null) => void;
    }
  | {
      loading: false;
      signIn: {
        createStrategy: (strategy: 'username' | 'email' | 'phone' | 'email_otp' | 'magic_link' | 'oauth' | 'passkey' | 'generic') => Function;
        prepareVerification: (params: VerificationParams) => Promise<ApiResult<PrepareVerificationResponse>>;
        completeVerification: (verificationCode: string) => Promise<Session>;
        completeProfile: (data: ProfileCompletionData) => Promise<Session>;
        identify: (identifier: string) => Promise<IdentifyResult>;
        initEnterpriseSso: (connectionId: string, redirectUri?: string) => Promise<{ sso_url: string; session: Session }>;
      };
      signinAttempt: SigninAttempt | null;
      discardSignInAttempt: () => void;
      setSignInAttempt: (attempt: SigninAttempt | null) => void;
    };`,
        api: [
          {
            name: 'loading',
            type: 'boolean',
            description:
              'Stays `true` until `useClient()` is ready. While loading is true, the hook does not expose a usable `signIn` object.',
          },
          {
            name: 'signIn',
            type: '{ createStrategy; prepareVerification; completeVerification; completeProfile; identify; initEnterpriseSso }',
            description:
              'The stateful sign-in controller. This is where the embedded sign-in form gets its strategy builders and its continuation methods.',
            children: [
              {
                name: 'createStrategy',
                type: "(strategy: 'username' | 'email' | 'phone' | 'email_otp' | 'magic_link' | 'oauth' | 'passkey' | 'generic') => Function",
                description:
                  'Returns the function for a specific sign-in strategy. The returned function posts the first sign-in request and stores the latest sign-in attempt when the response includes one.',
                children: [
                  {
                    name: 'username',
                    type: "({ username: string; password: string }) => Promise<ApiResult<Session>>",
                    description: 'Starts a username/password sign-in.',
                  },
                  {
                    name: 'email',
                    type: "({ email: string; password: string }) => Promise<ApiResult<Session>>",
                    description: 'Starts an email/password sign-in.',
                  },
                  {
                    name: 'phone',
                    type: "({ phone: string }) => Promise<ApiResult<Session>>",
                    description: 'Starts a phone OTP sign-in.',
                  },
                  {
                    name: 'email_otp',
                    type: "({ email: string }) => Promise<ApiResult<Session>>",
                    description: 'Starts an email OTP sign-in.',
                  },
                  {
                    name: 'magic_link',
                    type: "({ email: string }) => Promise<ApiResult<Session>>",
                    description: 'Starts a magic-link sign-in.',
                  },
                  {
                    name: 'oauth',
                    type: "({ provider: OAuthProvider; redirectUri?: string }) => Promise<ApiResult<{ oauth_url: string; session: Session }>>",
                    description:
                      'Starts a social OAuth sign-in. When the request succeeds, the hook immediately assigns `window.location.href` to the returned provider URL.',
                  },
                  {
                    name: 'passkey',
                    type: "() => Promise<ApiResult<Session>>",
                    description:
                      'Starts a passkey sign-in. The hook requests browser WebAuthn credentials, converts the browser response, and completes the sign-in.',
                  },
                  {
                    name: 'generic',
                    type: "({ email?: string; username?: string; password?: string; phone?: string; strategy?: string }) => Promise<ApiResult<Session>>",
                    description:
                      'The mixed strategy used by `SignInForm`. It lets the form submit identifier-first flows without committing to one builder up front.',
                  },
                ],
              },
              {
                name: 'prepareVerification',
                type: "(params: { strategy: 'email_otp'; redirectUri?: string } | { strategy: 'phone_otp'; lastDigits?: string } | { strategy: 'magic_link'; redirectUri?: string }) => Promise<ApiResult<{ otp_sent?: boolean; masked_phone?: string; masked_email?: string; verification_method?: string }>>",
                description:
                  'Prepares the next verification step for the current sign-in attempt. This is what the embedded flow uses before OTP and magic-link verification screens.',
              },
              {
                name: 'completeVerification',
                type: '(verificationCode: string) => Promise<Session>',
                description:
                  'Submits a verification code for the current attempt and updates `signinAttempt` with the latest server state.',
              },
              {
                name: 'completeProfile',
                type: '(data: ProfileCompletionData) => Promise<Session>',
                description:
                  'Finishes the profile-completion step when the sign-in flow requires missing user fields before finalizing the session.',
                children: [
                  {
                    name: 'first_name',
                    type: 'string | undefined',
                    description: 'First name collected during profile completion.',
                  },
                  {
                    name: 'last_name',
                    type: 'string | undefined',
                    description: 'Last name collected during profile completion.',
                  },
                  {
                    name: 'username',
                    type: 'string | undefined',
                    description: 'Username collected during profile completion.',
                  },
                  {
                    name: 'phone_number',
                    type: 'string | undefined',
                    description: 'Phone number collected during profile completion.',
                  },
                  {
                    name: 'phone_country_code',
                    type: 'string | undefined',
                    description: 'Phone country code sent with the phone number when the flow collects one.',
                  },
                  {
                    name: 'email',
                    type: 'string | undefined',
                    description: 'Email collected during profile completion.',
                  },
                ],
              },
              {
                name: 'identify',
                type: '(identifier: string) => Promise<{ strategy: "sso" | "social" | "password"; connection_id?: string; idp_url?: string; provider?: string }>',
                description:
                  'Looks up the identifier-first result for an entered email or username. `SignInForm` uses this to decide whether to show password entry, enterprise SSO, or a social handoff.',
              },
              {
                name: 'initEnterpriseSso',
                type: '(connectionId: string, redirectUri?: string) => Promise<{ sso_url: string; session: Session }>',
                description:
                  'Starts an enterprise SSO redirect for a known connection.',
              },
            ],
          },
          {
            name: 'signinAttempt',
            type: 'SigninAttempt | null',
            description:
              'The latest in-progress sign-in attempt captured by the hook. Embedded auth screens use this to decide which step to render next.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Stable identifier for the current attempt.',
              },
              {
                name: 'email',
                type: 'string',
                description: 'Email associated with the attempt when one is available.',
              },
              {
                name: 'method',
                type: "'plain' | 'sso' | 'passkey'",
                description: 'High-level sign-in method behind the current attempt.',
              },
              {
                name: 'sso_provider',
                type: "'x_oauth' | 'github_oauth' | 'gitlab_oauth' | 'google_oauth' | 'facebook_oauth' | 'microsoft_oauth' | 'linkedin_oauth' | 'discord_oauth'",
                description: 'Social or SSO provider attached to the attempt when relevant.',
              },
              {
                name: 'current_step',
                type: "'verify_password' | 'verify_email' | 'verify_email_link' | 'verify_email_otp' | 'verify_phone' | 'verify_phone_otp' | 'verify_second_factor' | 'add_second_factor' | 'complete_profile'",
                description: 'Current step in the sign-in state machine.',
              },
              {
                name: 'first_method_authenticated',
                type: 'boolean',
                description: 'Whether the first factor has already been completed.',
              },
              {
                name: 'second_method_authenticated',
                type: 'boolean',
                description: 'Whether the second factor has already been completed.',
              },
              {
                name: 'second_method_authentication_required',
                type: 'boolean',
                description: 'Whether this attempt still requires a second factor.',
              },
              {
                name: 'available_2fa_methods',
                type: 'string[] | undefined',
                description: 'Available second-factor methods when the attempt is waiting for a 2FA choice.',
              },
              {
                name: 'completed',
                type: 'boolean',
                description: 'Whether the attempt has fully finished.',
              },
              {
                name: 'requires_completion',
                type: 'boolean | undefined',
                description: 'Whether profile completion is still required.',
              },
              {
                name: 'required_fields',
                type: 'string[] | undefined',
                description: 'Fields the flow requires before the attempt can complete.',
              },
              {
                name: 'missing_fields',
                type: 'string[] | undefined',
                description: 'Fields still missing from the attempt.',
              },
              {
                name: 'profile_completion_data',
                type: 'ProfileCompletionData | undefined',
                description: 'Partial profile data already collected during the sign-in flow.',
                children: [
                  {
                    name: 'first_name',
                    type: 'string | undefined',
                    description: 'Collected first name.',
                  },
                  {
                    name: 'last_name',
                    type: 'string | undefined',
                    description: 'Collected last name.',
                  },
                  {
                    name: 'username',
                    type: 'string | undefined',
                    description: 'Collected username.',
                  },
                  {
                    name: 'phone_number',
                    type: 'string | undefined',
                    description: 'Collected phone number.',
                  },
                  {
                    name: 'phone_country_code',
                    type: 'string | undefined',
                    description: 'Collected phone country code.',
                  },
                  {
                    name: 'email',
                    type: 'string | undefined',
                    description: 'Collected email.',
                  },
                ],
              },
            ],
          },
          {
            name: 'discardSignInAttempt',
            type: '() => void',
            description: 'Clears the in-memory sign-in attempt and returns the hook to its initial local state.',
          },
          {
            name: 'setSignInAttempt',
            type: '(attempt: SigninAttempt | null) => void',
            description:
              'Lets higher-level components restore or replace the current attempt explicitly. `SignInForm` uses this when it resumes a stored or returned attempt.',
          },
        ],
        details: [
          'The hook keeps `signinAttempt` in local React state. Every builder except OAuth and passkey updates that state when the server returns `session.signin_attempts`.',
          'That local attempt is what lets the embedded sign-in UI move from the initial credential screen into OTP, magic-link, second-factor, or profile-completion screens without rebuilding the whole flow from scratch.',
          'OAuth behaves differently from the other strategies. Its builder requests an OAuth init payload and immediately redirects the browser to the returned provider URL.',
          'Passkey also behaves differently. It runs a full browser WebAuthn flow, converting challenge and credential payloads between base64url strings and browser buffer types before finishing the sign-in.',
          'The hook itself does not choose which screen to render next. It exposes the current attempt state, and higher-level components such as `SignInForm` and `TwoFactorVerification` decide which UI branch to show.',
          'Identifier-first flows are split between `identify()` and the actual strategy builders. `identify()` only tells you which path to take. The real attempt is still created by one of the sign-in strategies afterward.',
        ],
        examples: [
          {
            title: 'Sign in with email and password',
            code: `export default function EmailPasswordSignIn() {
  const { loading, signIn } = useSignIn();

  async function submit() {
    if (loading) {
      return;
    }

    await signIn.createStrategy('email')({
      email: 'jane@example.com',
      password: 'correct horse battery staple',
    });
  }

  return <button onClick={submit}>Sign in with password</button>;
}`,
          },
          {
            title: 'Resolve an identifier-first branch',
            code: `export default function IdentifierLookup() {
  const { loading, signIn } = useSignIn();

  async function checkIdentifier() {
    if (loading) {
      return;
    }

    const result = await signIn.identify('jane@example.com');

    if (result.strategy === 'sso' && result.connection_id) {
      await signIn.initEnterpriseSso(result.connection_id, window.location.href);
    }
  }

  return <button onClick={checkIdentifier}>Continue</button>;
}`,
          },
          {
            title: 'Prepare and complete email OTP verification',
            code: `export default function EmailOtpVerification() {
  const { loading, signIn, signinAttempt } = useSignIn();

  async function sendOtp() {
    if (loading) {
      return;
    }

    await signIn.createStrategy('email_otp')({
      email: 'jane@example.com',
    });

    await signIn.prepareVerification({
      strategy: 'email_otp',
      redirectUri: window.location.href,
    });
  }

  async function verifyOtp() {
    await signIn.completeVerification('123456');
  }

  return (
    <div>
      <button onClick={sendOtp}>Send OTP</button>
      <button onClick={verifyOtp} disabled={!signinAttempt}>
        Verify OTP
      </button>
    </div>
  );
}`,
          },
          {
            title: 'Finish required profile fields',
            code: `export default function CompleteProfile() {
  const { loading, signIn, signinAttempt } = useSignIn();

  async function submitProfile() {
    if (loading || !signinAttempt?.requires_completion) {
      return;
    }

    await signIn.completeProfile({
      first_name: 'Jane',
      last_name: 'Doe',
      username: 'janedoe',
    });
  }

  return <button onClick={submitProfile}>Finish sign in</button>;
}`,
          },
          {
            title: 'Start a passkey sign-in',
            code: `export default function PasskeySignIn() {
  const { loading, signIn } = useSignIn();

  async function signInWithPasskey() {
    if (loading) {
      return;
    }

    await signIn.createStrategy('passkey')();
  }

  return <button onClick={signInWithPasskey}>Use passkey</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-sign-up',
        title: 'useSignUp',
        description: 'Drive the sign-up flow from your own code.',
        importName: 'useSignUp',
        intro:
          '`useSignUp()` is the stateful sign-up hook behind `SignUpForm`. It creates the sign-up attempt, keeps the latest in-progress signup attempt in memory, prepares the verification step that comes next, completes OTP verification, and validates deployment invitations before the user submits the form.',
        example: `export default function EmailSignUp() {
  const { loading, signUp, signupAttempt } = useSignUp();

  async function submit() {
    if (loading) {
      return;
    }

    await signUp.create({
      email: 'jane@example.com',
      password: 'CorrectHorseBatteryStaple123!',
    });
  }

  return (
    <div>
      <button onClick={submit}>Create account</button>
      {signupAttempt ? <p>Current step: {signupAttempt.current_step}</p> : null}
    </div>
  );
}`,
        points: [],
        signature: `declare function useSignUp():
  | {
      loading: true;
      signUp: never;
      signupAttempt: null;
      discardSignupAttempt: () => void;
    }
  | {
      loading: false;
      signUp: {
        create: (params: SignUpParams) => Promise<ApiResult<unknown>>;
        prepareVerification: (params: { strategy: 'email_otp'; redirectUri?: string } | { strategy: 'phone_otp'; lastDigits?: string }) => Promise<ApiResult<{ otp_sent?: boolean; masked_phone?: string; masked_email?: string; verification_method?: string }>>;
        completeVerification: (verificationCode: string) => Promise<ApiResult<Session>>;
        validateDeploymentInvitation: (token: string) => Promise<DeploymentInvitationData>;
      };
      signupAttempt: SignupAttempt | null;
      discardSignupAttempt: () => void;
    };`,
        api: [
          {
            name: 'loading',
            type: 'boolean',
            description:
              'Stays `true` until `useClient()` is ready. While loading is true, the hook does not expose a usable `signUp` object.',
          },
          {
            name: 'signUp',
            type: '{ create; prepareVerification; completeVerification; validateDeploymentInvitation }',
            required: true,
            description:
              'The stateful sign-up controller used by the embedded sign-up form.',
            children: [
              {
                name: 'create',
                type: '(params: SignUpParams) => Promise<ApiResult<unknown>>',
                description:
                  'Starts a sign-up attempt with the submitted user fields. When the response includes `session.signup_attempts`, the hook stores the latest one in `signupAttempt`.',
              },
              {
                name: 'prepareVerification',
                type: "(params: { strategy: 'email_otp'; redirectUri?: string } | { strategy: 'phone_otp'; lastDigits?: string }) => Promise<ApiResult<{ otp_sent?: boolean; masked_phone?: string; masked_email?: string; verification_method?: string }>>",
                description:
                  'Prepares the verification step for the current sign-up attempt. This is what `SignUpForm` uses after `create()` has moved the flow into email or phone verification.',
              },
              {
                name: 'completeVerification',
                type: '(verificationCode: string) => Promise<ApiResult<Session>>',
                description:
                  'Submits an OTP for the current sign-up attempt and updates `signupAttempt` with the latest attempt state when the server returns one.',
              },
              {
                name: 'validateDeploymentInvitation',
                type: '(token: string) => Promise<{ valid: boolean; first_name?: string; last_name?: string; email?: string; message?: string; error_code?: string }>',
                description:
                  'Validates an invitation token before the user submits the form and returns any prefilled invitation data that should shape the form.',
                children: [
                  {
                    name: 'valid',
                    type: 'boolean',
                    description: 'Whether the invitation token is valid.',
                  },
                  {
                    name: 'first_name',
                    type: 'string | undefined',
                    description: 'Invited first name when the invitation contains one.',
                  },
                  {
                    name: 'last_name',
                    type: 'string | undefined',
                    description: 'Invited last name when the invitation contains one.',
                  },
                  {
                    name: 'email',
                    type: 'string | undefined',
                    description: 'Invited email address when the invitation contains one.',
                  },
                  {
                    name: 'message',
                    type: 'string | undefined',
                    description: 'Validation message for invalid or failed invitation checks.',
                  },
                  {
                    name: 'error_code',
                    type: 'string | undefined',
                    description: 'Error code describing why invitation validation failed.',
                  },
                ],
              },
            ],
          },
          {
            name: 'signupAttempt',
            type: 'SignupAttempt | null',
            required: true,
            description:
              'The latest in-progress sign-up attempt captured by the hook. Embedded sign-up screens use this to decide which verification step comes next.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Stable identifier for the current sign-up attempt.',
              },
              {
                name: 'first_name',
                type: 'string',
                description: 'Collected first name for the attempt.',
              },
              {
                name: 'last_name',
                type: 'string',
                description: 'Collected last name for the attempt.',
              },
              {
                name: 'email',
                type: 'string',
                description: 'Collected email for the attempt.',
              },
              {
                name: 'username',
                type: 'string',
                description: 'Collected username for the attempt.',
              },
              {
                name: 'phone_number',
                type: 'string',
                description: 'Collected phone number for the attempt.',
              },
              {
                name: 'required_fields',
                type: 'string[]',
                description: 'Fields the deployment still requires for the attempt.',
              },
              {
                name: 'missing_fields',
                type: 'string[]',
                description: 'Fields that are still missing from the attempt.',
              },
              {
                name: 'current_step',
                type: "'verify_email' | 'verify_phone' | 'verify_authenticator'",
                description: 'Current sign-up verification step.',
              },
              {
                name: 'remaining_steps',
                type: "('verify_email' | 'verify_phone' | 'verify_authenticator')[]",
                description: 'Verification steps that still remain after the current one.',
              },
              {
                name: 'completed',
                type: 'boolean',
                description: 'Whether the sign-up attempt has fully finished.',
              },
            ],
          },
          {
            name: 'discardSignupAttempt',
            type: '() => void',
            required: true,
            description:
              'Clears the in-memory sign-up attempt and returns the hook to its initial local state.',
          },
        ],
        details: [
          'The hook keeps `signupAttempt` in local React state. The embedded sign-up flow uses that attempt to move from the initial form into OTP verification without rebuilding the whole flow from scratch.',
          'Unlike `useSignIn()`, there is no strategy builder matrix here. `create()` takes the form payload directly and the deployment decides which fields and verification steps are required next.',
          'The built-in sign-up form uses `validateDeploymentInvitation()` before submission when an `invite_token` query param is present. That validation can prefill the invited user fields and can also block the flow when the token is invalid.',
          'The hook itself does not enforce restricted sign-up or waitlist redirects. Those branches are handled by higher-level UI such as `SignUpForm`, which reads deployment restrictions and decides whether to show the form, redirect to the waitlist, or show a restricted message.',
          'After a sign-up attempt is created, higher-level UI decides when to call `prepareVerification()`. In the stock flow, that happens automatically when the attempt moves into `verify_email` or `verify_phone`.',
        ],
        examples: [
          {
            title: 'Create a sign-up attempt',
            code: `export default function BasicSignUp() {
  const { loading, signUp } = useSignUp();

  async function submit() {
    if (loading) {
      return;
    }

    await signUp.create({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
      password: 'CorrectHorseBatteryStaple123!',
    });
  }

  return <button onClick={submit}>Create account</button>;
}`,
          },
          {
            title: 'Validate an invitation token before rendering the form',
            code: `export default function InvitationAwareSignUp() {
  const { loading, signUp } = useSignUp();

  async function validate() {
    if (loading) {
      return;
    }

    const invitation = await signUp.validateDeploymentInvitation('invite-token');

    if (invitation.valid) {
      console.log(invitation.email);
    }
  }

  return <button onClick={validate}>Validate invitation</button>;
}`,
          },
          {
            title: 'Prepare and complete email verification',
            code: `export default function EmailVerification() {
  const { loading, signUp, signupAttempt } = useSignUp();

  async function start() {
    if (loading) {
      return;
    }

    await signUp.create({
      email: 'jane@example.com',
      password: 'CorrectHorseBatteryStaple123!',
    });

    await signUp.prepareVerification({
      strategy: 'email_otp',
      redirectUri: window.location.href,
    });
  }

  async function verify() {
    await signUp.completeVerification('123456');
  }

  return (
    <div>
      <button onClick={start}>Send OTP</button>
      <button onClick={verify} disabled={!signupAttempt}>
        Verify OTP
      </button>
    </div>
  );
}`,
          },
          {
            title: 'Reset the local sign-up flow',
            code: `export default function RestartSignUp() {
  const { signupAttempt, discardSignupAttempt } = useSignUp();

  if (!signupAttempt) {
    return null;
  }

  return <button onClick={discardSignupAttempt}>Start over</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-sso-callback',
        title: 'useSSOCallback',
        description: 'Read and continue SSO callback state after the user returns from the provider.',
        importName: 'useSSOCallback',
        intro:
          '`useSSOCallback()` is the headless callback hook behind `SSOCallback`. It reads the OAuth query params on mount, decides whether the callback belongs to a sign-in flow or a social-connection flow, exchanges the callback with the backend, and exposes the returned session, redirect target, and any unfinished sign-in attempt.',
        example: `export default function SsoCallbackPage() {
  const { loading, error, processed, signinAttempt, redirectUri } = useSSOCallback();

  if (!processed || loading) {
    return <p>Completing sign in...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <p>Callback processed.</p>
      {signinAttempt ? <p>Next step: {signinAttempt.current_step}</p> : null}
      {redirectUri ? <p>Redirect target: {redirectUri}</p> : null}
    </div>
  );
}`,
        points: [],
        signature: `declare function useSSOCallback(): {
  loading: boolean;
  error: Error | null;
  session: Session | null;
  redirectUri: string | null;
  processed: boolean;
  signinAttempt: SigninAttempt | null;
};`,
        api: [
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the callback exchange is currently running.',
          },
          {
            name: 'error',
            type: 'Error | null',
            required: true,
            description: 'Callback error when the OAuth params are missing, invalid, or rejected.',
          },
          {
            name: 'session',
            type: 'Session | null',
            required: true,
            description: 'Session returned by the callback exchange.',
            children: [
              {
                name: 'id',
                type: 'number',
                description: 'Session identifier.',
              },
              {
                name: 'active_signin',
                type: 'SignIn | null',
                description: 'Active sign-in for the returned session.',
                children: [
                  {
                    name: 'id',
                    type: 'string',
                    description: 'Active sign-in identifier.',
                  },
                  {
                    name: 'user_id',
                    type: 'string',
                    description: 'User identifier attached to the active sign-in.',
                  },
                  {
                    name: 'active_organization_membership_id',
                    type: 'string',
                    description: 'Active organization membership for this sign-in.',
                  },
                  {
                    name: 'active_workspace_membership_id',
                    type: 'string',
                    description: 'Active workspace membership for this sign-in.',
                  },
                  {
                    name: 'expiresAt',
                    type: 'string',
                    description: 'Sign-in expiry timestamp.',
                  },
                  {
                    name: 'lastActiveAt',
                    type: 'string',
                    description: 'Last activity timestamp for the sign-in.',
                  },
                  {
                    name: 'user',
                    type: 'CurrentUser',
                    description: 'User record attached to the active sign-in.',
                    children: [
                      {
                        name: 'id',
                        type: 'string',
                        description: 'Current user identifier.',
                      },
                      {
                        name: 'first_name',
                        type: 'string',
                        description: 'User first name.',
                      },
                      {
                        name: 'last_name',
                        type: 'string',
                        description: 'User last name.',
                      },
                      {
                        name: 'username',
                        type: 'string',
                        description: 'Username when one is set.',
                      },
                      {
                        name: 'primary_email_address',
                        type: 'UserEmailAddress',
                        description: 'Primary email-address record.',
                        children: [
                          {
                            name: 'email',
                            type: 'string',
                            description: 'Primary email address value.',
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
                        description: 'Primary phone-number record when one exists.',
                        children: [
                          {
                            name: 'phone_number',
                            type: 'string',
                            description: 'Primary phone number value.',
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
                        description: 'Whether the user has a password set.',
                      },
                      {
                        name: 'has_passkeys',
                        type: 'boolean',
                        description: 'Whether the user has passkeys registered.',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'signins',
                type: 'SignIn[] | undefined',
                description: 'Sign-ins attached to the returned session.',
                children: [
                  {
                    name: '[].id',
                    type: 'string',
                    description: 'Sign-in identifier.',
                  },
                  {
                    name: '[].active_organization_membership_id',
                    type: 'string',
                    description: 'Active organization membership for the sign-in.',
                  },
                  {
                    name: '[].active_workspace_membership_id',
                    type: 'string',
                    description: 'Active workspace membership for the sign-in.',
                  },
                  {
                    name: '[].expiresAt',
                    type: 'string',
                    description: 'Sign-in expiry timestamp.',
                  },
                  {
                    name: '[].lastActiveAt',
                    type: 'string',
                    description: 'Last activity timestamp.',
                  },
                  {
                    name: '[].browser',
                    type: 'string',
                    description: 'Browser recorded for the sign-in.',
                  },
                  {
                    name: '[].device',
                    type: 'string',
                    description: 'Device recorded for the sign-in.',
                  },
                  {
                    name: '[].city',
                    type: 'string',
                    description: 'City recorded for the sign-in.',
                  },
                  {
                    name: '[].region',
                    type: 'string',
                    description: 'Region recorded for the sign-in.',
                  },
                  {
                    name: '[].country',
                    type: 'string',
                    description: 'Country recorded for the sign-in.',
                  },
                ],
              },
              {
                name: 'signin_attempts',
                type: 'SigninAttempt[] | undefined',
                description: 'Sign-in attempts returned with the session.',
                children: [
                  {
                    name: '[].id',
                    type: 'string',
                    description: 'Sign-in-attempt identifier.',
                  },
                  {
                    name: '[].email',
                    type: 'string',
                    description: 'Email associated with the attempt.',
                  },
                  {
                    name: '[].method',
                    type: "'plain' | 'sso' | 'passkey'",
                    description: 'High-level sign-in method behind the attempt.',
                  },
                  {
                    name: '[].sso_provider',
                    type: "'x_oauth' | 'github_oauth' | 'gitlab_oauth' | 'google_oauth' | 'facebook_oauth' | 'microsoft_oauth' | 'linkedin_oauth' | 'discord_oauth'",
                    description: 'Provider attached to the attempt when relevant.',
                  },
                  {
                    name: '[].current_step',
                    type: "'verify_password' | 'verify_email' | 'verify_email_link' | 'verify_email_otp' | 'verify_phone' | 'verify_phone_otp' | 'verify_second_factor' | 'add_second_factor' | 'complete_profile'",
                    description: 'Current step for the attempt.',
                  },
                  {
                    name: '[].first_method_authenticated',
                    type: 'boolean',
                    description: 'Whether the first factor has completed.',
                  },
                  {
                    name: '[].second_method_authenticated',
                    type: 'boolean',
                    description: 'Whether the second factor has completed.',
                  },
                  {
                    name: '[].second_method_authentication_required',
                    type: 'boolean',
                    description: 'Whether the attempt still requires a second factor.',
                  },
                  {
                    name: '[].available_2fa_methods',
                    type: 'string[] | undefined',
                    description: 'Available second-factor methods.',
                  },
                  {
                    name: '[].completed',
                    type: 'boolean',
                    description: 'Whether the attempt has fully finished.',
                  },
                  {
                    name: '[].requires_completion',
                    type: 'boolean | undefined',
                    description: 'Whether the sign-in still needs profile completion.',
                  },
                  {
                    name: '[].missing_fields',
                    type: 'string[] | undefined',
                    description: 'Fields still missing from the attempt.',
                  },
                  {
                    name: '[].required_fields',
                    type: 'string[] | undefined',
                    description: 'Fields required for the attempt to complete.',
                  },
                ],
              },
            ],
          },
          {
            name: 'redirectUri',
            type: 'string | null',
            required: true,
            description: 'Redirect target returned by the callback exchange when one is available.',
          },
          {
            name: 'processed',
            type: 'boolean',
            required: true,
            description: 'Whether the hook has already inspected the callback URL and finished its first processing pass.',
          },
          {
            name: 'signinAttempt',
            type: 'SigninAttempt | null',
            required: true,
            description: 'Latest sign-in attempt returned by the callback exchange when the sign-in flow still has work left to do.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Stable identifier for the returned attempt.',
              },
              {
                name: 'method',
                type: "'plain' | 'sso' | 'passkey'",
                description: 'Sign-in method attached to the callback result.',
              },
              {
                name: 'current_step',
                type: "'verify_password' | 'verify_email' | 'verify_email_link' | 'verify_email_otp' | 'verify_phone' | 'verify_phone_otp' | 'verify_second_factor' | 'add_second_factor' | 'complete_profile'",
                description: 'Current step for the unfinished sign-in flow.',
              },
              {
                name: 'completed',
                type: 'boolean',
                description: 'Whether the returned attempt has fully finished.',
              },
              {
                name: 'second_method_authentication_required',
                type: 'boolean',
                description: 'Whether the returned attempt still requires a second factor.',
              },
              {
                name: 'available_2fa_methods',
                type: 'string[] | undefined',
                description: 'Available second-factor methods when the attempt is waiting for one.',
              },
              {
                name: 'requires_completion',
                type: 'boolean | undefined',
                description: 'Whether the sign-in still needs profile completion.',
              },
            ],
          },
        ],
        details: [
          'The hook processes the callback only once per mount. The `processed` flag prevents the same URL from being exchanged multiple times while the page re-renders.',
          'It accepts two kinds of callback results. A `sign_in` callback returns session state for authentication, while a `connect_social` callback is used to finish a social-account connection flow for an already signed-in user.',
          'The hook does not navigate on its own. It only exposes the returned state. Components such as `SSOCallback` decide whether to resume an unfinished sign-in attempt, continue to a redirect target, or show an error state.',
          'When the callback returns a session with unfinished sign-in attempts, the hook surfaces the latest one as `signinAttempt` so the UI can hand the user back into the right verification or completion step.',
          'If the callback URL does not contain OAuth data, the hook marks itself as processed and returns an error instead of waiting forever.',
        ],
        examples: [
          {
            title: 'Resume an unfinished sign-in attempt',
            code: `export default function ResumeSsoSignIn() {
  const { processed, loading, signinAttempt } = useSSOCallback();
  const { navigateToSignIn } = useNavigation();

  if (!processed || loading || !signinAttempt || signinAttempt.completed) {
    return null;
  }

  return (
    <button onClick={() => navigateToSignIn(window.location.href)}>
      Continue sign in
    </button>
  );
}`,
          },
          {
            title: 'Handle an SSO callback error',
            code: `export default function SsoErrorState() {
  const { processed, loading, error } = useSSOCallback();

  if (!processed || loading || !error) {
    return null;
  }

  return <p>{error.message}</p>;
}`,
          },
        ],
      },
      {
        slug: 'use-waitlist',
        title: 'useWaitlist',
        description: 'Create and manage waitlist submissions.',
        importName: 'useWaitlist',
        intro:
          '`useWaitlist()` is the headless waitlist hook behind `WaitlistForm`. It submits the waitlist fields to the active deployment and returns the created waitlist entry so the page can decide how to show success.',
        example: `export default function JoinWaitlist() {
  const { loading, joinWaitlist } = useWaitlist();

  async function submit() {
    if (loading) {
      return;
    }

    await joinWaitlist({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
    });
  }

  return <button onClick={submit}>Join waitlist</button>;
}`,
        points: [],
        signature: `declare function useWaitlist():
  | {
      loading: true;
      joinWaitlist: never;
    }
  | {
      loading: boolean;
      joinWaitlist: (params: {
        first_name: string;
        last_name: string;
        email: string;
      }) => Promise<ApiResult<{
        message: string;
        entry: {
          id: string;
          deployment_id: number;
          email_address: string;
          first_name: string;
          last_name: string;
          created_at: string;
          updated_at: string;
        };
      }>>;
    };`,
        api: [
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the shared client is still loading or a waitlist request is currently running.',
          },
          {
            name: 'joinWaitlist',
            type: '(params: { first_name: string; last_name: string; email: string }) => Promise<ApiResult<WaitlistResponse>>',
            required: true,
            description: 'Submits a waitlist entry for the active deployment.',
            children: [
              {
                name: 'first_name',
                type: 'string',
                description: 'Submitted first name.',
              },
              {
                name: 'last_name',
                type: 'string',
                description: 'Submitted last name.',
              },
              {
                name: 'email',
                type: 'string',
                description: 'Submitted email address.',
              },
              {
                name: 'message',
                type: 'string',
                description: 'Success message returned after the waitlist entry is created.',
              },
              {
                name: 'entry',
                type: 'WaitlistEntry',
                description: 'Created waitlist entry.',
                children: [
                  {
                    name: 'id',
                    type: 'string',
                    description: 'Waitlist-entry identifier.',
                  },
                  {
                    name: 'deployment_id',
                    type: 'number',
                    description: 'Deployment identifier that owns the waitlist entry.',
                  },
                  {
                    name: 'email_address',
                    type: 'string',
                    description: 'Stored email address for the waitlist entry.',
                  },
                  {
                    name: 'first_name',
                    type: 'string',
                    description: 'Stored first name.',
                  },
                  {
                    name: 'last_name',
                    type: 'string',
                    description: 'Stored last name.',
                  },
                  {
                    name: 'created_at',
                    type: 'string',
                    description: 'Creation timestamp for the waitlist entry.',
                  },
                  {
                    name: 'updated_at',
                    type: 'string',
                    description: 'Last update timestamp for the waitlist entry.',
                  },
                ],
              },
            ],
          },
        ],
        details: [
          'The hook is intentionally small. It only submits the waitlist payload and reports whether the request is still running.',
          'The stock `WaitlistForm` adds field rendering, deployment-aware field selection, and the local submitted-state UI on top of this hook.',
          'When the shared client is still loading, the hook returns a loading branch where `joinWaitlist` is unavailable.',
          'The hook does not keep a separate success state. Higher-level UI decides whether to show a success screen from the returned waitlist response.',
        ],
        examples: [
          {
            title: 'Submit a basic waitlist entry',
            code: `export default function BasicWaitlistForm() {
  const { loading, joinWaitlist } = useWaitlist();

  async function submit() {
    if (loading) {
      return;
    }

    await joinWaitlist({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
    });
  }

  return <button onClick={submit}>Join waitlist</button>;
}`,
          },
          {
            title: 'Read the created waitlist entry',
            code: `export default function WaitlistSuccess() {
  const { loading, joinWaitlist } = useWaitlist();

  async function submit() {
    if (loading) {
      return;
    }

    const result = await joinWaitlist({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane@example.com',
    });

    if ('data' in result) {
      console.log(result.data.entry.id);
      console.log(result.data.entry.email_address);
    }
  }

  return <button onClick={submit}>Submit entry</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-forgot-password',
        title: 'useForgotPassword',
        description: 'Drive the password reset flow.',
        importName: 'useForgotPassword',
        intro:
          '`useForgotPassword()` is the headless password-recovery hook behind `ForgotPassword`. It starts the reset flow for an email address, verifies the OTP that comes back to the user, and then exchanges the reset token for a new session when the password is changed.',
        example: `export default function ForgotPasswordFlow() {
  const { loading, forgotPassword, verifyOtp, resetPassword } = useForgotPassword();

  async function run() {
    if (loading) {
      return;
    }

    await forgotPassword('jane@example.com');
    const verification = await verifyOtp('jane@example.com', '123456');

    if ('data' in verification) {
      await resetPassword(verification.data.token, 'NewPassword123!');
    }
  }

  return <button onClick={run}>Reset password</button>;
}`,
        points: [],
        signature: `declare function useForgotPassword(): {
  loading: boolean;
  forgotPassword: (email: string) => Promise<ApiResult<{}>>;
  verifyOtp: (email: string, otp: string) => Promise<ApiResult<{ token: string }>>;
  resetPassword: (token: string, password: string) => Promise<ApiResult<Session>>;
};`,
        api: [
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the shared client is still loading.',
          },
          {
            name: 'forgotPassword',
            type: '(email: string) => Promise<ApiResult<{}>>',
            required: true,
            description: 'Starts the password-reset flow for an email address.',
          },
          {
            name: 'verifyOtp',
            type: '(email: string, otp: string) => Promise<ApiResult<{ token: string }>>',
            required: true,
            description: 'Verifies the OTP from the recovery email and returns the reset token used by the final password-reset step.',
            children: [
              {
                name: 'token',
                type: 'string',
                description: 'Reset token that must be passed to `resetPassword()`.',
              },
            ],
          },
          {
            name: 'resetPassword',
            type: '(token: string, password: string) => Promise<ApiResult<Session>>',
            required: true,
            description: 'Resets the password with the verified reset token and returns the resulting session.',
            children: [
              {
                name: 'id',
                type: 'number',
                description: 'Session identifier.',
              },
              {
                name: 'active_signin',
                type: 'SignIn | null',
                description: 'Active sign-in for the returned session.',
                children: [
                  {
                    name: 'id',
                    type: 'string',
                    description: 'Active sign-in identifier.',
                  },
                  {
                    name: 'active_organization_membership_id',
                    type: 'string',
                    description: 'Active organization membership for the sign-in.',
                  },
                  {
                    name: 'active_workspace_membership_id',
                    type: 'string',
                    description: 'Active workspace membership for the sign-in.',
                  },
                  {
                    name: 'expiresAt',
                    type: 'string',
                    description: 'Sign-in expiry timestamp.',
                  },
                  {
                    name: 'lastActiveAt',
                    type: 'string',
                    description: 'Last activity timestamp for the sign-in.',
                  },
                ],
              },
              {
                name: 'signin_attempts',
                type: 'SigninAttempt[] | undefined',
                description: 'Sign-in attempts returned with the session.',
                children: [
                  {
                    name: '[].id',
                    type: 'string',
                    description: 'Sign-in-attempt identifier.',
                  },
                  {
                    name: '[].current_step',
                    type: "'verify_password' | 'verify_email' | 'verify_email_link' | 'verify_email_otp' | 'verify_phone' | 'verify_phone_otp' | 'verify_second_factor' | 'add_second_factor' | 'complete_profile'",
                    description: 'Current step for the sign-in attempt.',
                  },
                  {
                    name: '[].completed',
                    type: 'boolean',
                    description: 'Whether the sign-in attempt has fully finished.',
                  },
                  {
                    name: '[].second_method_authentication_required',
                    type: 'boolean',
                    description: 'Whether the sign-in still requires a second factor.',
                  },
                ],
              },
            ],
          },
        ],
        details: [
          'The hook itself is linear: request a reset, verify the OTP, then exchange the returned reset token for a session with the new password.',
          'The stock `ForgotPassword` component adds the screen state and navigation around this hook, but the hook itself does not manage any wizard step state.',
          'A successful `resetPassword()` call can still return a session with unfinished sign-in attempts. The built-in UI checks for that and sends the user back into the sign-in flow when a second factor is still required.',
          'The hook is email-based. Phone-based recovery and other recovery surfaces are not part of this contract.',
        ],
        examples: [
          {
            title: 'Start password recovery for an email address',
            code: `export default function RequestPasswordReset() {
  const { loading, forgotPassword } = useForgotPassword();

  async function sendCode() {
    if (loading) {
      return;
    }

    await forgotPassword('jane@example.com');
  }

  return <button onClick={sendCode}>Send recovery code</button>;
}`,
          },
          {
            title: 'Verify the OTP and capture the reset token',
            code: `export default function VerifyRecoveryCode() {
  const { loading, verifyOtp } = useForgotPassword();

  async function verify() {
    if (loading) {
      return;
    }

    const result = await verifyOtp('jane@example.com', '123456');

    if ('data' in result) {
      console.log(result.data.token);
    }
  }

  return <button onClick={verify}>Verify recovery code</button>;
}`,
          },
          {
            title: 'Reset the password and inspect the returned session',
            code: `export default function CompletePasswordReset() {
  const { loading, resetPassword } = useForgotPassword();

  async function complete() {
    if (loading) {
      return;
    }

    const result = await resetPassword('reset-token', 'NewPassword123!');

    if ('data' in result && result.data.signin_attempts?.length) {
      const attempt = result.data.signin_attempts.at(-1);
      console.log(attempt?.current_step);
    }
  }

  return <button onClick={complete}>Set new password</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-magic-link-verification',
        title: 'useMagicLinkVerification',
        description: 'Finish a magic-link attempt after the user returns from email.',
        importName: 'useMagicLinkVerification',
        intro:
          '`useMagicLinkVerification()` is the headless verification hook behind `MagicLinkVerification`. It verifies the callback token and attempt pair, tracks whether verification is still running, and exposes a simple success state for the page that owns the redirect after verification completes.',
        example: `export default function MagicLinkPage() {
  const { loading, success, verifyMagicLink } = useMagicLinkVerification();

  async function verify() {
    await verifyMagicLink({
      token: 'magic-link-token',
      attempt: 'signin-attempt-id',
      redirectUri: window.location.href,
    });
  }

  return (
    <div>
      <button onClick={verify}>Verify magic link</button>
      {loading ? <p>Verifying…</p> : null}
      {success === true ? <p>Verified.</p> : null}
    </div>
  );
}`,
        points: [],
        signature: `declare function useMagicLinkVerification(): {
  loading: boolean;
  verifyMagicLink: (params: {
    token?: string;
    attempt?: string;
    redirectUri?: string;
  }) => Promise<ApiResult<{}>>;
  success: boolean | null;
};`,
        api: [
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the hook is still waiting for the shared client or is currently verifying the magic link.',
          },
          {
            name: 'verifyMagicLink',
            type: '(params: { token?: string; attempt?: string; redirectUri?: string }) => Promise<ApiResult<{}>>',
            required: true,
            description: 'Verifies a magic-link token and the associated attempt identifier.',
            children: [
              {
                name: 'token',
                type: 'string | undefined',
                description: 'Magic-link token returned in the callback URL.',
              },
              {
                name: 'attempt',
                type: 'string | undefined',
                description: 'Sign-in attempt identifier returned in the callback URL.',
              },
              {
                name: 'redirectUri',
                type: 'string | undefined',
                description: 'Optional redirect target to carry through the verification request.',
              },
            ],
          },
          {
            name: 'success',
            type: 'boolean | null',
            required: true,
            description: 'Verification outcome. `null` means the current request has not finished yet, `true` means verification succeeded, and `false` means the last verification attempt failed.',
          },
        ],
        details: [
          'The hook only owns the verification request and the small bit of state around it. It does not read query params on its own and it does not navigate after success.',
          'The stock `MagicLinkVerification` component reads the callback token, attempt, and redirect target from the current URL, then passes those values into this hook.',
          'When `verifyMagicLink()` starts, the hook resets `success` back to `null`, marks itself loading, and then updates `success` to `true` or `false` when the request finishes.',
          'If either `token` or `attempt` is missing, the hook throws before sending the verification request.',
          'The hook is intentionally small so apps can decide what success and failure should look like, including whether to show a status page, redirect immediately, or let the user retry.',
        ],
        examples: [
          {
            title: 'Verify from the current callback URL',
            code: `import { useEffect } from 'react';

export default function MagicLinkCallbackPage() {
  const { loading, success, verifyMagicLink } = useMagicLinkVerification();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') ?? undefined;
    const attempt = params.get('attempt') ?? undefined;
    const redirectUri = params.get('redirect_uri') ?? undefined;

    if (!token || !attempt) {
      return;
    }

    void verifyMagicLink({ token, attempt, redirectUri });
  }, [verifyMagicLink]);

  if (loading) {
    return <p>Verifying your magic link…</p>;
  }

  if (success === false) {
    return <p>This magic link is no longer valid.</p>;
  }

  return null;
}`,
          },
          {
            title: 'Retry verification from a custom screen',
            code: `export default function RetryMagicLink() {
  const { loading, success, verifyMagicLink } = useMagicLinkVerification();

  async function retry() {
    await verifyMagicLink({
      token: 'magic-link-token',
      attempt: 'signin-attempt-id',
    });
  }

  return (
    <div>
      <button onClick={retry} disabled={loading}>
        Try again
      </button>
      {success === false ? <p>Verification failed.</p> : null}
    </div>
  );
}`,
          },
        ],
      },
      {
        slug: 'use-invitation',
        title: 'useInvitation',
        description: 'Accept and inspect pending invitations.',
        importName: 'useInvitation',
        intro:
          '`useInvitation()` is the headless invitation-acceptance hook behind `AcceptInvite`. It accepts an invitation token, stores the last returned invitation result, exposes a loading state for the active request, and keeps a reset path so the page can clear the last result before trying again.',
        example: `export default function InvitationPage() {
  const { acceptInvitation, invitationData, loading, error } = useInvitation();

  async function accept() {
    await acceptInvitation('invite-token');
  }

  return (
    <div>
      <button onClick={accept} disabled={loading}>
        Accept invitation
      </button>
      {error ? <p>{error}</p> : null}
      {invitationData?.organization ? <p>{invitationData.organization.name}</p> : null}
    </div>
  );
}`,
        points: [],
        signature: `declare function useInvitation(): {
  acceptInvitation: (token: string) => Promise<{
    organization?: { id: string; name: string };
    workspace?: { id: string; name: string };
    signin_id?: string;
    already_member?: boolean;
    message?: string;
    requires_signin?: boolean;
    invited_email?: string;
    error_code?: string;
  }>;
  invitationData: {
    organization?: { id: string; name: string };
    workspace?: { id: string; name: string };
    signin_id?: string;
    already_member?: boolean;
    message?: string;
    requires_signin?: boolean;
    invited_email?: string;
    error_code?: string;
  } | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
};`,
        api: [
          {
            name: 'acceptInvitation',
            type: '(token: string) => Promise<AcceptInvitationResponse>',
            required: true,
            description: 'Accepts an invitation token and returns the invitation result.',
            children: [
              {
                name: 'organization',
                type: '{ id: string; name: string } | undefined',
                description: 'Organization that the invitation belongs to when one is returned.',
                children: [
                  {
                    name: 'id',
                    type: 'string',
                    description: 'Organization identifier.',
                  },
                  {
                    name: 'name',
                    type: 'string',
                    description: 'Organization name.',
                  },
                ],
              },
              {
                name: 'workspace',
                type: '{ id: string; name: string } | undefined',
                description: 'Workspace that the invitation belongs to when one is returned.',
                children: [
                  {
                    name: 'id',
                    type: 'string',
                    description: 'Workspace identifier.',
                  },
                  {
                    name: 'name',
                    type: 'string',
                    description: 'Workspace name.',
                  },
                ],
              },
              {
                name: 'signin_id',
                type: 'string | undefined',
                description: 'Sign-in identifier returned when the accepted invitation is attached to a specific sign-in.',
              },
              {
                name: 'already_member',
                type: 'boolean | undefined',
                description: 'Whether the invited user is already a member.',
              },
              {
                name: 'message',
                type: 'string | undefined',
                description: 'Human-readable message returned with the invitation result.',
              },
              {
                name: 'requires_signin',
                type: 'boolean | undefined',
                description: 'Whether the user must sign in before the invitation can be completed.',
              },
              {
                name: 'invited_email',
                type: 'string | undefined',
                description: 'Email address that the invitation expects.',
              },
              {
                name: 'error_code',
                type: 'string | undefined',
                description: 'Error code when the invitation could not be accepted cleanly.',
              },
            ],
          },
          {
            name: 'invitationData',
            type: 'AcceptInvitationResponse | null',
            required: true,
            description: 'Last invitation result returned by `acceptInvitation()`.',
            children: [
              {
                name: 'organization',
                type: '{ id: string; name: string } | undefined',
                description: 'Accepted organization when one is returned.',
              },
              {
                name: 'workspace',
                type: '{ id: string; name: string } | undefined',
                description: 'Accepted workspace when one is returned.',
              },
              {
                name: 'signin_id',
                type: 'string | undefined',
                description: 'Returned sign-in identifier when one is present.',
              },
              {
                name: 'already_member',
                type: 'boolean | undefined',
                description: 'Whether the invited user was already a member.',
              },
              {
                name: 'message',
                type: 'string | undefined',
                description: 'Returned invitation message.',
              },
              {
                name: 'requires_signin',
                type: 'boolean | undefined',
                description: 'Whether the invitation still requires sign-in.',
              },
              {
                name: 'invited_email',
                type: 'string | undefined',
                description: 'Expected invited email address.',
              },
              {
                name: 'error_code',
                type: 'string | undefined',
                description: 'Returned error code when acceptance failed.',
              },
            ],
          },
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether an invitation-acceptance request is currently running.',
          },
          {
            name: 'error',
            type: 'string | null',
            required: true,
            description: 'Current invitation error message.',
          },
          {
            name: 'reset',
            type: '() => void',
            required: true,
            description: 'Clears the current error and invitation result so the UI can retry from a clean state.',
          },
        ],
        details: [
          'The hook stores the last invitation result in local state rather than returning a bare request promise only. That is what lets `AcceptInvite` render the success, already-member, and sign-in-required branches from one result object.',
          'Network failures and logical invitation failures are both surfaced through the same result shape. On network failure, the hook also synthesizes an `error_code` so the UI still has structured state to render.',
          'The hook does not decide where to navigate next. Higher-level UI uses the returned `requires_signin`, `invited_email`, and membership data to decide whether to continue, send the user to sign-in or sign-up, or show a terminal error state.',
          'Calling `acceptInvitation()` clears the previous error and invitation result before the next request starts.',
        ],
        examples: [
          {
            title: 'Accept an invitation token from your own page',
            code: `export default function AcceptOrgInvite() {
  const { acceptInvitation, invitationData, loading } = useInvitation();

  async function accept() {
    await acceptInvitation('invite-token');
  }

  return (
    <div>
      <button onClick={accept} disabled={loading}>
        Accept invitation
      </button>
      {invitationData?.organization ? (
        <p>Joined {invitationData.organization.name}</p>
      ) : null}
    </div>
  );
}`,
          },
          {
            title: 'Reset the invitation state before retrying',
            code: `export default function RetryInvitation() {
  const { acceptInvitation, error, reset } = useInvitation();

  async function retry() {
    reset();
    await acceptInvitation('invite-token');
  }

  return (
    <div>
      <button onClick={retry}>Try again</button>
      {error ? <p>{error}</p> : null}
    </div>
  );
}`,
          },
        ],
      },
      {
        slug: 'use-user-signins',
        title: 'useUserSignins',
        description: 'Read and manage the sign-in records attached to the current user.',
        importName: 'useUserSignins',
        intro:
          '`useUserSignins()` is the headless session-list hook behind the active-sessions section in `ManageAccount`. It loads the current user’s sign-in records with SWR, exposes a way to sign out one of those records, and keeps a manual refetch path so the UI can refresh after a mutation.',
        example: `export default function ActiveSessions() {
  const { signins, loading, removeSignin } = useUserSignins();

  async function endFirstSession() {
    if (!signins?.length) {
      return;
    }

    await removeSignin(signins[0].id);
  }

  return (
    <div>
      <button onClick={endFirstSession} disabled={loading}>
        End first session
      </button>
      <p>Sessions: {signins?.length ?? 0}</p>
    </div>
  );
}`,
        points: [],
        signature: `declare function useUserSignins(): {
  signins: SignIn[] | undefined;
  error: Error | null;
  removeSignin: (id: string) => Promise<ApiResult<unknown>>;
  refetch: () => Promise<SignIn[] | undefined>;
  loading: boolean;
};`,
        api: [
          {
            name: 'signins',
            type: 'SignIn[] | undefined',
            required: true,
            description: 'Sign-in records attached to the current user.',
            children: [
              {
                name: '[].id',
                type: 'string',
                description: 'Sign-in identifier.',
              },
              {
                name: '[].user_id',
                type: 'string',
                description: 'User identifier attached to the sign-in.',
              },
              {
                name: '[].active_organization_membership_id',
                type: 'string',
                description: 'Active organization membership for the sign-in.',
              },
              {
                name: '[].active_workspace_membership_id',
                type: 'string',
                description: 'Active workspace membership for the sign-in.',
              },
              {
                name: '[].expiresAt',
                type: 'string',
                description: 'Sign-in expiry timestamp.',
              },
              {
                name: '[].lastActiveAt',
                type: 'string',
                description: 'Last activity timestamp for the sign-in.',
              },
              {
                name: '[].ipAddress',
                type: 'string',
                description: 'IP address recorded for the sign-in.',
              },
              {
                name: '[].browser',
                type: 'string',
                description: 'Browser recorded for the sign-in.',
              },
              {
                name: '[].device',
                type: 'string',
                description: 'Device recorded for the sign-in.',
              },
              {
                name: '[].city',
                type: 'string',
                description: 'City recorded for the sign-in.',
              },
              {
                name: '[].region',
                type: 'string',
                description: 'Region recorded for the sign-in.',
              },
              {
                name: '[].regionCode',
                type: 'string',
                description: 'Region code recorded for the sign-in.',
              },
              {
                name: '[].country',
                type: 'string',
                description: 'Country recorded for the sign-in.',
              },
              {
                name: '[].countryCode',
                type: 'string',
                description: 'Country code recorded for the sign-in.',
              },
              {
                name: '[].user',
                type: 'CurrentUser',
                description: 'User record attached to the sign-in.',
                children: [
                  {
                    name: 'id',
                    type: 'string',
                    description: 'Current user identifier.',
                  },
                  {
                    name: 'first_name',
                    type: 'string',
                    description: 'User first name.',
                  },
                  {
                    name: 'last_name',
                    type: 'string',
                    description: 'User last name.',
                  },
                  {
                    name: 'username',
                    type: 'string',
                    description: 'Username when one is set.',
                  },
                ],
              },
            ],
          },
          {
            name: 'error',
            type: 'Error | null',
            required: true,
            description: 'SWR error for the current sign-ins query.',
          },
          {
            name: 'removeSignin',
            type: '(id: string) => Promise<ApiResult<unknown>>',
            required: true,
            description: 'Signs out one specific sign-in record.',
          },
          {
            name: 'refetch',
            type: '() => Promise<SignIn[] | undefined>',
            required: true,
            description: 'Revalidates the sign-ins query and returns the latest list from SWR.',
          },
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the shared client or the sign-ins query is still loading.',
          },
        ],
        details: [
          'This hook is centered on the current user’s sign-in records, not just the active session. That is why it is the right source for account-security screens that list every active browser session.',
          'The hook is SWR-backed, so `signins` can be `undefined` on the first render while the query is still resolving.',
          'Calling `removeSignin()` does not automatically refetch the list inside the hook. The stock active-sessions UI explicitly calls both `refetch()` and the session refetch from `useSession()` after a sign-out action.',
          '`useSession()` and `useUserSignins()` overlap, but they are aimed at different UI problems: `useSession()` manages the active session, while `useUserSignins()` manages the list of sign-ins attached to the current user.',
        ],
        examples: [
          {
            title: 'Render the active sign-in count',
            code: `export default function SessionCount() {
  const { signins, loading } = useUserSignins();

  if (loading) {
    return <p>Loading sessions…</p>;
  }

  return <p>{signins?.length ?? 0} active sessions</p>;
}`,
          },
          {
            title: 'Sign out one session and refresh the list',
            code: `export default function EndFirstSession() {
  const { signins, removeSignin, refetch } = useUserSignins();

  async function signOutFirst() {
    if (!signins?.length) {
      return;
    }

    await removeSignin(signins[0].id);
    await refetch();
  }

  return <button onClick={signOutFirst}>End first session</button>;
}`,
          },
        ],
      },
    ],
  };
