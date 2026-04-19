import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const workspacesGeneratedDocOverrides: Record<string, Partial<BackendDoc>> = {
  updateWorkspaceMember: {
    description: 'Update one workspace membership.',
    intro: 'Patches an existing workspace membership record.',
  },
  removeWorkspaceMember: {
    description: 'Remove one workspace membership.',
    intro: 'Deletes an existing workspace membership record.',
  },
  updateWorkspaceRole: {
    description: 'Update one workspace role.',
    intro: 'Patches a custom workspace role definition.',
  },
  deleteWorkspaceRole: {
    description: 'Delete one workspace role.',
    intro: 'Deletes a custom workspace role definition.',
  },
};
