import type { SharedGroup } from './shared-sdk-pages.types';
import { coreStateHookGroup } from './shared-sdk-pages.hooks.core-state';
import { authFlowsHookGroup } from './shared-sdk-pages.hooks.auth-flows';
import { organizationsHookGroup } from './shared-sdk-pages.hooks.organizations';
import { notificationsHookGroup } from './shared-sdk-pages.hooks.notifications';
import { agentsHookGroup } from './shared-sdk-pages.hooks.agents';
import { webhooksHookGroup } from './shared-sdk-pages.hooks.webhooks';
import { apiIdentityHookGroup } from './shared-sdk-pages.hooks.api-identity';

export const hookGroups: SharedGroup[] = [
  coreStateHookGroup,
  authFlowsHookGroup,
  organizationsHookGroup,
  notificationsHookGroup,
  agentsHookGroup,
  webhooksHookGroup,
  apiIdentityHookGroup,
];
