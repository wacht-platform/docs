import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page';
import type { TOCItemType } from 'fumadocs-core/toc';
import { allBackendGroups } from '@/components/shared-backend-pages.generated';
import type { BackendDoc } from '@/components/shared-backend-pages.types';
import type { ApiField } from '@/components/api-explorer';
import { rustBackendMethodLabel, toSnakeCase } from '@/components/rust-backend-labels';
import { rustBackendSignatures } from '@/components/rust-backend-signatures';
import { rustBackendReturnTypes } from '@/components/rust-backend-return-types';
import { rustTypeAliases, rustTypeDefs } from '@/components/rust-type-defs';
import { docsContentRoute } from '@/lib/shared';

function headingId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[0.8125rem] text-foreground">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function extractSharedMethodKey(code: string): string | null {
  const match = code.match(/client\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\(/);
  if (match) return `${match[1]}.${match[2]}`;

  if (/\bcreateSessionTicket\(/.test(code)) return 'operations.createSessionTicket';
  if (/\bcheckPrincipalAuthz\(/.test(code)) return 'operations.checkPrincipalAuthz';
  if (/\bcheckAuthz\(/.test(code)) return 'operations.checkAuthz';

  return null;
}

function rustCallForSharedMethod(key: string, rustMethod: string): string {
  const calls: Record<string, string> = {
    'health.healthCheck': 'let _health = client.health().check().send().await?;',
    'analytics.getAnalyticsSummary': 'let _stats = client.analytics().fetch_stats().send().await?;',
    'notifications.createNotification': 'let _notification = client.notifications().create(wacht_rs::models::CreateNotificationRequest::new("Deployment Notice".to_string(), "A new version is available.".to_string()).with_user_id("user_123".to_string())).send().await?;',

    'users.listUsers': 'let _users = client.users().fetch_users().send().await?;',
    'users.getUser': 'let _user = client.users().fetch_user_details("user_id").send().await?;',
    'users.createUser': 'let _user = client.users().create_user(wacht_rs::models::CreateUserRequest { first_name: "Ada".to_string(), last_name: "Lovelace".to_string(), email_address: Some("ada@example.com".to_string()), phone_number: None, username: Some("ada".to_string()), password: Some("StrongPass123!".to_string()), skip_password_check: false, profile_image: None }).send().await?;',
    'users.updateUser': 'let _user = client.users().update_user("user_id", wacht_rs::models::UpdateUserRequest { first_name: Some("Ada".to_string()), last_name: None, username: None, public_metadata: None, private_metadata: None, disabled: Some(false), profile_image: None }).send().await?;',
    'users.deleteUser': 'client.users().delete_user("user_id").send().await?;',
    'users.updatePassword': 'client.users().update_password("user_id", wacht_rs::models::UpdatePasswordRequest { new_password: "NewStrongPass123!".to_string(), skip_password_check: Some(false) }).send().await?;',
    'users.addEmail': 'let _email = client.users().emails().add_email("user_id", wacht_rs::models::AddEmailRequest { email: "ada+work@example.com".to_string(), verification_strategy: Some("email_link".to_string()) }).send().await?;',
    'users.updateEmail': 'let _email = client.users().emails().update_email("user_id", "email_id", wacht_rs::models::UpdateEmailRequest { email: None, is_primary: Some(true) }).send().await?;',
    'users.deleteEmail': 'client.users().emails().delete_email("user_id", "email_id").send().await?;',
    'users.addPhone': 'let _phone = client.users().phones().add_phone("user_id", wacht_rs::models::AddPhoneRequest { phone_number: "5551234567".to_string(), country_code: "US".to_string() }).send().await?;',
    'users.updatePhone': 'let _phone = client.users().phones().update_phone("user_id", "phone_id", wacht_rs::models::UpdatePhoneRequest { phone_number: None, country_code: None, verified: Some(true), is_primary: Some(true) }).send().await?;',
    'users.deletePhone': 'client.users().phones().delete_phone("user_id", "phone_id").send().await?;',
    'users.deleteSocialConnection': 'client.users().social_connections().delete_social_connection("user_id", "connection_id").send().await?;',

    'invitations.listInvitations': 'let _invitations = client.invitations().fetch_users().send().await?;',
    'invitations.inviteUser': 'let _invitation = client.invitations().create(wacht_rs::models::InviteUserRequest { first_name: "Grace".to_string(), last_name: "Hopper".to_string(), email_address: "grace@example.com".to_string(), expiry_days: Some(7) }).send().await?;',
    'invitations.deleteInvitation': 'client.invitations().delete("invitation_id").send().await?;',
    'invitations.listWaitlist': 'let _waitlist = client.waitlist().fetch().send().await?;',
    'invitations.approveWaitlistUser': 'client.waitlist().approve("waitlist_user_id").send().await?;',

    'organizations.listOrganizations': 'let _orgs = client.organizations().fetch_organizations().send().await?;',
    'organizations.getOrganization': 'let _org = client.organizations().fetch_organization("organization_id").send().await?;',
    'organizations.createOrganization': 'let _org = client.organizations().create_organization(wacht_rs::models::CreateOrganizationRequest { name: "Acme Corp".to_string(), description: Some("Primary customer org".to_string()), public_metadata: None, private_metadata: None, organization_image: None }).send().await?;',
    'organizations.updateOrganization': 'let _org = client.organizations().update_organization("organization_id", wacht_rs::models::UpdateOrganizationRequest { name: Some("Acme Corporation".to_string()), description: None, public_metadata: None, private_metadata: None, organization_image: None }).send().await?;',
    'organizations.deleteOrganization': 'client.organizations().delete_organization("organization_id").send().await?;',
    'organizations.listOrganizationMembers': 'let _members = client.organizations().members().fetch_members("organization_id").send().await?;',
    'organizations.addOrganizationMember': 'let _member = client.organizations().members().add_member("organization_id", wacht_rs::models::AddOrganizationMemberRequest { user_id: "user_123".to_string(), role_ids: vec!["org_role_admin".to_string()] }).send().await?;',
    'organizations.listOrganizationRoles': 'let _roles = client.organizations().roles().fetch_roles("organization_id").send().await?;',
    'organizations.createOrganizationRole': 'let _role = client.organizations().roles().create_role("organization_id", wacht_rs::models::CreateRoleRequest { name: "support_manager".to_string(), permissions: vec!["organizations.members.read".to_string(), "organizations.members.write".to_string()] }).send().await?;',
    'organizations.createWorkspaceForOrganization': 'let _workspace = client.organizations().create_organization_workspace("organization_id", wacht_rs::models::CreateWorkspaceRequest { name: "EU Workspace".to_string(), description: Some("Regional operations".to_string()), public_metadata: None, private_metadata: None, workspace_image: None }).send().await?;',

    'workspaces.listWorkspaces': 'let _workspaces = client.workspaces().fetch_workspaces().send().await?;',
    'workspaces.getWorkspace': 'let _workspace = client.workspaces().fetch_workspace("workspace_id").send().await?;',
    'workspaces.updateWorkspace': 'let _workspace = client.workspaces().update_workspace("workspace_id", wacht_rs::models::UpdateWorkspaceRequest { name: Some("EU Workspace 2".to_string()), description: None, public_metadata: None, private_metadata: None, workspace_image: None }).send().await?;',
    'workspaces.deleteWorkspace': 'client.workspaces().delete_workspace("workspace_id").send().await?;',
    'workspaces.listWorkspaceMembers': 'let _members = client.workspaces().members().fetch_members("workspace_id").send().await?;',
    'workspaces.addWorkspaceMember': 'let _member = client.workspaces().members().add_member("workspace_id", "user_123", vec!["workspace_role_member".to_string()]).send().await?;',
    'workspaces.listWorkspaceRoles': 'let _roles = client.workspaces().roles().fetch_roles("workspace_id").send().await?;',
    'workspaces.createWorkspaceRole': 'let _role = client.workspaces().roles().create_role("workspace_id", wacht_rs::models::CreateRoleRequest { name: "workspace_editor".to_string(), permissions: vec!["workspaces.members.read".to_string(), "workspaces.members.write".to_string()] }).send().await?;',

    'oauth.listOAuthApps': 'let _apps = client.oauth().list_oauth_apps().send().await?;',
    'oauth.createOAuthApp': 'let _app = client.oauth().create_oauth_app(wacht_rs::models::CreateOAuthAppRequest { slug: "acme-oauth".to_string(), name: "Acme OAuth".to_string(), description: Some("OAuth app".to_string()), fqdn: Some("auth.acme.test".to_string()), supported_scopes: Some(vec!["openid".to_string(),"profile".to_string()]), scope_definitions: None, allow_dynamic_client_registration: Some(false), logo_file: None, logo_filename: None }).send().await?;',
    'oauth.listOAuthClients': 'let _clients = client.oauth().list_oauth_clients("oauth_app_slug").send().await?;',
    'oauth.createOAuthClient': 'let _client = client.oauth().create_oauth_client("acme-oauth", wacht_rs::models::CreateOAuthClientRequest { client_auth_method: "client_secret_post".to_string(), grant_types: vec!["authorization_code".to_string()], redirect_uris: vec!["https://app.acme.test/callback".to_string()], token_endpoint_auth_signing_alg: None, jwks_uri: None, jwks: None, public_key_pem: None }).send().await?;',
    'oauth.listOAuthGrants': 'let _grants = client.oauth().list_oauth_grants("oauth_app_slug", "oauth_client_id").send().await?;',
    'oauth.revokeOAuthGrant': 'client.oauth().revoke_oauth_grant("oauth_app_slug", "oauth_client_id", "grant_id").send().await?;',

    'segments.listSegments': 'let _segments = client.segments().fetch_segments().send().await?;',
    'segments.assignToSegment': 'client.segments().assign_segment("segment_id", "entity_id").send().await?;',
    'segments.removeFromSegment': 'client.segments().remove_segment("segment_id", "entity_id").send().await?;',
    'segments.getSegmentData': 'let _data = client.segments().get_segment_data("segment_id", "user").send().await?;',

    'operations.createSessionTicket': 'let _ticket = client.session().create(wacht_rs::models::CreateSessionTicketRequest::impersonation("user_123")).send().await?;',
    'operations.checkAuthz': `let _authz = client.gateway().check_authz_with_principal_type(
        wacht_rs::gateway::GatewayPrincipalType::ApiKey,
        "api_key_value",
        "GET",
        "users/*",
        wacht_rs::gateway::GatewayAuthzOptions::default(),
    ).await?;`,
    'operations.checkPrincipalAuthz': `let _authz = client.gateway().check_authz_with_principal_type(
        wacht_rs::gateway::GatewayPrincipalType::ApiKey,
        "api_key_value",
        "POST",
        "users/*",
        wacht_rs::gateway::GatewayAuthzOptions::default(),
    ).await?;`,

    'webhooks.listWebhookDeliveries':
      'let _deliveries = client.webhooks().list_webhook_deliveries("billing-webhooks").status("failed").limit(20).send().await?;',
    'webhooks.getWebhookDelivery':
      'let _delivery = client.webhooks().get_webhook_delivery_details("billing-webhooks", "delivery_id").send().await?;',
    'webhooks.replayWebhookDelivery':
      'let _replay = client.webhooks().replay_webhook_deliveries("billing-webhooks").by_ids(vec!["delivery_id".to_string()]).send().await?;',
  };

  const exact = calls[key];
  if (exact) return exact;

  const [group] = key.split('.');
  const rustGroup = group === 'apiKeys' ? 'api_keys' : group === 'utility' ? 'settings' : toSnakeCase(group);
  return `let _result = client.${rustGroup}().${rustMethod}(/* args */).send().await?;`;
}

function buildRustUsageFromDoc(doc: BackendDoc): string {
  const key = extractSharedMethodKey(doc.usage);
  const rustMethod = rustBackendMethodLabel(doc.title).replace(/\(\)$/g, '');
  const call = key ? rustCallForSharedMethod(key, rustMethod) : `let _result = client.${rustMethod}(/* args */).send().await?;`;

  return `use wacht_rs::{Result, WachtClient};

pub async fn example() -> Result<()> {
    let client = WachtClient::builder()
        .api_key(&std::env::var("WACHT_API_KEY")?)
        .build()?;

    ${call}

    Ok(())
}`;
}

function splitTopLevelUnion(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value) {
    if (ch === '<') depth += 1;
    if (ch === '>') depth = Math.max(0, depth - 1);
    if (ch === '|' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function toRustType(input: string): string {
  const raw = input.trim();
  if (!raw) return 'serde_json::Value';

  const union = splitTopLevelUnion(raw);
  if (union.length > 1) {
    const nonNullable = union.filter((part) => part !== 'undefined' && part !== 'null');
    const hasNullable = nonNullable.length !== union.length;
    if (hasNullable && nonNullable.length === 1) {
      return `Option<${toRustType(nonNullable[0])}>`;
    }
    return union.map((part) => toRustType(part)).join(' | ');
  }

  if (raw.endsWith('[]')) return `Vec<${toRustType(raw.slice(0, -2))}>`;
  const arrayMatch = raw.match(/^Array<(.+)>$/);
  if (arrayMatch) return `Vec<${toRustType(arrayMatch[1])}>`;
  if (/^Record<\s*string\s*,\s*unknown\s*>$/.test(raw)) return 'serde_json::Value';

  return raw
    .replace(/\bstring\b/g, 'String')
    .replace(/\bboolean\b/g, 'bool')
    .replace(/\bnumber\b/g, 'i64')
    .replace(/\bvoid\b/g, '()')
    .replace(/\bunknown\b/g, 'serde_json::Value')
    .replace(/\bobject\b/g, 'serde_json::Value')
    .replace(/\bBlob\b/g, 'Vec<u8>')
    .replace(/\bFile\b/g, 'Vec<u8>');
}

function extractPromiseReturn(signature?: string): string {
  if (!signature) return '()';
  const match = signature.match(/Promise<([\s\S]+)>/);
  return match?.[1]?.trim() ?? '()';
}

function convertField(field: ApiField): ApiField {
  return {
    ...field,
    name: toSnakeCase(field.name),
    type: field.type ? toRustType(field.type) : field.type,
    children: field.children?.map((child) => convertField(child)),
  };
}

function buildRustSignature(doc: BackendDoc, rustTitle: string): string {
  const slugTail = doc.slug.split('/').at(-1) ?? doc.slug;
  const exactSignature = rustBackendSignatures[doc.slug] ?? rustBackendSignatures[slugTail];
  if (exactSignature) return exactSignature;

  const methodName = rustTitle.endsWith('()') ? rustTitle.slice(0, -2) : rustTitle;
  const params = (doc.params ?? [])
    .filter((field) => field.name !== 'client')
    .map((field) => `${toSnakeCase(field.name)}: ${toRustType(field.type ?? 'serde_json::Value')}`)
    .join(',\n  ');
  const rustReturn = toRustType(extractPromiseReturn(doc.signature));
  return `fn ${methodName}(\n  ${params}\n) -> Result<${rustReturn}, wacht_rs::Error>`;
}

function splitTopLevelParams(value: string): string[] {
  const out: string[] = [];
  let current = '';
  let angle = 0;
  let round = 0;
  let square = 0;

  for (const ch of value) {
    if (ch === '<') angle += 1;
    else if (ch === '>') angle = Math.max(0, angle - 1);
    else if (ch === '(') round += 1;
    else if (ch === ')') round = Math.max(0, round - 1);
    else if (ch === '[') square += 1;
    else if (ch === ']') square = Math.max(0, square - 1);

    if (ch === ',' && angle === 0 && round === 0 && square === 0) {
      if (current.trim()) out.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }

  if (current.trim()) out.push(current.trim());
  return out;
}

function nativeParamsFromSignature(signature: string): ApiField[] {
  const match = signature.match(/^fn\s+[a-z0-9_]+\(([\s\S]*)\)\s*->/i);
  if (!match) return [];
  const rawParams = splitTopLevelParams(match[1]);

  return rawParams
    .map((part) => part.trim())
    .filter((part) => part && part !== '&self' && part !== 'self' && part !== '&mut self')
    .map((part) => {
      const idx = part.indexOf(':');
      if (idx < 0) {
        return {
          name: part,
          type: 'serde_json::Value',
          description: 'Rust parameter from the wacht-rs method signature.',
        } satisfies ApiField;
      }
      return {
        name: part.slice(0, idx).trim(),
        type: part.slice(idx + 1).trim(),
        description: 'Rust parameter from the wacht-rs method signature.',
      } satisfies ApiField;
    });
}

function extractResultInnerType(signature: string): string | null {
  const start = signature.indexOf('Result<');
  if (start < 0) return null;

  const inner = signature.slice(start + 'Result<'.length);
  let angleDepth = 0;
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    if (ch === '<') angleDepth += 1;
    else if (ch === '>') {
      if (angleDepth === 0) {
        return inner.slice(0, i).trim();
      }
      angleDepth -= 1;
    } else if (ch === ',' && angleDepth === 0) {
      return inner.slice(0, i).trim();
    }
  }
  return null;
}

function nativeApiFromRustReturnType(slug: string, signature: string): ApiField[] {
  const slugTail = slug.split('/').at(-1) ?? slug;
  const mapped = rustBackendReturnTypes[slug] ?? rustBackendReturnTypes[slugTail];
  const fromSignature = extractResultInnerType(signature);
  const returnType = mapped ?? fromSignature ?? 'serde_json::Value';

  if (returnType === '()') return [];

  const children = expandRustTypeChildren(returnType);

  return [
    {
      name: 'result',
      type: returnType,
      description: 'Rust return type from the wacht-rs builder `.send()` call.',
      children,
    },
  ];
}

function splitTopLevelArgs(value: string): string[] {
  const out: string[] = [];
  let cur = '';
  let depth = 0;
  for (const ch of value) {
    if (ch === '<') depth += 1;
    else if (ch === '>') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function normalizeTypeName(raw: string): string {
  return raw
    .replace(/^&(?:'[_a-zA-Z0-9]+\s+)?/, '')
    .replace(/^mut\s+/, '')
    .trim();
}

function parseTypeExpr(raw: string): { base: string; args: string[] } {
  const value = normalizeTypeName(raw);
  const lt = value.indexOf('<');
  if (lt < 0 || !value.endsWith('>')) return { base: value, args: [] };
  return {
    base: value.slice(0, lt).trim(),
    args: splitTopLevelArgs(value.slice(lt + 1, -1)),
  };
}

function shortTypeName(raw: string): string {
  const value = normalizeTypeName(raw);
  const idx = value.lastIndexOf('::');
  return idx >= 0 ? value.slice(idx + 2) : value;
}

function substituteGenerics(type: string, genericMap: Map<string, string>): string {
  let out = type;
  for (const [k, v] of genericMap.entries()) {
    out = out.replace(new RegExp(`\\b${k}\\b`, 'g'), v);
  }
  return out;
}

function expandRustTypeChildren(type: string, depth = 0, seen = new Set<string>()): ApiField[] | undefined {
  if (depth > 4) return undefined;
  const cleaned = normalizeTypeName(type);
  if (!cleaned) return undefined;

  const expr = parseTypeExpr(cleaned);
  const baseShort = shortTypeName(expr.base);
  const key = `${baseShort}<${expr.args.join(',')}>`;
  if (seen.has(key)) return undefined;
  seen.add(key);

  if (baseShort === 'Option' || baseShort === 'Vec' || baseShort === 'Box' || baseShort === 'Arc' || baseShort === 'Rc') {
    return expr.args[0] ? expandRustTypeChildren(expr.args[0], depth + 1, seen) : undefined;
  }

  const aliased = rustTypeAliases[baseShort];
  if (aliased) {
    return expandRustTypeChildren(aliased, depth + 1, seen);
  }

  const def = rustTypeDefs[baseShort];
  if (!def) return undefined;

  const genericMap = new Map<string, string>();
  for (let i = 0; i < def.generics.length; i += 1) {
    genericMap.set(def.generics[i], expr.args[i] ?? def.generics[i]);
  }

  return def.fields.map((field) => {
    const resolvedType = substituteGenerics(field.type, genericMap);
    return {
      name: field.name,
      type: resolvedType,
      description: `Rust field from \`${baseShort}\`.`,
      children: expandRustTypeChildren(resolvedType, depth + 1, new Set(seen)),
    } satisfies ApiField;
  });
}

function rewriteRustDoc(doc: BackendDoc): BackendDoc {
  const rustTitle = rustBackendMethodLabel(doc.title);
  const rustSignature = buildRustSignature(doc, rustTitle);
  return {
    ...doc,
    title: rustTitle,
    usage: buildRustUsageFromDoc(doc),
    signature: rustSignature,
    intro: doc.endpoint?.method && doc.endpoint?.path
      ? `${doc.description} This maps to \`${doc.endpoint.method.toUpperCase()} ${doc.endpoint.path}\`.`
      : doc.intro,
    params: nativeParamsFromSignature(rustSignature),
    api: nativeApiFromRustReturnType(doc.slug, rustSignature),
    sections: doc.sections?.filter((section) => section.title.trim().toLowerCase() !== 'behavior'),
    examples: doc.examples?.map((example) => ({
      ...example,
      code: buildRustUsageFromDoc({ ...doc, usage: example.code }),
      lang: 'rust',
    })),
  };
}

function apiFieldSignature(field: ApiField) {
  const typeLabel = field.type ?? (field.children?.length ? 'serde_json::Value' : 'serde_json::Value');
  return `${toSnakeCase(field.name)}: ${typeLabel};`;
}

function ApiProperty({ field, depth = 0 }: { field: ApiField; depth?: number }) {
  return (
    <details className="group py-4" style={{ paddingLeft: depth ? `${depth * 20}px` : undefined }}>
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-2">
          <span className="flex shrink-0 items-center self-center text-muted-foreground transition-transform group-open:rotate-90">›</span>
          <div className="min-w-0 flex-1 rounded-md bg-muted/20 px-3 py-2">
            <div className="[&_pre]:my-0 [&_pre]:max-h-none [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:bg-transparent [&_pre]:px-0 [&_pre]:py-0 [&_pre]:text-[0.8125rem] [&_pre]:leading-6">
              <DynamicCodeBlock lang="rust" code={apiFieldSignature(field)} codeblock={{ allowCopy: false }} />
            </div>
          </div>
        </div>
      </summary>

      <div className="space-y-3 pt-3 pl-7">
        <div className="text-sm leading-7 text-muted-foreground">{field.description}</div>
        {field.children?.length ? (
          <div className="divide-y divide-border border-l border-border/70 pl-4">
            {field.children.map((child) => (
              <ApiProperty key={`${field.name}.${child.name}`} field={child} depth={depth + 1} />
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}

export function getRustBackendDoc(slug: string | string[]) {
  const slugKey = Array.isArray(slug) ? slug.join('/') : slug;
  const group = allBackendGroups.find((entry) =>
    entry.docs.some((doc) => (doc.path?.join('/') ?? doc.slug) === slugKey),
  );
  const doc = group?.docs.find((entry) => (entry.path?.join('/') ?? entry.slug) === slugKey);
  if (!doc) return null;
  return { group: group!.label, ...rewriteRustDoc({ ...doc, slug: slugKey }) };
}

export function getRustBackendDocParams() {
  const params: Array<{ slug: string[] }> = [];
  for (const group of allBackendGroups) {
    for (const doc of group.docs) {
      params.push({ slug: ['sdks', 'rust', 'backend', ...(doc.path ?? [doc.slug])] });
    }
  }
  return params;
}

export function buildRustBackendToc(doc: BackendDoc) {
  const visibleSections = doc.sections ?? [];
  const toc: TOCItemType[] = [{ title: 'Usage', url: '#usage', depth: 2 }];
  if (doc.signature) toc.push({ title: 'Signature', url: '#signature', depth: 2 });
  if (doc.params?.length) toc.push({ title: doc.paramsTitle ?? 'Parameters', url: '#parameters', depth: 2 });
  if (doc.api?.length) toc.push({ title: 'API', url: '#api', depth: 2 });
  if (visibleSections.length) {
    for (const section of visibleSections) {
      toc.push({ title: section.title, url: `#${headingId(section.title)}`, depth: 2 });
    }
  }
  if (doc.examples?.length) toc.push({ title: 'Examples', url: '#examples', depth: 2 });
  return toc;
}

export function getRustBackendMarkdownUrl(slug: string) {
  return `${docsContentRoute}/sdks/rust/backend/${slug}/content.md`;
}

export function buildRustBackendMarkdown({ doc }: { doc: BackendDoc }) {
  const visibleSections = doc.sections ?? [];
  const blocks: string[] = [];
  blocks.push(`# ${doc.title}`);
  blocks.push('');
  blocks.push(doc.description);
  blocks.push('');
  blocks.push(doc.intro);
  blocks.push('');
  blocks.push('## Usage');
  blocks.push('');
  blocks.push('```rust');
  blocks.push(doc.usage.trim());
  blocks.push('```');

  if (doc.signature) {
    blocks.push('');
    blocks.push('## Signature');
    blocks.push('');
    blocks.push('```rust');
    blocks.push(doc.signature.trim());
    blocks.push('```');
  }

  if (doc.params?.length) {
    blocks.push('');
    blocks.push(`## ${doc.paramsTitle ?? 'Parameters'}`);
    blocks.push('');
    for (const field of doc.params) {
      blocks.push(`- **${field.name}** \`${field.type ?? 'serde_json::Value'}\``);
      blocks.push(`  - ${field.description}`);
    }
  }

  if (doc.api?.length) {
    blocks.push('');
    blocks.push('## API');
    blocks.push('');
    for (const field of doc.api) {
      blocks.push(`- **${field.name}** \`${field.type ?? 'serde_json::Value'}\``);
      blocks.push(`  - ${field.description}`);
    }
  }

  if (visibleSections.length) {
    for (const section of visibleSections) {
      blocks.push('');
      blocks.push(`## ${section.title}`);
      blocks.push('');
      if (section.paragraphs?.length) blocks.push(...section.paragraphs, '');
      if (section.points?.length) blocks.push(...section.points.map((point) => `- ${point}`), '');
    }
  }

  if (doc.examples?.length) {
    blocks.push('');
    blocks.push('## Examples');
    blocks.push('');
    for (const example of doc.examples) {
      blocks.push(`### ${example.title}`);
      blocks.push('');
      blocks.push('```rust');
      blocks.push(example.code.trim());
      blocks.push('```');
      blocks.push('');
    }
  }

  return blocks.join('\n').trim() + '\n';
}

export function RustBackendDocPage({
  slug,
  markdownUrl,
}: {
  slug: string;
  markdownUrl?: string;
}) {
  const doc = getRustBackendDoc(slug);
  if (!doc) throw new Error(`Unknown rust backend doc: ${slug}`);
  const visibleSections = doc.sections ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-[1.5rem] font-normal leading-tight text-foreground">{doc.title}</h1>
      <div className="space-y-3">
        <div className="text-sm leading-7 text-muted-foreground">{renderInline(doc.intro)}</div>
      </div>
      {markdownUrl ? (
        <div className="flex flex-wrap items-center gap-2">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover markdownUrl={markdownUrl} />
        </div>
      ) : null}
      <section className="space-y-3">
        <h2 id="usage" className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">Usage</h2>
        <p>The following example shows Rust backend usage with `wacht_rs`.</p>
        <DynamicCodeBlock lang="rust" code={doc.usage} codeblock={{ allowCopy: true }} />
      </section>
      {doc.signature ? (
        <section className="space-y-3">
          <h2 id="signature" className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">Signature</h2>
          <div className="[&_pre]:my-0 [&_pre]:max-h-none [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:bg-transparent [&_pre]:px-0 [&_pre]:py-0 [&_pre]:text-[0.8125rem] [&_pre]:leading-6">
            <DynamicCodeBlock lang="rust" code={doc.signature} codeblock={{ allowCopy: false }} />
          </div>
        </section>
      ) : null}
      {doc.params?.length ? (
        <section className="space-y-3">
          <h2 id="parameters" className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">{doc.paramsTitle ?? 'Parameters'}</h2>
          <div className="divide-y divide-border border-y border-border">
            {doc.params.map((field) => (
              <ApiProperty key={field.name} field={field} />
            ))}
          </div>
        </section>
      ) : null}
      {doc.api?.length ? (
        <section className="space-y-3">
          <h2 id="api" className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">Return value</h2>
          <div className="divide-y divide-border border-y border-border">
            {doc.api.map((field) => (
              <ApiProperty key={field.name} field={field} />
            ))}
          </div>
        </section>
      ) : null}
      {visibleSections.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 id={headingId(section.title)} className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">{section.title}</h2>
          {section.paragraphs?.length ? (
            <div className="space-y-2">
              {section.paragraphs.map((paragraph) => (
                <div key={paragraph} className="text-sm leading-7 text-muted-foreground">{renderInline(paragraph)}</div>
              ))}
            </div>
          ) : null}
          {section.points?.length ? (
            <ul className="space-y-1.5 text-sm leading-7 text-muted-foreground">
              {section.points.map((point) => (
                <li key={point}>{renderInline(point)}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      {doc.examples?.length ? (
        <section className="space-y-3">
          <h2 id="examples" className="mt-5 mb-3 text-[1.5rem] font-normal leading-tight">Examples</h2>
          <div className="space-y-5">
            {doc.examples.map((example) => (
              <div key={example.title} className="space-y-2">
                <h3 className="text-base font-medium text-foreground">{example.title}</h3>
                <DynamicCodeBlock lang="rust" code={example.code} codeblock={{ allowCopy: true }} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
