import type { SharedGroup } from './shared-sdk-pages.types';
import { frameworkMeta } from './shared-sdk-pages.catalog';
import { controlComponentGroup } from './shared-sdk-pages.components.control';
import { authUiComponentGroup } from './shared-sdk-pages.components.auth-ui';
import { accountComponentGroup } from './shared-sdk-pages.components.account';
import { organizationWorkspaceComponentGroup } from './shared-sdk-pages.components.org-workspace';
import { notificationsComponentGroup } from './shared-sdk-pages.components.notifications';

export { frameworkMeta };

export const componentGroups: SharedGroup[] = [
  controlComponentGroup,
  authUiComponentGroup,
  accountComponentGroup,
  organizationWorkspaceComponentGroup,
  notificationsComponentGroup,
];
