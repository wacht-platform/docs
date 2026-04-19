import type { BackendFrameworkKey, BackendGroup, BackendMeta } from '@/components/shared-backend-pages.types';
import { foundationBackendDocs } from '@/components/backend-docs/catalog/foundation';
import { usersBackendDocs } from '@/components/backend-docs/catalog/users';
import { organizationsBackendDocs } from '@/components/backend-docs/catalog/organizations';
import { workspacesBackendDocs } from '@/components/backend-docs/catalog/workspaces';
import { apiKeysBackendDocs } from '@/components/backend-docs/catalog/api-keys';
import { webhooksBackendDocs } from '@/components/backend-docs/catalog/webhooks';
import { agentsBackendDocs } from '@/components/backend-docs/catalog/agents';
import { oauthBackendDocs } from '@/components/backend-docs/catalog/oauth';
import { operationsBackendDocs } from '@/components/backend-docs/catalog/operations';
import { settingsBackendDocs } from '@/components/backend-docs/catalog/settings';
import { segmentsBackendDocs } from '@/components/backend-docs/catalog/segments';

export const backendMeta: Record<BackendFrameworkKey, BackendMeta> = {
  nextjs: {
    label: 'Next.js',
    importPath: '@wacht/nextjs/server',
    defaultClientExpression: 'await wachtClient()',
  },
  'react-router': {
    label: 'React Router',
    importPath: '@wacht/react-router/server',
    defaultClientExpression: 'await wachtClient()',
  },
  'tanstack-router': {
    label: 'TanStack Router',
    importPath: '@wacht/tanstack-router/server',
    defaultClientExpression: 'await wachtClient()',
  },
  node: {
    label: 'Node',
    importPath: '@wacht/backend',
    defaultClientExpression: "new WachtClient({ apiKey: process.env.WACHT_API_KEY! })",
  },
};

export const backendGroups: BackendGroup[] = [
  { label: 'Foundation', docs: foundationBackendDocs },
  { label: 'Users', docs: usersBackendDocs },
  { label: 'Organizations', docs: organizationsBackendDocs },
  { label: 'Workspaces', docs: workspacesBackendDocs },
  { label: 'API keys', docs: apiKeysBackendDocs },
  { label: 'Webhooks', docs: webhooksBackendDocs },
  { label: 'Agents', docs: agentsBackendDocs },
  { label: 'OAuth', docs: oauthBackendDocs },
  { label: 'Utility', docs: operationsBackendDocs },
  { label: 'Settings', docs: settingsBackendDocs },
  { label: 'Segments', docs: segmentsBackendDocs },
];
