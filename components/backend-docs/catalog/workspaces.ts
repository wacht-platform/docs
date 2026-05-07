import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const workspacesBackendDocs: BackendDoc[] = [
{
        slug: 'list-workspaces',
        path: ['workspaces', 'list-workspaces'],
        title: 'listWorkspaces()',
        description: 'List workspaces in the current deployment.',
        intro:
          'Returns paginated workspace list items and forwards pagination, search, and sorting query params.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listWorkspaces() {
  const client = await wachtClient();
  return client.workspaces.listWorkspaces({
    limit: 20,
    search: 'engineering',
    sort_key: 'created_at',
    sort_order: 'desc',
  });
}`,
        signature: `function listWorkspaces(
  options?: ListWorkspacesOptions,
): Promise<PaginatedResponse<WorkspaceListItem>>`,
        paramsTitle: 'ListWorkspacesOptions',
        params: [
          { name: 'limit', type: 'number | undefined', description: 'Maximum workspaces to return.' },
          { name: 'offset', type: 'number | undefined', description: 'Number of workspaces to skip.' },
          { name: 'search', type: 'string | undefined', description: 'Search term forwarded to backend.' },
          { name: 'sort_key', type: 'string | undefined', description: 'Sort key forwarded to backend.' },
          { name: 'sort_order', type: "'asc' | 'desc' | undefined", description: 'Sort order for `sort_key`.' },
        ],
        api: [
          { name: 'data', type: 'WorkspaceListItem[]', description: 'Workspace list rows.' },
          { name: 'total', type: 'number', description: 'Total number of workspaces matching the current query.' },
          { name: 'limit', type: 'number | undefined', description: 'Effective page size from backend response.' },
          { name: 'offset', type: 'number | undefined', description: 'Effective page offset from backend response.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Lists workspaces accessible in the deployment context.',
              'Supports pagination, search, and backend sort options.',
            ],
          },
        ],
      },
{
        slug: 'get-workspace',
        path: ['workspaces', 'get-workspace'],
        title: 'getWorkspace()',
        description: 'Load one workspace by id.',
        intro:
          'Returns the expanded workspace details payload, including organization link, roles, and segments.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getWorkspace(workspaceId: string) {
  const client = await wachtClient();
  return client.workspaces.getWorkspace(workspaceId);
}`,
        signature: `function getWorkspace(
  workspaceId: string,
): Promise<WorkspaceDetails>`,
        params: [
          { name: 'workspaceId', type: 'string', description: 'Stable workspace id to load.' },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Stable workspace identifier.' },
          { name: 'organization_id', type: 'string', description: 'Parent organization id.' },
          { name: 'name', type: 'string', description: 'Workspace display name.' },
          { name: 'description', type: 'string | undefined', description: 'Workspace description text.' },
          {
            name: 'public_metadata',
            type: 'Record<string, unknown>',
            description: 'Public workspace metadata.',
            children: [
              { name: 'plan', type: 'string | undefined', description: 'Example public plan field.' },
              { name: 'owner', type: 'string | undefined', description: 'Example public owner field.' },
            ],
          },
          {
            name: 'private_metadata',
            type: 'Record<string, unknown>',
            description: 'Private workspace metadata.',
            children: [
              { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
              { name: 'billing_id', type: 'string | undefined', description: 'Example internal billing identifier.' },
            ],
          },
          { name: 'roles', type: 'WorkspaceRole[]', description: 'Workspace roles available in this workspace.' },
          { name: 'segments', type: 'Segment[]', description: 'Segments currently attached to this workspace.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Returns expanded workspace details by workspace id.',
              'Use this when you need role and segment context for one workspace.',
            ],
          },
        ],
      },
{
        slug: 'update-workspace',
        path: ['workspaces', 'update-workspace'],
        title: 'updateWorkspace()',
        description: 'Patch workspace fields by id.',
        intro:
          'Updates workspace fields using multipart form fields, including optional metadata updates and image upload/removal.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateWorkspace(workspaceId: string) {
  const client = await wachtClient();
  return client.workspaces.updateWorkspace(workspaceId, {
    description: 'Updated workspace description',
    remove_image: true,
  });
}`,
        signature: `function updateWorkspace(
  workspaceId: string,
  request: UpdateWorkspaceRequest,
): Promise<Workspace>`,
        params: [
          { name: 'workspaceId', type: 'string', description: 'Stable workspace id.' },
          { name: 'request.name', type: 'string | undefined', description: 'Optional new workspace name.' },
          { name: 'request.description', type: 'string | undefined', description: 'Optional new workspace description.' },
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
          { name: 'request.remove_image', type: 'boolean | undefined', description: 'Remove existing workspace image when true.' },
          { name: 'request.workspace_image', type: 'File | Blob | undefined', description: 'Optional new workspace image upload.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Updates mutable workspace fields by id.',
              'Multipart payload supports metadata updates and image replacement/removal.',
            ],
          },
        ],
      },
{
        slug: 'delete-workspace',
        path: ['workspaces', 'delete-workspace'],
        title: 'deleteWorkspace()',
        description: 'Delete a workspace by id.',
        intro:
          'Deletes a workspace resource. This method resolves with no return value on success.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function deleteWorkspace(workspaceId: string) {
  const client = await wachtClient();
  await client.workspaces.deleteWorkspace(workspaceId);
}`,
        signature: `function deleteWorkspace(
  workspaceId: string,
): Promise<void>`,
        params: [
          { name: 'workspaceId', type: 'string', description: 'Stable workspace id to delete.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Deletes the target workspace and returns no payload.',
              'Callers should treat this operation as destructive and irreversible.',
            ],
          },
        ],
      },
{
        slug: 'list-workspace-members',
        path: ['workspaces', 'list-workspace-members'],
        title: 'listWorkspaceMembers()',
        description: 'List members in one workspace.',
        intro:
          'Returns paginated workspace members and forwards pagination, search, and sorting query params.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listWorkspaceMembers(workspaceId: string) {
  const client = await wachtClient();
  return client.workspaces.listWorkspaceMembers(workspaceId, {
    limit: 20,
    sort_key: 'created_at',
    sort_order: 'desc',
  });
}`,
        signature: `function listWorkspaceMembers(
  workspaceId: string,
  options?: ListWorkspaceMembersOptions,
): Promise<PaginatedResponse<WorkspaceMember>>`,
        params: [
          { name: 'workspaceId', type: 'string', description: 'Stable workspace id.' },
          { name: 'options.limit', type: 'number | undefined', description: 'Maximum members to return.' },
          { name: 'options.offset', type: 'number | undefined', description: 'Number of members to skip.' },
          { name: 'options.search', type: 'string | undefined', description: 'Search term forwarded to backend.' },
          { name: 'options.sort_key', type: 'string | undefined', description: 'Sort key forwarded to backend.' },
          { name: 'options.sort_order', type: "'asc' | 'desc' | undefined", description: 'Sort order for `sort_key`.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Lists members for one workspace with optional pagination and search.',
              'Use membership ids from this response for membership update/remove calls.',
            ],
          },
        ],
      },
{
        slug: 'add-workspace-member',
        path: ['workspaces', 'add-workspace-member'],
        title: 'addWorkspaceMember()',
        description: 'Add a user to a workspace.',
        intro:
          'Creates a workspace membership for a user with assigned role ids.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function addWorkspaceMember(workspaceId: string, userId: string, roleId: string) {
  const client = await wachtClient();
  return client.workspaces.addWorkspaceMember(workspaceId, {
    user_id: userId,
    role_ids: [roleId],
  });
}`,
        signature: `function addWorkspaceMember(
  workspaceId: string,
  request: AddWorkspaceMemberRequest,
): Promise<WorkspaceMember>`,
        paramsTitle: 'AddWorkspaceMemberRequest',
        params: [
          { name: 'workspaceId', type: 'string', description: 'Target workspace id.' },
          { name: 'user_id', type: 'string', description: 'User id to add to the workspace.' },
          { name: 'role_ids', type: 'string[]', description: 'Workspace role ids assigned to this membership.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Creates a workspace membership binding a user to one or more workspace roles.',
              'Returns the created membership object.',
            ],
          },
        ],
      },
{
        slug: 'list-workspace-roles',
        path: ['workspaces', 'list-workspace-roles'],
        title: 'listWorkspaceRoles()',
        description: 'List roles for one workspace.',
        intro:
          'Returns workspace roles scoped to one workspace id.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listWorkspaceRoles(workspaceId: string) {
  const client = await wachtClient();
  return client.workspaces.listWorkspaceRoles(workspaceId);
}`,
        signature: `function listWorkspaceRoles(
  workspaceId: string,
): Promise<PaginatedResponse<WorkspaceRole>>`,
        params: [
          { name: 'workspaceId', type: 'string', description: 'Target workspace id.' },
        ],
        api: [
          { name: 'data', type: 'WorkspaceRole[]', description: 'Workspace role rows.' },
          { name: 'total', type: 'number', description: 'Total number of workspace roles matching the current query.' },
          { name: 'limit', type: 'number | undefined', description: 'Effective page size from backend response.' },
          { name: 'offset', type: 'number | undefined', description: 'Effective page offset from backend response.' },
        ],
        sections: [
          {
            title: 'Behavior',
            points: [
              'Lists role definitions scoped to a workspace.',
              'Use role ids from this response in membership assignment flows.',
            ],
          },
        ],
      },
{
        slug: 'create-workspace-role',
        path: ['workspaces', 'create-workspace-role'],
        title: 'createWorkspaceRole()',
        description: 'Create a role under one workspace.',
        intro:
          'Creates a workspace role with name and permissions.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createWorkspaceRole(workspaceId: string) {
  const client = await wachtClient();
  return client.workspaces.createWorkspaceRole(workspaceId, {
    name: 'moderator',
    permissions: ['workspaces.members.read'],
  });
}`,
        signature: `function createWorkspaceRole(
  workspaceId: string,
  request: CreateWorkspaceRoleRequest,
): Promise<WorkspaceRole>`,
        paramsTitle: 'CreateWorkspaceRoleRequest',
        params: [
          { name: 'workspaceId', type: 'string', description: 'Target workspace id.' },
          { name: 'name', type: 'string', description: 'Role display name.' },
          { name: 'permissions', type: 'string[]', description: 'Permission identifiers for this role.' },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Created workspace role id.' },
          { name: 'name', type: 'string', description: 'Created role display name.' },
          { name: 'permissions', type: 'string[]', description: 'Permissions attached to this role.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Operates on workspace-scoped role definitions.',
          'Validate required fields before calling to avoid predictable request failures.',
        ],
      },
    ],
  },
];
