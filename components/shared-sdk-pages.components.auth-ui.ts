import type { SharedGroup } from './shared-sdk-pages.types';

export const authUiComponentGroup: SharedGroup = {
    label: 'Auth UI',
    docs: [
      {
        slug: 'sign-in-form',
        title: 'SignInForm',
        description: 'Render the embedded sign-in flow inside your app and let the deployment settings drive the rest of the experience.',
        importName: 'SignInForm',
        intro:
          '`SignInForm` is the shared embedded sign-in surface. It sits on top of `SignInProvider`, `useSignIn`, `useSession`, deployment auth settings, and the shared navigation helpers, so the form can move between identifier entry, password entry, other auth strategies, verification, passkeys, profile completion, multi-session selection, and redirect handling without extra wiring from the app.',
        example: `<DefaultStylesProvider>
  <SignInForm />
</DefaultStylesProvider>`,
        points: [
          'Use this when sign-in should stay inside your own pages instead of redirecting to hosted auth.',
          'There is no top-level prop API on `SignInForm`; the available methods and the redirect targets come from deployment settings, session state, and the current URL.',
          'If the user already has an active sign-in and multi-session support is disabled, the component redirects instead of showing the form.',
        ],
        sections: [
          {
            title: 'Entry and state',
            paragraphs: [
              'The component wraps its content in `SignInProvider`, which tracks the current step, the first-factor strategy, the enabled social providers, and the identifier state.',
              'The provider resolves the deployment-backed auth rules before the form decides what to show. The form does not invent its own capabilities.',
            ],
            points: [
              'If the user already has an active sign-in and multi-session support is disabled, the component redirects instead of showing the form.',
              'If the deployment enables passkey prompting on auth and the signed-in user does not yet have a passkey, the form pauses and shows the passkey prompt before the final redirect.',
            ],
          },
          {
            title: 'Primary screen',
            paragraphs: [
              'The main screen renders the sign-in title, the optional current-account hints, the social sign-in buttons, the passkey button, and the credential form. Those pieces appear only when the deployment enables them.',
              'Social auth buttons are grouped and laid out dynamically. With one provider the button reads like a full call to action, and with several providers it collapses into compact provider labels.',
              'The “other methods” screen is a separate branch with its own back path. It is used when the main view would be too crowded or the user wants a different strategy entirely.',
            ],
          },
          {
            title: 'Verification and recovery',
            paragraphs: [
              'The identifier step can branch into password, OTP, magic-link, social, SSO, or passkey flows depending on deployment settings and what the user enters.',
              'The forgot-password path is part of the sign-in component. It can start the password reset flow, verify the OTP, and send the user back into sign-in if a follow-up attempt is still incomplete.',
              'Verification states come from the sign-in attempt. The component knows how to resume email OTP, phone OTP, magic-link, 2FA, and profile-completion steps.',
            ],
            points: [
              'If a sign-in attempt returns an incomplete profile, the component hands off to profile completion instead of staying on the sign-in screen.',
              'If a sign-in attempt requires second-factor verification, the component hands off to the two-factor flow and keeps the attempt identifier alive through that transition.',
              'Passkey prompting is separate from passkey sign-in. One is the login method itself; the other is a follow-up prompt after sign-in to register a passkey for later.',
            ],
          },
          {
            title: 'Session-aware paths',
            paragraphs: [
              'When the current session already contains sign-ins, the form can surface existing accounts and offer continue-as and more-accounts paths instead of starting from scratch.',
              'Continue-as uses the active session’s sign-in list and keeps the current redirect target intact. More accounts sends the user to the account-selection route when that route is configured.',
              'Sign-in tickets and incomplete sign-in attempts are both resumable through query parameters, which is how impersonation and mid-flow redirects get restored.',
            ],
            points: [
              'If the page receives a `ticket`, the component exchanges it for a session before it resolves the redirect target.',
              'If the page receives a `signin_attempt_id`, it rehydrates the attempt from the session and resumes the correct verification branch.',
            ],
          },
          {
            title: 'Redirects and deployment rules',
            paragraphs: [
              'SSO error query parameters are handled on entry so the form can show the error state and let the user retry without breaking the route.',
              'The SSO branch uses the provider connection returned by identifier lookup to send the user to the right identity provider, and it preserves the redirect target when one is present.',
              'Redirect handling always checks `redirect_uri` first, then deployment redirect URLs, then the deployment frontend host.',
            ],
            points: [
              'In staging, redirects keep `__dev_session__` attached so the session survives the round trip.',
              'The deployment auth settings are the real source of truth for which first-factor fields render. The form does not invent its own capabilities.',
            ],
          },
        ],
        examples: [
          {
            title: 'Basic embedded page',
            code: `<DefaultStylesProvider>
  <SignInForm />
</DefaultStylesProvider>`,
          },
          {
            title: 'Custom shell',
            code: `export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md py-12">
      <h1>Sign in</h1>
      <DefaultStylesProvider>
        <SignInForm />
      </DefaultStylesProvider>
    </div>
  );
}`,
          },
        ],
      },
      {
        slug: 'sign-up-form',
        title: 'SignUpForm',
        description: 'Render the embedded sign-up flow inside your app and let deployment settings decide what the form shows.',
        importName: 'SignUpForm',
        intro:
          '`SignUpForm` is the embedded sign-up surface. It reads deployment auth settings, invitation state, and the current session before it decides which fields, strategies, and redirects are available.',
        example: `<DefaultStylesProvider>
  <SignUpForm />
</DefaultStylesProvider>`,
        points: [
          'Use this when sign-up should stay inside your app layout instead of going through hosted auth.',
          'The visible fields, invitation behavior, and verification step all come from deployment settings.',
          'There is no top-level prop API on `SignUpForm`; the component is driven by deployment state, session state, the current URL, and the local sign-up attempt.',
          'If the current session already has an active sign-in and multi-session support is disabled, the form redirects instead of rendering.',
          'If the deployment is restricted or waitlist-only, the component follows that rule before showing the form.',
        ],
        sections: [
          {
            title: 'Entry and state',
            paragraphs: [
              'The component reads from `useSignUp`, `useDeployment`, `useSession`, `useNavigation`, and the OAuth sign-in helper so it can combine the signup attempt, session state, and deployment settings in one place.',
              'It keeps local form state for names, email, username, phone number, password, country code, invitation token, OTP code, and loading flags.',
              'The sign-up hook returns the current `signupAttempt` together with `discardSignupAttempt()`, so the component can reset and restart the flow when the user switches methods.',
            ],
            points: [
              'The initial redirect target comes from `redirect_uri`, then deployment sign-up settings, then the deployment frontend host.',
              'In staging, the redirect keeps `__dev_session__` attached so the session survives the round trip.',
              'When the current session already contains an active sign-in, the component short-circuits unless multi-session support is enabled.',
            ],
          },
          {
            title: 'Account details',
            paragraphs: [
              'The visible fields come directly from `deployment.auth_settings`. First name, last name, username, email, phone number, and password each render only when the deployment enables them.',
              'Required markers, validation, and read-only behavior follow the deployment settings too.',
              'The field inputs are also normalized before submit: email is lowercased and phone numbers are stripped to digits and formatting characters the component can validate.',
            ],
            points: [
              'If the invitation validator pre-fills the email address, the field becomes read-only.',
              'The form validates the name, username, email, phone, and password fields before it submits the request.',
              'The submit payload includes `phone_country_code` when the phone field has one and `invite_token` when an invitation token is present.',
              'Name, username, email, phone, and password each have their own validation rules before the create request is allowed to go out.',
            ],
          },
          {
            title: 'Invitations and waitlist',
            paragraphs: [
              'An invitation token can come from the `invite_token` query parameter, or from the surrounding page if you pass it through before rendering the component.',
              'When an invitation token is present, the component validates it and pre-fills the invited user details if the token is valid.',
              'The invitation data can prefill first name, last name, and email, and the email field becomes read-only when the invite already fixes it.',
              'If the deployment is in waitlist mode and there is no invite token, the component redirects to the waitlist page instead of rendering the sign-up form.',
              'If the deployment is restricted, the form shows a restricted message and points the user toward support.',
            ],
            points: [
              'Invitation validation uses `validateDeploymentInvitation()` on the sign-up helper.',
              'The restricted-state help link falls back to the sign-in page with `?help=true`, or to `/contact` when no sign-in page is configured.',
              'The waitlist redirect uses the configured waitlist page URL first and falls back to the deployment frontend host when that setting is missing.',
            ],
          },
          {
            title: 'Social sign-up',
            paragraphs: [
              'If the deployment exposes enabled social connections, the component renders the social buttons above the form and uses the OAuth sign-in helper to start the provider flow.',
              'The `redirect_uri` query parameter is forwarded into the OAuth request so the user returns to the same place after the provider flow completes.',
              'The social flow uses the same redirect selection as the rest of the component, so provider auth does not bypass the sign-up page’s own destination rules.',
            ],
            points: [
              'The social button block disappears when no enabled social connections are available.',
              'The provider flow uses the same deployment-backed redirect behavior as the rest of the component.',
              'The OAuth helper returns an `oauth_url`, and the component navigates there directly after the request succeeds.',
            ],
          },
          {
            title: 'Verification and completion',
            paragraphs: [
              'Submitting the form creates a sign-up attempt. If the deployment requires email or phone verification, the component switches into the OTP step instead of finishing immediately.',
              'The verification screen reuses the same attempt and can resend the code when the user asks for it.',
              'The OTP screen changes its labels and support copy based on whether the current step is email verification or phone verification.',
            ],
            points: [
              'When the verification response returns an active sign-in, the component refreshes the session and proceeds with the logged-in state.',
              'When the attempt completes, the component resolves the final redirect using `redirect_uri`, then the deployment redirect setting, then the frontend host.',
              'The resend action uses `email_otp` or `phone_otp` depending on the step the attempt is currently in.',
              'If the attempt is completed and the deployment is in staging mode, the redirect keeps the stored dev session query parameter intact.',
            ],
          },
          {
            title: 'Reset and retry',
            paragraphs: [
              'The “Use other method” action clears the current form data, OTP state, and signup attempt so the user can start over from the first screen.',
              'That reset is important when the current attempt has already moved into a verification branch and the user wants to switch strategies.',
            ],
            points: [
              'Resetting also clears the local invitation and error state.',
              'The component uses the same helper path for both a clean restart and a recovery from a partial attempt.',
            ],
          },
        ],
        examples: [
          {
            title: 'Embedded sign-up page',
            code: `<SignUpForm />`,
          },
          {
            title: 'Custom page shell',
            code: `export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-md py-12">
      <h1>Create your account</h1>
      <SignUpForm />
    </main>
  );
}`,
          },
        ],
      },
      {
        slug: 'waitlist-form',
        title: 'WaitlistForm',
        description: 'Collect waitlist registrations with the shared embedded form and keep the response inside the same page.',
        importName: 'WaitlistForm',
        intro:
          '`WaitlistForm` is the embedded waitlist surface. It reads deployment auth settings, collects the enabled fields, and submits the result to the waitlist API.',
        example: `<WaitlistForm />`,
        points: [
          'Use it when the product is not open to direct sign-up yet.',
          'The visible fields still follow the deployment auth settings.',
          'The component owns its default styles and does not need an outer `DefaultStylesProvider` wrapper.',
          'There is no prop API on `WaitlistForm`; the form is driven by deployment state and local submission state.',
        ],
        sections: [
          {
            title: 'Entry and state',
            paragraphs: [
              'The component reads `deployment` from `useDeployment` and the submit function from `useWaitlist`.',
              'It keeps local state for first name, last name, email, submission state, loading state, and any error returned by the request.',
            ],
            points: [
              'The form does not redirect; it stays on the page and switches to the success view once the request succeeds.',
            ],
          },
          {
            title: 'Fields and validation',
            paragraphs: [
              'First name, last name, and email are the only fields on the waitlist form.',
              'First name and last name only render when the deployment enables them. Email always renders.',
              'The request strips empty values before it sends the form data, so optional fields stay out of the payload when they are blank.',
            ],
            points: [
              'Required markers come from the deployment auth settings.',
              'The form shows the field-level error state returned by the local error helper.',
              'The submit path goes through `useWaitlist()`.',
            ],
          },
        ],
        examples: [
          {
            title: 'Standalone waitlist page',
            code: `<WaitlistForm />`,
          },
          {
            title: 'Waitlist route shell',
            code: `export default function WaitlistPage() {
  return (
    <main className="mx-auto max-w-md py-12">
      <h1>Join the waitlist</h1>
      <WaitlistForm />
    </main>
  );
}`,
          },
        ],
      },
      {
        slug: 'sso-callback',
        title: 'SSOCallback',
        description: 'Finish an SSO flow after the user returns from the identity provider and route the user to the next step.',
        importName: 'SSOCallback',
        intro:
          '`SSOCallback` handles the return path after an SSO or enterprise auth redirect. It reads the callback state, completes the exchange, and decides whether to continue the sign-in attempt or move on to the final redirect.',
        example: `<SSOCallback />`,
        points: [
          'Use it on the callback route that receives the provider response.',
          'It is a completion step, not a user-facing auth screen.',
        ],
        sections: [
          {
            title: 'Callback state',
            paragraphs: [
              'The hook reads the OAuth `code`, the encoded `state`, and any OAuth error values from the URL.',
              'If the callback URL does not contain either a code or an OAuth error, the component treats it as an invalid callback and stops there.',
            ],
            points: [
              'If the OAuth provider returned an error, the component records it and stays on the error state.',
              'The callback parser expects the state format used by the auth flow, so malformed or expired links fail early.',
            ],
          },
          {
            title: 'Exchange step',
            paragraphs: [
              'The encoded state decides whether the callback is finishing a sign-in flow or a social connection flow.',
              'A sign-in callback and a connect-social callback follow different backend routes behind the scenes.',
            ],
            points: [
              'The component forwards both `code` and `state` to the backend endpoint.',
              'The result includes the updated session and may include a redirect target from the server.',
            ],
          },
          {
            title: 'Resume behavior',
            paragraphs: [
              'If the response includes a sign-in attempt, the component routes the user back into the unfinished attempt instead of going straight to the final destination.',
            ],
          },
        ],
        examples: [
          {
            title: 'Callback route',
            code: `export default function SSOCallbackPage() {
  return <SSOCallback />;
}`,
          },
        ],
      },
      {
        slug: 'magic-link-verification',
        title: 'MagicLinkVerification',
        description: 'Finish a magic-link flow after the user returns from email and decide whether to redirect or retry.',
        importName: 'MagicLinkVerification',
        intro:
          '`MagicLinkVerification` resolves the email-link callback step. It reads the callback parameters, verifies the link with the backend, and then moves the user on to the final redirect or back into sign-in when the link is no longer valid.',
        example: `<MagicLinkVerification />`,
        points: [
          'Use it on the route that receives the magic-link callback.',
          'It is part of the embedded auth flow, not the hosted redirect path.',
        ],
        sections: [
          {
            title: 'Callback params',
            paragraphs: [
              'The component reads `token`, `attempt`, and optional `redirect_uri` from the current URL. If either `token` or `attempt` is missing, the component treats the link as malformed and stops there. The callback parameters are parsed once when the component mounts.',
            ],
          },
          {
            title: 'Verification',
            paragraphs: [
              'The hook verifies the token and attempt with the backend. If the backend accepts the link, the component marks the flow as successful and prepares the redirect. The verification result is tied to the current attempt, so old links do not continue a different flow.',
            ],
          },
          {
            title: 'Redirect and retry',
            paragraphs: [
              'After verification, the component resolves the final redirect using `redirect_uri`, then the deployment sign-in redirect, then the deployment frontend host. If the link is invalid or has already been used, the component shows the error state and lets the user try signing in again. In staging, the redirect keeps `__dev_session__` attached so the session survives the round trip.',
            ],
          },
        ],
        examples: [
          {
            title: 'Verification route',
            code: `export default function MagicLinkPage() {
  return <MagicLinkVerification />;
}`,
          },
        ],
      },
      {
        slug: 'accept-invite',
        title: 'AcceptInvite',
        description: 'Accept an organization or workspace invite inside the app.',
        importName: 'AcceptInvite',
        intro:
          '`AcceptInvite` is the embedded invite-acceptance surface. It reads the token, resolves the invitation, and either finishes the membership flow or hands off to sign-in or sign-up when the invite still needs an authenticated user.',
        example: `<AcceptInvite token={token} />`,
        points: [],
        sections: [
          {
            title: 'Invite source',
            paragraphs: [
              'The token can come from the `token` prop, `invite_token` in the URL, or the older `token` query parameter. The component checks those sources once when it starts.',
              'If the token is missing, the component stops on the invalid-invite state instead of trying to guess the next step.',
            ],
          },
          {
            title: 'Result states',
            paragraphs: [
              'A valid invitation can resolve to a completed membership, an already-member state, a sign-in or sign-up requirement, an expired invite, or a generic error state.',
              'When the invite still needs authentication, the component keeps the invite context and sends the user to the right auth entry point with the token still attached.',
            ],
          },
          {
            title: 'Fallbacks',
            paragraphs: [
              'If the invite is already consumed or no longer valid, the page stays on the invite error state and lets the user retry or continue through the auth path that matches the invite.',
              'Use `useInvitation` directly when you want to own the acceptance UI yourself.',
            ],
          },
        ],
      },
      {
        slug: 'signed-in-accounts',
        title: 'SignedInAccounts',
        description: 'Render the accounts attached to the current session.',
        importName: 'SignedInAccounts',
        intro:
          '`SignedInAccounts` surfaces the signed-in accounts attached to the current session. It matters when the product supports multi-account sessions and account switching.',
        example: `<SignedInAccounts />`,
        points: [
          'Use it when the session can carry more than one sign-in.',
          'It pairs naturally with `useSession` and `switchSignIn` when you need explicit switching controls.',
        ],
        sections: [
          {
            title: 'Overview',
            paragraphs: [
              'Use it when the current session can hold more than one sign-in and the user needs a dedicated surface for switching between them or signing out of a specific account. It is the account-switching page, not the compact trigger.',
            ],
          },
          {
            title: 'Behavior',
            paragraphs: [
              'The component reads the current session, waits for loading to finish, and sends the user to sign-in if the session has no accounts attached. When accounts do exist, it shows the available sign-ins in one place and keeps the active account first.',
              'Selecting an account switches to it, while the optional add-account path keeps the current session context intact and hands the user back through the normal sign-in flow.',
              'If the user signs out from this surface, the active session is cleared and the component returns the user to the hosted sign-in path if one is configured.',
            ],
          },
          {
            title: 'Account switching',
            paragraphs: [
              'The switching flow is session-based rather than a one-off account picker. That means the component can keep the current redirect target and resume the same app destination after the user changes accounts.',
              'The active account is rendered first so the current context stays obvious before the user chooses a different sign-in.',
            ],
          },
          {
            title: 'Add account',
            paragraphs: [
              'The add-account path is not a separate login widget. It is the same sign-in flow, opened from the current session so the user can add another account without losing their existing context.',
            ],
          },
          {
            title: 'Sign out',
            paragraphs: [
              'The component can sign out one account or clear the whole session depending on the current session shape. That is what keeps it useful for multi-account setups instead of just single-user apps.',
            ],
          },
          {
            title: 'When to use it',
            paragraphs: [
              'Use this page when you need a dedicated account-switching surface rather than the compact `UserButton` dropdown.',
            ],
          },
        ],
      },
    ],
  };
