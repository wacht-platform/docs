import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const operationsGeneratedDocOverrides: Record<string, Partial<BackendDoc>> = {
  uploadImage: {
    description: 'Upload deployment images used by settings and profiles.',
    intro: 'Uploads image file data and returns the resolved URL.',
    signature: `function uploadImage(
  imageType: 'logo' | 'favicon' | 'user-profile' | 'org-profile' | 'workspace-profile',
  file: File,
): Promise<{ url: string }>`,
    params: [
      { name: 'imageType', type: `'logo' | 'favicon' | 'user-profile' | 'org-profile' | 'workspace-profile'`, description: 'Upload target bucket/type.' },
      { name: 'file', type: 'File', description: 'Image file payload.' },
    ],
    api: [{ name: 'url', type: 'string', description: 'Resolved uploaded image URL.' }],
  },
};
