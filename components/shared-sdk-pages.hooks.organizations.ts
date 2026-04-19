import type { SharedGroup } from './shared-sdk-pages.types';

export const organizationsHookGroup: SharedGroup = {
    label: 'Multi tenancy',
    docs: [
      {
        slug: 'use-organization-list',
        title: 'useOrganizationList',
        description: 'List the organizations available to the current user.',
        importName: 'useOrganizationList',
        intro:
          '`useOrganizationList()` is the broad organization-management hook built on top of `useOrganizationMemberships()`. It derives the organization list from the current user’s memberships, then layers the organization-level management actions on top of that list: members, invitations, domains, roles, enterprise connections, SCIM tokens, and organization creation or deletion.',
        example: `export default function OrganizationPicker() {
  const { organizations, loading } = useOrganizationList();

  if (loading) {
    return <p>Loading organizations…</p>;
  }

  return (
    <ul>
      {organizations?.map((organization) => (
        <li key={organization.id}>{organization.name}</li>
      ))}
    </ul>
  );
}`,
        points: [],
        signature: `declare function useOrganizationList(): {
  organizations: Organization[] | undefined;
  loading: boolean;
  error: null;
  refetch: () => Promise<void>;
  leaveOrganization: (organization: Organization) => Promise<void>;
  getOrganizationRoles: (organization: Organization) => Promise<OrganizationRole[]>;
  getOrganizationMembers: (organization: Organization, params?: { page: number; limit: number; search?: string }) => Promise<PaginatedResponse<OrganizationMembership[]>>;
  removeOrganizationMember: (organization: Organization, member: OrganizationMembership) => Promise<void>;
  createOrganization: (organization: NewOrgnization) => Promise<ApiResult<{ organization: Organization; membership: OrganizationMembership }>>;
  getOrganizationInvitations: (organization: Organization) => Promise<OrganizationInvitation[]>;
  getOrganizationDomains: (organization: Organization) => Promise<OrganizationDomain[]>;
  addOrganizationDomain: (organization: Organization, domain: NewDomain) => Promise<ApiResult<OrganizationDomain>>;
  verifyOrganizationDomain: (organization: Organization, domain: OrganizationDomain) => Promise<ApiResult<OrganizationDomain>>;
  removeOrganizationDomain: (organization: Organization, domain: OrganizationDomain) => Promise<ApiResult<OrganizationDomain>>;
  addRoleToOrganizationMember: (organization: Organization, member: OrganizationMembership, role: OrganizationRole) => Promise<OrganizationMembership>;
  removeRoleFromOrganizationMember: (organization: Organization, member: OrganizationMembership, role: OrganizationRole) => Promise<OrganizationMembership>;
  inviteOrganizationMember: (organization: Organization, invitation: OrganizationInvitationPayload) => Promise<OrganizationInvitation>;
  discardOrganizationInvitation: (organization: Organization, invitation: OrganizationInvitation) => Promise<OrganizationInvitation>;
  resendOrganizationInvitation: (organization: Organization, invitation: OrganizationInvitation) => Promise<OrganizationInvitation>;
  updateOrganization: (organization: Organization, update: OrganizationUpdate) => Promise<ApiResult<Organization>>;
  addRole: (organization: Organization, newRole: RoleCreate) => Promise<ApiResult<OrganizationRole>>;
  removeOrganizationRoles: (organization: Organization, role: OrganizationRole) => Promise<void>;
  deleteOrganization: (organization: Organization) => Promise<void>;
  getEnterpriseConnections: (organization: Organization) => Promise<EnterpriseConnection[]>;
  createEnterpriseConnection: (organization: Organization, payload: CreateEnterpriseConnectionPayload) => Promise<EnterpriseConnection>;
  updateEnterpriseConnection: (organization: Organization, connectionId: string, payload: UpdateEnterpriseConnectionPayload) => Promise<EnterpriseConnection>;
  deleteEnterpriseConnection: (organization: Organization, connectionId: string) => Promise<void>;
  testEnterpriseConnectionConfig: (organization: Organization, payload: { protocol: 'saml' | 'oidc'; idp_entity_id?: string; idp_sso_url?: string; idp_certificate?: string; oidc_issuer_url?: string; oidc_client_id?: string; oidc_client_secret?: string }) => Promise<{ success: boolean; protocol: string; checks: Record<string, boolean>; errors?: Record<string, string> }>;
  testEnterpriseConnection: (organization: Organization, connectionId: string) => Promise<{ success: boolean; protocol: string; checks: Record<string, boolean>; errors?: Record<string, string> }>;
  generateSCIMToken: (organization: Organization, connectionId: string) => Promise<SCIMTokenInfo>;
  getSCIMToken: (organization: Organization, connectionId: string) => Promise<SCIMTokenInfo>;
  revokeSCIMToken: (organization: Organization, connectionId: string) => Promise<void>;
};`,
        api: [
          {
            name: 'organizations',
            type: 'Organization[] | undefined',
            required: true,
            description: 'Organizations derived from the current user’s organization memberships.',
            children: [
              {
                name: '[].id',
                type: 'string',
                description: 'Organization identifier.',
              },
              {
                name: '[].name',
                type: 'string',
                description: 'Organization name.',
              },
              {
                name: '[].image_url',
                type: 'string',
                description: 'Organization image URL.',
              },
              {
                name: '[].description',
                type: 'string',
                description: 'Organization description.',
              },
              {
                name: '[].member_count',
                type: 'number',
                description: 'Organization member count.',
              },
              {
                name: '[].enforce_mfa',
                type: 'boolean',
                description: 'Whether the organization enforces MFA.',
              },
              {
                name: '[].enable_ip_restriction',
                type: 'boolean',
                description: 'Whether the organization uses IP restrictions.',
              },
              {
                name: '[].whitelisted_ips',
                type: 'string[]',
                description: 'Whitelisted IP addresses for the organization.',
              },
              {
                name: '[].auto_assigned_workspace_id',
                type: 'string',
                description: 'Workspace automatically assigned for new members when configured.',
              },
            ],
          },
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the organization memberships query is still loading.',
          },
          {
            name: 'error',
            type: 'null',
            required: true,
            description: 'This hook currently hardcodes `null` instead of exposing the underlying membership-query error.',
          },
          {
            name: 'refetch',
            type: '() => Promise<void>',
            required: true,
            description: 'Revalidates the underlying organization memberships query.',
          },
          {
            name: 'createOrganization',
            type: '(organization: NewOrgnization) => Promise<ApiResult<{ organization: Organization; membership: OrganizationMembership }>>',
            required: true,
            description: 'Creates a new organization and refreshes both the organization list and the current session.',
            children: [
              {
                name: 'organization.name',
                type: 'string',
                description: 'Organization name.',
              },
              {
                name: 'organization.description',
                type: 'string | undefined',
                description: 'Optional organization description.',
              },
              {
                name: 'organization.image',
                type: 'File | undefined',
                description: 'Optional organization image.',
              },
            ],
          },
          {
            name: 'updateOrganization',
            type: '(organization: Organization, update: OrganizationUpdate) => Promise<ApiResult<Organization>>',
            required: true,
            description: 'Updates one organization and refreshes the membership-derived list.',
          },
          {
            name: 'deleteOrganization',
            type: '(organization: Organization) => Promise<void>',
            required: true,
            description: 'Deletes an organization, clears token cache, and refreshes both the list and the current session.',
          },
          {
            name: 'leaveOrganization',
            type: '(organization: Organization) => Promise<void>',
            required: true,
            description: 'Leaves an organization as the current user.',
          },
          {
            name: 'getOrganizationMembers',
            type: '(organization: Organization, params?: { page: number; limit: number; search?: string }) => Promise<PaginatedResponse<OrganizationMembership[]>>',
            required: true,
            description: 'Loads organization members, optionally with pagination and search.',
          },
          {
            name: 'removeOrganizationMember',
            type: '(organization: Organization, member: OrganizationMembership) => Promise<void>',
            required: true,
            description: 'Removes one member from an organization.',
          },
          {
            name: 'getOrganizationRoles',
            type: '(organization: Organization) => Promise<OrganizationRole[]>',
            required: true,
            description: 'Loads the role definitions for an organization.',
          },
          {
            name: 'addRole',
            type: '(organization: Organization, newRole: RoleCreate) => Promise<ApiResult<OrganizationRole>>',
            required: true,
            description: 'Creates a custom organization role.',
          },
          {
            name: 'removeOrganizationRoles',
            type: '(organization: Organization, role: OrganizationRole) => Promise<void>',
            required: true,
            description: 'Removes one organization role.',
          },
          {
            name: 'addRoleToOrganizationMember',
            type: '(organization: Organization, member: OrganizationMembership, role: OrganizationRole) => Promise<OrganizationMembership>',
            required: true,
            description: 'Adds a role to a specific organization member.',
          },
          {
            name: 'removeRoleFromOrganizationMember',
            type: '(organization: Organization, member: OrganizationMembership, role: OrganizationRole) => Promise<OrganizationMembership>',
            required: true,
            description: 'Removes a role from a specific organization member.',
          },
          {
            name: 'getOrganizationInvitations',
            type: '(organization: Organization) => Promise<OrganizationInvitation[]>',
            required: true,
            description: 'Loads pending invitations for an organization.',
          },
          {
            name: 'inviteOrganizationMember',
            type: '(organization: Organization, invitation: OrganizationInvitationPayload) => Promise<OrganizationInvitation>',
            required: true,
            description: 'Invites a user into an organization, optionally into a workspace with a workspace role.',
          },
          {
            name: 'discardOrganizationInvitation',
            type: '(organization: Organization, invitation: OrganizationInvitation) => Promise<OrganizationInvitation>',
            required: true,
            description: 'Discards a pending organization invitation.',
          },
          {
            name: 'resendOrganizationInvitation',
            type: '(organization: Organization, invitation: OrganizationInvitation) => Promise<OrganizationInvitation>',
            required: true,
            description: 'Resends a pending organization invitation.',
          },
          {
            name: 'getOrganizationDomains',
            type: '(organization: Organization) => Promise<OrganizationDomain[]>',
            required: true,
            description: 'Loads verified and unverified organization domains.',
          },
          {
            name: 'addOrganizationDomain',
            type: '(organization: Organization, domain: NewDomain) => Promise<ApiResult<OrganizationDomain>>',
            required: true,
            description: 'Adds a new domain to an organization.',
          },
          {
            name: 'verifyOrganizationDomain',
            type: '(organization: Organization, domain: OrganizationDomain) => Promise<ApiResult<OrganizationDomain>>',
            required: true,
            description: 'Verifies one organization domain.',
          },
          {
            name: 'removeOrganizationDomain',
            type: '(organization: Organization, domain: OrganizationDomain) => Promise<ApiResult<OrganizationDomain>>',
            required: true,
            description: 'Removes one organization domain.',
          },
          {
            name: 'getEnterpriseConnections',
            type: '(organization: Organization) => Promise<EnterpriseConnection[]>',
            required: true,
            description: 'Loads enterprise SSO connections for an organization.',
          },
          {
            name: 'createEnterpriseConnection',
            type: '(organization: Organization, payload: CreateEnterpriseConnectionPayload) => Promise<EnterpriseConnection>',
            required: true,
            description: 'Creates a new enterprise SSO connection.',
          },
          {
            name: 'updateEnterpriseConnection',
            type: '(organization: Organization, connectionId: string, payload: UpdateEnterpriseConnectionPayload) => Promise<EnterpriseConnection>',
            required: true,
            description: 'Updates an existing enterprise SSO connection.',
          },
          {
            name: 'deleteEnterpriseConnection',
            type: '(organization: Organization, connectionId: string) => Promise<void>',
            required: true,
            description: 'Deletes an enterprise SSO connection.',
          },
          {
            name: 'testEnterpriseConnectionConfig',
            type: "(organization: Organization, payload: { protocol: 'saml' | 'oidc'; idp_entity_id?: string; idp_sso_url?: string; idp_certificate?: string; oidc_issuer_url?: string; oidc_client_id?: string; oidc_client_secret?: string }) => Promise<{ success: boolean; protocol: string; checks: Record<string, boolean>; errors?: Record<string, string> }>",
            required: true,
            description: 'Tests an enterprise-connection configuration before it is saved.',
          },
          {
            name: 'testEnterpriseConnection',
            type: '(organization: Organization, connectionId: string) => Promise<{ success: boolean; protocol: string; checks: Record<string, boolean>; errors?: Record<string, string> }>',
            required: true,
            description: 'Tests an existing enterprise connection.',
          },
          {
            name: 'generateSCIMToken',
            type: '(organization: Organization, connectionId: string) => Promise<SCIMTokenInfo>',
            required: true,
            description: 'Generates a SCIM token for one enterprise connection.',
          },
          {
            name: 'getSCIMToken',
            type: '(organization: Organization, connectionId: string) => Promise<SCIMTokenInfo>',
            required: true,
            description: 'Loads the current SCIM token information.',
          },
          {
            name: 'revokeSCIMToken',
            type: '(organization: Organization, connectionId: string) => Promise<void>',
            required: true,
            description: 'Revokes the SCIM token for one enterprise connection.',
          },
        ],
        details: [
          'This hook does not fetch a dedicated organization list endpoint. It derives `organizations` from `useOrganizationMemberships()`, so the list only contains organizations the current user is actually a member of.',
          'The management methods are organization-scoped helpers layered on top of that membership-derived list. That is why most methods take an `organization` object as their first argument.',
          'The hook mixes read helpers and mutation helpers. It is useful for admin or management UI, but it is broader than the hooks you want for a simple picker or active-scope display.',
          'Creation and deletion clear token or session-adjacent state and refetch shared queries because those actions can change the user’s active scope and available memberships.',
          'The current implementation hardcodes `error: null` instead of exposing the underlying membership query error. The docs reflect that behavior as it exists today.',
        ],
        examples: [
          {
            title: 'Render the organization list',
            code: `export default function OrganizationList() {
  const { organizations, loading } = useOrganizationList();

  if (loading) {
    return <p>Loading organizations…</p>;
  }

  return (
    <ul>
      {organizations?.map((organization) => (
        <li key={organization.id}>{organization.name}</li>
      ))}
    </ul>
  );
}`,
          },
          {
            title: 'Create a new organization',
            code: `export default function CreateOrgButton() {
  const { createOrganization } = useOrganizationList();

  async function create() {
    await createOrganization({
      name: 'Acme',
      description: 'Customer-facing workspace',
    });
  }

  return <button onClick={create}>Create organization</button>;
}`,
          },
          {
            title: 'Load organization members',
            code: `export default function LoadMembers() {
  const { organizations, getOrganizationMembers } = useOrganizationList();

  async function load() {
    const organization = organizations?.[0];
    if (!organization) {
      return;
    }

    const result = await getOrganizationMembers(organization, {
      page: 1,
      limit: 20,
    });

    console.log(result.items);
  }

  return <button onClick={load}>Load members</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-active-organization',
        title: 'useActiveOrganization',
        description: 'Read the currently active organization.',
        importName: 'useActiveOrganization',
        intro:
          '`useActiveOrganization()` is the active-scope wrapper over `useOrganizationList()`. It resolves the current active organization and active organization membership from the session, then rebinds the organization-level management methods so they operate on that active organization automatically.',
        example: `export default function ActiveOrgHeader() {
  const { activeOrganization, loading } = useActiveOrganization();

  if (loading) {
    return <p>Loading organization…</p>;
  }

  return <p>{activeOrganization?.name ?? 'No active organization'}</p>;
}`,
        points: [],
        signature: `declare function useActiveOrganization():
  | {
      activeOrganization: null;
      activeMembership: null;
      loading: true;
      error: Error | null;
      updateOrganization: never;
      getRoles: never;
      getMembers: never;
      getDomains: never;
      addDomain: never;
      verifyDomain: never;
      removeDomain: never;
      removeRole: never;
      getInvitations: never;
      removeMember: never;
      addMemberRole: never;
      removeMemberRole: never;
      inviteMember: never;
      discardInvitation: never;
      resendInvitation: never;
      leave: never;
      getEnterpriseConnections: never;
      createEnterpriseConnection: never;
      updateEnterpriseConnection: never;
      deleteEnterpriseConnection: never;
      generateSCIMToken: never;
      getSCIMToken: never;
      revokeSCIMToken: never;
    }
  | {
      activeOrganization: Organization | null;
      activeMembership: OrganizationMembershipWithOrganization | null;
      loading: false;
      refetch: () => Promise<void>;
      getRoles: () => Promise<OrganizationRole[]>;
      updateOrganization: (update: OrganizationUpdate) => Promise<ApiResult<Organization> | []>;
      getMembers: () => Promise<PaginatedResponse<OrganizationMembership[]> | []>;
      getDomains: () => Promise<OrganizationDomain[] | []>;
      addDomain: (domain: NewDomain) => Promise<ApiResult<OrganizationDomain> | undefined>;
      verifyDomain: (domain: OrganizationDomain) => Promise<ApiResult<OrganizationDomain> | undefined>;
      removeDomain: (domain: OrganizationDomain) => Promise<ApiResult<OrganizationDomain> | undefined>;
      getInvitations: () => Promise<OrganizationInvitation[] | []>;
      removeMember: (member: OrganizationMembership) => Promise<void | []>;
      leave: () => Promise<void | undefined>;
      removeRole: (role: OrganizationRole) => Promise<void | undefined>;
      addMemberRole: (member: OrganizationMembership, role: OrganizationRole) => Promise<OrganizationMembership | undefined>;
      removeMemberRole: (member: OrganizationMembership, role: OrganizationRole) => Promise<OrganizationMembership | undefined>;
      inviteMember: (invitationPayload: OrganizationInvitationPayload) => Promise<OrganizationInvitation | undefined>;
      discardInvitation: (invitation: OrganizationInvitation) => Promise<OrganizationInvitation | undefined>;
      resendInvitation: (invitation: OrganizationInvitation) => Promise<OrganizationInvitation | undefined>;
      getEnterpriseConnections: () => Promise<EnterpriseConnection[] | []>;
      createEnterpriseConnection: (payload: CreateEnterpriseConnectionPayload) => Promise<EnterpriseConnection | undefined>;
      updateEnterpriseConnection: (connectionId: string, payload: UpdateEnterpriseConnectionPayload) => Promise<EnterpriseConnection | undefined>;
      deleteEnterpriseConnection: (connectionId: string) => Promise<void | undefined>;
      testEnterpriseConnectionConfig: (payload: { protocol: 'saml' | 'oidc'; idp_entity_id?: string; idp_sso_url?: string; idp_certificate?: string; oidc_issuer_url?: string; oidc_client_id?: string; oidc_client_secret?: string }) => Promise<{ success: boolean; protocol: string; checks: Record<string, boolean>; errors?: Record<string, string> } | null>;
      testEnterpriseConnection: (connectionId: string) => Promise<{ success: boolean; protocol: string; checks: Record<string, boolean>; errors?: Record<string, string> } | null>;
      generateSCIMToken: (connectionId: string) => Promise<SCIMTokenInfo | undefined>;
      getSCIMToken: (connectionId: string) => Promise<SCIMTokenInfo | undefined>;
      revokeSCIMToken: (connectionId: string) => Promise<void | undefined>;
      error: null;
    };`,
        api: [
          {
            name: 'activeOrganization',
            type: 'Organization | null',
            required: true,
            description: 'Organization whose membership identifier matches the active sign-in in the session.',
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
              {
                name: 'image_url',
                type: 'string',
                description: 'Organization image URL.',
              },
              {
                name: 'description',
                type: 'string',
                description: 'Organization description.',
              },
              {
                name: 'member_count',
                type: 'number',
                description: 'Organization member count.',
              },
              {
                name: 'enforce_mfa',
                type: 'boolean',
                description: 'Whether the organization enforces MFA.',
              },
            ],
          },
          {
            name: 'activeMembership',
            type: 'OrganizationMembershipWithOrganization | null',
            required: true,
            description: 'Current active organization membership resolved from the session.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Organization-membership identifier.',
              },
              {
                name: 'organization',
                type: 'Organization',
                description: 'Organization attached to the active membership.',
              },
              {
                name: 'roles',
                type: 'OrganizationRole[]',
                description: 'Roles attached to the active membership.',
                children: [
                  {
                    name: '[].id',
                    type: 'string',
                    description: 'Role identifier.',
                  },
                  {
                    name: '[].name',
                    type: 'string',
                    description: 'Role name.',
                  },
                  {
                    name: '[].permissions',
                    type: 'string[]',
                    description: 'Permissions granted by the role.',
                  },
                ],
              },
              {
                name: 'eligibility_restriction',
                type: '{ type: "none" | "ip_not_allowed" | "mfa_required" | "ip_and_mfa_required"; message: string } | undefined',
                description: 'Eligibility restriction attached to the membership when one exists.',
              },
            ],
          },
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the session or the underlying organization list is still loading.',
          },
          {
            name: 'error',
            type: 'Error | null',
            required: true,
            description: 'Combined loading error from the session branch or the organization-list branch.',
          },
          {
            name: 'refetch',
            type: '() => Promise<void>',
            description: 'Revalidates the underlying organization memberships query.',
          },
          {
            name: 'getRoles',
            type: '() => Promise<OrganizationRole[]>',
            description: 'Loads roles for the active organization.',
          },
          {
            name: 'getMembers',
            type: '() => Promise<PaginatedResponse<OrganizationMembership[]> | []>',
            description: 'Loads members for the active organization.',
          },
          {
            name: 'updateOrganization',
            type: '(update: OrganizationUpdate) => Promise<ApiResult<Organization> | []>',
            description: 'Updates the active organization.',
          },
          {
            name: 'getDomains',
            type: '() => Promise<OrganizationDomain[] | []>',
            description: 'Loads domains for the active organization.',
          },
          {
            name: 'addDomain',
            type: '(domain: NewDomain) => Promise<ApiResult<OrganizationDomain> | undefined>',
            description: 'Adds a domain to the active organization.',
          },
          {
            name: 'verifyDomain',
            type: '(domain: OrganizationDomain) => Promise<ApiResult<OrganizationDomain> | undefined>',
            description: 'Verifies one domain on the active organization.',
          },
          {
            name: 'removeDomain',
            type: '(domain: OrganizationDomain) => Promise<ApiResult<OrganizationDomain> | undefined>',
            description: 'Removes one domain from the active organization.',
          },
          {
            name: 'getInvitations',
            type: '() => Promise<OrganizationInvitation[] | []>',
            description: 'Loads invitations for the active organization.',
          },
          {
            name: 'removeMember',
            type: '(member: OrganizationMembership) => Promise<void | []>',
            description: 'Removes a member from the active organization.',
          },
          {
            name: 'addMemberRole',
            type: '(member: OrganizationMembership, role: OrganizationRole) => Promise<OrganizationMembership | undefined>',
            description: 'Adds a role to a member in the active organization.',
          },
          {
            name: 'removeMemberRole',
            type: '(member: OrganizationMembership, role: OrganizationRole) => Promise<OrganizationMembership | undefined>',
            description: 'Removes a role from a member in the active organization.',
          },
          {
            name: 'inviteMember',
            type: '(invitationPayload: OrganizationInvitationPayload) => Promise<OrganizationInvitation | undefined>',
            description: 'Invites a member into the active organization.',
          },
          {
            name: 'discardInvitation',
            type: '(invitation: OrganizationInvitation) => Promise<OrganizationInvitation | undefined>',
            description: 'Discards an invitation from the active organization.',
          },
          {
            name: 'resendInvitation',
            type: '(invitation: OrganizationInvitation) => Promise<OrganizationInvitation | undefined>',
            description: 'Resends an invitation from the active organization.',
          },
          {
            name: 'leave',
            type: '() => Promise<void | undefined>',
            description: 'Leaves the active organization.',
          },
          {
            name: 'removeRole',
            type: '(role: OrganizationRole) => Promise<void | undefined>',
            description: 'Removes a role from the active organization.',
          },
          {
            name: 'getEnterpriseConnections',
            type: '() => Promise<EnterpriseConnection[] | []>',
            description: 'Loads enterprise connections for the active organization.',
          },
          {
            name: 'createEnterpriseConnection',
            type: '(payload: CreateEnterpriseConnectionPayload) => Promise<EnterpriseConnection | undefined>',
            description: 'Creates an enterprise connection on the active organization.',
          },
          {
            name: 'updateEnterpriseConnection',
            type: '(connectionId: string, payload: UpdateEnterpriseConnectionPayload) => Promise<EnterpriseConnection | undefined>',
            description: 'Updates an enterprise connection on the active organization.',
          },
          {
            name: 'deleteEnterpriseConnection',
            type: '(connectionId: string) => Promise<void | undefined>',
            description: 'Deletes an enterprise connection on the active organization.',
          },
          {
            name: 'testEnterpriseConnectionConfig',
            type: "(payload: { protocol: 'saml' | 'oidc'; idp_entity_id?: string; idp_sso_url?: string; idp_certificate?: string; oidc_issuer_url?: string; oidc_client_id?: string; oidc_client_secret?: string }) => Promise<{ success: boolean; protocol: string; checks: Record<string, boolean>; errors?: Record<string, string> } | null>",
            description: 'Tests an enterprise-connection configuration for the active organization.',
          },
          {
            name: 'testEnterpriseConnection',
            type: '(connectionId: string) => Promise<{ success: boolean; protocol: string; checks: Record<string, boolean>; errors?: Record<string, string> } | null>',
            description: 'Tests an existing enterprise connection on the active organization.',
          },
          {
            name: 'generateSCIMToken',
            type: '(connectionId: string) => Promise<SCIMTokenInfo | undefined>',
            description: 'Generates a SCIM token for an enterprise connection on the active organization.',
          },
          {
            name: 'getSCIMToken',
            type: '(connectionId: string) => Promise<SCIMTokenInfo | undefined>',
            description: 'Loads SCIM token information for an enterprise connection on the active organization.',
          },
          {
            name: 'revokeSCIMToken',
            type: '(connectionId: string) => Promise<void | undefined>',
            description: 'Revokes the SCIM token for an enterprise connection on the active organization.',
          },
        ],
        details: [
          'This hook is not a separate data source. It wraps `useOrganizationList()` and `useSession()`, then resolves one active organization and one active membership from the current session.',
          'All of the management methods are rebound to the current active organization, so callers no longer pass an `organization` argument each time.',
          'When there is no active organization, many methods return `[]`, `null`, or `undefined` instead of throwing. The docs reflect that behavior because it is part of the current implementation contract.',
          'The loading branch is a true union. While either the session or the organization list is still loading, the mutation methods are unavailable.',
          'This is the right hook for organization-aware pages such as settings, members, invitations, domains, and enterprise SSO screens that should always operate on the active organization only.',
        ],
        examples: [
          {
            title: 'Render the active organization name',
            code: `export default function ActiveOrganizationTitle() {
  const { activeOrganization, loading } = useActiveOrganization();

  if (loading) {
    return <p>Loading organization…</p>;
  }

  return <p>{activeOrganization?.name ?? 'No active organization'}</p>;
}`,
          },
          {
            title: 'Load members for the active organization',
            code: `export default function ActiveOrganizationMembers() {
  const { loading, getMembers } = useActiveOrganization();

  async function loadMembers() {
    if (loading) {
      return;
    }

    const result = await getMembers();
    console.log(result);
  }

  return <button onClick={loadMembers}>Load members</button>;
}`,
          },
          {
            title: 'Invite a member into the active organization',
            code: `export default function InviteMemberButton() {
  const { loading, inviteMember } = useActiveOrganization();

  async function invite() {
    if (loading) {
      return;
    }

    await inviteMember({
      email: 'jane@example.com',
      organizationRole: {
        id: 'role_123',
        organization_id: 'org_123',
        name: 'Admin',
        permissions: ['org:manage'],
        created_at: '',
        updated_at: '',
      },
    });
  }

  return <button onClick={invite}>Invite member</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-active-tenancy',
        title: 'useActiveTenancy',
        description: 'Read the current tenancy scope across organizations and workspaces.',
        importName: 'useActiveTenancy',
        intro:
          '`useActiveTenancy()` resolves the current active organization membership and workspace membership from the active sign-in in the session. It is the broadest “where am I scoped right now?” hook in the multi-tenancy layer.',
        example: `export default function ActiveTenancySummary() {
  const { loading, orgMembership, workspaceMembership } = useActiveTenancy();

  if (loading) {
    return <p>Loading tenancy…</p>;
  }

  return (
    <div>
      <p>Organization: {orgMembership?.organization.name ?? 'None'}</p>
      <p>Workspace: {workspaceMembership?.workspace.name ?? 'None'}</p>
    </div>
  );
}`,
        points: [],
        signature: `declare function useActiveTenancy(): {
  loading: boolean;
  orgMembership: OrganizationMembership | null;
  workspaceMembership: WorkspaceMembership | null;
};`,
        api: [
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the session, organization memberships, or workspace memberships are still loading.',
          },
          {
            name: 'orgMembership',
            type: 'OrganizationMembership | null',
            required: true,
            description: 'Organization membership whose identifier matches the active sign-in in the session.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Organization-membership identifier.',
              },
              {
                name: 'organization',
                type: 'Organization',
                description: 'Organization attached to the active membership.',
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
                  {
                    name: 'image_url',
                    type: 'string',
                    description: 'Organization image URL.',
                  },
                  {
                    name: 'description',
                    type: 'string',
                    description: 'Organization description.',
                  },
                  {
                    name: 'member_count',
                    type: 'number',
                    description: 'Organization member count.',
                  },
                  {
                    name: 'enforce_mfa',
                    type: 'boolean',
                    description: 'Whether the organization enforces MFA.',
                  },
                  {
                    name: 'enable_ip_restriction',
                    type: 'boolean',
                    description: 'Whether the organization uses IP restrictions.',
                  },
                ],
              },
              {
                name: 'user',
                type: 'PublicUserData',
                description: 'Public user data for the membership owner.',
                children: [
                  {
                    name: 'id',
                    type: 'string',
                    description: 'User identifier.',
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
              {
                name: 'roles',
                type: 'OrganizationRole[]',
                description: 'Roles attached to the membership.',
                children: [
                  {
                    name: '[].id',
                    type: 'string',
                    description: 'Role identifier.',
                  },
                  {
                    name: '[].name',
                    type: 'string',
                    description: 'Role name.',
                  },
                  {
                    name: '[].permissions',
                    type: 'string[]',
                    description: 'Permissions granted by the role.',
                  },
                ],
              },
              {
                name: 'public_metadata',
                type: 'Record<string, unknown>',
                description: 'Public metadata stored on the membership.',
              },
              {
                name: 'created_at',
                type: 'string',
                description: 'Creation timestamp for the membership.',
              },
              {
                name: 'updated_at',
                type: 'string',
                description: 'Last update timestamp for the membership.',
              },
            ],
          },
          {
            name: 'workspaceMembership',
            type: 'WorkspaceMembership | null',
            required: true,
            description: 'Workspace membership whose identifier matches the active sign-in in the session.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Workspace-membership identifier.',
              },
              {
                name: 'workspace',
                type: 'Workspace',
                description: 'Workspace attached to the active membership.',
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
                  {
                    name: 'image_url',
                    type: 'string',
                    description: 'Workspace image URL.',
                  },
                  {
                    name: 'description',
                    type: 'string',
                    description: 'Workspace description.',
                  },
                  {
                    name: 'member_count',
                    type: 'number',
                    description: 'Workspace member count.',
                  },
                  {
                    name: 'enforce_2fa',
                    type: 'boolean',
                    description: 'Whether the workspace enforces 2FA.',
                  },
                  {
                    name: 'enable_ip_restriction',
                    type: 'boolean',
                    description: 'Whether the workspace uses IP restrictions.',
                  },
                ],
              },
              {
                name: 'organization',
                type: 'Organization',
                description: 'Parent organization for the workspace membership.',
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
                name: 'roles',
                type: 'WorkspaceRole[]',
                description: 'Roles attached to the workspace membership.',
                children: [
                  {
                    name: '[].id',
                    type: 'string',
                    description: 'Role identifier.',
                  },
                  {
                    name: '[].name',
                    type: 'string',
                    description: 'Role name.',
                  },
                  {
                    name: '[].permissions',
                    type: 'string[]',
                    description: 'Permissions granted by the role.',
                  },
                ],
              },
              {
                name: 'eligibility_restriction',
                type: '{ type: "none" | "ip_not_allowed" | "mfa_required" | "ip_and_mfa_required"; message: string } | undefined',
                description: 'Eligibility restriction attached to the membership when one exists.',
                children: [
                  {
                    name: 'type',
                    type: '"none" | "ip_not_allowed" | "mfa_required" | "ip_and_mfa_required"',
                    description: 'Restriction type.',
                  },
                  {
                    name: 'message',
                    type: 'string',
                    description: 'Restriction message.',
                  },
                ],
              },
            ],
          },
        ],
        details: [
          'The hook does not fetch a separate “active tenancy” resource. It derives the active organization and workspace memberships by matching the active sign-in in the session against the full membership lists.',
          'That means the hook only becomes useful once both the session and the relevant membership collections have loaded.',
          'If the current session has no sign-ins, or if the active membership identifiers do not match any loaded membership rows, the hook returns `null` for that side of the scope.',
          'This hook is the right fit for UI that needs to work across both tenancy models at once. If a page only cares about one model, `useActiveOrganization()` or `useActiveWorkspace()` is usually a tighter fit.',
        ],
        examples: [
          {
            title: 'Render the current organization and workspace scope',
            code: `export default function TenancyHeader() {
  const { loading, orgMembership, workspaceMembership } = useActiveTenancy();

  if (loading) {
    return <p>Loading tenancy…</p>;
  }

  return (
    <div>
      <p>Organization: {orgMembership?.organization.name ?? 'None'}</p>
      <p>Workspace: {workspaceMembership?.workspace.name ?? 'None'}</p>
    </div>
  );
}`,
          },
          {
            title: 'Gate UI that needs any active tenancy scope',
            code: `export default function TenancyGate() {
  const { loading, orgMembership, workspaceMembership } = useActiveTenancy();

  if (loading) {
    return null;
  }

  if (!orgMembership && !workspaceMembership) {
    return <p>Select a workspace or organization first.</p>;
  }

  return <p>Tenancy ready.</p>;
}`,
          },
        ],
      },
      {
        slug: 'use-workspace-list',
        title: 'useWorkspaceList',
        description: 'List the workspaces available to the current user.',
        importName: 'useWorkspaceList',
        intro:
          '`useWorkspaceList()` is the broad workspace-management hook built on top of `useWorkspaceMemberships()`. It derives the workspace list from the current user’s workspace memberships, then layers workspace-level management actions on top of that list: members, roles, invitations, updates, and deletion.',
        example: `export default function WorkspacePicker() {
  const { workspaces, loading } = useWorkspaceList();

  if (loading) {
    return <p>Loading workspaces…</p>;
  }

  return (
    <ul>
      {workspaces.map((workspace) => (
        <li key={workspace.id}>{workspace.name}</li>
      ))}
    </ul>
  );
}`,
        points: [],
        signature: `declare function useWorkspaceList(): {
  workspaces: WorkspaceWithOrganization[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  leaveWorkspace: (id: string, userId: string) => Promise<void>;
  createWorkspace: (organizationId: string, name: string, image?: File, description?: string) => Promise<{ workspace: Workspace; membership: WorkspaceMembership }>;
  updateWorkspace: (workspace: Workspace, data: { name?: string; description?: string; image?: File; enforce_2fa?: boolean; enable_ip_restriction?: boolean; whitelisted_ips?: string[] }) => Promise<unknown>;
  deleteWorkspace: (workspace: Workspace) => Promise<unknown>;
  getWorkspaceMembers: (workspace: Workspace, params?: { page: number; limit: number; search?: string }) => Promise<PaginatedResponse<WorkspaceMembership[]>>;
  getWorkspaceRoles: (workspace: Workspace) => Promise<WorkspaceRole[]>;
  createWorkspaceRole: (workspace: Workspace, name: string, permissions: string[]) => Promise<WorkspaceRole>;
  deleteWorkspaceRole: (workspace: Workspace, role: WorkspaceRole) => Promise<unknown>;
  removeWorkspaceMember: (workspace: Workspace, memberId: string) => Promise<unknown>;
  addWorkspaceMemberRole: (workspace: Workspace, membershipId: string, roleId: string) => Promise<unknown>;
  removeWorkspaceMemberRole: (workspace: Workspace, membershipId: string, roleId: string) => Promise<unknown>;
  getWorkspaceInvitations: (workspace: WorkspaceWithOrganization) => Promise<any[]>;
  createWorkspaceInvitation: (workspace: WorkspaceWithOrganization, email: string, workspaceRoleId?: string) => Promise<unknown>;
  discardWorkspaceInvitation: (workspace: WorkspaceWithOrganization, invitationId: string) => Promise<unknown>;
  resendWorkspaceInvitation: (workspace: WorkspaceWithOrganization, invitationId: string) => Promise<unknown>;
};`,
        api: [
          {
            name: 'workspaces',
            type: 'WorkspaceWithOrganization[]',
            required: true,
            description: 'Workspaces derived from the current user’s workspace memberships.',
            children: [
              {
                name: '[].id',
                type: 'string',
                description: 'Workspace identifier.',
              },
              {
                name: '[].name',
                type: 'string',
                description: 'Workspace name.',
              },
              {
                name: '[].image_url',
                type: 'string',
                description: 'Workspace image URL.',
              },
              {
                name: '[].description',
                type: 'string',
                description: 'Workspace description.',
              },
              {
                name: '[].member_count',
                type: 'number',
                description: 'Workspace member count.',
              },
              {
                name: '[].enforce_2fa',
                type: 'boolean',
                description: 'Whether the workspace enforces 2FA.',
              },
              {
                name: '[].enable_ip_restriction',
                type: 'boolean',
                description: 'Whether the workspace uses IP restrictions.',
              },
              {
                name: '[].organization',
                type: 'Organization',
                description: 'Parent organization attached to the workspace entry.',
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
                name: '[].eligibility_restriction',
                type: '{ type: "none" | "ip_not_allowed" | "mfa_required" | "ip_and_mfa_required"; message: string } | undefined',
                description: 'Eligibility restriction attached to the workspace membership when one exists.',
              },
            ],
          },
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the workspace memberships query is still loading.',
          },
          {
            name: 'error',
            type: 'Error | null',
            required: true,
            description: 'Underlying workspace-memberships query error.',
          },
          {
            name: 'refetch',
            type: '() => Promise<void>',
            required: true,
            description: 'Revalidates the underlying workspace memberships query.',
          },
          {
            name: 'createWorkspace',
            type: '(organizationId: string, name: string, image?: File, description?: string) => Promise<{ workspace: Workspace; membership: WorkspaceMembership }>',
            required: true,
            description: 'Creates a new workspace under one organization and refreshes the workspace list.',
          },
          {
            name: 'updateWorkspace',
            type: '(workspace: Workspace, data: { name?: string; description?: string; image?: File; enforce_2fa?: boolean; enable_ip_restriction?: boolean; whitelisted_ips?: string[] }) => Promise<unknown>',
            required: true,
            description: 'Updates one workspace and refreshes the list.',
          },
          {
            name: 'deleteWorkspace',
            type: '(workspace: Workspace) => Promise<unknown>',
            required: true,
            description: 'Deletes one workspace, clears token cache, and refreshes the list.',
          },
          {
            name: 'leaveWorkspace',
            type: '(id: string, userId: string) => Promise<void>',
            required: true,
            description: 'Leaves one workspace as one specific user and refreshes the list.',
          },
          {
            name: 'getWorkspaceMembers',
            type: '(workspace: Workspace, params?: { page: number; limit: number; search?: string }) => Promise<PaginatedResponse<WorkspaceMembership[]>>',
            required: true,
            description: 'Loads members for a workspace, optionally with pagination and search.',
          },
          {
            name: 'removeWorkspaceMember',
            type: '(workspace: Workspace, memberId: string) => Promise<unknown>',
            required: true,
            description: 'Removes one member from a workspace and refreshes the list.',
          },
          {
            name: 'getWorkspaceRoles',
            type: '(workspace: Workspace) => Promise<WorkspaceRole[]>',
            required: true,
            description: 'Loads roles for a workspace.',
          },
          {
            name: 'createWorkspaceRole',
            type: '(workspace: Workspace, name: string, permissions: string[]) => Promise<WorkspaceRole>',
            required: true,
            description: 'Creates a custom workspace role.',
          },
          {
            name: 'deleteWorkspaceRole',
            type: '(workspace: Workspace, role: WorkspaceRole) => Promise<unknown>',
            required: true,
            description: 'Deletes one workspace role.',
          },
          {
            name: 'addWorkspaceMemberRole',
            type: '(workspace: Workspace, membershipId: string, roleId: string) => Promise<unknown>',
            required: true,
            description: 'Adds one role to a workspace membership.',
          },
          {
            name: 'removeWorkspaceMemberRole',
            type: '(workspace: Workspace, membershipId: string, roleId: string) => Promise<unknown>',
            required: true,
            description: 'Removes one role from a workspace membership.',
          },
          {
            name: 'getWorkspaceInvitations',
            type: '(workspace: WorkspaceWithOrganization) => Promise<any[]>',
            required: true,
            description: 'Loads invitations for a workspace through the parent organization invitation surface.',
          },
          {
            name: 'createWorkspaceInvitation',
            type: '(workspace: WorkspaceWithOrganization, email: string, workspaceRoleId?: string) => Promise<unknown>',
            required: true,
            description: 'Creates a workspace invitation through the parent organization invitation surface.',
          },
          {
            name: 'discardWorkspaceInvitation',
            type: '(workspace: WorkspaceWithOrganization, invitationId: string) => Promise<unknown>',
            required: true,
            description: 'Discards a workspace invitation through the parent organization invitation surface.',
          },
          {
            name: 'resendWorkspaceInvitation',
            type: '(workspace: WorkspaceWithOrganization, invitationId: string) => Promise<unknown>',
            required: true,
            description: 'Resends a workspace invitation through the parent organization invitation surface.',
          },
        ],
        details: [
          'This hook does not fetch a dedicated workspace list endpoint. It derives `workspaces` from `useWorkspaceMemberships()`, so the list only contains workspaces the current user is actually a member of.',
          'Each workspace entry is enriched with its parent organization and any eligibility restriction from the workspace membership. That is why the list type is `WorkspaceWithOrganization[]` instead of plain `Workspace[]`.',
          'Workspace invitations are handled through the organization invitation surface in the current implementation. That is why the invitation helpers require a `WorkspaceWithOrganization` rather than only a workspace ID.',
          'The hook mixes read helpers and mutation helpers. It is appropriate for workspace-management UI, but broader than what you want for a simple current-workspace read.',
        ],
        examples: [
          {
            title: 'Render the workspace list',
            code: `export default function WorkspaceList() {
  const { workspaces, loading } = useWorkspaceList();

  if (loading) {
    return <p>Loading workspaces…</p>;
  }

  return (
    <ul>
      {workspaces.map((workspace) => (
        <li key={workspace.id}>{workspace.name}</li>
      ))}
    </ul>
  );
}`,
          },
          {
            title: 'Create a workspace inside one organization',
            code: `export default function CreateWorkspaceButton() {
  const { createWorkspace } = useWorkspaceList();

  async function create() {
    await createWorkspace('org_123', 'Operations');
  }

  return <button onClick={create}>Create workspace</button>;
}`,
          },
          {
            title: 'Load workspace members',
            code: `export default function LoadWorkspaceMembers() {
  const { workspaces, getWorkspaceMembers } = useWorkspaceList();

  async function load() {
    const workspace = workspaces[0];
    if (!workspace) {
      return;
    }

    const result = await getWorkspaceMembers(workspace, {
      page: 1,
      limit: 20,
    });

    console.log(result.items);
  }

  return <button onClick={load}>Load workspace members</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-active-workspace',
        title: 'useActiveWorkspace',
        description: 'Read the currently active workspace.',
        importName: 'useActiveWorkspace',
        intro:
          '`useActiveWorkspace()` is the active-scope wrapper over `useWorkspaceList()`. It resolves the current active workspace and active workspace membership from the session, then rebinds the workspace-level management methods so they operate on that active workspace automatically.',
        example: `export default function ActiveWorkspaceHeader() {
  const { activeWorkspace, loading } = useActiveWorkspace();

  if (loading) {
    return <p>Loading workspace…</p>;
  }

  return <p>{activeWorkspace?.name ?? 'No active workspace'}</p>;
}`,
        points: [],
        signature: `declare function useActiveWorkspace():
  | {
      activeWorkspace: null;
      activeMembership: null;
      loading: true;
      error: Error | null;
      refetch: () => Promise<void>;
      leave: never;
      updateWorkspace: never;
      deleteWorkspace: never;
      getMembers: never;
      getRoles: never;
      createRole: never;
      deleteRole: never;
      inviteMember: never;
      removeMember: never;
      addMemberRole: never;
      removeMemberRole: never;
      getInvitations: never;
      discardInvitation: never;
      resendInvitation: never;
    }
  | {
      activeWorkspace: Workspace | null;
      activeMembership: WorkspaceMembership | null;
      loading: false;
      error: Error | null;
      refetch: () => Promise<void>;
      leave: () => Promise<void | undefined>;
      updateWorkspace: (data: { name?: string; description?: string; image?: File; enforce_2fa?: boolean; enable_ip_restriction?: boolean; whitelisted_ips?: string[] }) => Promise<unknown>;
      deleteWorkspace: () => Promise<unknown>;
      getMembers: (params?: { page: number; limit: number; search?: string }) => Promise<PaginatedResponse<WorkspaceMembership[]> | { data: []; meta: { total: number; page: number; limit: number } }>;
      getRoles: () => Promise<WorkspaceRole[]>;
      createRole: (name: string, permissions: string[]) => Promise<WorkspaceRole | undefined>;
      deleteRole: (role: WorkspaceRole) => Promise<unknown>;
      inviteMember: (params: { email: string; workspaceRoleId?: string }) => Promise<unknown>;
      removeMember: (memberId: string) => Promise<unknown>;
      addMemberRole: (membershipId: string, roleId: string) => Promise<unknown>;
      removeMemberRole: (membershipId: string, roleId: string) => Promise<unknown>;
      getInvitations: () => Promise<any[]>;
      discardInvitation: (invitationId: string) => Promise<unknown>;
      resendInvitation: (invitationId: string) => Promise<unknown>;
    };`,
        api: [
          {
            name: 'activeWorkspace',
            type: 'Workspace | null',
            required: true,
            description: 'Workspace whose membership identifier matches the active sign-in in the session.',
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
              {
                name: 'image_url',
                type: 'string',
                description: 'Workspace image URL.',
              },
              {
                name: 'description',
                type: 'string',
                description: 'Workspace description.',
              },
              {
                name: 'member_count',
                type: 'number',
                description: 'Workspace member count.',
              },
              {
                name: 'enforce_2fa',
                type: 'boolean',
                description: 'Whether the workspace enforces 2FA.',
              },
              {
                name: 'enable_ip_restriction',
                type: 'boolean',
                description: 'Whether the workspace uses IP restrictions.',
              },
            ],
          },
          {
            name: 'activeMembership',
            type: 'WorkspaceMembership | null',
            required: true,
            description: 'Current active workspace membership resolved from the session.',
            children: [
              {
                name: 'id',
                type: 'string',
                description: 'Workspace-membership identifier.',
              },
              {
                name: 'workspace',
                type: 'Workspace',
                description: 'Workspace attached to the active membership.',
              },
              {
                name: 'organization',
                type: 'Organization',
                description: 'Parent organization attached to the active workspace membership.',
              },
              {
                name: 'roles',
                type: 'WorkspaceRole[]',
                description: 'Roles attached to the active workspace membership.',
                children: [
                  {
                    name: '[].id',
                    type: 'string',
                    description: 'Role identifier.',
                  },
                  {
                    name: '[].name',
                    type: 'string',
                    description: 'Role name.',
                  },
                  {
                    name: '[].permissions',
                    type: 'string[]',
                    description: 'Permissions granted by the role.',
                  },
                ],
              },
              {
                name: 'eligibility_restriction',
                type: '{ type: "none" | "ip_not_allowed" | "mfa_required" | "ip_and_mfa_required"; message: string } | undefined',
                description: 'Eligibility restriction attached to the membership when one exists.',
              },
            ],
          },
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the session or the underlying workspace list is still loading.',
          },
          {
            name: 'error',
            type: 'Error | null',
            required: true,
            description: 'Combined loading error from the session branch or the workspace-list branch.',
          },
          {
            name: 'refetch',
            type: '() => Promise<void>',
            required: true,
            description: 'Revalidates the underlying workspace memberships query.',
          },
          {
            name: 'leave',
            type: '() => Promise<void | undefined>',
            description: 'Leaves the active workspace using the current sign-in user ID.',
          },
          {
            name: 'updateWorkspace',
            type: '(data: { name?: string; description?: string; image?: File; enforce_2fa?: boolean; enable_ip_restriction?: boolean; whitelisted_ips?: string[] }) => Promise<unknown>',
            description: 'Updates the active workspace.',
          },
          {
            name: 'deleteWorkspace',
            type: '() => Promise<unknown>',
            description: 'Deletes the active workspace.',
          },
          {
            name: 'getMembers',
            type: '(params?: { page: number; limit: number; search?: string }) => Promise<PaginatedResponse<WorkspaceMembership[]> | { data: []; meta: { total: number; page: number; limit: number } }>',
            description: 'Loads members for the active workspace.',
          },
          {
            name: 'getRoles',
            type: '() => Promise<WorkspaceRole[]>',
            description: 'Loads roles for the active workspace.',
          },
          {
            name: 'createRole',
            type: '(name: string, permissions: string[]) => Promise<WorkspaceRole | undefined>',
            description: 'Creates a role on the active workspace.',
          },
          {
            name: 'deleteRole',
            type: '(role: WorkspaceRole) => Promise<unknown>',
            description: 'Deletes a role from the active workspace.',
          },
          {
            name: 'removeMember',
            type: '(memberId: string) => Promise<unknown>',
            description: 'Removes a member from the active workspace.',
          },
          {
            name: 'addMemberRole',
            type: '(membershipId: string, roleId: string) => Promise<unknown>',
            description: 'Adds a role to a member in the active workspace.',
          },
          {
            name: 'removeMemberRole',
            type: '(membershipId: string, roleId: string) => Promise<unknown>',
            description: 'Removes a role from a member in the active workspace.',
          },
          {
            name: 'getInvitations',
            type: '() => Promise<any[]>',
            description: 'Loads invitations for the active workspace.',
          },
          {
            name: 'inviteMember',
            type: '(params: { email: string; workspaceRoleId?: string }) => Promise<unknown>',
            description: 'Invites a member into the active workspace.',
          },
          {
            name: 'discardInvitation',
            type: '(invitationId: string) => Promise<unknown>',
            description: 'Discards an invitation from the active workspace.',
          },
          {
            name: 'resendInvitation',
            type: '(invitationId: string) => Promise<unknown>',
            description: 'Resends an invitation from the active workspace.',
          },
        ],
        details: [
          'This hook is not a separate data source. It wraps `useWorkspaceList()` and `useSession()`, then resolves one active workspace and one active membership from the current session.',
          'All of the management methods are rebound to the current active workspace, so callers no longer pass a `workspace` argument each time.',
          'Invitation helpers need the active workspace together with its parent organization. The hook resolves that by matching the active workspace back into the broader `workspaces` list from `useWorkspaceList()`.',
          'When there is no active workspace, many methods return empty values or `undefined` instead of throwing. The docs reflect that behavior because it is part of the current implementation contract.',
          'This is the right hook for workspace-aware pages such as workspace settings, members, roles, and invitations that should always operate on the active workspace only.',
        ],
        examples: [
          {
            title: 'Render the active workspace name',
            code: `export default function ActiveWorkspaceTitle() {
  const { activeWorkspace, loading } = useActiveWorkspace();

  if (loading) {
    return <p>Loading workspace…</p>;
  }

  return <p>{activeWorkspace?.name ?? 'No active workspace'}</p>;
}`,
          },
          {
            title: 'Load members for the active workspace',
            code: `export default function ActiveWorkspaceMembers() {
  const { loading, getMembers } = useActiveWorkspace();

  async function loadMembers() {
    if (loading) {
      return;
    }

    const result = await getMembers({
      page: 1,
      limit: 20,
    });

    console.log(result);
  }

  return <button onClick={loadMembers}>Load members</button>;
}`,
          },
          {
            title: 'Invite a member into the active workspace',
            code: `export default function InviteWorkspaceMember() {
  const { loading, inviteMember } = useActiveWorkspace();

  async function invite() {
    if (loading) {
      return;
    }

    await inviteMember({
      email: 'jane@example.com',
    });
  }

  return <button onClick={invite}>Invite member</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-organization-memberships',
        title: 'useOrganizationMemberships',
        description: 'Read organization memberships for the current user.',
        importName: 'useOrganizationMemberships',
        intro:
          '`useOrganizationMemberships()` is the raw organization-membership query that higher-level organization hooks build on top of. It loads the current user’s organization memberships with SWR and exposes the membership rows together with a manual refetch path.',
        example: `export default function MembershipList() {
  const { organizationMemberships, loading } = useOrganizationMemberships();

  if (loading) {
    return <p>Loading memberships…</p>;
  }

  return (
    <ul>
      {organizationMemberships?.map((membership) => (
        <li key={membership.id}>{membership.organization.name}</li>
      ))}
    </ul>
  );
}`,
        points: [],
        signature: `declare function useOrganizationMemberships(): {
  organizationMemberships: OrganizationMembershipWithOrganization[] | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: () => Promise<void>;
};`,
        api: [
          {
            name: 'organizationMemberships',
            type: 'OrganizationMembershipWithOrganization[] | undefined',
            required: true,
            description: 'Organization memberships for the current user.',
            children: [
              {
                name: '[].id',
                type: 'string',
                description: 'Organization-membership identifier.',
              },
              {
                name: '[].organization',
                type: 'Organization',
                description: 'Organization attached to the membership.',
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
                  {
                    name: 'image_url',
                    type: 'string',
                    description: 'Organization image URL.',
                  },
                  {
                    name: 'description',
                    type: 'string',
                    description: 'Organization description.',
                  },
                  {
                    name: 'member_count',
                    type: 'number',
                    description: 'Organization member count.',
                  },
                ],
              },
              {
                name: '[].user_id',
                type: 'string',
                description: 'User identifier attached to the membership.',
              },
              {
                name: '[].roles',
                type: 'OrganizationRole[]',
                description: 'Roles attached to the membership.',
                children: [
                  {
                    name: '[].id',
                    type: 'string',
                    description: 'Role identifier.',
                  },
                  {
                    name: '[].name',
                    type: 'string',
                    description: 'Role name.',
                  },
                  {
                    name: '[].permissions',
                    type: 'string[]',
                    description: 'Permissions granted by the role.',
                  },
                ],
              },
              {
                name: '[].public_metadata',
                type: 'Record<string, unknown>',
                description: 'Public metadata stored on the membership.',
              },
              {
                name: '[].created_at',
                type: 'string',
                description: 'Creation timestamp for the membership.',
              },
              {
                name: '[].updated_at',
                type: 'string',
                description: 'Last update timestamp for the membership.',
              },
              {
                name: '[].eligibility_restriction',
                type: '{ type: "none" | "ip_not_allowed" | "mfa_required" | "ip_and_mfa_required"; message: string } | undefined',
                description: 'Eligibility restriction attached to the membership when one exists.',
                children: [
                  {
                    name: 'type',
                    type: '"none" | "ip_not_allowed" | "mfa_required" | "ip_and_mfa_required"',
                    description: 'Restriction type.',
                  },
                  {
                    name: 'message',
                    type: 'string',
                    description: 'Restriction message.',
                  },
                ],
              },
            ],
          },
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the shared client or the organization-memberships query is still loading.',
          },
          {
            name: 'error',
            type: 'Error | undefined',
            required: true,
            description: 'Underlying SWR error for the organization-memberships query.',
          },
          {
            name: 'refetch',
            type: '() => Promise<void>',
            required: true,
            description: 'Revalidates the organization-memberships query.',
          },
        ],
        details: [
          'This is the low-level membership query, not the higher-level organization list. That is why it returns membership rows rather than plain organizations.',
          'Higher-level hooks such as `useOrganizationList()`, `useActiveOrganization()`, and `useActiveTenancy()` all build on top of this membership data.',
          'The hook is SWR-backed, so `organizationMemberships` can be `undefined` on the first render while the query is still resolving.',
          'Because it exposes membership rows directly, this is the right hook for permission-aware UI or any screen that needs role and membership metadata rather than only organization names.',
        ],
        examples: [
          {
            title: 'Render organization memberships',
            code: `export default function OrganizationMembershipList() {
  const { organizationMemberships, loading } = useOrganizationMemberships();

  if (loading) {
    return <p>Loading memberships…</p>;
  }

  return (
    <ul>
      {organizationMemberships?.map((membership) => (
        <li key={membership.id}>
          {membership.organization.name} ({membership.roles.length} roles)
        </li>
      ))}
    </ul>
  );
}`,
          },
          {
            title: 'Refetch membership data after an external change',
            code: `export default function RefreshMemberships() {
  const { refetch } = useOrganizationMemberships();

  return <button onClick={() => refetch()}>Refresh memberships</button>;
}`,
          },
        ],
      },
      {
        slug: 'use-workspace-memberships',
        title: 'useWorkspaceMemberships',
        description: 'Read workspace memberships for the current user.',
        importName: 'useWorkspaceMemberships',
        intro:
          '`useWorkspaceMemberships()` is the raw workspace-membership query that higher-level workspace hooks build on top of. It loads the current user’s workspace memberships with SWR and exposes the membership rows together with a manual refetch path.',
        example: `export default function WorkspaceMembershipList() {
  const { workspaceMemberships, loading } = useWorkspaceMemberships();

  if (loading) {
    return <p>Loading memberships…</p>;
  }

  return (
    <ul>
      {workspaceMemberships?.map((membership) => (
        <li key={membership.id}>{membership.workspace.name}</li>
      ))}
    </ul>
  );
}`,
        points: [],
        signature: `declare function useWorkspaceMemberships(): {
  workspaceMemberships: WorkspaceMembership[] | undefined;
  loading: boolean;
  error: Error | undefined;
  refetch: () => Promise<void>;
};`,
        api: [
          {
            name: 'workspaceMemberships',
            type: 'WorkspaceMembership[] | undefined',
            required: true,
            description: 'Workspace memberships for the current user.',
            children: [
              {
                name: '[].id',
                type: 'string',
                description: 'Workspace-membership identifier.',
              },
              {
                name: '[].workspace',
                type: 'Workspace',
                description: 'Workspace attached to the membership.',
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
                  {
                    name: 'image_url',
                    type: 'string',
                    description: 'Workspace image URL.',
                  },
                  {
                    name: 'description',
                    type: 'string',
                    description: 'Workspace description.',
                  },
                  {
                    name: 'member_count',
                    type: 'number',
                    description: 'Workspace member count.',
                  },
                  {
                    name: 'enforce_2fa',
                    type: 'boolean',
                    description: 'Whether the workspace enforces 2FA.',
                  },
                  {
                    name: 'enable_ip_restriction',
                    type: 'boolean',
                    description: 'Whether the workspace uses IP restrictions.',
                  },
                ],
              },
              {
                name: '[].organization_id',
                type: 'string',
                description: 'Parent organization identifier for the workspace membership.',
              },
              {
                name: '[].user_id',
                type: 'string',
                description: 'User identifier attached to the membership.',
              },
              {
                name: '[].organization',
                type: 'Organization',
                description: 'Parent organization attached to the workspace membership.',
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
                name: '[].roles',
                type: 'WorkspaceRole[]',
                description: 'Roles attached to the membership.',
                children: [
                  {
                    name: '[].id',
                    type: 'string',
                    description: 'Role identifier.',
                  },
                  {
                    name: '[].name',
                    type: 'string',
                    description: 'Role name.',
                  },
                  {
                    name: '[].permissions',
                    type: 'string[]',
                    description: 'Permissions granted by the role.',
                  },
                ],
              },
              {
                name: '[].public_metadata',
                type: 'Record<string, unknown>',
                description: 'Public metadata stored on the membership.',
              },
              {
                name: '[].created_at',
                type: 'string',
                description: 'Creation timestamp for the membership.',
              },
              {
                name: '[].updated_at',
                type: 'string',
                description: 'Last update timestamp for the membership.',
              },
              {
                name: '[].eligibility_restriction',
                type: '{ type: "none" | "ip_not_allowed" | "mfa_required" | "ip_and_mfa_required"; message: string } | undefined',
                description: 'Eligibility restriction attached to the membership when one exists.',
                children: [
                  {
                    name: 'type',
                    type: '"none" | "ip_not_allowed" | "mfa_required" | "ip_and_mfa_required"',
                    description: 'Restriction type.',
                  },
                  {
                    name: 'message',
                    type: 'string',
                    description: 'Restriction message.',
                  },
                ],
              },
            ],
          },
          {
            name: 'loading',
            type: 'boolean',
            required: true,
            description: 'Whether the shared client or the workspace-memberships query is still loading.',
          },
          {
            name: 'error',
            type: 'Error | undefined',
            required: true,
            description: 'Underlying SWR error for the workspace-memberships query.',
          },
          {
            name: 'refetch',
            type: '() => Promise<void>',
            required: true,
            description: 'Revalidates the workspace-memberships query.',
          },
        ],
        details: [
          'This is the low-level membership query, not the higher-level workspace list. That is why it returns membership rows rather than plain workspaces.',
          'Higher-level hooks such as `useWorkspaceList()`, `useActiveWorkspace()`, and `useActiveTenancy()` all build on top of this membership data.',
          'The query only runs when workspaces are enabled in the current deployment. If workspace support is disabled, the hook stays on the empty/query-disabled path instead of fetching.',
          'Because it exposes membership rows directly, this is the right hook for permission-aware workspace UI or any screen that needs role, organization, and eligibility metadata rather than only workspace names.',
        ],
        examples: [
          {
            title: 'Render workspace memberships',
            code: `export default function WorkspaceMemberships() {
  const { workspaceMemberships, loading } = useWorkspaceMemberships();

  if (loading) {
    return <p>Loading memberships…</p>;
  }

  return (
    <ul>
      {workspaceMemberships?.map((membership) => (
        <li key={membership.id}>
          {membership.workspace.name} ({membership.roles.length} roles)
        </li>
      ))}
    </ul>
  );
}`,
          },
          {
            title: 'Refetch workspace memberships after an external change',
            code: `export default function RefreshWorkspaceMemberships() {
  const { refetch } = useWorkspaceMemberships();

  return <button onClick={() => refetch()}>Refresh memberships</button>;
}`,
          },
        ],
      },
    ],
  };
