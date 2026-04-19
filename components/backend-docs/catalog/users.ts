import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const usersBackendDocs: BackendDoc[] = [
{
        slug: 'list-users',
        path: ['users', 'list-users'],
        title: 'listUsers()',
        description: 'List users through the backend client.',
        intro:
          'Retrieves a list of users. Returns a `PaginatedResponse<User>` object with a `data` property that contains an array of `User` objects, and a `has_more` property that indicates whether another page of users is available.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listRecentUsers() {
  const client = await wachtClient();
  return client.users.listUsers({ limit: 20, offset: 0 });
}`,
        signature: `function listUsers(
  options?: ListUsersOptions,
): Promise<PaginatedResponse<User>>`,
        paramsTitle: 'ListUsersOptions',
        params: [
          {
            name: 'limit',
            type: 'number | undefined',
            description: 'Maximum number of users to return for this page. When omitted, the backend keeps its default page size.',
          },
          {
            name: 'offset',
            type: 'number | undefined',
            description: 'Number of users to skip before returning results. Use it together with `limit` for offset-based pagination.',
          },
          {
            name: 'sort_key',
            type: '"created_at" | "username" | "email" | "phone_number" | undefined',
            description: 'Sort field used by the backend user list query.',
          },
          {
            name: 'sort_order',
            type: '"asc" | "desc" | undefined',
            description: 'Sort direction for the selected `sort_key`.',
          },
          {
            name: 'search',
            type: 'string | undefined',
            description: 'Search term forwarded to the backend user list query.',
          },
        ],
        api: [
          {
            name: 'data',
            type: 'User[]',
            description: 'The users returned for the current page.',
            children: [
              { name: 'id', type: 'string', description: 'Stable user identifier.' },
              { name: 'created_at', type: 'string', description: 'Creation timestamp.' },
              { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
              { name: 'first_name', type: 'string', description: 'User first name.' },
              { name: 'last_name', type: 'string', description: 'User last name.' },
              { name: 'username', type: 'string | undefined', description: 'Optional username.' },
              { name: 'profile_picture_url', type: 'string', description: 'Resolved profile picture URL.' },
              { name: 'primary_email_address', type: 'string | undefined', description: 'Primary email address string when one exists.' },
              { name: 'primary_phone_number', type: 'string | undefined', description: 'Primary phone number string when one exists.' },
            ],
          },
          {
            name: 'has_more',
            type: 'boolean',
            description: 'Whether another page of users exists after this one.',
          },
          {
            name: 'limit',
            type: 'number | undefined',
            description: 'The effective page size reflected by the backend when present.',
          },
          {
            name: 'offset',
            type: 'number | undefined',
            description: 'The effective offset reflected by the backend when present.',
          },
        ],
        examples: [
          {
            title: 'Basic',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listUsers() {
  const client = await wachtClient();
  const response = await client.users.listUsers();

  return response;
}`,
            lang: 'ts',
          },
          {
            title: 'Limit the number of results',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listFirstTenUsers() {
  const client = await wachtClient();
  const { data, has_more, limit, offset } = await client.users.listUsers({
    limit: 10,
    offset: 0,
  });

  return { data, has_more, limit, offset };
}`,
            lang: 'ts',
          },
          {
            title: 'Search users',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function searchUsers(search: string) {
  const client = await wachtClient();

  return client.users.listUsers({
    search,
    limit: 20,
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Sort by username',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listUsersByUsername() {
  const client = await wachtClient();

  return client.users.listUsers({
    sort_key: 'username',
    sort_order: 'asc',
    limit: 25,
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Iterate through several pages',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function exportUsers() {
  const client = await wachtClient();
  const allUsers = [];
  let offset = 0;

  while (true) {
    const page = await client.users.listUsers({
      limit: 100,
      offset,
    });

    allUsers.push(...page.data);

    if (!page.has_more) {
      break;
    }

    offset += page.data.length;
  }

  return allUsers;
}`,
            lang: 'ts',
          },
          {
            title: 'Read only the user ids from the current page',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function listUserIds() {
  const client = await wachtClient();
  const { data } = await client.users.listUsers({ limit: 25 });

  return data.map((user) => user.id);
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
        slug: 'get-user',
        path: ['users', 'get-user'],
        title: 'getUser()',
        description: 'Load one user by id.',
        intro:
          'Loads the full backend user record for one user id. This returns the detailed `UserDetails` shape rather than the smaller `User` objects used in list responses.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getUser(userId: string) {
  const client = await wachtClient();
  return client.users.getUser(userId);
}`,
        signature: `function getUser(
  userId: string,
): Promise<UserDetails>`,
        params: [
          {
            name: 'userId',
            type: 'string',
            description: 'Stable id of the user to load.',
          },
        ],
        api: [
          {
            name: 'id',
            type: 'string',
            description: 'Stable user identifier.',
          },
          {
            name: 'created_at',
            type: 'string',
            description: 'Creation timestamp.',
          },
          {
            name: 'updated_at',
            type: 'string',
            description: 'Last update timestamp.',
          },
          {
            name: 'first_name',
            type: 'string',
            description: 'Current first name.',
          },
          {
            name: 'last_name',
            type: 'string',
            description: 'Current last name.',
          },
          {
            name: 'username',
            type: 'string | undefined',
            description: 'Current username when one exists.',
          },
          {
            name: 'profile_picture_url',
            type: 'string',
            description: 'Current profile image URL.',
          },
          {
            name: 'disabled',
            type: 'boolean',
            description: 'Whether the user is currently disabled.',
          },
          {
            name: 'public_metadata',
            type: 'Record<string, unknown>',
            description: 'Public metadata stored on the user.',
            children: [
              { name: 'tier', type: 'string | undefined', description: 'Example public tier/plan field.' },
              { name: 'segment', type: 'string | undefined', description: 'Example public segment label.' },
            ],
          },
          {
            name: 'private_metadata',
            type: 'Record<string, unknown>',
            description: 'Private metadata stored on the user.',
            children: [
              { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
              { name: 'risk_score', type: 'number | undefined', description: 'Example internal risk score.' },
            ],
          },
          {
            name: 'primary_email_address',
            type: 'string | undefined',
            description: 'Primary email address string when one exists.',
          },
          {
            name: 'primary_phone_number',
            type: 'string | undefined',
            description: 'Primary phone number string when one exists.',
          },
          {
            name: 'email_addresses',
            type: 'UserEmail[]',
            description: 'Resolved email addresses attached to the user.',
          },
          {
            name: 'phone_numbers',
            type: 'UserPhone[]',
            description: 'Resolved phone numbers attached to the user.',
          },
          {
            name: 'social_connections',
            type: 'UserSocialConnection[]',
            description: 'Linked social connections attached to the user.',
          },
          {
            name: 'segments',
            type: 'Segment[]',
            description: 'Segments currently attached to the user.',
          },
          {
            name: 'has_password',
            type: 'boolean',
            description: 'Whether the user currently has a password set.',
          },
          {
            name: 'has_backup_codes',
            type: 'boolean',
            description: 'Whether the user currently has backup codes generated.',
          },
        ],
        sections: [
          {
            title: 'What it returns',
            paragraphs: [
              'This method loads the detailed backend user payload, not the lighter list-item shape returned by `listUsers()`.',
              'That makes it the right read operation when your admin flow needs metadata, contact inventories, social connections, password state, or segment assignments for one user.',
            ],
          },
        ],
        examples: [
          {
            title: 'Load one user for an admin page',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function getUser(userId: string) {
  const client = await wachtClient();
  return client.users.getUser(userId);
}`,
            lang: 'ts',
          },
          {
            title: 'Read profile and metadata fields',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function getUserAdminSummary(userId: string) {
  const client = await wachtClient();
  const user = await client.users.getUser(userId);

  return {
    id: user.id,
    fullName: [user.first_name, user.last_name].join(' '),
    disabled: user.disabled,
    publicMetadata: user.public_metadata,
  };
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'create-user',
        path: ['users', 'create-user'],
        title: 'createUser()',
        description: 'Create a user directly from server code.',
        intro:
          'Creates a user through the backend management API. The SDK sends this request as `multipart/form-data`, which lets you provide the core user fields and optionally upload a `profile_image` in the same call.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createUser() {
  const client = await wachtClient();

  return client.users.createUser({
    first_name: 'Ada',
    last_name: 'Lovelace',
    email_address: 'ada@example.com',
    password: 'super-secret-password',
  });
}`,
        signature: `function createUser(
  request: CreateUserRequest,
): Promise<User>`,
        paramsTitle: 'CreateUserRequest',
        params: [
          {
            name: 'first_name',
            type: 'string',
            description: 'User first name. This is required when first names are enabled and required by the deployment auth settings.',
          },
          {
            name: 'last_name',
            type: 'string',
            description: 'User last name. This is required when last names are enabled and required by the deployment auth settings.',
          },
          {
            name: 'email_address',
            type: 'string | undefined',
            description: 'Primary email address to create with the user. When present, the backend creates it as the primary email and marks it verified immediately.',
          },
          {
            name: 'phone_number',
            type: 'string | undefined',
            description: 'Primary phone number to create with the user. When present, the backend creates it as the primary phone number and marks it verified immediately.',
          },
          {
            name: 'username',
            type: 'string | undefined',
            description: 'Optional username for the new user. Depending on deployment auth settings, this may be required.',
          },
          {
            name: 'password',
            type: 'string | undefined',
            description: 'Optional password for the new user. Depending on deployment auth settings, this may be required and validated against the configured password rules.',
          },
          {
            name: 'skip_password_check',
            type: 'boolean | undefined',
            description: 'When `true`, bypasses the normal password validation check during creation.',
          },
          {
            name: 'profile_image',
            type: 'File | Blob | undefined',
            description: 'Optional profile image uploaded with the create request. When present, the backend uploads it after the user record is created and stores the resulting profile image URL.',
          },
        ],
        api: [
          {
            name: 'id',
            type: 'string',
            description: 'Stable user identifier.',
          },
          {
            name: 'created_at',
            type: 'string',
            description: 'Creation timestamp.',
          },
          {
            name: 'updated_at',
            type: 'string',
            description: 'Last update timestamp.',
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
            type: 'string | undefined',
            description: 'Optional username.',
          },
          {
            name: 'profile_picture_url',
            type: 'string',
            description: 'Resolved profile picture URL. This is empty when no profile image was uploaded.',
          },
          {
            name: 'primary_email_address',
            type: 'string | undefined',
            description: 'Primary email address string when one was created with the user.',
          },
          {
            name: 'primary_phone_number',
            type: 'string | undefined',
            description: 'Primary phone number string when one was created with the user.',
          },
        ],
        sections: [
          {
            title: 'What the backend does',
            paragraphs: [
              'The backend creates the core user record first, then creates the primary email and primary phone records when you provide them.',
              'If you include `profile_image`, the backend uploads it after the user exists and then updates the user profile image URL.',
            ],
          },
          {
            title: 'Validation depends on deployment settings',
            paragraphs: [
              'Whether fields like `email_address`, `phone_number`, `username`, or `password` are actually required depends on the deployment auth settings the backend reads at request time.',
              'If password validation is enabled, the backend enforces the configured password rules unless you explicitly pass `skip_password_check: true`.',
            ],
          },
        ],
        examples: [
          {
            title: 'Create a user with an email and password',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createUser() {
  const client = await wachtClient();

  return client.users.createUser({
    first_name: 'Ada',
    last_name: 'Lovelace',
    email_address: 'ada@example.com',
    password: 'super-secret-password',
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Create a user with a phone number instead',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createPhoneUser() {
  const client = await wachtClient();

  return client.users.createUser({
    first_name: 'Taylor',
    last_name: 'Jordan',
    phone_number: '+14155550123',
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Create a user during an import and skip password checks',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function importUser() {
  const client = await wachtClient();

  return client.users.createUser({
    first_name: 'Grace',
    last_name: 'Hopper',
    email_address: 'grace@example.com',
    password: 'temporary-import-password',
    skip_password_check: true,
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Create a user with a profile image',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function createUserWithProfileImage(file: File) {
  const client = await wachtClient();

  return client.users.createUser({
    first_name: 'Lin',
    last_name: 'Nguyen',
    email_address: 'lin@example.com',
    profile_image: file,
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'update-user',
        path: ['users', 'update-user'],
        title: 'updateUser()',
        description: 'Update a user record by id.',
        intro:
          'Updates the mutable fields on an existing user. The SDK sends this request as `multipart/form-data`, which lets you update profile fields, metadata, and profile image state in one call.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function disableUser(userId: string) {
  const client = await wachtClient();

  return client.users.updateUser(userId, {
    disabled: true,
  });
}`,
        signature: `function updateUser(
  userId: string,
  request: UpdateUserRequest,
): Promise<UserDetails>`,
        params: [
          {
            name: 'userId',
            type: 'string',
            description: 'Stable id of the user to update.',
          },
          {
            name: 'request',
            type: 'UpdateUserRequest',
            description: 'Multipart update payload containing the fields you want to change.',
            children: [
              {
                name: 'first_name',
                type: 'string | undefined',
                description: 'Updated first name. The backend ignores empty strings here rather than treating them as a clear operation.',
              },
              {
                name: 'last_name',
                type: 'string | undefined',
                description: 'Updated last name. The backend ignores empty strings here rather than treating them as a clear operation.',
              },
              {
                name: 'username',
                type: 'string | undefined',
                description: 'Updated username. Depending on deployment auth settings, username validation rules may still apply.',
              },
              {
                name: 'public_metadata',
                type: 'Record<string, unknown> | undefined',
                description: 'Replacement public metadata object for the user.',
                children: [
                  { name: 'tier', type: 'string | undefined', description: 'Example public tier/plan field.' },
                  { name: 'segment', type: 'string | undefined', description: 'Example public segment label.' },
                ],
              },
              {
                name: 'private_metadata',
                type: 'Record<string, unknown> | undefined',
                description: 'Replacement private metadata object for the user.',
                children: [
                  { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
                  { name: 'risk_score', type: 'number | undefined', description: 'Example internal risk score.' },
                ],
              },
              {
                name: 'disabled',
                type: 'boolean | undefined',
                description: 'When `true`, disables the user. The backend also deletes existing sign-ins for that user when this is set to `true`.',
              },
              {
                name: 'remove_profile_image',
                type: 'boolean | undefined',
                description: 'When `true`, removes the stored profile image.',
              },
              {
                name: 'profile_image',
                type: 'File | Blob | undefined',
                description: 'Optional replacement profile image uploaded with the update request.',
              },
            ],
          },
        ],
        api: [
          {
            name: 'id',
            type: 'string',
            description: 'Stable user identifier.',
          },
          {
            name: 'created_at',
            type: 'string',
            description: 'Creation timestamp.',
          },
          {
            name: 'updated_at',
            type: 'string',
            description: 'Last update timestamp.',
          },
          {
            name: 'first_name',
            type: 'string',
            description: 'Current first name after the update.',
          },
          {
            name: 'last_name',
            type: 'string',
            description: 'Current last name after the update.',
          },
          {
            name: 'username',
            type: 'string | undefined',
            description: 'Current username when one exists.',
          },
          {
            name: 'profile_picture_url',
            type: 'string',
            description: 'Current profile image URL after any upload or removal logic has been applied.',
          },
          {
            name: 'disabled',
            type: 'boolean',
            description: 'Whether the user is currently disabled.',
          },
          {
            name: 'public_metadata',
            type: 'Record<string, unknown>',
            description: 'Current public metadata object.',
            children: [
              { name: 'tier', type: 'string | undefined', description: 'Example public tier/plan field.' },
              { name: 'segment', type: 'string | undefined', description: 'Example public segment label.' },
            ],
          },
          {
            name: 'private_metadata',
            type: 'Record<string, unknown>',
            description: 'Current private metadata object.',
            children: [
              { name: 'internal_notes', type: 'string | undefined', description: 'Example internal note field.' },
              { name: 'risk_score', type: 'number | undefined', description: 'Example internal risk score.' },
            ],
          },
          {
            name: 'primary_email_address',
            type: 'string | undefined',
            description: 'Current primary email address string when one exists.',
          },
          {
            name: 'primary_phone_number',
            type: 'string | undefined',
            description: 'Current primary phone number string when one exists.',
          },
          {
            name: 'email_addresses',
            type: 'UserEmail[]',
            description: 'Resolved user email addresses included in the detailed response.',
          },
          {
            name: 'phone_numbers',
            type: 'UserPhone[]',
            description: 'Resolved user phone numbers included in the detailed response.',
          },
          {
            name: 'social_connections',
            type: 'UserSocialConnection[]',
            description: 'Linked social connections included in the detailed response.',
          },
          {
            name: 'segments',
            type: 'Segment[]',
            description: 'Segments currently attached to the user.',
          },
          {
            name: 'has_password',
            type: 'boolean',
            description: 'Whether the user currently has a password set.',
          },
          {
            name: 'has_backup_codes',
            type: 'boolean',
            description: 'Whether the user currently has backup codes generated.',
          },
        ],
        sections: [
          {
            title: 'What the backend does',
            paragraphs: [
              'The backend updates the user record first and then re-queries the full `UserDetails` payload, so the response is a detailed post-update snapshot rather than the smaller list-style `User` shape.',
              'If you set `remove_profile_image`, the backend clears the stored image and then reloads the user. If you upload a new `profile_image`, the backend uploads it after the record update and then reloads the user again.',
            ],
          },
          {
            title: 'Metadata fields replace their stored values',
            paragraphs: [
              'When you send `public_metadata` or `private_metadata`, the backend treats them as the new stored metadata values for that field.',
              'If you need to preserve part of an existing metadata object, read it first and merge it on your side before calling `updateUser()`.',
            ],
          },
          {
            title: 'Disabling a user is a stronger action than a normal profile edit',
            paragraphs: [
              'When `disabled` is set to `true`, the backend also deletes the user existing sign-ins as part of the update flow.',
              'That makes `updateUser({ disabled: true })` the right administrative action for cutting off access without permanently deleting the user record.',
            ],
          },
        ],
        examples: [
          {
            title: 'Disable a user',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function disableUser(userId: string) {
  const client = await wachtClient();

  return client.users.updateUser(userId, {
    disabled: true,
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Update profile fields and metadata',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateUserProfile(userId: string) {
  const client = await wachtClient();

  return client.users.updateUser(userId, {
    first_name: 'Ada',
    last_name: 'Byron',
    public_metadata: {
      title: 'Administrator',
      team: 'platform',
    },
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Replace the profile image',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function updateUserProfileImage(userId: string, file: File) {
  const client = await wachtClient();

  return client.users.updateUser(userId, {
    profile_image: file,
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Remove the profile image',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function removeUserProfileImage(userId: string) {
  const client = await wachtClient();

  return client.users.updateUser(userId, {
    remove_profile_image: true,
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'delete-user',
        path: ['users', 'delete-user'],
        title: 'deleteUser()',
        description: 'Delete a user by id.',
        intro:
          '`client.users.deleteUser(userId)` permanently removes a user through the backend management API.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function deleteUser(userId: string) {
  const client = await wachtClient();
  await client.users.deleteUser(userId);
}`,
        signature: `function deleteUser(
  userId: string,
): Promise<void>`,
        params: [
          {
            name: 'userId',
            type: 'string',
            description: 'Stable id of the user to delete.',
          },
        ],
        sections: [
          {
            title: 'When to use it',
            paragraphs: [
              'Use `deleteUser()` for administrative cleanup and hard-delete flows where the user record should no longer exist.',
              'If you only need to stop access temporarily, `updateUser()` with `disabled: true` is usually the safer option.',
            ],
          },
          {
            title: 'Return value',
            paragraphs: [
              'This method does not return a user object. A successful call resolves with no value.',
            ],
          },
        ],
        examples: [
          {
            title: 'Delete a user',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function deleteUser(userId: string) {
  const client = await wachtClient();
  await client.users.deleteUser(userId);
}`,
            lang: 'ts',
          },
          {
            title: 'Delete after a final lookup',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function deleteDisabledUser(userId: string) {
  const client = await wachtClient();
  const user = await client.users.getUser(userId);

  if (!user.disabled) {
    throw new Error('Refusing to delete an active user');
  }

  await client.users.deleteUser(userId);
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'update-password',
        path: ['users', 'update-password'],
        title: 'updatePassword()',
        description: 'Update a user password by id.',
        intro:
          'Updates the password for one user through the backend management API.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updatePassword(userId: string, newPassword: string) {
  const client = await wachtClient();

  await client.users.updatePassword(userId, {
    new_password: newPassword,
  });
}`,
        signature: `function updatePassword(
  userId: string,
  request: UpdatePasswordRequest,
): Promise<void>`,
        params: [
          {
            name: 'userId',
            type: 'string',
            description: 'Stable id of the user whose password should be changed.',
          },
          {
            name: 'request',
            type: 'UpdatePasswordRequest',
            description: 'Password update payload.',
            children: [
              {
                name: 'new_password',
                type: 'string',
                description: 'New password to set for the user.',
              },
              {
                name: 'skip_password_check',
                type: 'boolean | undefined',
                description: 'When `true`, bypasses the normal password validation check.',
              },
            ],
          },
        ],
        sections: [
          {
            title: 'What it does',
            paragraphs: [
              'This is the direct administrative password-change operation for an existing user.',
              'It updates the stored password and does not return a user object on success.',
            ],
          },
          {
            title: 'Validation',
            paragraphs: [
              'The backend validates the new password against the deployment password rules unless you explicitly pass `skip_password_check: true`.',
              'Use the skip flag carefully. It is an override for administrative flows, not the normal default.',
            ],
          },
          {
            title: 'Return value',
            paragraphs: [
              'This method resolves with no value when the password update succeeds.',
            ],
          },
        ],
        examples: [
          {
            title: 'Set a new password',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function resetPassword(userId: string, newPassword: string) {
  const client = await wachtClient();

  await client.users.updatePassword(userId, {
    new_password: newPassword,
  });
}`,
            lang: 'ts',
          },
          {
            title: 'Skip password checks during an import or recovery flow',
            code: `import { wachtClient } from '@wacht/nextjs/server';

export async function importPassword(userId: string, password: string) {
  const client = await wachtClient();

  await client.users.updatePassword(userId, {
    new_password: password,
    skip_password_check: true,
  });
}`,
            lang: 'ts',
          },
        ],
      },
{
        slug: 'add-email',
        path: ['users', 'add-email'],
        title: 'addEmail()',
        description: 'Add an email address to a user.',
        intro:
          'Creates a user email identifier for the target user id.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function addEmail(userId: string, email: string) {
  const client = await wachtClient();
  return client.users.addEmail(userId, { email });
}`,
        signature: `function addEmail(
  userId: string,
  request: AddEmailRequest,
): Promise<UserEmail>`,
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
        slug: 'update-email',
        path: ['users', 'update-email'],
        title: 'updateEmail()',
        description: 'Update a user email identifier.',
        intro:
          'Updates one email identifier by id for a specific user.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function markPrimaryEmail(userId: string, emailId: string) {
  const client = await wachtClient();
  return client.users.updateEmail(userId, emailId, { is_primary: true });
}`,
        signature: `function updateEmail(
  userId: string,
  emailId: string,
  request: UpdateEmailRequest,
): Promise<UserEmail>`,
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
        slug: 'delete-email',
        path: ['users', 'delete-email'],
        title: 'deleteEmail()',
        description: 'Delete a user email identifier.',
        intro:
          'Removes one email identifier from the target user.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function deleteEmail(userId: string, emailId: string) {
  const client = await wachtClient();
  await client.users.deleteEmail(userId, emailId);
}`,
        signature: `function deleteEmail(
  userId: string,
  emailId: string,
): Promise<void>`,
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
        slug: 'add-phone',
        path: ['users', 'add-phone'],
        title: 'addPhone()',
        description: 'Add a phone number to a user.',
        intro:
          'Creates a user phone identifier for the target user id.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function addPhone(userId: string) {
  const client = await wachtClient();
  return client.users.addPhone(userId, {
    phone_number: '+14155552671',
    country_code: 'US',
  });
}`,
        signature: `function addPhone(
  userId: string,
  request: AddPhoneRequest,
): Promise<UserPhone>`,
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
        slug: 'update-phone',
        path: ['users', 'update-phone'],
        title: 'updatePhone()',
        description: 'Update a user phone identifier.',
        intro:
          'Updates one phone identifier by id for a specific user.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function updatePhone(userId: string, phoneId: string) {
  const client = await wachtClient();
  return client.users.updatePhone(userId, phoneId, { verified: true });
}`,
        signature: `function updatePhone(
  userId: string,
  phoneId: string,
  request: UpdatePhoneRequest,
): Promise<UserPhone>`,
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
        slug: 'delete-phone',
        path: ['users', 'delete-phone'],
        title: 'deletePhone()',
        description: 'Delete a user phone identifier.',
        intro:
          'Removes one phone identifier from the target user.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function deletePhone(userId: string, phoneId: string) {
  const client = await wachtClient();
  await client.users.deletePhone(userId, phoneId);
}`,
        signature: `function deletePhone(
  userId: string,
  phoneId: string,
): Promise<void>`,
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
        slug: 'delete-social-connection',
        path: ['users', 'delete-social-connection'],
        title: 'deleteSocialConnection()',
        description: 'Delete a user social connection by id.',
        intro:
          'Removes one social identity connection from the target user.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function unlinkSocial(userId: string, connectionId: string) {
  const client = await wachtClient();
  await client.users.deleteSocialConnection(userId, connectionId);
}`,
        signature: `function deleteSocialConnection(
  userId: string,
  connectionId: string,
): Promise<void>`,
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
        slug: 'list-invitations',
        path: ['users', 'list-invitations'],
        title: 'listInvitations()',
        description: 'List deployment invitations.',
        intro:
          'Returns paginated invitation rows with optional search/sort filters.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listInvitations() {
  const client = await wachtClient();
  return client.invitations.listInvitations({ limit: 20 });
}`,
        signature: `function listInvitations(
  options?: {
    limit?: number;
    offset?: number;
    sort_key?: string;
    sort_order?: string;
    search?: string;
  },
): Promise<PaginatedResponse<DeploymentInvitation>>`,
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
        slug: 'invite-user',
        path: ['users', 'invite-user'],
        title: 'inviteUser()',
        description: 'Create a deployment invitation.',
        intro:
          'Creates an invitation for a future user account.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function inviteUser(email: string) {
  const client = await wachtClient();
  return client.invitations.inviteUser({
    first_name: 'Ada',
    last_name: 'Lovelace',
    email_address: email,
    expiry_days: 7,
  });
}`,
        signature: `function inviteUser(
  request: InviteUserRequest,
): Promise<DeploymentInvitation>`,
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
        slug: 'delete-invitation',
        path: ['users', 'delete-invitation'],
        title: 'deleteInvitation()',
        description: 'Delete one invitation by id.',
        intro:
          'Removes a pending invitation record.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function deleteInvitation(invitationId: string) {
  const client = await wachtClient();
  await client.invitations.deleteInvitation(invitationId);
}`,
        signature: `function deleteInvitation(
  invitationId: string,
): Promise<void>`,
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
        slug: 'list-waitlist',
        path: ['users', 'list-waitlist'],
        title: 'listWaitlist()',
        description: 'List deployment waitlist users.',
        intro:
          'Returns paginated waitlist rows with optional search/sort filters.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listWaitlist() {
  const client = await wachtClient();
  return client.invitations.listWaitlist({ limit: 20 });
}`,
        signature: `function listWaitlist(
  options?: {
    limit?: number;
    offset?: number;
    sort_key?: string;
    sort_order?: string;
    search?: string;
  },
): Promise<PaginatedResponse<DeploymentWaitlistUser>>`,
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
        slug: 'approve-waitlist-user',
        path: ['users', 'approve-waitlist-user'],
        title: 'approveWaitlistUser()',
        description: 'Approve a waitlist user and create invitation.',
        intro:
          'Approves a waitlist entry and returns the generated invitation.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function approveWaitlistUser(waitlistUserId: string) {
  const client = await wachtClient();
  return client.invitations.approveWaitlistUser(waitlistUserId);
}`,
        signature: `function approveWaitlistUser(
  waitlistUserId: string,
): Promise<DeploymentInvitation>`,
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
];
