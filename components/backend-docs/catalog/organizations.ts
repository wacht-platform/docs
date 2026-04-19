import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const organizationsBackendDocs: BackendDoc[] = [
{
        slug: 'list-organizations',
        path: ['organizations', 'list-organizations'],
        title: 'listOrganizations()',
        description: 'List organizations in the current deployment.',
        intro:
          'Returns organizations as a paginated response. Supports pagination, text search, and sort forwarding.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listOrganizations() {
  const client = await wachtClient();
  return client.organizations.listOrganizations({
    limit: 20,
    offset: 0,
    search: 'acme',
    sort_key: 'created_at',
    sort_order: 'desc',
  });
}`,
        signature: `function listOrganizations(
  options?: ListOrganizationsOptions,
): Promise<PaginatedResponse<Organization>>`,
        paramsTitle: 'ListOrganizationsOptions',
        params: [
          {
            name: 'limit',
            type: 'number | undefined',
            description: 'Maximum organizations to return for this page.',
          },
          {
            name: 'offset',
            type: 'number | undefined',
            description: 'Number of organizations to skip before returning results.',
          },
          {
            name: 'sort_key',
            type: 'string | undefined',
            description: 'Sort key forwarded to backend organization list query.',
          },
          {
            name: 'sort_order',
            type: "'asc' | 'desc' | undefined",
            description: 'Sort order for the selected `sort_key`.',
          },
          {
            name: 'search',
            type: 'string | undefined',
            description: 'Search term forwarded to backend organization list query.',
          },
        ],
        api: [
          {
            name: 'data',
            type: 'Organization[]',
            description: 'Organizations in the current page.',
            children: [
              { name: 'id', type: 'string', description: 'Stable organization identifier.' },
              { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
              { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
              { name: 'name', type: 'string', description: 'Organization display name.' },
              { name: 'description', type: 'string', description: 'Organization description text.' },
              { name: 'image_url', type: 'string', description: 'Organization image URL.' },
              { name: 'member_count', type: 'number', description: 'Current member count.' },
              {
                name: 'public_metadata',
                type: 'Record<string, unknown>',
                description: 'Public organization metadata.',
                children: [
                  { name: 'plan', type: 'string | undefined', description: 'Example public plan field.' },
                  { name: 'owner', type: 'string | undefined', description: 'Example public owner field.' },
                ],
              },
              {
                name: 'private_metadata',
                type: 'Record<string, unknown>',
                description: 'Private organization metadata.',
                children: [
                  { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
                  { name: 'billing_id', type: 'string | undefined', description: 'Example internal billing identifier.' },
                ],
              },
            ],
          },
          {
            name: 'has_more',
            type: 'boolean',
            description: 'Whether another page exists after this one.',
          },
          {
            name: 'limit',
            type: 'number | undefined',
            description: 'Effective page size reflected by backend response.',
          },
          {
            name: 'offset',
            type: 'number | undefined',
            description: 'Effective offset reflected by backend response.',
          },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Lists organizations visible in the deployment context.',
              'Supports standard list pagination and sorting options.',
            ],
          },
          {
            title: 'Operational usage',
            points: [
              'Use this as an index call before id-scoped operations.',
              'Persist the returned organization id for member, role, and workspace operations.',
            ],
          },
        ],
        examples: [
          {
            title: 'List first page with defaults',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listOrganizationPage() {
  const client = await wachtClient();
  return client.organizations.listOrganizations();
}`,
            lang: 'ts',
          },
          {
            title: 'Search and sort organizations',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function searchOrganizations(search: string) {
  const client = await wachtClient();
  return client.organizations.listOrganizations({
    search,
    sort_key: 'created_at',
    sort_order: 'desc',
    limit: 25,
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'get-organization',
        path: ['organizations', 'get-organization'],
        title: 'getOrganization()',
        description: 'Load one organization by id.',
        intro:
          'Returns the detailed organization payload, including organization roles, workspaces, and segments.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getOrganization(organizationId: string) {
  const client = await wachtClient();
  return client.organizations.getOrganization(organizationId);
}`,
        signature: `function getOrganization(
  organizationId: string,
): Promise<OrganizationDetails>`,
        params: [
          {
            name: 'organizationId',
            type: 'string',
            description: 'Stable organization id to load.',
          },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Stable organization identifier.' },
          { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
          { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
          { name: 'name', type: 'string', description: 'Organization display name.' },
          { name: 'description', type: 'string', description: 'Organization description text.' },
          { name: 'image_url', type: 'string', description: 'Organization image URL.' },
          { name: 'member_count', type: 'number', description: 'Current member count.' },
          {
            name: 'public_metadata',
            type: 'Record<string, unknown>',
            description: 'Public organization metadata.',
            children: [
              { name: 'plan', type: 'string | undefined', description: 'Example public plan field.' },
              { name: 'owner', type: 'string | undefined', description: 'Example public owner field.' },
            ],
          },
          {
            name: 'private_metadata',
            type: 'Record<string, unknown>',
            description: 'Private organization metadata.',
            children: [
              { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
              { name: 'billing_id', type: 'string | undefined', description: 'Example internal billing identifier.' },
            ],
          },
          { name: 'roles', type: 'OrganizationRole[]', description: 'Deployment-level and organization-level roles available to this organization.' },
          { name: 'workspaces', type: 'Workspace[]', description: 'Workspaces currently under this organization.' },
          { name: 'segments', type: 'Segment[]', description: 'Segments currently attached to this organization.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Returns full organization details by id.',
              'Includes related role, workspace, and segment information in one payload.',
            ],
          },
        ],
        examples: [
          {
            title: 'Load full organization details',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function loadOrganization(organizationId: string) {
  const client = await wachtClient();
  return client.organizations.getOrganization(organizationId);
}`,
            lang: 'ts',
          },
          {
            title: 'Read only roles and workspace ids',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function summarizeOrganization(organizationId: string) {
  const client = await wachtClient();
  const organization = await client.organizations.getOrganization(organizationId);

  return {
    roleNames: organization.roles.map((role) => role.name),
    workspaceIds: organization.workspaces.map((workspace) => workspace.id),
  };
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'create-organization',
        path: ['organizations', 'create-organization'],
        title: 'createOrganization()',
        description: 'Create an organization in the current deployment.',
        intro:
          'Creates an organization from multipart form fields. Name is required, and you can optionally include metadata and an uploaded image.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createOrganization() {
  const client = await wachtClient();
  return client.organizations.createOrganization({
    name: 'Acme',
    description: 'Enterprise account',
    public_metadata: { tier: 'enterprise' },
  });
}`,
        signature: `function createOrganization(
  request: CreateOrganizationRequest,
): Promise<Organization>`,
        paramsTitle: 'CreateOrganizationRequest',
        params: [
          { name: 'name', type: 'string', description: 'Organization display name.' },
          { name: 'description', type: 'string | undefined', description: 'Optional description text.' },
          {
            name: 'public_metadata',
            type: 'Record<string, unknown> | undefined',
            description: 'Optional public metadata.',
            children: [
              { name: 'plan', type: 'string | undefined', description: 'Example public plan field.' },
              { name: 'owner', type: 'string | undefined', description: 'Example public owner field.' },
            ],
          },
          {
            name: 'private_metadata',
            type: 'Record<string, unknown> | undefined',
            description: 'Optional private metadata.',
            children: [
              { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
              { name: 'billing_id', type: 'string | undefined', description: 'Example internal billing identifier.' },
            ],
          },
          { name: 'organization_image', type: 'File | Blob | undefined', description: 'Optional uploaded organization image.' },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Stable organization identifier.' },
          { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
          { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
          { name: 'name', type: 'string', description: 'Organization display name.' },
          { name: 'description', type: 'string', description: 'Organization description text.' },
          { name: 'image_url', type: 'string', description: 'Organization image URL.' },
          { name: 'member_count', type: 'number', description: 'Current member count.' },
          {
            name: 'public_metadata',
            type: 'Record<string, unknown>',
            description: 'Public organization metadata.',
            children: [
              { name: 'plan', type: 'string | undefined', description: 'Example public plan field.' },
              { name: 'owner', type: 'string | undefined', description: 'Example public owner field.' },
            ],
          },
          {
            name: 'private_metadata',
            type: 'Record<string, unknown>',
            description: 'Private organization metadata.',
            children: [
              { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
              { name: 'billing_id', type: 'string | undefined', description: 'Example internal billing identifier.' },
            ],
          },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Creates an organization and returns the created organization object.',
              'Multipart payload allows metadata plus optional image upload.',
            ],
          },
        ],
        examples: [
          {
            title: 'Create with metadata only',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createBasicOrganization() {
  const client = await wachtClient();
  return client.organizations.createOrganization({
    name: 'Acme',
    public_metadata: { plan: 'pro' },
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Create with uploaded image',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createOrganizationWithImage(file: Blob) {
  const client = await wachtClient();
  return client.organizations.createOrganization({
    name: 'Acme',
    organization_image: file,
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'update-organization',
        path: ['organizations', 'update-organization'],
        title: 'updateOrganization()',
        description: 'Update organization fields by id.',
        intro:
          'Patches organization fields with multipart form fields. You can update metadata, upload a new image, or remove the current image.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateOrganization(organizationId: string) {
  const client = await wachtClient();
  return client.organizations.updateOrganization(organizationId, {
    description: 'Updated description',
    remove_image: true,
  });
}`,
        signature: `function updateOrganization(
  organizationId: string,
  request: UpdateOrganizationRequest,
): Promise<Organization>`,
        params: [
          { name: 'organizationId', type: 'string', description: 'Stable organization id.' },
          { name: 'request.name', type: 'string | undefined', description: 'Optional new name.' },
          { name: 'request.description', type: 'string | undefined', description: 'Optional new description.' },
          {
            name: 'request.public_metadata',
            type: 'Record<string, unknown> | undefined',
            description: 'Optional public metadata patch.',
            children: [
              { name: 'plan', type: 'string | undefined', description: 'Example public plan field.' },
              { name: 'owner', type: 'string | undefined', description: 'Example public owner field.' },
            ],
          },
          {
            name: 'request.private_metadata',
            type: 'Record<string, unknown> | undefined',
            description: 'Optional private metadata patch.',
            children: [
              { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
              { name: 'billing_id', type: 'string | undefined', description: 'Example internal billing identifier.' },
            ],
          },
          { name: 'request.remove_image', type: 'boolean | undefined', description: 'Remove existing organization image when true.' },
          { name: 'request.organization_image', type: 'File | Blob | undefined', description: 'Optional new organization image upload.' },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Stable organization identifier.' },
          { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
          { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
          { name: 'name', type: 'string', description: 'Organization display name.' },
          { name: 'description', type: 'string', description: 'Organization description text.' },
          { name: 'image_url', type: 'string', description: 'Organization image URL.' },
          { name: 'member_count', type: 'number', description: 'Current member count.' },
          {
            name: 'public_metadata',
            type: 'Record<string, unknown>',
            description: 'Public organization metadata.',
            children: [
              { name: 'plan', type: 'string | undefined', description: 'Example public plan field.' },
              { name: 'owner', type: 'string | undefined', description: 'Example public owner field.' },
            ],
          },
          {
            name: 'private_metadata',
            type: 'Record<string, unknown>',
            description: 'Private organization metadata.',
            children: [
              { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
              { name: 'billing_id', type: 'string | undefined', description: 'Example internal billing identifier.' },
            ],
          },
        ],
        
        examples: [
          {
            title: 'Patch metadata',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function patchOrganizationMetadata(organizationId: string) {
  const client = await wachtClient();
  return client.organizations.updateOrganization(organizationId, {
    public_metadata: { owner: 'ops' },
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Replace image',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function replaceOrganizationImage(organizationId: string, image: Blob) {
  const client = await wachtClient();
  return client.organizations.updateOrganization(organizationId, {
    organization_image: image,
    remove_image: false,
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
        slug: 'delete-organization',
        path: ['organizations', 'delete-organization'],
        title: 'deleteOrganization()',
        description: 'Delete an organization by id.',
        intro:
          'Deletes the organization resource. This method resolves with no return value on success.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function deleteOrganization(organizationId: string) {
  const client = await wachtClient();
  await client.organizations.deleteOrganization(organizationId);
}`,
        signature: `function deleteOrganization(
  organizationId: string,
): Promise<void>`,
        params: [
          { name: 'organizationId', type: 'string', description: 'Stable organization id to delete.' },
        ],
        
        examples: [
          {
            title: 'Delete by id',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function removeOrganization(organizationId: string) {
  const client = await wachtClient();
  await client.organizations.deleteOrganization(organizationId);
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
{
        slug: 'list-organization-members',
        path: ['organizations', 'list-organization-members'],
        title: 'listOrganizationMembers()',
        description: 'List members for one organization.',
        intro:
          'Returns a paginated member list with optional pagination, search, and sorting query params.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listOrganizationMembers(organizationId: string) {
  const client = await wachtClient();
  return client.organizations.listOrganizationMembers(organizationId, {
    limit: 20,
    search: 'john',
    sort_key: 'created_at',
    sort_order: 'desc',
  });
}`,
        signature: `function listOrganizationMembers(
  organizationId: string,
  options?: ListOrganizationMembersOptions,
): Promise<PaginatedResponse<OrganizationMember>>`,
        params: [
          { name: 'organizationId', type: 'string', description: 'Stable organization id.' },
          { name: 'options.limit', type: 'number | undefined', description: 'Maximum members to return.' },
          { name: 'options.offset', type: 'number | undefined', description: 'Items to skip.' },
          { name: 'options.search', type: 'string | undefined', description: 'Search term forwarded to backend.' },
          { name: 'options.sort_key', type: 'string | undefined', description: 'Sort key forwarded to backend.' },
          { name: 'options.sort_order', type: "'asc' | 'desc' | undefined", description: 'Sort order for `sort_key`.' },
        ],
        api: [
          { name: 'data', type: 'OrganizationMember[]', description: 'Member rows in the page.' },
          { name: 'has_more', type: 'boolean', description: 'Whether a next page exists.' },
          { name: 'limit', type: 'number | undefined', description: 'Effective page size from backend response.' },
          { name: 'offset', type: 'number | undefined', description: 'Effective page offset from backend response.' },
        ],
        
        examples: [
          {
            title: 'List with defaults',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listMembers(organizationId: string) {
  const client = await wachtClient();
  return client.organizations.listOrganizationMembers(organizationId);
}`,
            lang: 'ts',
          },
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
        slug: 'add-organization-member',
        path: ['organizations', 'add-organization-member'],
        title: 'addOrganizationMember()',
        description: 'Add a user as an organization member.',
        intro:
          'Creates an organization membership for a user using role ids.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function addOrganizationMember(organizationId: string, userId: string, roleId: string) {
  const client = await wachtClient();
  return client.organizations.addOrganizationMember(organizationId, {
    user_id: userId,
    role_ids: [roleId],
  });
}`,
        signature: `function addOrganizationMember(
  organizationId: string,
  request: AddOrganizationMemberRequest,
): Promise<OrganizationMember>`,
        params: [
          { name: 'organizationId', type: 'string', description: 'Stable organization id.' },
          { name: 'request.user_id', type: 'string', description: 'User id to add.' },
          { name: 'request.role_ids', type: 'string[]', description: 'Organization role ids assigned to the membership.' },
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
        slug: 'list-organization-roles',
        path: ['organizations', 'list-organization-roles'],
        title: 'listOrganizationRoles()',
        description: 'List roles for one organization.',
        intro:
          'Returns organization roles scoped to one organization id.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listOrganizationRoles(organizationId: string) {
  const client = await wachtClient();
  return client.organizations.listOrganizationRoles(organizationId);
}`,
        signature: `function listOrganizationRoles(
  organizationId: string,
): Promise<PaginatedResponse<OrganizationRole>>`,
        params: [
          { name: 'organizationId', type: 'string', description: 'Target organization id.' },
        ],
        api: [
          { name: 'data', type: 'OrganizationRole[]', description: 'Organization roles in this organization.' },
          { name: 'has_more', type: 'boolean', description: 'Whether another page exists.' },
          { name: 'limit', type: 'number | undefined', description: 'Effective page size from backend response.' },
          { name: 'offset', type: 'number | undefined', description: 'Effective page offset from backend response.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Operates on organization-scoped role definitions.',
          'Use pagination and filters from this method to build admin list views.',
        ],
      },
    ],
  },
{
        slug: 'create-organization-role',
        path: ['organizations', 'create-organization-role'],
        title: 'createOrganizationRole()',
        description: 'Create a role under one organization.',
        intro:
          'Creates an organization role with a name and permissions list.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createRole(organizationId: string) {
  const client = await wachtClient();
  return client.organizations.createOrganizationRole(organizationId, {
    name: 'support-agent',
    permissions: ['organizations.members.read'],
  });
}`,
        signature: `function createOrganizationRole(
  organizationId: string,
  request: CreateOrganizationRoleRequest,
): Promise<OrganizationRole>`,
        params: [
          { name: 'organizationId', type: 'string', description: 'Stable organization id.' },
          { name: 'request.name', type: 'string', description: 'Role name.' },
          { name: 'request.permissions', type: 'string[]', description: 'Permission identifiers for this role.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Operates on organization-scoped role definitions.',
          'Validate required fields before calling to avoid predictable request failures.',
        ],
      },
    ],
  },
{
        slug: 'create-workspace-for-organization',
        path: ['organizations', 'create-workspace-for-organization'],
        title: 'createWorkspaceForOrganization()',
        description: 'Create a workspace under one organization.',
        intro:
          'Creates a workspace using multipart form fields, with optional metadata and optional `workspace_image` upload.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createWorkspaceForOrganization(organizationId: string) {
  const client = await wachtClient();
  return client.organizations.createWorkspaceForOrganization(organizationId, {
    name: 'Engineering',
    description: 'Core team workspace',
  });
}`,
        signature: `function createWorkspaceForOrganization(
  organizationId: string,
  request: CreateWorkspaceRequest,
): Promise<Workspace>`,
        params: [
          { name: 'organizationId', type: 'string', description: 'Stable organization id.' },
          { name: 'request.name', type: 'string', description: 'Workspace name.' },
          { name: 'request.description', type: 'string | undefined', description: 'Optional workspace description.' },
          {
            name: 'request.public_metadata',
            type: 'Record<string, unknown> | undefined',
            description: 'Optional public metadata.',
            children: [
              { name: 'plan', type: 'string | undefined', description: 'Example public plan field.' },
              { name: 'owner', type: 'string | undefined', description: 'Example public owner field.' },
            ],
          },
          {
            name: 'request.private_metadata',
            type: 'Record<string, unknown> | undefined',
            description: 'Optional private metadata.',
            children: [
              { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
              { name: 'billing_id', type: 'string | undefined', description: 'Example internal billing identifier.' },
            ],
          },
          { name: 'request.workspace_image', type: 'File | Blob | undefined', description: 'Optional uploaded workspace image.' },
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
];
