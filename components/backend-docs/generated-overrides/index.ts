import type { BackendDoc } from '@/components/shared-backend-pages.types';
import { usersGeneratedDocOverrides } from '@/components/backend-docs/generated-overrides/users';
import { organizationsGeneratedDocOverrides } from '@/components/backend-docs/generated-overrides/organizations';
import { workspacesGeneratedDocOverrides } from '@/components/backend-docs/generated-overrides/workspaces';
import { apiKeysGeneratedDocOverrides } from '@/components/backend-docs/generated-overrides/api-keys';
import { webhooksGeneratedDocOverrides } from '@/components/backend-docs/generated-overrides/webhooks';
import { agentsGeneratedDocOverrides } from '@/components/backend-docs/generated-overrides/agents';
import { oauthGeneratedDocOverrides } from '@/components/backend-docs/generated-overrides/oauth';
import { operationsGeneratedDocOverrides } from '@/components/backend-docs/generated-overrides/operations';
import { settingsGeneratedDocOverrides } from '@/components/backend-docs/generated-overrides/settings';
import { segmentsGeneratedDocOverrides } from '@/components/backend-docs/generated-overrides/segments';

export const generatedDocOverrides: Record<string, Partial<BackendDoc>> = {
  ...usersGeneratedDocOverrides,
  ...organizationsGeneratedDocOverrides,
  ...workspacesGeneratedDocOverrides,
  ...apiKeysGeneratedDocOverrides,
  ...webhooksGeneratedDocOverrides,
  ...agentsGeneratedDocOverrides,
  ...oauthGeneratedDocOverrides,
  ...operationsGeneratedDocOverrides,
  ...settingsGeneratedDocOverrides,
  ...segmentsGeneratedDocOverrides,
};
