import type { ApiField } from '@/components/api-explorer';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { generatedDocOverrides } from '@/components/backend-docs/generated-overrides';
import { backendCoverageGroupOrder, classifyBackendCoverageDoc } from '@/components/backend-docs/grouping';
import { generatedMethodDocMeta, type GeneratedMethodDocMeta } from '@/components/generated-method-doc-meta';
import { generatedBackendCoverageDocs } from '@/components/shared-backend-coverage';
import { backendGroups } from '@/components/shared-backend-pages.catalog';
import type { BackendDoc, BackendGroup } from '@/components/shared-backend-pages.types';

export const generatedGroupLabels: Record<string, string> = {
  users: 'Users',
  invitations: 'Invitations',
  sessions: 'Sessions',
  organizations: 'Organizations',
  workspaces: 'Workspaces',
  'api-auth-apps': 'API auth apps',
  'api-auth-keys': 'API auth keys',
  'api-auth-audit': 'API auth audit',
  'api-auth-rate-limits': 'API auth rate limits',
  'webhooks-apps': 'Webhooks apps',
  'webhook-endpoints': 'Webhook endpoints',
  'webhook-deliveries': 'Webhook deliveries',
  'webhook-catalogs': 'Webhook catalogs',
  'webhook-analytics': 'Webhook analytics',
  'ai-configuration': 'AI configuration',
  'ai-runtime': 'AI runtime',
  'oauth-apps': 'OAuth apps',
  'oauth-clients': 'OAuth clients',
  'oauth-scopes': 'OAuth scopes',
  'oauth-grants': 'OAuth grants',
  operations: 'Utility',
  settings: 'Settings',
  segments: 'Segments',
};

const MODEL_TYPE_SKIP_SYMBOLS = new Set([
  'Array',
  'ReadonlyArray',
  'Promise',
  'Date',
  'Blob',
  'File',
  'FormData',
  'Map',
  'Set',
  'URL',
  'Uint8Array',
  'ArrayBuffer',
]);

function normalizeDocTypeName(type: string) {
  return type
    .replace(/\s+/g, '')
    .replace(/\|undefined/g, '')
    .replace(/\|null/g, '')
    .replace(/\[\]$/, '');
}

function removeUndefinedUnion(type: string) {
  return type
    .replace(/\s*\|\s*undefined/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadModelTypeFieldMap(): Record<string, ApiField[]> {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, '../node/src/models'),
    path.resolve(cwd, 'node/src/models'),
  ];
  const modelsDir = candidates.find((candidate) => fs.existsSync(candidate));
  if (!modelsDir) return {};

  const files = fs
    .readdirSync(modelsDir)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file) => path.join(modelsDir, file));
  if (!files.length) return {};

  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    skipLibCheck: true,
  });
  const checker = program.getTypeChecker();
  const symbols = new Map<string, ts.Symbol>();

  function isPrimitive(type: ts.Type) {
    const flags = type.getFlags();
    return Boolean(
      flags &
        (ts.TypeFlags.StringLike |
          ts.TypeFlags.NumberLike |
          ts.TypeFlags.BooleanLike |
          ts.TypeFlags.BigIntLike |
          ts.TypeFlags.Null |
          ts.TypeFlags.Undefined |
          ts.TypeFlags.Void |
          ts.TypeFlags.Any |
          ts.TypeFlags.Unknown |
          ts.TypeFlags.Never |
          ts.TypeFlags.ESSymbolLike),
    );
  }

  function isExpandableObject(type: ts.Type, typeLabel: string) {
    if (!type) return false;
    if (isPrimitive(type)) return false;
    if (typeLabel.startsWith('Record<')) return false;
    const symbolName = type.getSymbol()?.getName();
    if (symbolName && MODEL_TYPE_SKIP_SYMBOLS.has(symbolName)) return false;
    const props = checker.getPropertiesOfType(type);
    return props.length > 0;
  }

  function literalUnionTypeLabel(type: ts.Type): string | undefined {
    if (!(type.flags & ts.TypeFlags.Union)) return undefined;
    const union = type as ts.UnionType;
    if (!union.types.length) return undefined;

    const parts: string[] = [];
    for (const member of union.types) {
      if (member.flags & ts.TypeFlags.StringLiteral) {
        parts.push(JSON.stringify((member as ts.StringLiteralType).value));
        continue;
      }
      if (member.flags & ts.TypeFlags.NumberLiteral) {
        parts.push(String((member as ts.NumberLiteralType).value));
        continue;
      }
      if (member.flags & ts.TypeFlags.BooleanLiteral) {
        const label = checker.typeToString(member, undefined, ts.TypeFormatFlags.NoTruncation);
        parts.push(label === 'true' ? 'true' : 'false');
        continue;
      }
      if (member.flags & ts.TypeFlags.Null) {
        parts.push('null');
        continue;
      }
      if (member.flags & ts.TypeFlags.Undefined) {
        parts.push('undefined');
        continue;
      }
      return undefined;
    }

    if (!parts.length) return undefined;
    return parts.join(' | ');
  }

  function displayTypeLabel(type: ts.Type, contextNode: ts.Node) {
    const literalUnion = literalUnionTypeLabel(type);
    if (literalUnion) return literalUnion;
    return checker.typeToString(type, contextNode, ts.TypeFormatFlags.NoTruncation);
  }

  function getArrayElementType(type: ts.Type): ts.Type | null {
    if (checker.isArrayType(type) || checker.isTupleType(type)) {
      const ref = type as ts.TypeReference;
      const args = checker.getTypeArguments(ref);
      return args[0] ?? null;
    }
    return null;
  }

  function serializeFields(
    typeName: string,
    type: ts.Type,
    contextNode: ts.Node,
    parentPath: string[] = [],
    visited = new Set<string>(),
    depth = 0,
  ): ApiField[] {
    if (depth > 6) return [];

    const key = `${typeName}:${checker.typeToString(type, contextNode, ts.TypeFormatFlags.NoTruncation)}`;
    if (visited.has(key)) return [];
    visited.add(key);

    const properties = checker.getPropertiesOfType(type);
    const fields: ApiField[] = [];

    for (const property of properties) {
      const declaration = property.valueDeclaration ?? property.declarations?.[0] ?? contextNode;
      const propertyType = checker.getTypeOfSymbolAtLocation(property, declaration);
      const nonNullable = checker.getNonNullableType(propertyType);
      const propertyName = property.getName();
      const pathParts = [...parentPath, propertyName];
      const propertyTypeLabel = displayTypeLabel(propertyType, declaration);
      const optional = Boolean(property.getFlags() & ts.SymbolFlags.Optional);
      const normalizedTypeLabel = optional ? removeUndefinedUnion(propertyTypeLabel) : propertyTypeLabel;
      const field: ApiField = {
        name: propertyName,
        type: normalizedTypeLabel,
        required: !optional,
        description: nestedFieldDescription(typeName, pathParts, undefined),
      };

      const arrayElementType = getArrayElementType(nonNullable);
      if (arrayElementType) {
        const arrayElementLabel = displayTypeLabel(arrayElementType, declaration);
        if (isExpandableObject(arrayElementType, arrayElementLabel)) {
          field.children = serializeFields(
            typeName,
            arrayElementType,
            declaration,
            pathParts,
            new Set(visited),
            depth + 1,
          );
        }
        fields.push(field);
        continue;
      }

      if (isExpandableObject(nonNullable, propertyTypeLabel)) {
        field.children = serializeFields(
          typeName,
          nonNullable,
          declaration,
          pathParts,
          new Set(visited),
          depth + 1,
        );
      }

      fields.push(field);
    }

    return fields;
  }

  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.startsWith(modelsDir)) continue;
    if (sourceFile.isDeclarationFile) continue;

    for (const statement of sourceFile.statements) {
      const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
      const isExported = modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
      if (!isExported) continue;

      if (ts.isInterfaceDeclaration(statement)) {
        const symbol = checker.getSymbolAtLocation(statement.name);
        if (symbol) symbols.set(statement.name.text, symbol);
      }

      if (ts.isTypeAliasDeclaration(statement)) {
        const symbol = checker.getSymbolAtLocation(statement.name);
        if (symbol) symbols.set(statement.name.text, symbol);
      }
    }
  }

  const result: Record<string, ApiField[]> = {};
  for (const [typeName, symbol] of symbols.entries()) {
    const declarations = symbol.getDeclarations();
    const declaration = declarations?.[0];
    if (!declaration) continue;
    const declaredType = checker.getDeclaredTypeOfSymbol(symbol);
    if (!isExpandableObject(declaredType, checker.typeToString(declaredType, declaration))) continue;
    const fields = serializeFields(typeName, declaredType, declaration);
    if (!fields.length) continue;
    result[typeName] = fields;
    result[normalizeDocTypeName(typeName)] = fields;
  }

  return result;
}

const modelTypeFieldMap = loadModelTypeFieldMap();
const unwantedSectionTitles = new Set([
  'behavior notes',
  'ai behavior notes',
  'return type',
  'operational notes',
]);

function stripUnwantedSections(
  sections: Array<{ title: string; points?: string[]; paragraphs?: string[] }> | undefined,
) {
  if (!sections?.length) return sections;
  return sections.filter((section) => !unwantedSectionTitles.has(section.title.trim().toLowerCase()));
}

function loadApiMethodDocMeta(): Record<string, GeneratedMethodDocMeta> {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, '../node/src/api'),
    path.resolve(cwd, 'node/src/api'),
  ];
  const apiDir = candidates.find((candidate) => fs.existsSync(candidate));
  if (!apiDir) return {};

  const files = fs
    .readdirSync(apiDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => path.join(apiDir, file));
  if (!files.length) return {};

  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    skipLibCheck: true,
  });
  const checker = program.getTypeChecker();
  const result: Record<string, GeneratedMethodDocMeta> = {};

  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.startsWith(apiDir)) continue;
    if (sourceFile.isDeclarationFile) continue;

    for (const statement of sourceFile.statements) {
      if (!ts.isFunctionDeclaration(statement) || !statement.name) continue;
      const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
      const isExported = modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
      const isAsync = modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword);
      if (!isExported || !isAsync) continue;

      const method = statement.name.text;
      const signature = checker.getSignatureFromDeclaration(statement);
      if (!signature) continue;

      const params = statement.parameters.map((param) => {
        const name = ts.isIdentifier(param.name) ? param.name.text : param.name.getText(sourceFile);
        const inferredType = checker.typeToString(
          checker.getTypeAtLocation(param),
          param,
          ts.TypeFormatFlags.NoTruncation,
        );
        return {
          name,
          type: inferredType,
          optional: Boolean(param.questionToken || param.initializer),
        };
      });

      const returns = checker.typeToString(
        checker.getReturnTypeOfSignature(signature),
        statement,
        ts.TypeFormatFlags.NoTruncation,
      );
      const signatureText = `function ${method}(\n${params
        .map((param) => `  ${param.name}${param.optional ? '?' : ''}: ${param.type},`)
        .join('\n')}\n): ${returns}`;

      result[method] = {
        signature: signatureText,
        params,
        returns,
      };
    }
  }

  return result;
}

const apiMethodDocMeta = loadApiMethodDocMeta();

function getMethodDocMeta(method: string): GeneratedMethodDocMeta | undefined {
  return generatedMethodDocMeta[method] ?? apiMethodDocMeta[method];
}

function generatedParamDescription(name: string, type: string) {
  const lower = name.toLowerCase();
  if (lower === 'client') return 'Optional explicit Wacht client instance. Omit to use the default client.';
  if (lower === 'agentid') return 'Target agent id.';
  if (lower === 'subagentid') return 'Sub-agent id linked to the parent agent.';
  if (lower === 'toolid') return 'Target tool id.';
  if (lower === 'kbid') return 'Target knowledge base id.';
  if (lower === 'mcpserverid') return 'Target MCP server id.';
  if (lower === 'actorid') return 'Actor id used for actor-scoped AI endpoints.';
  if (lower === 'projectid') return 'Target actor project id.';
  if (lower === 'threadid') return 'Target actor project thread id.';
  if (lower === 'itemid') return 'Target task board item id.';
  if (lower === 'documentid') return 'Target knowledge base document id.';
  if (lower === 'oauthappslug') return 'OAuth app slug.';
  if (lower === 'oauthclientid') return 'OAuth client id.';
  if (lower === 'grantid') return 'OAuth grant id.';
  if (lower === 'scope') return 'OAuth/skills scope key for the operation.';
  if (lower.endsWith('id')) return 'Identifier for the target resource.';
  if (lower.endsWith('slug')) return 'Slug identifier for the target resource.';
  if (lower === 'request') return 'Request payload object sent to the backend API.';
  if (lower === 'options') return 'Optional query/filter object used to shape list/search behavior.';
  if (lower === 'file') return 'File/blob payload uploaded using multipart form data.';
  if (lower === 'path') return 'Filesystem path selector.';
  if (lower === 'includearchived') return 'When true, include archived records.';
  if (lower === 'title') return 'Optional document/item title metadata.';
  if (lower === 'description') return 'Optional description metadata.';
  if (lower === 'requestraw') return 'Request payload object sent to the backend API.';
  if (type.includes('CreateOAuthAppRequest')) return 'OAuth app creation payload.';
  if (type.includes('UpdateOAuthAppRequest')) return 'OAuth app update payload.';
  if (type.includes('UpdateOAuthScopeRequest')) return 'OAuth scope update payload.';
  if (type.includes('SetOAuthScopeMappingRequest')) return 'OAuth scope-to-permission mapping payload.';
  if (type.includes('CreateOAuthClientRequest')) return 'OAuth client creation payload.';
  if (type.includes('UpdateOAuthClientRequest')) return 'OAuth client update payload.';
  if (type.includes('CreateAiAgentRequest')) return 'AI agent creation payload.';
  if (type.includes('UpdateAiAgentRequest')) return 'AI agent update payload.';
  if (type.includes('CreateAiToolRequest')) return 'AI tool creation payload.';
  if (type.includes('UpdateAiToolRequest')) return 'AI tool update payload.';
  if (type.includes('CreateAiKnowledgeBaseRequest')) return 'Knowledge base creation payload.';
  if (type.includes('UpdateAiKnowledgeBaseRequest')) return 'Knowledge base update payload.';
  if (type.includes('CreateMcpServerRequest')) return 'MCP server creation payload.';
  if (type.includes('UpdateMcpServerRequest')) return 'MCP server update payload.';
  if (type.includes('DiscoverMcpServerAuthRequest')) return 'MCP auth discovery request payload.';
  if (type.includes('CreateActorProjectRequest')) return 'Actor project creation payload.';
  if (type.includes('UpdateActorProjectRequest')) return 'Actor project update payload.';
  if (type.includes('CreateProjectTaskBoardItemRequest')) return 'Task board item creation payload.';
  if (type.includes('UpdateProjectTaskBoardItemRequest')) return 'Task board item update payload.';
  if (type.includes('AppendProjectTaskBoardItemJournalRequest')) return 'Task board journal append payload.';
  if (type.includes('CreateAgentThreadRequest')) return 'Agent thread creation payload.';
  if (type.includes('UpdateAgentThreadRequest')) return 'Agent thread update payload.';
  if (type.includes('ExecuteAgentRequest')) return 'Agent run execution payload.';
  if (type.includes('UpdateAiSettingsRequest')) return 'AI settings update payload.';
  if (type.includes('ListOptions')) return 'Pagination list options (`limit`, `offset`) and related filters.';
  if (type.includes('Update')) return 'Partial update payload; only provided fields are changed.';
  if (type.includes('Create')) return 'Creation payload for the target backend resource.';
  return 'Method parameter forwarded to backend handling.';
}

function generatedValueForType(type: string) {
  const compact = type.replace(/\s+/g, '');
  if (compact.includes('AddEmailRequest'))
    return `{
    email: 'user+secondary@example.com',
  }`;
  if (compact.includes('UpdateEmailRequest'))
    return `{
    is_primary: true,
  }`;
  if (compact.includes('AddPhoneRequest'))
    return `{
    country_code: '+1',
    phone_number: '5551234567',
  }`;
  if (compact.includes('UpdatePhoneRequest'))
    return `{
    verified: true,
  }`;
  if (compact.includes('InviteUserRequest'))
    return `{
    first_name: 'Ada',
    last_name: 'Lovelace',
    email_address: 'ada@example.com',
  }`;
  if (compact.includes('CreateSessionTicketRequest'))
    return `{
    ticket_type: 'impersonation',
    user_id: 'user_123',
    expires_in: 300,
  }`;
  if (compact.includes('ListApiAuditLogsOptions'))
    return `{
    limit: 50,
    outcome: 'blocked',
  }`;
  if (compact.includes('GetApiAuditAnalyticsOptions'))
    return `{
    include_top_keys: true,
    include_top_paths: true,
    top_limit: 10,
  }`;
  if (compact.includes('GetApiAuditTimeseriesOptions'))
    return `{
    interval: 'hour',
  }`;
  if (compact.includes('UpdateApiAuthAppRequest'))
    return `{
    name: 'Updated API Auth App',
    is_active: true,
  }`;
  if (compact.includes('UpdateWebhookAppRequest'))
    return `{
    name: 'Updated Webhook App',
    is_active: true,
  }`;
  if (compact.includes('AppendWebhookEventCatalogEventsRequest'))
    return `{
    events: [
      { name: 'user.created', description: 'Triggered when a user is created' },
    ],
  }`;
  if (compact.includes('ArchiveWebhookEventInCatalogRequest'))
    return `{
    event_name: 'user.created',
    is_archived: true,
  }`;
  if (compact.includes('UpdateWebhookEndpointRequest'))
    return `{
    is_active: true,
    max_retries: 5,
    timeout_seconds: 10,
  }`;
  if (compact.includes('CreateWebhookEndpointRequest'))
    return `{
    url: 'https://example.com/webhooks/wacht',
    subscriptions: [{ event_name: 'user.created' }],
    headers: { 'x-env': 'staging' },
  }`;
  if (compact.includes('TestWebhookEndpointRequest'))
    return `{
    event_name: 'user.created',
    payload: { id: 'user_123' },
  }`;
  if (compact.includes('TriggerWebhookRequest'))
    return `{
    event_name: 'user.created',
    payload: { id: 'user_123' },
    filter_context: { environment: 'staging' },
  }`;
  if (compact.includes('DeploymentRestrictionsUpdates'))
    return `{
    sign_up_mode: 'waitlist',
    block_disposable_emails: true,
    waitlist_collect_names: true,
  }`;
  if (compact.includes('DeploymentB2bSettingsUpdates'))
    return `{
    organizations_enabled: true,
    workspaces_enabled: true,
    allow_users_to_create_orgs: false,
  }`;
  if (compact.includes('password_min_length?:number') && compact.includes('mfa_methods?:Array<'))
    return `{
    password_min_length: 12,
    mfa_enabled: true,
    mfa_methods: ['totp'],
  }`;
  if (compact.includes('display_name?:string') && compact.includes('primary_color?:string'))
    return `{
    display_name: 'Acme Console',
    primary_color: '#111827',
    theme: 'auto',
  }`;
  if (compact.includes('CreateJwtTemplateRequest'))
    return `{
    name: 'default',
    token_lifetime: 3600,
    template: { role: 'user' },
  }`;
  if (compact.includes('UpdateJwtTemplateRequest'))
    return `{
    token_lifetime: 7200,
    template: { role: 'admin' },
  }`;
  if (compact.includes('SmtpConfigRequest'))
    return `{
    host: 'smtp.example.com',
    port: 587,
    username: 'mailer',
    password: 'secret',
    from_email: 'no-reply@example.com',
  }`;
  if (compact.includes('CreateOAuthAppRequest'))
    return `{
    slug: 'acme-oauth',
    name: 'Acme OAuth App',
    description: 'OAuth app for first-party integrations',
    supported_scopes: ['profile:read'],
  }`;
  if (compact.includes('UpdateOAuthAppRequest'))
    return `{
    name: 'Updated OAuth App Name',
    description: 'Updated description',
  }`;
  if (compact.includes('UpdateOAuthScopeRequest'))
    return `{
    description: 'Updated scope description',
  }`;
  if (compact.includes('SetOAuthScopeMappingRequest'))
    return `{
    permission: 'users:read',
  }`;
  if (compact.includes('CreateOAuthClientRequest'))
    return `{
    client_auth_method: 'client_secret_basic',
    grant_types: ['authorization_code'],
    redirect_uris: ['https://example.com/callback'],
  }`;
  if (compact.includes('UpdateOAuthClientRequest'))
    return `{
    redirect_uris: ['https://example.com/callback'],
  }`;
  if (compact.includes('CreateAiAgentRequest'))
    return `{
    name: 'Support Agent',
    instructions: 'Help users resolve account issues.',
  }`;
  if (compact.includes('UpdateAiAgentRequest'))
    return `{
    name: 'Support Agent v2',
  }`;
  if (compact.includes('CreateAiToolRequest'))
    return `{
    name: 'fetch-user-profile',
    kind: 'api',
    configuration: {},
  }`;
  if (compact.includes('UpdateAiToolRequest'))
    return `{
    name: 'fetch-user-profile-v2',
  }`;
  if (compact.includes('CreateAiKnowledgeBaseRequest'))
    return `{
    name: 'Product Docs',
    description: 'Knowledge base for product documentation',
  }`;
  if (compact.includes('UpdateAiKnowledgeBaseRequest'))
    return `{
    name: 'Product Docs v2',
  }`;
  if (compact.includes('CreateMcpServerRequest'))
    return `{
    name: 'Internal MCP',
    transport: 'sse',
    endpoint_url: 'https://mcp.example.com',
  }`;
  if (compact.includes('UpdateMcpServerRequest'))
    return `{
    name: 'Internal MCP (Updated)',
  }`;
  if (compact.includes('DiscoverMcpServerAuthRequest'))
    return `{
    endpoint_url: 'https://mcp.example.com',
  }`;
  if (compact.includes('CreateActorProjectRequest'))
    return `{
    name: 'Customer Support Project',
  }`;
  if (compact.includes('UpdateActorProjectRequest'))
    return `{
    name: 'Customer Support Project v2',
  }`;
  if (compact.includes('CreateProjectTaskBoardItemRequest'))
    return `{
    title: 'Investigate login issue',
  }`;
  if (compact.includes('UpdateProjectTaskBoardItemRequest'))
    return `{
    title: 'Investigate login issue (updated)',
  }`;
  if (compact.includes('AppendProjectTaskBoardItemJournalRequest'))
    return `{
    entry: 'Investigated logs and found root cause.',
  }`;
  if (compact.includes('CreateAgentThreadRequest'))
    return `{
    title: 'Investigate issue thread',
  }`;
  if (compact.includes('UpdateAgentThreadRequest'))
    return `{
    title: 'Investigate issue thread (updated)',
  }`;
  if (compact.includes('ExecuteAgentRequest'))
    return `{
    prompt: 'Summarize current project status.',
  }`;
  if (compact.includes('UpdateAiSettingsRequest'))
    return `{
    enabled: true,
  }`;
  if (compact.includes('CreateSegmentRequest'))
    return `{
    name: 'Enterprise users',
    type: 'user',
  }`;
  if (compact.includes('UpdateSegmentRequest'))
    return `{
    name: 'Enterprise users (updated)',
  }`;
  if (compact.includes('SegmentDataRequest'))
    return `{
    target_type: 'user',
    filters: { user: { email: '@example.com' } },
  }`;
  if (compact.includes('UpdateOrganizationMemberRequest'))
    return `{
    role: 'admin',
  }`;
  if (compact.includes('UpdateOrganizationRoleRequest'))
    return `{
    name: 'Organization Admin',
  }`;
  if (compact.includes('UpdateWorkspaceMemberRequest'))
    return `{
    role: 'editor',
  }`;
  if (compact.includes('UpdateWorkspaceRoleRequest'))
    return `{
    name: 'Workspace Editor',
  }`;
  if (compact.includes('{replace_existing?:boolean;file_name?:string}'))
    return `{
    replace_existing: true,
    file_name: 'skills.zip',
  }`;
  if (compact.includes('{limit?:number;before_id?:string;after_id?:string}'))
    return `{
    limit: 50,
  }`;
  if (compact.includes('{limit?:number;offset?:number}'))
    return `{
    limit: 20,
    offset: 0,
  }`;
  if (compact.includes('{q?:string;limit?:number;cursor?:string}'))
    return `{
    q: 'support',
    limit: 20,
  }`;
  if (compact.includes('ListOptions&{search?:string}'))
    return `{
    limit: 20,
    search: 'support',
  }`;
  if (compact.includes('ListOptions&{sort_key?:string;sort_order?:string;search?:string;}'))
    return `{
    limit: 20,
    sort_key: 'created_at',
    sort_order: 'desc',
  }`;
  if (compact.includes('ListOptions'))
    return `{
    limit: 20,
    offset: 0,
  }`;
  if (compact.includes('ListSegmentsOptions'))
    return `{
    limit: 20,
    search: 'enterprise',
  }`;
  return '';
}

function generatedValueLiteral(name: string, type: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith('id')) return `'${lower}-123'`;
  if (lower.endsWith('slug')) return `'${lower.replace('_', '-')}'`;
  if (lower === 'request' || lower === 'options') {
    const specific = generatedValueForType(type);
    return specific || '{}';
  }
  if (lower === 'includearchived') return 'true';
  if (lower === 'file') return `new File(['example'], 'example.txt')`;
  if (lower === 'path') return `'/'`;
  if (lower === 'scope') return `'agent'`;
  if (lower === 'title') return `'Example title'`;
  if (lower === 'description') return `'Example description'`;
  if (type.includes('boolean')) return 'true';
  if (type.includes('number')) return '1';
  if (type.includes('[]')) return '[]';
  if (type.includes('Record<')) return '{}';
  return `'value'`;
}

function primitiveTypeLabel(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function humanizeFieldName(value: string): string {
  return value.replace(/_/g, ' ');
}

function nestedFieldDescription(requestType: string, path: string[], item: unknown): string {
  const compactType = requestType.replace(/\s+/g, '');
  const key = path[path.length - 1] ?? '';
  const pathKey = path.join('.');

  if (pathKey === 'events') return 'Event definitions appended to the target catalog.';
  if (pathKey === 'events.name') return 'Stable event identifier.';
  if (pathKey === 'events.description') return 'Human-readable event description.';
  if (pathKey === 'event_name') return 'Event name used for archive, trigger, or test operations.';
  if (pathKey === 'is_archived') return 'When true, archives the target event; false unarchives it.';
  if (pathKey === 'payload') return 'Structured payload object sent with the event.';
  if (pathKey === 'filter_context') return 'Optional context used by endpoint filter rules.';
  if (pathKey === 'is_active') return 'Whether the target app or endpoint remains active.';
  if (pathKey === 'name') return 'Display name for the target resource.';
  if (pathKey === 'description') return 'Optional description text.';
  if (pathKey === 'url') return 'Destination URL for webhook delivery.';
  if (pathKey === 'headers') return 'Static request headers attached to outbound delivery requests.';
  if (pathKey === 'subscriptions') return 'Event subscriptions configured for the endpoint.';
  if (pathKey === 'subscriptions.event_name') return 'Event name subscribed by this endpoint.';
  if (pathKey === 'max_retries') return 'Maximum retry attempts after failed deliveries.';
  if (pathKey === 'timeout_seconds') return 'Per-attempt timeout in seconds.';
  if (pathKey === 'rate_limit_config') return 'Per-endpoint delivery throttling configuration.';
  if (pathKey === 'rate_limit_config.enabled') return 'Whether endpoint-level rate limiting is enabled.';
  if (pathKey === 'rate_limit_config.requests_per_minute') return 'Allowed requests per minute for this endpoint.';

  if (compactType.includes('DeploymentRestrictionsUpdates')) {
    if (key === 'sign_up_mode') return 'Deployment signup mode policy.';
    if (key === 'block_disposable_emails') return 'Blocks disposable email providers during signup.';
    if (key === 'allowlist_enabled') return 'Enables allowlist enforcement.';
    if (key === 'blocklist_enabled') return 'Enables blocklist enforcement.';
    if (key === 'waitlist_collect_names') return 'Collects first/last name in waitlist flow.';
  }

  if (compactType.includes('DeploymentB2bSettingsUpdates')) {
    if (key === 'organizations_enabled') return 'Enables organization features.';
    if (key === 'workspaces_enabled') return 'Enables workspace features.';
    if (key === 'allow_users_to_create_orgs') return 'Allows end users to self-create organizations.';
    if (key === 'max_allowed_org_members') return 'Maximum members per organization.';
    if (key === 'max_allowed_workspace_members') return 'Maximum members per workspace.';
  }

  if (compactType.includes('password_min_length?:number') || compactType.includes('mfa_methods?:Array<')) {
    if (key === 'allowed_domains') return 'Allowed email/domain list for signup and auth flows.';
    if (key === 'password_min_length') return 'Minimum password length.';
    if (key === 'password_require_uppercase') return 'Requires at least one uppercase character.';
    if (key === 'password_require_lowercase') return 'Requires at least one lowercase character.';
    if (key === 'password_require_numbers') return 'Requires at least one numeric character.';
    if (key === 'password_require_special_chars') return 'Requires at least one special character.';
    if (key === 'mfa_enabled') return 'Enables MFA requirement policy.';
    if (key === 'mfa_methods') return 'Allowed MFA methods.';
    if (key === 'session_timeout') return 'Session timeout value in seconds.';
    if (key === 'refresh_token_expiration') return 'Refresh token expiration value in seconds.';
  }

  if (compactType.includes('display_name?:string') || compactType.includes('primary_color?:string')) {
    if (key === 'display_name') return 'Deployment display name shown in UI.';
    if (key === 'primary_color') return 'Primary brand color for hosted UI.';
    if (key === 'logo_url') return 'Logo asset URL.';
    if (key === 'favicon_url') return 'Favicon asset URL.';
    if (key === 'custom_css') return 'Custom CSS string applied by hosted UI.';
    if (key === 'theme') return 'Default theme mode.';
    if (key === 'locale') return 'Default locale code.';
    if (key === 'timezone') return 'Default timezone identifier.';
  }

  if (Array.isArray(item)) return 'Array field used by this request.';
  if (item && typeof item === 'object') return 'Nested object field used by this request.';
  return `${humanizeFieldName(key)} value used by this request.`;
}

function inferFieldsFromObject(value: Record<string, unknown>, requestType: string, parentPath: string[] = []): ApiField[] {
  return Object.entries(value).map(([key, item]) => {
    const path = [...parentPath, key];
    const field: ApiField = {
      name: key,
      description: nestedFieldDescription(requestType, path, item),
    };

    if (Array.isArray(item)) {
      if (!item.length) {
        field.type = 'array';
        return field;
      }

      const first = item[0];
      if (first && typeof first === 'object' && !Array.isArray(first)) {
        field.type = 'object[]';
        field.children = inferFieldsFromObject(first as Record<string, unknown>, requestType, path);
        return field;
      }

      field.type = `${primitiveTypeLabel(first)}[]`;
      return field;
    }

    if (item && typeof item === 'object') {
      field.type = 'object';
      field.children = inferFieldsFromObject(item as Record<string, unknown>, requestType, path);
      return field;
    }

    field.type = primitiveTypeLabel(item);
    return field;
  });
}

function generatedNestedFieldsForType(type: string): ApiField[] | undefined {
  const normalized = normalizeDocTypeName(type);
  const modelFields = modelTypeFieldMap[type] ?? modelTypeFieldMap[normalized];
  if (modelFields?.length) {
    return modelFields.map((field) => ({
      ...field,
      children: field.children?.map((child) => ({ ...child })),
    }));
  }

  const literal = generatedValueForType(type).trim();
  if (!literal.startsWith('{')) return undefined;

  try {
    const parsed = Function(`return (${literal});`)() as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined;
    return inferFieldsFromObject(parsed as Record<string, unknown>, type);
  } catch {
    return undefined;
  }
}

function generatedUsage(
  entry: (typeof generatedBackendCoverageDocs)[number],
  methodMeta: GeneratedMethodDocMeta | undefined,
) {
  const callTarget = `client.${entry.resource}.${entry.method}`;
  const params = methodMeta?.params?.filter((param) => param.name !== 'client') ?? [];
  const declarations = params.map((param) => {
    const value = generatedValueLiteral(param.name, param.type);
    return `  const ${param.name}${param.optional ? '' : ''}: ${param.type} = ${value};`;
  });
  const args = params.map((param) => param.name);

  return `import { wachtClient } from '@wacht/nextjs/server';

export async function example() {
  const client = await wachtClient();
${declarations.length ? `${declarations.join('\n')}\n` : ''}  return ${callTarget}(${args.join(', ')});
}`;
}

function generatedMethodSummary(method: string) {
  if (method.startsWith('list')) return 'List records.';
  if (method.startsWith('get')) return 'Get one record or payload.';
  if (method.startsWith('create')) return 'Create a resource.';
  if (method.startsWith('update')) return 'Update a resource.';
  if (method.startsWith('delete')) return 'Delete a resource.';
  if (method.startsWith('archive')) return 'Archive a resource.';
  if (method.startsWith('unarchive')) return 'Restore an archived resource.';
  if (method.startsWith('attach')) return 'Attach a linked resource.';
  if (method.startsWith('detach')) return 'Detach a linked resource.';
  if (method.startsWith('search')) return 'Search records.';
  if (method.startsWith('verify')) return 'Run verification flow.';
  if (method.startsWith('rotate')) return 'Rotate secrets or credentials.';
  if (method.startsWith('revoke')) return 'Revoke authorization or access.';
  if (method.startsWith('assign')) return 'Assign entities.';
  if (method.startsWith('remove')) return 'Remove entities.';
  if (method.startsWith('connect')) return 'Connect resources.';
  if (method.startsWith('disconnect')) return 'Disconnect resources.';
  if (method.startsWith('run')) return 'Start execution.';
  if (method.startsWith('upload')) return 'Upload content.';
  if (method.startsWith('read')) return 'Read content.';
  if (method.startsWith('trigger')) return 'Trigger backend event delivery.';
  return 'Call this backend method.';
}

function generatedMethodIntro(method: string) {
  if (method.startsWith('list')) return 'Returns paginated or list-style results for the target resource.';
  if (method.startsWith('get')) return 'Fetches detailed data for a specific resource or scope.';
  if (method.startsWith('create')) return 'Creates backend state for the target resource.';
  if (method.startsWith('update')) return 'Applies partial or full updates for the target resource.';
  if (method.startsWith('delete')) return 'Removes backend state for the target resource.';
  if (method.startsWith('search')) return 'Runs server-side search against the target resource.';
  if (method.startsWith('upload')) return 'Uploads file/blob payloads for the target resource.';
  return 'Calls the corresponding backend method for this capability.';
}

function generatedApiFieldsForReturn(methodMeta: GeneratedMethodDocMeta | undefined): ApiField[] | undefined {
  if (!methodMeta) return undefined;
  const ret = methodMeta.returns;
  const paginatedMatch = ret.match(/^Promise<PaginatedResponse<(.+)>>$/);
  const cursorMatch = ret.match(/^Promise<CursorPage<(.+)>>$/);
  if (ret.includes('Promise<void>')) return undefined;
  if (paginatedMatch) {
    const itemType = paginatedMatch[1].trim();
    const itemFields = modelTypeFieldMap[itemType] ?? modelTypeFieldMap[normalizeDocTypeName(itemType)];
    return [
      {
        name: 'data',
        type: `${itemType}[]`,
        description: 'Current page result items.',
        children: itemFields,
      },
      { name: 'has_more', type: 'boolean', description: 'Whether additional pages are available.' },
      { name: 'limit', type: 'number | undefined', description: 'Effective page size when returned by backend.' },
      { name: 'offset', type: 'number | undefined', description: 'Effective offset when returned by backend.' },
    ];
  }
  if (cursorMatch) {
    const itemType = cursorMatch[1].trim();
    const itemFields = modelTypeFieldMap[itemType] ?? modelTypeFieldMap[normalizeDocTypeName(itemType)];
    return [
      {
        name: 'data',
        type: `${itemType}[]`,
        description: 'Current page result items.',
        children: itemFields,
      },
      { name: 'next_cursor', type: 'string | undefined', description: 'Cursor token for the next page.' },
    ];
  }

  const directPromiseMatch = ret.match(/^Promise<(.+)>$/);
  if (directPromiseMatch) {
    const resolved = directPromiseMatch[1].trim();
    const resolvedNormalized = normalizeDocTypeName(resolved);
    const arrayResolved = resolved.match(/^(.+)\[]$/);

    if (arrayResolved) {
      const itemType = arrayResolved[1].trim();
      const itemFields = modelTypeFieldMap[itemType] ?? modelTypeFieldMap[normalizeDocTypeName(itemType)];
      if (itemFields?.length) {
        return [
          {
            name: 'items',
            type: `${itemType}[]`,
            description: 'List items returned by this operation.',
            children: itemFields,
          },
        ];
      }
    }

    const directFields = modelTypeFieldMap[resolved] ?? modelTypeFieldMap[resolvedNormalized];
    if (directFields?.length) {
      return directFields;
    }
  }

  if (ret.includes('Promise<AiSettings>')) {
    return [
      { name: 'enabled', type: 'boolean | undefined', description: 'Whether AI capabilities are enabled for the deployment.' },
      { name: 'default_model', type: 'string | undefined', description: 'Default model identifier when configured.' },
      { name: 'updated_at', type: 'string | undefined', description: 'Last update timestamp when returned.' },
    ];
  }
  if (ret.includes('Promise<OAuthApp>')) {
    return [
      { name: 'slug', type: 'string', description: 'OAuth app slug.' },
      { name: 'name', type: 'string', description: 'OAuth app display name.' },
      { name: 'supported_scopes', type: 'string[] | undefined', description: 'Configured supported scope names.' },
      { name: 'allow_dynamic_client_registration', type: 'boolean | undefined', description: 'Whether dynamic client registration is enabled.' },
    ];
  }
  if (ret.includes('Promise<OAuthClient>')) {
    return [
      { name: 'id', type: 'string', description: 'OAuth client id.' },
      { name: 'client_auth_method', type: 'string | undefined', description: 'Client authentication method.' },
      { name: 'grant_types', type: 'string[] | undefined', description: 'Allowed OAuth grant types.' },
      { name: 'redirect_uris', type: 'string[] | undefined', description: 'Allowed redirect URIs.' },
    ];
  }
  if (ret.includes('Promise<OAuthDomainVerificationResponse>')) {
    return [
      { name: 'verified', type: 'boolean | undefined', description: 'Whether domain verification passed.' },
      { name: 'domain', type: 'string | undefined', description: 'Verified domain value.' },
      { name: 'message', type: 'string | undefined', description: 'Verification status message.' },
    ];
  }
  if (ret.includes('Promise<RotateOAuthClientSecretResponse>')) {
    return [
      { name: 'client_secret', type: 'string', description: 'Newly issued OAuth client secret.' },
      { name: 'client_id', type: 'string | undefined', description: 'OAuth client id.' },
    ];
  }
  if (ret.includes('Promise<WebhookApp>')) {
    return [
      { name: 'app_slug', type: 'string', description: 'Webhook app slug.' },
      { name: 'name', type: 'string', description: 'Webhook app display name.' },
      { name: 'is_active', type: 'boolean', description: 'Whether webhook app is active.' },
      { name: 'event_catalog_slug', type: 'string | null | undefined', description: 'Bound event catalog slug when set.' },
    ];
  }
  if (ret.includes('Promise<WebhookEventCatalog>')) {
    return [
      { name: 'slug', type: 'string', description: 'Webhook event catalog slug.' },
      { name: 'name', type: 'string', description: 'Catalog name.' },
      { name: 'events', type: 'WebhookEventDefinition[]', description: 'Event definitions in the catalog.' },
    ];
  }
  if (ret.includes('Promise<ReplayTaskStatus>')) {
    return [
      { name: 'task_id', type: 'string', description: 'Replay task id.' },
      { name: 'status', type: 'string', description: 'Replay task status value.' },
      { name: 'processed', type: 'number', description: 'Processed delivery count.' },
      { name: 'failed_count', type: 'number', description: 'Failed delivery count.' },
    ];
  }
  if (ret.includes('Promise<ApiAuthApp>')) {
    return [
      { name: 'app_slug', type: 'string', description: 'API auth app slug.' },
      { name: 'name', type: 'string', description: 'API auth app name.' },
      { name: 'is_active', type: 'boolean', description: 'Whether API auth app is active.' },
      { name: 'permissions', type: 'string[]', description: 'Granted permission list.' },
      { name: 'resources', type: 'string[]', description: 'Granted resource scope list.' },
    ];
  }
  if (ret.includes('Promise<ActorProject>')) {
    return [
      { name: 'id', type: 'string', description: 'Actor project id.' },
      { name: 'name', type: 'string', description: 'Actor project display name.' },
      { name: 'archived_at', type: 'string | null | undefined', description: 'Archive timestamp when archived.' },
    ];
  }
  if (ret.includes('Promise<AgentThread>')) {
    return [
      { name: 'id', type: 'string', description: 'Thread id.' },
      { name: 'project_id', type: 'string | undefined', description: 'Owning project id.' },
      { name: 'archived_at', type: 'string | null | undefined', description: 'Archive timestamp when archived.' },
    ];
  }
  if (ret.includes('Promise<ProjectTaskBoardItem>')) {
    return [
      { name: 'id', type: 'string', description: 'Task board item id.' },
      { name: 'status', type: 'string | undefined', description: 'Task board item status.' },
      { name: 'title', type: 'string | undefined', description: 'Task board item title.' },
    ];
  }
  if (ret.includes('Promise<McpServer>') || ret.includes('Promise<McpServerCreateResponse>')) {
    return [
      { name: 'id', type: 'string', description: 'MCP server id.' },
      { name: 'name', type: 'string', description: 'MCP server display name.' },
      { name: 'transport', type: 'string | undefined', description: 'MCP transport mode (for example `sse`).' },
      { name: 'endpoint_url', type: 'string | undefined', description: 'MCP endpoint URL.' },
    ];
  }
  if (ret.includes('Promise<AiKnowledgeBase>') || ret.includes('Promise<AiKnowledgeBaseWithDetails>')) {
    return [
      { name: 'id', type: 'string', description: 'Knowledge base id.' },
      { name: 'name', type: 'string', description: 'Knowledge base name.' },
      { name: 'description', type: 'string | undefined', description: 'Knowledge base description.' },
    ];
  }
  if (ret.includes('Promise<AiKnowledgeBaseDocument>')) {
    return [
      { name: 'id', type: 'string', description: 'Document id.' },
      { name: 'title', type: 'string | undefined', description: 'Document title.' },
      { name: 'status', type: 'string | undefined', description: 'Ingestion/indexing status.' },
    ];
  }
  if (ret.includes('Promise<AiAgent>') || ret.includes('Promise<AiAgentWithDetails>') || ret.includes('Promise<AgentDetailsResponse>')) {
    return [
      { name: 'id', type: 'string', description: 'Agent id.' },
      { name: 'name', type: 'string', description: 'Agent display name.' },
      { name: 'instructions', type: 'string | undefined', description: 'Agent instructions/system prompt.' },
    ];
  }
  if (ret.includes('Promise<AiTool>') || ret.includes('Promise<AiToolWithDetails>')) {
    return [
      { name: 'id', type: 'string', description: 'Tool id.' },
      { name: 'name', type: 'string', description: 'Tool display name.' },
      { name: 'kind', type: 'string | undefined', description: 'Tool kind/type.' },
    ];
  }
  if (ret.includes('Promise<BinaryFileResponse>')) {
    return [
      { name: 'data', type: 'ArrayBuffer', description: 'Binary file content.' },
      { name: 'mime_type', type: 'string | undefined', description: 'Detected content type when available.' },
      { name: 'file_name', type: 'string | undefined', description: 'Suggested filename when available.' },
    ];
  }
  if (ret.includes('Promise<ReplayTaskListResponse>')) {
    return [
      { name: 'data', type: 'ReplayTaskStatus[]', description: 'Replay tasks in the current page.' },
      { name: 'has_more', type: 'boolean', description: 'Whether additional replay tasks are available.' },
    ];
  }
  if (ret.includes('Promise<SkillTreeResponse>')) {
    return [
      { name: 'entries', type: 'SkillTreeEntry[] | undefined', description: 'Skill tree entries returned by backend.' },
    ];
  }

  return [
    { name: 'result', type: ret.replace(/^Promise</, '').replace(/>$/, ''), description: 'Operation result payload.' },
  ];
}

function generatedAiExampleCode(entry: (typeof generatedBackendCoverageDocs)[number]) {
  const m = entry.method;
  if (m === 'listActorProjects') {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function listProjectsForActor(actorId: string) {
  const client = await wachtClient();
  return client.ai.listActorProjects(actorId, true);
}`;
  }
  if (m === 'searchActorProjects') {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function searchProjects(actorId: string, cursor?: string) {
  const client = await wachtClient();
  return client.ai.searchActorProjects(actorId, {
    q: 'support',
    limit: 20,
    cursor,
  });
}`;
  }
  if (m === 'listProjectThreads' || m === 'searchActorProjectThreads') {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function loadThreadSlice(actorId: string, projectId: string) {
  const client = await wachtClient();
  const threads = await client.ai.listProjectThreads(projectId, true);
  const search = await client.ai.searchActorProjectThreads(actorId, { q: 'login issue', limit: 20 });
  return { threads, search };
}`;
  }
  if (m === 'listThreadMessages') {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function loadRecentMessages(threadId: string) {
  const client = await wachtClient();
  return client.ai.listThreadMessages(threadId, { limit: 50 });
}`;
  }
  if (m === 'listThreadEvents' || m === 'listThreadAssignments') {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function loadThreadOperationalState(threadId: string) {
  const client = await wachtClient();
  const events = await client.ai.listThreadEvents(threadId);
  const assignments = await client.ai.listThreadAssignments(threadId);
  return { events, assignments };
}`;
  }
  if (m === 'runAgentThread') {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function runAndInspect(threadId: string) {
  const client = await wachtClient();
  const run = await client.ai.runAgentThread(threadId, {
    prompt: 'Summarize current blockers and next actions.',
  });
  const events = await client.ai.listThreadEvents(threadId);
  return { run, events };
}`;
  }
  if (m.includes('KnowledgeBase') || m.includes('knowledgeBase') || m === 'uploadKnowledgeBaseDocument') {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function createKbAndUpload(file: File) {
  const client = await wachtClient();
  const kb = await client.ai.createKnowledgeBase({
    name: 'Support Docs',
    description: 'Knowledge base for support runbooks',
  });
  const doc = await client.ai.uploadKnowledgeBaseDocument(kb.id, file, 'runbook.md', 'Support runbook');
  return { kb, doc };
}`;
  }
  if (m.includes('McpServer')) {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function provisionMcp(actorId: string) {
  const client = await wachtClient();
  const server = await client.ai.createMcpServer({
    name: 'Internal MCP',
    transport: 'sse',
    endpoint_url: 'https://mcp.example.com',
  });
  const connected = await client.ai.connectActorMcpServer(actorId, server.id);
  return { server, connected };
}`;
  }
  if (m.includes('Tool')) {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function attachTool(agentId: string) {
  const client = await wachtClient();
  const tool = await client.ai.createTool({
    name: 'fetch-user-profile',
    kind: 'api',
    configuration: {},
  });
  await client.ai.attachAgentTool(agentId, tool.id);
  return tool;
}`;
  }
  if (m.includes('Skill')) {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function inspectSkills(agentId: string) {
  const client = await wachtClient();
  const tree = await client.ai.listAgentSkillTree(agentId, 'agent');
  const file = await client.ai.readAgentSkillFile(agentId, 'agent', '/README.md');
  return { tree, file };
}`;
  }
  if (m.includes('ProjectTaskBoardItem')) {
    return `import { wachtClient } from '@wacht/nextjs/server';

export async function createAndInspectBoardItem(projectId: string) {
  const client = await wachtClient();
  const item = await client.ai.createProjectTaskBoardItem(projectId, { title: 'Investigate incident' });
  const events = await client.ai.listProjectTaskBoardItemEvents(projectId, item.id);
  return { item, events };
}`;
  }
  return null;
}

function generatedAiExamples(
  entry: (typeof generatedBackendCoverageDocs)[number],
) {
  if (entry.resource !== 'ai') return [];
  const code = generatedAiExampleCode(entry);
  if (!code) return [];
  return [
    {
      title: 'AI usage pattern',
      code,
      lang: 'ts',
    },
  ];
}

function createGeneratedBackendDoc(entry: (typeof generatedBackendCoverageDocs)[number]): BackendDoc {
  const methodMeta = getMethodDocMeta(entry.method);
  const aiExamples = generatedAiExamples(entry);
  const generatedParams: ApiField[] | undefined = methodMeta
    ? methodMeta.params
        .filter((param) => param.name !== 'client')
        .map((param) => ({
          name: param.name,
          type: param.optional ? removeUndefinedUnion(param.type) : param.type,
          description: generatedParamDescription(param.name, param.type),
          required: !param.optional,
          children:
            param.name === 'request' || param.name === 'options'
              ? generatedNestedFieldsForType(param.type)
              : undefined,
        }))
    : undefined;

  const baseDoc: BackendDoc = {
    slug: entry.path[1],
    path: entry.path,
    title: `${entry.method}()`,
    description: generatedMethodSummary(entry.method),
    intro: generatedMethodIntro(entry.method),
    usage: generatedUsage(entry, methodMeta),
    signature: methodMeta?.signature ?? `function ${entry.method}(...args: unknown[]): Promise<unknown>`,
    paramsTitle: 'Parameters',
    params: generatedParams,
    api: generatedApiFieldsForReturn(methodMeta),
    examples: aiExamples.length ? aiExamples : undefined,
    sections: undefined,
  };
  const override = generatedDocOverrides[entry.method];
  const merged = override ? { ...baseDoc, ...override, path: entry.path, slug: entry.path[1] } : baseDoc;
  return {
    ...merged,
    sections: stripUnwantedSections(merged.sections),
  };
}

export const allBackendGroups: BackendGroup[] = (() => {
  const seeded = backendGroups.map((group) => ({ ...group, docs: [...group.docs] }));
  const byLabel = new Map(seeded.map((group) => [group.label, group]));

  function mergeParams(existing?: ApiField[], generated?: ApiField[]) {
    if (!existing?.length) return generated;
    if (!generated?.length) return existing;

    const existingByName = new Map(existing.map((field) => [field.name, field]));
    const merged: ApiField[] = generated.map((generatedField): ApiField => {
      const existingField = existingByName.get(generatedField.name);
      if (!existingField) return generatedField;

      return {
        ...generatedField,
        ...existingField,
        required:
          existingField.required ??
          generatedField.required ??
          !String(existingField.type ?? generatedField.type ?? '').includes('undefined'),
        children: generatedField.children ?? existingField.children,
      };
    });
    return merged;
  }

  function mergeApi(existing?: ApiField[], generated?: ApiField[]) {
    if (!existing?.length) return generated;
    if (!generated?.length) return existing;

    const existingByName = new Map(existing.map((field) => [field.name, field]));
    return generated.map((generatedField): ApiField => {
      const existingField = existingByName.get(generatedField.name);
      if (!existingField) return generatedField;

      return {
        ...generatedField,
        ...existingField,
        children: generatedField.children ?? existingField.children,
      };
    });
  }

  function normalizeParamsTitle(paramsTitle: string | undefined, params: ApiField[] | undefined) {
    if (!paramsTitle) return paramsTitle;
    if (!/Request$/.test(paramsTitle)) return paramsTitle;
    if (!params?.length) return paramsTitle;
    const hasNonRequestParams = params.some((field) => field.name !== 'request' && field.name !== 'options');
    return hasNonRequestParams ? 'Parameters' : paramsTitle;
  }

  function inferResourceFromGroupAndMethod(groupLabel: string, method: string): string {
    if (groupLabel === 'Users') {
      if (method === 'createSessionTicket') return 'sessions';
      if (
        method === 'listInvitations' ||
        method === 'inviteUser' ||
        method === 'deleteInvitation' ||
        method === 'listWaitlist' ||
        method === 'approveWaitlistUser'
      ) {
        return 'invitations';
      }
      return 'users';
    }
    if (groupLabel === 'Invitations') return 'invitations';
    if (groupLabel === 'Sessions') return 'sessions';
    if (groupLabel === 'Organizations') return 'organizations';
    if (groupLabel === 'Workspaces') return 'workspaces';
    if (groupLabel === 'API auth apps') return 'apiKeys';
    if (groupLabel === 'API auth keys') return 'apiKeys';
    if (groupLabel === 'API auth audit') return 'apiKeys';
    if (groupLabel === 'API auth rate limits') return 'apiKeys';
    if (groupLabel === 'Webhooks apps') return 'webhooks';
    if (groupLabel === 'Webhook endpoints') return 'webhooks';
    if (groupLabel === 'Webhook deliveries') return 'webhooks';
    if (groupLabel === 'Webhook catalogs') return 'webhooks';
    if (groupLabel === 'Webhook analytics') return 'webhooks';
    if (groupLabel === 'AI configuration') return 'ai';
    if (groupLabel === 'AI runtime') return 'ai';
    if (groupLabel === 'OAuth apps') return 'oauth';
    if (groupLabel === 'OAuth clients') return 'oauth';
    if (groupLabel === 'OAuth scopes') return 'oauth';
    if (groupLabel === 'OAuth grants') return 'oauth';
    if (groupLabel === 'Settings') return 'settings';
    if (groupLabel === 'Segments') return 'segments';
    if (groupLabel === 'Utility') {
      if (method === 'healthCheck') return 'health';
      if (method === 'createNotification') return 'notifications';
      if (method === 'getAnalyticsSummary') return 'analytics';
      if (method === 'uploadImage') return 'utility';
      if (method === 'checkAuthz' || method === 'checkPrincipalAuthz') return 'gateway';
      return 'operations';
    }
    return 'operations';
  }

  function inferPathGroupFromLabel(groupLabel: string): string {
    if (groupLabel === 'Users') return 'users';
    if (groupLabel === 'Invitations') return 'invitations';
    if (groupLabel === 'Sessions') return 'sessions';
    if (groupLabel === 'Organizations') return 'organizations';
    if (groupLabel === 'Workspaces') return 'workspaces';
    if (groupLabel === 'API auth apps') return 'api-auth-apps';
    if (groupLabel === 'API auth keys') return 'api-auth-keys';
    if (groupLabel === 'API auth audit') return 'api-auth-audit';
    if (groupLabel === 'API auth rate limits') return 'api-auth-rate-limits';
    if (groupLabel === 'Webhooks apps') return 'webhooks-apps';
    if (groupLabel === 'Webhook endpoints') return 'webhook-endpoints';
    if (groupLabel === 'Webhook deliveries') return 'webhook-deliveries';
    if (groupLabel === 'Webhook catalogs') return 'webhook-catalogs';
    if (groupLabel === 'Webhook analytics') return 'webhook-analytics';
    if (groupLabel === 'AI configuration') return 'ai-configuration';
    if (groupLabel === 'AI runtime') return 'ai-runtime';
    if (groupLabel === 'OAuth apps') return 'oauth-apps';
    if (groupLabel === 'OAuth clients') return 'oauth-clients';
    if (groupLabel === 'OAuth scopes') return 'oauth-scopes';
    if (groupLabel === 'OAuth grants') return 'oauth-grants';
    if (groupLabel === 'Utility') return 'operations';
    if (groupLabel === 'Settings') return 'settings';
    if (groupLabel === 'Segments') return 'segments';
    return 'operations';
  }

  function mergeDoc(existing: BackendDoc, generated: BackendDoc): BackendDoc {
    const mergedParams = mergeParams(existing.params, generated.params);
    const merged = {
      ...generated,
      ...existing,
      slug: existing.slug ?? generated.slug,
      path: existing.path ?? generated.path,
      title: existing.title ?? generated.title,
      description: existing.description ?? generated.description,
      intro: existing.intro ?? generated.intro,
      usage: existing.usage ?? generated.usage,
      signature: existing.signature ?? generated.signature,
      paramsTitle: normalizeParamsTitle(existing.paramsTitle ?? generated.paramsTitle, mergedParams),
      params: mergedParams,
      api: mergeApi(existing.api, generated.api),
      sections: existing.sections?.length ? existing.sections : generated.sections,
      examples: existing.examples?.length ? existing.examples : generated.examples,
    };
    return {
      ...merged,
      sections: stripUnwantedSections(merged.sections),
    };
  }

  // Enrich manual catalog docs with generated params/api/signatures even when no explicit coverage entry exists.
  for (const group of seeded) {
    group.docs = group.docs.map((doc) => {
      const match = doc.title.match(/^([A-Za-z0-9_]+)\(\)$/);
      const method = match?.[1];
      if (!method || !getMethodDocMeta(method)) return doc;

      const generated = createGeneratedBackendDoc({
        resource: inferResourceFromGroupAndMethod(group.label, method),
        method,
        path:
          doc.path && doc.path.length >= 2
            ? [doc.path[0], doc.path[1]]
            : [inferPathGroupFromLabel(group.label), doc.slug],
        endpoint: { method: '', path: '' },
      });
      return mergeDoc(doc, generated);
    });
  }

  for (const entry of generatedBackendCoverageDocs) {
    const coverageGroup = classifyBackendCoverageDoc(entry);
    const groupLabel = coverageGroup.label;
    if (!groupLabel) continue;
    const normalizedEntry = {
      ...entry,
      path: [coverageGroup.pathGroup, entry.path[1]] as [string, string],
    };
    const generated = createGeneratedBackendDoc(normalizedEntry);
    const generatedKey = (generated.path ?? [generated.slug]).join('/');

    let targetGroup = byLabel.get(groupLabel);
    if (!targetGroup) {
      targetGroup = { label: groupLabel, docs: [] };
      seeded.push(targetGroup);
      byLabel.set(groupLabel, targetGroup);
    }

    const existingInTarget = targetGroup.docs.findIndex(
      (doc) => ((doc.path ?? [doc.slug]).join('/')) === generatedKey || doc.title === generated.title,
    );

    if (existingInTarget >= 0) {
      targetGroup.docs[existingInTarget] = mergeDoc(targetGroup.docs[existingInTarget], generated);
      continue;
    }

    let sourceGroup: BackendGroup | undefined;
    let sourceIndex = -1;
    for (const candidate of seeded) {
      const candidateIndex = candidate.docs.findIndex(
        (doc) =>
          doc.title === generated.title ||
          (doc.path ? doc.path[1] === generated.path?.[1] : doc.slug === generated.slug),
      );
      if (candidateIndex >= 0) {
        sourceGroup = candidate;
        sourceIndex = candidateIndex;
        break;
      }
    }

    if (sourceGroup && sourceIndex >= 0) {
      const [existingDoc] = sourceGroup.docs.splice(sourceIndex, 1);
      targetGroup.docs.push(mergeDoc(existingDoc, generated));
      continue;
    }

    targetGroup.docs.push(generated);
  }

  const order = new Map(backendCoverageGroupOrder.map((label, index) => [label, index]));
  return seeded
    .filter((group) => group.docs.length > 0)
    .sort((a, b) => (order.get(a.label) ?? 999) - (order.get(b.label) ?? 999));
})();
