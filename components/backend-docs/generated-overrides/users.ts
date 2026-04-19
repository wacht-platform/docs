import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const usersGeneratedDocOverrides: Record<string, Partial<BackendDoc>> = {
  addEmail: {
    description: 'Add an email address to a user.',
    intro: 'Creates a user email record and returns the created email object.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function addSecondaryEmail(userId: string, email: string) {
  const client = await wachtClient();
  return client.users.addEmail(userId, { email });
}`,
    signature: `function addEmail(
  userId: string,
  request: AddEmailRequest,
): Promise<UserEmail>`,
    paramsTitle: 'AddEmailRequest',
    params: [
      { name: 'userId', type: 'string', description: 'Target user id.' },
      { name: 'email', type: 'string', description: 'Email address to attach.' },
      { name: 'verification_strategy', type: `VerificationStrategy | undefined`, description: 'Optional verification strategy override.' },
    ],
    api: [
      { name: 'id', type: 'string', description: 'Email record id.' },
      { name: 'email', type: 'string', description: 'Stored email value.' },
      { name: 'is_primary', type: 'boolean', description: 'Whether this is the primary email.' },
      { name: 'verified', type: 'boolean', description: 'Whether the email is verified.' },
    ],
  },
  updateEmail: {
    description: 'Update one email address on a user.',
    intro: 'Patches fields for an existing user email.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function makePrimaryEmail(userId: string, emailId: string) {
  const client = await wachtClient();
  return client.users.updateEmail(userId, emailId, { is_primary: true });
}`,
    signature: `function updateEmail(
  userId: string,
  emailId: string,
  request: UpdateEmailRequest,
): Promise<UserEmail>`,
    paramsTitle: 'UpdateEmailRequest',
    params: [
      { name: 'userId', type: 'string', description: 'Target user id.' },
      { name: 'emailId', type: 'string', description: 'Target email id.' },
      { name: 'email', type: 'string | undefined', description: 'Updated email value.' },
      { name: 'is_primary', type: 'boolean | undefined', description: 'Mark this email as primary.' },
    ],
    api: [
      { name: 'id', type: 'string', description: 'Email record id.' },
      { name: 'email', type: 'string', description: 'Updated email value.' },
      { name: 'is_primary', type: 'boolean', description: 'Primary-email flag after update.' },
    ],
  },
  deleteEmail: {
    description: 'Delete one email address from a user.',
    intro: 'Removes an email record from the target user.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function removeEmail(userId: string, emailId: string) {
  const client = await wachtClient();
  await client.users.deleteEmail(userId, emailId);
}`,
    signature: `function deleteEmail(userId: string, emailId: string): Promise<void>`,
    params: [
      { name: 'userId', type: 'string', description: 'Target user id.' },
      { name: 'emailId', type: 'string', description: 'Email id to remove.' },
    ],
  },
  addPhone: {
    description: 'Add a phone number to a user.',
    intro: 'Creates a user phone record.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function addPhone(userId: string) {
  const client = await wachtClient();
  return client.users.addPhone(userId, {
    country_code: '+1',
    phone_number: '5551234567',
  });
}`,
    signature: `function addPhone(
  userId: string,
  request: AddPhoneRequest,
): Promise<UserPhone>`,
    paramsTitle: 'AddPhoneRequest',
    params: [
      { name: 'userId', type: 'string', description: 'Target user id.' },
      { name: 'country_code', type: 'string', description: 'E.164 country code prefix.' },
      { name: 'phone_number', type: 'string', description: 'Phone number value.' },
    ],
    api: [
      { name: 'id', type: 'string', description: 'Phone record id.' },
      { name: 'phone_number', type: 'string', description: 'Stored phone number.' },
      { name: 'country_code', type: 'string', description: 'Stored country code.' },
      { name: 'verified', type: 'boolean', description: 'Verification status.' },
    ],
  },
  updatePhone: {
    description: 'Update one phone number on a user.',
    intro: 'Patches an existing phone record.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function verifyPhone(userId: string, phoneId: string) {
  const client = await wachtClient();
  return client.users.updatePhone(userId, phoneId, { verified: true });
}`,
    signature: `function updatePhone(
  userId: string,
  phoneId: string,
  request: UpdatePhoneRequest,
): Promise<UserPhone>`,
    paramsTitle: 'UpdatePhoneRequest',
    params: [
      { name: 'userId', type: 'string', description: 'Target user id.' },
      { name: 'phoneId', type: 'string', description: 'Target phone id.' },
      { name: 'phone_number', type: 'string | undefined', description: 'Updated phone number value.' },
      { name: 'country_code', type: 'string | undefined', description: 'Updated country code.' },
      { name: 'verified', type: 'boolean | undefined', description: 'Set phone verification status.' },
      { name: 'is_primary', type: 'boolean | undefined', description: 'Set as primary phone.' },
    ],
    sections: [],
  },
  deletePhone: {
    description: 'Delete one phone number from a user.',
    intro: 'Removes a phone record from the target user.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function removePhone(userId: string, phoneId: string) {
  const client = await wachtClient();
  await client.users.deletePhone(userId, phoneId);
}`,
    signature: `function deletePhone(userId: string, phoneId: string): Promise<void>`,
    params: [
      { name: 'userId', type: 'string', description: 'Target user id.' },
      { name: 'phoneId', type: 'string', description: 'Phone id to remove.' },
    ],
  },
  createSessionTicket: {
    description: 'Create a short-lived session ticket for privileged access flows.',
    intro: 'Creates a short-lived session ticket and returns the ticket plus expiration timestamp.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createImpersonationTicket(userId: string) {
  const client = await wachtClient();
  return client.sessions.createSessionTicket({
    ticket_type: 'impersonation',
    user_id: userId,
    expires_in: 300,
  });
}`,
    signature: `function createSessionTicket(
  request: CreateSessionTicketRequest,
): Promise<SessionTicketResponse>`,
    paramsTitle: 'CreateSessionTicketRequest',
    params: [
      { name: 'ticket_type', type: `'impersonation' | 'agent_access' | 'webhook_app_access' | 'api_auth_access'`, description: 'Target ticket flow.' },
      { name: 'user_id', type: 'string | undefined', description: 'User id for user-scoped tickets.' },
      { name: 'agent_ids', type: 'string[] | undefined', description: 'Agent ids for agent access tickets.' },
      { name: 'webhook_app_slug', type: 'string | undefined', description: 'Webhook app slug for webhook app tickets.' },
      { name: 'api_auth_app_slug', type: 'string | undefined', description: 'API auth app slug for API auth tickets.' },
      { name: 'expires_in', type: 'number | undefined', description: 'Ticket lifetime in seconds.' },
    ],
    api: [
      { name: 'ticket', type: 'string', description: 'Issued session ticket value.' },
      { name: 'expires_at', type: 'number', description: 'Epoch timestamp when ticket expires.' },
    ],
  },
  listInvitations: {
    description: 'List deployment invitations.',
    intro: 'Returns paginated invitation records.',
    signature: `function listInvitations(
  options?: {
    limit?: number;
    offset?: number;
    sort_key?: string;
    sort_order?: string;
    search?: string;
  },
): Promise<PaginatedResponse<DeploymentInvitation>>`,
    paramsTitle: 'List options',
    params: [
      { name: 'options.limit', type: 'number | undefined', description: 'Maximum page size.' },
      { name: 'options.offset', type: 'number | undefined', description: 'Result offset.' },
      { name: 'options.sort_key', type: 'string | undefined', description: 'Sort field.' },
      { name: 'options.sort_order', type: 'string | undefined', description: 'Sort direction.' },
      { name: 'options.search', type: 'string | undefined', description: 'Search term.' },
    ],
    api: [
      { name: 'data', type: 'DeploymentInvitation[]', description: 'Invitation rows for the current page.' },
      { name: 'has_more', type: 'boolean', description: 'Whether additional pages are available.' },
    ],
  },
  inviteUser: {
    description: 'Create a deployment invitation.',
    intro: 'Creates a deployment invitation and returns the created invitation.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function inviteMember(email: string, firstName: string, lastName: string) {
  const client = await wachtClient();
  return client.invitations.inviteUser({
    email_address: email,
    first_name: firstName,
    last_name: lastName,
  });
}`,
    signature: `function inviteUser(request: InviteUserRequest): Promise<DeploymentInvitation>`,
    paramsTitle: 'InviteUserRequest',
    params: [
      { name: 'first_name', type: 'string', description: 'Invitee first name.' },
      { name: 'last_name', type: 'string', description: 'Invitee last name.' },
      { name: 'email_address', type: 'string', description: 'Invitee email address.' },
    ],
  },
  listWaitlist: {
    description: 'List waitlist entries.',
    intro: 'Returns paginated waitlist users.',
    signature: `function listWaitlist(
  options?: {
    limit?: number;
    offset?: number;
    sort_key?: string;
    sort_order?: string;
    search?: string;
  },
): Promise<PaginatedResponse<DeploymentWaitlistUser>>`,
    paramsTitle: 'List options',
    params: [
      { name: 'options.limit', type: 'number | undefined', description: 'Maximum page size.' },
      { name: 'options.offset', type: 'number | undefined', description: 'Result offset.' },
      { name: 'options.sort_key', type: 'string | undefined', description: 'Sort field.' },
      { name: 'options.sort_order', type: 'string | undefined', description: 'Sort direction.' },
      { name: 'options.search', type: 'string | undefined', description: 'Search term.' },
    ],
  },
  deleteInvitation: {
    description: 'Delete one invitation.',
    intro: 'Removes an outstanding invitation record by invitation id.',
    signature: `function deleteInvitation(invitationId: string): Promise<void>`,
    params: [{ name: 'invitationId', type: 'string', description: 'Invitation id to delete.' }],
  },
  deleteSocialConnection: {
    description: 'Delete one user social connection.',
    intro:
      'Removes one linked social identity provider from a user. This only unlinks the provider connection record and does not delete the user account.',
    signature: `function deleteSocialConnection(
  userId: string,
  connectionId: string,
): Promise<void>`,
    params: [
      { name: 'userId', type: 'string', required: true, description: 'Target user id that owns the social connection.' },
      { name: 'connectionId', type: 'string', required: true, description: 'Social connection id to unlink from the user.' },
    ],
    sections: [
{
        title: 'Related Methods',
        points: [
          'Use `getUser()` to inspect currently linked social identities before unlinking.',
          'Use `updatePassword()` or email/phone methods when migrating a user away from social-only sign-in.',
        ],
      }
      ],
    examples: [
      {
        title: 'Unlink after validating owner user',
        code: `import { wachtClient } from '@wacht/nextjs/server';

export async function unlinkGithubConnection(userId: string, connectionId: string) {
  const client = await wachtClient();
  const user = await client.users.getUser(userId);

  const hasConnection = (user.social_connections ?? []).some((connection) => connection.id === connectionId);
  if (!hasConnection) {
    throw new Error('Connection does not belong to this user');
  }

  await client.users.deleteSocialConnection(userId, connectionId);
}`,
        lang: 'ts',
      },
    ],
  },
  approveWaitlistUser: {
    description: 'Approve one waitlist entry and issue an invitation.',
    intro: 'Approves one waitlist entry and returns the created invitation object.',
    signature: `function approveWaitlistUser(waitlistUserId: string): Promise<DeploymentInvitation>`,
    params: [{ name: 'waitlistUserId', type: 'string', description: 'Waitlist user id to approve.' }],
  },
};
