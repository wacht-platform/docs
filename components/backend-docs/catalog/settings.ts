import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const settingsBackendDocs: BackendDoc[] = [
{
        slug: 'get-deployment-settings',
        path: ['settings', 'get-deployment-settings'],
        title: 'getDeploymentSettings()',
        description: 'Get deployment metadata with effective settings.',
        intro:
          'Returns the current deployment plus resolved settings objects for auth, UI, B2B, and restrictions.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getDeploymentSettings() {
  const client = await wachtClient();
  return client.settings.getDeploymentSettings();
}`,
        signature: `function getDeploymentSettings(): Promise<DeploymentWithSettings>`,
        api: [
          { name: 'id', type: 'string', description: 'Deployment id.' },
          { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
          { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
          { name: 'maintenance_mode', type: 'boolean', description: 'Whether maintenance mode is enabled.' },
          { name: 'backend_host', type: 'string', description: 'Backend host for the deployment.' },
          { name: 'frontend_host', type: 'string', description: 'Frontend host for the deployment.' },
          { name: 'mail_from_host', type: 'string', description: 'Mail-from host configuration.' },
          { name: 'publishable_key', type: 'string', description: 'Deployment publishable key.' },
          { name: 'mode', type: `'production' | 'staging'`, description: 'Deployment mode.' },
          {
            name: 'auth_settings',
            type: 'Record<string, unknown> | undefined',
            description: 'Resolved auth settings object when configured.',
            children: [
              { name: 'password_min_length', type: 'number | undefined', description: 'Minimum allowed password length.' },
              { name: 'mfa_enabled', type: 'boolean | undefined', description: 'Whether MFA is enabled by policy.' },
              { name: 'mfa_methods', type: `Array<'totp' | 'sms' | 'email'> | undefined`, description: 'Allowed MFA methods.' },
              { name: 'session_timeout', type: 'number | undefined', description: 'Session timeout in seconds.' },
            ],
          },
          {
            name: 'ui_settings',
            type: 'Record<string, unknown> | undefined',
            description: 'Resolved UI settings object when configured.',
            children: [
              { name: 'display_name', type: 'string | undefined', description: 'Deployment display name.' },
              { name: 'primary_color', type: 'string | undefined', description: 'Primary brand color.' },
              { name: 'theme', type: `'light' | 'dark' | 'auto' | undefined`, description: 'Default theme mode.' },
              { name: 'locale', type: 'string | undefined', description: 'Default locale.' },
              { name: 'timezone', type: 'string | undefined', description: 'Default timezone id.' },
            ],
          },
          {
            name: 'b2b_settings',
            type: 'Record<string, unknown> | undefined',
            description: 'Resolved B2B settings object when configured.',
            children: [
              { name: 'organizations_enabled', type: 'boolean | undefined', description: 'Whether organizations are enabled.' },
              { name: 'workspaces_enabled', type: 'boolean | undefined', description: 'Whether workspaces are enabled.' },
              { name: 'allow_users_to_create_orgs', type: 'boolean | undefined', description: 'Whether users can self-create organizations.' },
              { name: 'max_allowed_org_members', type: 'number | undefined', description: 'Maximum members per organization.' },
              { name: 'max_allowed_workspace_members', type: 'number | undefined', description: 'Maximum members per workspace.' },
            ],
          },
          {
            name: 'restrictions',
            type: 'Record<string, unknown> | undefined',
            description: 'Resolved restrictions object when configured.',
            children: [
              { name: 'sign_up_mode', type: `'public' | 'restricted' | 'waitlist' | undefined`, description: 'Signup policy mode.' },
              { name: 'block_disposable_emails', type: 'boolean | undefined', description: 'Whether disposable emails are blocked.' },
              { name: 'waitlist_collect_names', type: 'boolean | undefined', description: 'Whether waitlist collects user names.' },
              { name: 'session_token_lifetime', type: 'number | undefined', description: 'Session token lifetime in seconds.' },
              { name: 'session_inactive_timeout', type: 'number | undefined', description: 'Session inactivity timeout in seconds.' },
            ],
          },
          { name: 'domain_verification_records', type: 'DomainVerificationRecords | undefined', description: 'Domain DNS verification records when present.' },
          { name: 'email_verification_records', type: 'EmailVerificationRecords | undefined', description: 'Email DNS verification records when present.' },
          { name: 'email_provider', type: `'postmark' | 'custom_smtp' | undefined`, description: 'Effective outbound email provider.' },
          {
            name: 'custom_smtp_config',
            type: 'CustomSmtpConfig | undefined',
            description: 'SMTP configuration summary when custom SMTP is configured.',
            children: [
              { name: 'host', type: 'string', description: 'Configured SMTP host.' },
              { name: 'port', type: 'number', description: 'Configured SMTP port.' },
              { name: 'username', type: 'string', description: 'Configured SMTP username.' },
              { name: 'from_email', type: 'string', description: 'Configured sender email.' },
              { name: 'use_tls', type: 'boolean', description: 'Whether TLS is enabled.' },
              { name: 'verified', type: 'boolean', description: 'Whether SMTP credentials have been verified.' },
            ],
          },
        ],
        sections: [
          {
            title: 'What it does',
            paragraphs: [
              'Reads the deployment root settings route and returns one merged deployment payload.',
              'Use it when you need a single snapshot that includes deployment metadata and resolved settings domains.',
            ],
          },
          {
            title: 'Return shape notes',
            paragraphs: [
              'Top-level deployment fields are typed explicitly in the SDK.',
              'Nested `auth_settings`, `ui_settings`, `b2b_settings`, and `restrictions` are currently modeled as generic objects in the Node SDK, so treat them as pass-through backend payloads unless you narrow them in your own app.',
            ],
          },
        ],
        examples: [
          {
            title: 'Read deployment mode and hosts',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function getDeploymentInfo() {
  const client = await wachtClient();
  const settings = await client.settings.getDeploymentSettings();

  return {
    id: settings.id,
    mode: settings.mode,
    backend: settings.backend_host,
    frontend: settings.frontend_host,
  };
}`,
            lang: 'ts',
          },
          {
            title: 'Check whether custom SMTP is active',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function isCustomSmtpActive() {
  const client = await wachtClient();
  const settings = await client.settings.getDeploymentSettings();
  return settings.email_provider === 'custom_smtp' && !!settings.custom_smtp_config?.verified;
}`,
            lang: 'ts',
          },
          {
            title: 'Read high-level settings flags for admin bootstrapping',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function getSettingsFlags() {
  const client = await wachtClient();
  const settings = await client.settings.getDeploymentSettings();

  return {
    hasAuthSettings: !!settings.auth_settings,
    hasUiSettings: !!settings.ui_settings,
    hasB2BSettings: !!settings.b2b_settings,
    hasRestrictions: !!settings.restrictions,
  };
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'update-deployment-restrictions',
        path: ['settings', 'update-deployment-restrictions'],
        title: 'updateDeploymentRestrictions()',
        description: 'Update deployment restriction settings.',
        intro:
          'Patches restriction controls such as allow/block lists, sign-up mode, and session policy fields.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateRestrictions() {
  const client = await wachtClient();
  await client.settings.updateDeploymentRestrictions({
    sign_up_mode: 'waitlist',
    block_disposable_emails: true,
  });
}`,
        signature: `function updateDeploymentRestrictions(
  request: DeploymentRestrictionsUpdates,
): Promise<void>`,
        paramsTitle: 'DeploymentRestrictionsUpdates',
        params: [
          { name: 'allowlist_enabled', type: 'boolean | undefined', description: 'Enable allowlist enforcement.' },
          { name: 'blocklist_enabled', type: 'boolean | undefined', description: 'Enable blocklist enforcement.' },
          { name: 'block_subaddresses', type: 'boolean | undefined', description: 'Block plus-address email variants.' },
          { name: 'block_disposable_emails', type: 'boolean | undefined', description: 'Block disposable email providers.' },
          { name: 'block_voip_numbers', type: 'boolean | undefined', description: 'Block VOIP phone numbers.' },
          {
            name: 'country_restrictions',
            type: 'CountryRestrictions | undefined',
            description: 'Country filtering object.',
            children: [
              { name: 'allowlist', type: 'string[] | undefined', description: 'Allowed country ISO codes.' },
              { name: 'blocklist', type: 'string[] | undefined', description: 'Blocked country ISO codes.' },
            ],
          },
          { name: 'banned_keywords', type: 'string[] | undefined', description: 'Blocked keyword list.' },
          { name: 'allowlisted_resources', type: 'string[] | undefined', description: 'Explicit allowlisted resources.' },
          { name: 'blocklisted_resources', type: 'string[] | undefined', description: 'Explicit blocklisted resources.' },
          { name: 'sign_up_mode', type: `'public' | 'restricted' | 'waitlist' | undefined`, description: 'Signup mode policy.' },
          { name: 'waitlist_collect_names', type: 'boolean | undefined', description: 'Whether waitlist form collects names.' },
          {
            name: 'multi_session_support',
            type: 'MultiSessionSupport | undefined',
            description: 'Multi-session policy object.',
            children: [
              { name: 'enabled', type: 'boolean | undefined', description: 'Whether multiple concurrent sessions are allowed.' },
              { name: 'max_sessions_per_user', type: 'number | undefined', description: 'Max concurrent sessions per user.' },
            ],
          },
          { name: 'session_token_lifetime', type: 'number | undefined', description: 'Session token lifetime (seconds).' },
          { name: 'session_validity_period', type: 'number | undefined', description: 'Session validity duration (seconds).' },
          { name: 'session_inactive_timeout', type: 'number | undefined', description: 'Inactive timeout (seconds).' },
        ],
        examples: [
          {
            title: 'Enable waitlist signup mode',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function setWaitlistMode() {
  const client = await wachtClient();
  await client.settings.updateDeploymentRestrictions({
    sign_up_mode: 'waitlist',
    waitlist_collect_names: true,
  });
}`,
            lang: 'ts',
          },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Applies a partial update and returns the server-side updated resource.',
          'Treat omitted optional fields as unchanged unless explicitly documented otherwise.',
        ],
      },
    ],
  },
{
        slug: 'update-b2b-settings',
        path: ['settings', 'update-b2b-settings'],
        title: 'updateB2BSettings()',
        description: 'Update deployment B2B settings.',
        intro:
          'Patches organization/workspace behavior, role defaults, membership limits, and related B2B flags.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateB2b() {
  const client = await wachtClient();
  await client.settings.updateB2BSettings({
    organizations_enabled: true,
    workspaces_enabled: true,
  });
}`,
        signature: `function updateB2BSettings(
  request: DeploymentB2bSettingsUpdates,
): Promise<void>`,
        paramsTitle: 'DeploymentB2bSettingsUpdates',
        params: [
          { name: 'organizations_enabled', type: 'boolean | undefined', description: 'Enable organizations feature.' },
          { name: 'workspaces_enabled', type: 'boolean | undefined', description: 'Enable workspaces feature.' },
          { name: 'allow_users_to_create_orgs', type: 'boolean | undefined', description: 'Allow self-service organization creation.' },
          { name: 'max_allowed_org_members', type: 'number | undefined', description: 'Organization membership cap.' },
          { name: 'max_allowed_workspace_members', type: 'number | undefined', description: 'Workspace membership cap.' },
          { name: 'custom_org_role_enabled', type: 'boolean | undefined', description: 'Enable custom org roles.' },
          { name: 'custom_workspace_role_enabled', type: 'boolean | undefined', description: 'Enable custom workspace roles.' },
          { name: 'organization_permissions', type: 'string[] | undefined', description: 'Organization permission catalog.' },
          { name: 'workspace_permissions', type: 'string[] | undefined', description: 'Workspace permission catalog.' },
          { name: 'enterprise_sso_enabled', type: 'boolean | undefined', description: 'Enable enterprise SSO capabilities.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Applies a partial update and returns the server-side updated resource.',
          'Treat omitted optional fields as unchanged unless explicitly documented otherwise.',
        ],
      },
    ],
  },
{
        slug: 'update-auth-settings',
        path: ['settings', 'update-auth-settings'],
        title: 'updateAuthSettings()',
        description: 'Update deployment auth settings.',
        intro:
          'Patches auth policy fields handled by `/settings/auth` for the current deployment.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateAuth() {
  const client = await wachtClient();
  await client.settings.updateAuthSettings({
    password_min_length: 12,
    mfa_enabled: true,
  });
}`,
        signature: `function updateAuthSettings(
  request: {
    allowed_domains?: string[];
    password_min_length?: number;
    password_require_uppercase?: boolean;
    password_require_lowercase?: boolean;
    password_require_numbers?: boolean;
    password_require_special_chars?: boolean;
    mfa_enabled?: boolean;
    mfa_methods?: Array<'totp' | 'sms' | 'email'>;
    session_timeout?: number;
    refresh_token_expiration?: number;
  },
): Promise<void>`,
        paramsTitle: 'UpdateAuthSettingsRequest',
        params: [
          { name: 'allowed_domains', type: 'string[] | undefined', description: 'Allowed email/domain policy list.' },
          { name: 'password_min_length', type: 'number | undefined', description: 'Minimum password length.' },
          { name: 'password_require_uppercase', type: 'boolean | undefined', description: 'Require uppercase letters.' },
          { name: 'password_require_lowercase', type: 'boolean | undefined', description: 'Require lowercase letters.' },
          { name: 'password_require_numbers', type: 'boolean | undefined', description: 'Require numeric characters.' },
          { name: 'password_require_special_chars', type: 'boolean | undefined', description: 'Require special characters.' },
          { name: 'mfa_enabled', type: 'boolean | undefined', description: 'Enable MFA requirements.' },
          { name: 'mfa_methods', type: `Array<'totp' | 'sms' | 'email'> | undefined`, description: 'Enabled MFA methods.' },
          { name: 'session_timeout', type: 'number | undefined', description: 'Session timeout (seconds).' },
          { name: 'refresh_token_expiration', type: 'number | undefined', description: 'Refresh token expiration (seconds).' },
        ],
        sections: [
          {
            title: 'Patch semantics',
            paragraphs: [
              'This method sends a partial patch to `/settings/auth`.',
              'Only provided fields are updated. Omitted fields are left unchanged by the backend.',
            ],
          },
          {
            title: 'Return value',
            paragraphs: [
              'The method resolves with no value when the update succeeds.',
            ],
          },
        ],
        examples: [
          {
            title: 'Harden password policy',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function hardenPasswordPolicy() {
  const client = await wachtClient();

  await client.settings.updateAuthSettings({
    password_min_length: 14,
    password_require_uppercase: true,
    password_require_lowercase: true,
    password_require_numbers: true,
    password_require_special_chars: true,
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Enable MFA and adjust session limits',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function enforceMfaAndSessionLimits() {
  const client = await wachtClient();

  await client.settings.updateAuthSettings({
    mfa_enabled: true,
    mfa_methods: ['totp'],
    session_timeout: 3600,
    refresh_token_expiration: 60 * 60 * 24 * 30,
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'update-display-settings',
        path: ['settings', 'update-display-settings'],
        title: 'updateDisplaySettings()',
        description: 'Update deployment display settings.',
        intro:
          'Patches branding and UI display fields handled by `/settings/display`.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateDisplay() {
  const client = await wachtClient();
  await client.settings.updateDisplaySettings({
    primary_color: '#111827',
    logo_url: 'https://cdn.example.com/logo.png',
  });
}`,
        signature: `function updateDisplaySettings(
  request: {
    display_name?: string;
    primary_color?: string;
    logo_url?: string;
    favicon_url?: string;
    custom_css?: string;
    theme?: 'light' | 'dark' | 'auto';
    locale?: string;
    timezone?: string;
  },
): Promise<void>`,
        paramsTitle: 'UpdateDisplaySettingsRequest',
        params: [
          { name: 'display_name', type: 'string | undefined', description: 'Display name shown in UI.' },
          { name: 'primary_color', type: 'string | undefined', description: 'Primary brand color.' },
          { name: 'logo_url', type: 'string | undefined', description: 'Logo image URL.' },
          { name: 'favicon_url', type: 'string | undefined', description: 'Favicon image URL.' },
          { name: 'custom_css', type: 'string | undefined', description: 'Custom stylesheet content.' },
          { name: 'theme', type: `'light' | 'dark' | 'auto' | undefined`, description: 'Default theme mode.' },
          { name: 'locale', type: 'string | undefined', description: 'Default locale.' },
          { name: 'timezone', type: 'string | undefined', description: 'Default timezone identifier.' },
        ],
        sections: [
          {
            title: 'Patch semantics',
            paragraphs: [
              'This method sends a partial patch to `/settings/display`.',
              'Only provided fields are changed; all other display settings remain as-is.',
            ],
          },
          {
            title: 'Return value',
            paragraphs: [
              'The method resolves with no value when the display settings update is accepted.',
            ],
          },
        ],
        examples: [
          {
            title: 'Update brand identity assets',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateBrandAssets() {
  const client = await wachtClient();

  await client.settings.updateDisplaySettings({
    display_name: 'Acme Console',
    logo_url: 'https://cdn.example.com/acme/logo.svg',
    favicon_url: 'https://cdn.example.com/acme/favicon.ico',
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Set theme and localization defaults',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function setDisplayDefaults() {
  const client = await wachtClient();

  await client.settings.updateDisplaySettings({
    theme: 'auto',
    locale: 'en-US',
    timezone: 'America/New_York',
    primary_color: '#0f172a',
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'list-jwt-templates',
        path: ['settings', 'list-jwt-templates'],
        title: 'listJwtTemplates()',
        description: 'List JWT templates in the deployment.',
        intro:
          'Returns JWT templates as a paginated response envelope.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listJwtTemplates() {
  const client = await wachtClient();
  return client.settings.listJwtTemplates();
}`,
        signature: `function listJwtTemplates(): Promise<PaginatedResponse<JwtTemplate>>`,
        api: [
          {
            name: 'data',
            type: 'JwtTemplate[]',
            description: 'JWT templates in the current page.',
            children: [
              { name: 'id', type: 'string', description: 'Template id.' },
              { name: 'name', type: 'string', description: 'Template name.' },
              { name: 'token_lifetime', type: 'number', description: 'Token lifetime in seconds.' },
              { name: 'allowed_clock_skew', type: 'number', description: 'Allowed clock skew in seconds.' },
              {
                name: 'custom_signing_key',
                type: 'CustomSigningKey | undefined',
                description: 'Custom key config when enabled.',
                children: [
                  { name: 'kid', type: 'string | undefined', description: 'Signing key id.' },
                  { name: 'alg', type: 'string | undefined', description: 'Signing algorithm.' },
                  { name: 'private_key', type: 'string | undefined', description: 'PEM/JWK private signing key material.' },
                ],
              },
              {
                name: 'template',
                type: 'Record<string, unknown>',
                description: 'Claim template object.',
                children: [
                  { name: 'sub', type: 'string | undefined', description: 'Subject claim template.' },
                  { name: 'role', type: 'string | undefined', description: 'Role/authorization claim template.' },
                  {
                    name: 'metadata',
                    type: 'Record<string, unknown> | undefined',
                    description: 'Additional custom claim object.',
                    children: [
                      { name: 'tenant_id', type: 'string | undefined', description: 'Example tenant identifier claim.' },
                      { name: 'plan', type: 'string | undefined', description: 'Example plan claim.' },
                    ],
                  },
                ],
              },
              { name: 'deployment_id', type: 'string', description: 'Owning deployment id.' },
              { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
              { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
            ],
          },
          { name: 'has_more', type: 'boolean', description: 'Whether another page exists.' },
          { name: 'limit', type: 'number | undefined', description: 'Effective page size when provided.' },
          { name: 'offset', type: 'number | undefined', description: 'Effective page offset when provided.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Returns a backend-scoped list response for this resource.',
          'Use pagination and filters from this method to build admin list views.',
        ],
      },
    ],
  },
{
        slug: 'create-jwt-template',
        path: ['settings', 'create-jwt-template'],
        title: 'createJwtTemplate()',
        description: 'Create a deployment JWT template.',
        intro:
          'Creates a JWT template on the deployment route.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createTemplate() {
  const client = await wachtClient();
  return client.settings.createJwtTemplate({
    name: 'default',
    token_lifetime: 3600,
    allowed_clock_skew: 60,
    template: {},
  });
}`,
        signature: `function createJwtTemplate(
  request: CreateJwtTemplateRequest,
): Promise<JwtTemplate>`,
        paramsTitle: 'CreateJwtTemplateRequest',
        params: [
          { name: 'name', type: 'string', description: 'Template display name.' },
          { name: 'token_lifetime', type: 'number', description: 'Token lifetime in seconds.' },
          { name: 'allowed_clock_skew', type: 'number | undefined', description: 'Allowed clock skew in seconds.' },
          {
            name: 'custom_signing_key',
            type: 'CustomSigningKey | undefined',
            description: 'Optional custom signing key config.',
            children: [
              { name: 'kid', type: 'string | undefined', description: 'Signing key id.' },
              { name: 'alg', type: 'string | undefined', description: 'Signing algorithm.' },
              { name: 'private_key', type: 'string | undefined', description: 'PEM/JWK private signing key material.' },
            ],
          },
          {
            name: 'template',
            type: 'Record<string, unknown>',
            description: 'JWT claims template definition.',
            children: [
              { name: 'sub', type: 'string | undefined', description: 'Subject claim template.' },
              { name: 'role', type: 'string | undefined', description: 'Role/authorization claim template.' },
              {
                name: 'metadata',
                type: 'Record<string, unknown> | undefined',
                description: 'Additional custom claim object.',
                children: [
                  { name: 'tenant_id', type: 'string | undefined', description: 'Example tenant identifier claim.' },
                  { name: 'plan', type: 'string | undefined', description: 'Example plan claim.' },
                ],
              },
            ],
          },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Created template id.' },
          { name: 'name', type: 'string', description: 'Created template name.' },
          { name: 'token_lifetime', type: 'number', description: 'Configured token lifetime.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Creates a new resource and returns the created object from the backend.',
          'Validate required fields before calling to avoid predictable request failures.',
        ],
      },
    ],
  },
{
        slug: 'update-jwt-template',
        path: ['settings', 'update-jwt-template'],
        title: 'updateJwtTemplate()',
        description: 'Update a deployment JWT template.',
        intro:
          'Patches one JWT template identified by template id.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateTemplate(templateId: string) {
  const client = await wachtClient();
  return client.settings.updateJwtTemplate(templateId, {
    token_lifetime: 7200,
  });
}`,
        signature: `function updateJwtTemplate(
  templateId: string,
  request: UpdateJwtTemplateRequest,
): Promise<JwtTemplate>`,
        paramsTitle: 'UpdateJwtTemplateRequest',
        params: [
          { name: 'templateId', type: 'string', description: 'Target template id.' },
          { name: 'name', type: 'string | undefined', description: 'Updated template name.' },
          { name: 'token_lifetime', type: 'number | undefined', description: 'Updated lifetime in seconds.' },
          { name: 'allowed_clock_skew', type: 'number | undefined', description: 'Updated clock skew allowance.' },
          {
            name: 'custom_signing_key',
            type: 'CustomSigningKey | undefined',
            description: 'Updated custom key config.',
            children: [
              { name: 'kid', type: 'string | undefined', description: 'Signing key id.' },
              { name: 'alg', type: 'string | undefined', description: 'Signing algorithm.' },
              { name: 'private_key', type: 'string | undefined', description: 'PEM/JWK private signing key material.' },
            ],
          },
          {
            name: 'template',
            type: 'Record<string, unknown> | undefined',
            description: 'Updated claims template.',
            children: [
              { name: 'sub', type: 'string | undefined', description: 'Subject claim template.' },
              { name: 'role', type: 'string | undefined', description: 'Role/authorization claim template.' },
              {
                name: 'metadata',
                type: 'Record<string, unknown> | undefined',
                description: 'Additional custom claim object.',
                children: [
                  { name: 'tenant_id', type: 'string | undefined', description: 'Example tenant identifier claim.' },
                  { name: 'plan', type: 'string | undefined', description: 'Example plan claim.' },
                ],
              },
            ],
          },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Applies a partial update and returns the server-side updated resource.',
          'Treat omitted optional fields as unchanged unless explicitly documented otherwise.',
        ],
      },
    ],
  },
{
        slug: 'delete-jwt-template',
        path: ['settings', 'delete-jwt-template'],
        title: 'deleteJwtTemplate()',
        description: 'Delete a deployment JWT template.',
        intro:
          'Deletes one JWT template by id.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function deleteTemplate(templateId: string) {
  const client = await wachtClient();
  await client.settings.deleteJwtTemplate(templateId);
}`,
        signature: `function deleteJwtTemplate(templateId: string): Promise<void>`,
        params: [
          { name: 'templateId', type: 'string', description: 'Template id to delete.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Performs a destructive operation against the target resource.',
          'Callers should treat this as irreversible unless a separate restore flow exists.',
        ],
      },
    ],
  },
{
        slug: 'get-email-template',
        path: ['settings', 'get-email-template'],
        title: 'getEmailTemplate()',
        description: 'Get one deployment email template.',
        intro:
          'Loads the email template by template name from `/settings/email-templates/{template_name}`.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getTemplate(templateName: string) {
  const client = await wachtClient();
  return client.settings.getEmailTemplate(templateName);
}`,
        signature: `function getEmailTemplate(
  templateName: string,
): Promise<EmailTemplate>`,
        params: [
          { name: 'templateName', type: 'string', description: 'Template name segment in backend route.' },
        ],
        api: [
          { name: 'template_name', type: 'string', description: 'Template identifier.' },
          { name: 'template_data', type: 'string', description: 'Template body/content.' },
          { name: 'template_from', type: 'string', description: 'From address.' },
          { name: 'template_reply_to', type: 'string | undefined', description: 'Reply-to address when configured.' },
          { name: 'template_subject', type: 'string', description: 'Template subject line.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Fetches a single resource by identifier or query context.',
          'Use this result as the source of truth before update, replay, or delete flows.',
        ],
      },
    ],
  },
{
        slug: 'update-email-template',
        path: ['settings', 'update-email-template'],
        title: 'updateEmailTemplate()',
        description: 'Update one deployment email template.',
        intro:
          'Patches a named email template and returns the updated template.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateTemplate(templateName: string, template: EmailTemplate) {
  const client = await wachtClient();
  return client.settings.updateEmailTemplate(templateName, template);
}`,
        signature: `function updateEmailTemplate(
  templateName: string,
  template: EmailTemplate,
): Promise<EmailTemplate>`,
        paramsTitle: 'EmailTemplate',
        params: [
          { name: 'templateName', type: 'string', description: 'Target template name.' },
          { name: 'template_name', type: 'string', description: 'Template identifier in payload.' },
          { name: 'template_data', type: 'string', description: 'Template body/content.' },
          { name: 'template_from', type: 'string', description: 'From address.' },
          { name: 'template_reply_to', type: 'string | undefined', description: 'Reply-to address.' },
          { name: 'template_subject', type: 'string', description: 'Template subject line.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Applies a partial update and returns the server-side updated resource.',
          'Treat omitted optional fields as unchanged unless explicitly documented otherwise.',
        ],
      },
    ],
  },
{
        slug: 'get-social-connections',
        path: ['settings', 'get-social-connections'],
        title: 'getSocialConnections()',
        description: 'List deployment social connections.',
        intro:
          'Returns social connection records as a paginated response.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getSocialConnections() {
  const client = await wachtClient();
  return client.settings.getSocialConnections();
}`,
        signature: `function getSocialConnections(): Promise<PaginatedResponse<SocialConnection>>`,
        api: [
          {
            name: 'data',
            type: 'SocialConnection[]',
            description: 'Social connection records in the page.',
            children: [
              { name: 'id', type: 'string', description: 'Connection id.' },
              { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
              { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
              { name: 'deployment_id', type: 'string | null | undefined', description: 'Owning deployment id.' },
              { name: 'provider', type: 'SocialConnectionProvider | undefined', description: 'OAuth provider key.' },
              { name: 'enabled', type: 'boolean', description: 'Whether provider is enabled.' },
              {
                name: 'credentials',
                type: 'SocialConnectionCredentials | undefined',
                description: 'Provider credentials payload.',
                children: [
                  { name: 'client_id', type: 'string | undefined', description: 'OAuth client id from provider console.' },
                  { name: 'client_secret', type: 'string | undefined', description: 'OAuth client secret from provider console.' },
                  { name: 'redirect_uri', type: 'string | undefined', description: 'OAuth callback/redirect URI.' },
                  { name: 'scopes', type: 'string[] | undefined', description: 'Requested OAuth scopes.' },
                ],
              },
            ],
          },
          { name: 'has_more', type: 'boolean', description: 'Whether another page exists.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Fetches a single resource by identifier or query context.',
          'Use this result as the source of truth before update, replay, or delete flows.',
        ],
      },
    ],
  },
{
        slug: 'upsert-social-connection',
        path: ['settings', 'upsert-social-connection'],
        title: 'upsertSocialConnection()',
        description: 'Create or update a deployment social connection.',
        intro:
          'Upserts provider configuration for deployment social login.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function upsertConnection() {
  const client = await wachtClient();
  return client.settings.upsertSocialConnection({
    provider: 'google_oauth',
    enabled: true,
    credentials: {
      client_id: '...',
      client_secret: '...',
      redirect_uri: 'https://example.com/auth/google/callback',
      scopes: ['openid', 'email', 'profile'],
    },
  });
}`,
        signature: `function upsertSocialConnection(
  connection: UpsertSocialConnectionRequest,
): Promise<SocialConnection>`,
        paramsTitle: 'UpsertSocialConnectionRequest',
        params: [
          { name: 'provider', type: 'SocialConnectionProvider | undefined', description: 'Provider key to create/update.' },
          { name: 'enabled', type: 'boolean | undefined', description: 'Enable/disable provider.' },
          { name: 'user_defined_scopes', type: 'string[] | undefined', description: 'Requested provider scopes.' },
          {
            name: 'credentials',
            type: 'SocialConnectionCredentials | undefined',
            description: 'Provider credential object.',
            children: [
              { name: 'client_id', type: 'string | undefined', description: 'OAuth client id from provider console.' },
              { name: 'client_secret', type: 'string | undefined', description: 'OAuth client secret from provider console.' },
              { name: 'redirect_uri', type: 'string | undefined', description: 'OAuth callback/redirect URI.' },
              { name: 'scopes', type: 'string[] | undefined', description: 'Requested OAuth scopes.' },
            ],
          },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Applies a partial update and returns the server-side updated resource.',
          'Treat omitted optional fields as unchanged unless explicitly documented otherwise.',
        ],
      },
    ],
  },
{
        slug: 'update-smtp-config',
        path: ['settings', 'update-smtp-config'],
        title: 'updateSmtpConfig()',
        description: 'Create or update deployment SMTP configuration.',
        intro:
          'Stores SMTP transport settings and returns the resolved SMTP config.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateSmtp() {
  const client = await wachtClient();
  return client.settings.updateSmtpConfig({
    host: 'smtp.example.com',
    port: 587,
    username: 'mailer',
    password: 'secret',
    from_email: 'no-reply@example.com',
    use_tls: true,
  });
}`,
        signature: `function updateSmtpConfig(
  request: SmtpConfigRequest,
): Promise<SmtpConfigResponse>`,
        paramsTitle: 'SmtpConfigRequest',
        params: [
          { name: 'host', type: 'string', description: 'SMTP host.' },
          { name: 'port', type: 'number', description: 'SMTP port.' },
          { name: 'username', type: 'string', description: 'SMTP username.' },
          { name: 'password', type: 'string', description: 'SMTP password/secret.' },
          { name: 'from_email', type: 'string', description: 'Sender email.' },
          { name: 'use_tls', type: 'boolean | undefined', description: 'Whether to use TLS.' },
        ],
        api: [
          { name: 'host', type: 'string', description: 'Stored SMTP host.' },
          { name: 'port', type: 'number', description: 'Stored SMTP port.' },
          { name: 'username', type: 'string', description: 'Stored SMTP username.' },
          { name: 'from_email', type: 'string', description: 'Stored sender email.' },
          { name: 'use_tls', type: 'boolean', description: 'Stored TLS setting.' },
          { name: 'verified', type: 'boolean', description: 'Whether SMTP is verified.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Applies a partial update and returns the server-side updated resource.',
          'Treat omitted optional fields as unchanged unless explicitly documented otherwise.',
        ],
      },
    ],
  },
{
        slug: 'verify-smtp-connection',
        path: ['settings', 'verify-smtp-connection'],
        title: 'verifySmtpConnection()',
        description: 'Verify SMTP configuration credentials.',
        intro:
          'Attempts SMTP verification using the provided config payload.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function verifySmtp(config: SmtpConfigRequest) {
  const client = await wachtClient();
  return client.settings.verifySmtpConnection(config);
}`,
        signature: `function verifySmtpConnection(
  request: SmtpConfigRequest,
): Promise<SmtpVerifyResponse>`,
        paramsTitle: 'SmtpConfigRequest',
        params: [
          { name: 'host', type: 'string', description: 'SMTP host.' },
          { name: 'port', type: 'number', description: 'SMTP port.' },
          { name: 'username', type: 'string', description: 'SMTP username.' },
          { name: 'password', type: 'string', description: 'SMTP password/secret.' },
          { name: 'from_email', type: 'string', description: 'Sender email.' },
          { name: 'use_tls', type: 'boolean | undefined', description: 'Whether to use TLS.' },
        ],
        api: [
          { name: 'success', type: 'boolean', description: 'Whether verification succeeded.' },
          { name: 'message', type: 'string | undefined', description: 'Verification message when present.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Wraps the corresponding backend endpoint for this capability.',
          'Use the returned payload as canonical backend state for follow-up operations.',
        ],
      },
    ],
  },
{
        slug: 'remove-smtp-config',
        path: ['settings', 'remove-smtp-config'],
        title: 'removeSmtpConfig()',
        description: 'Remove deployment SMTP configuration.',
        intro:
          'Deletes SMTP settings for the current deployment.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function removeSmtpConfig() {
  const client = await wachtClient();
  await client.settings.removeSmtpConfig();
}`,
        signature: `function removeSmtpConfig(): Promise<void>`,
        examples: [
          {
            title: 'Clear SMTP and fall back to default provider',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function resetSmtp() {
  const client = await wachtClient();
  await client.settings.removeSmtpConfig();
}`,
            lang: 'ts',
          },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Performs a destructive operation against the target resource.',
          'Callers should treat this as irreversible unless a separate restore flow exists.',
        ],
      },
    ],
  },
];
