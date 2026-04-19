import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const organizationsGeneratedDocOverrides: Record<string, Partial<BackendDoc>> = {
  updateOrganizationMember: {
    description: 'Update one organization membership.',
    intro: 'Patches an existing organization membership record.',
  },
  removeOrganizationMember: {
    description: 'Remove one organization membership.',
    intro: 'Deletes an existing organization membership record.',
  },
  updateOrganizationRole: {
    description: 'Update one organization role.',
    intro: 'Patches a custom organization role definition.',
  },
  deleteOrganizationRole: {
    description: 'Delete one organization role.',
    intro: 'Deletes a custom organization role definition.',
  },
};
