import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { siteUrl } from '@/lib/shared';
import { getSharedSdkDocParams } from '@/components/shared-sdk-pages';
import { getSharedBackendDocParams } from '@/components/shared-backend-pages';
import { getRustBackendDocParams } from '@/components/rust-backend-pages';
import platformManifest from '@/public/openapi/platform-api-manifest.json';
import frontendManifest from '@/public/openapi/frontend-api-manifest.json';

function asAbsoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

function pathPriority(path: string) {
  if (path === '/') return 1;
  if (path === '/docs') return 0.95;
  if (path.endsWith('/quickstart') || path.endsWith('/getting-started')) return 0.9;
  if (path.startsWith('/docs/reference/')) return 0.7;
  return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const uniquePaths = new Set<string>([
    '/',
    '/docs',
    '/docs/guides',
    '/docs/reference',
    '/docs/reference/backend-api',
    '/docs/reference/frontend-api',
    '/docs/sdks',
    '/docs/sdks/nextjs',
    '/docs/sdks/react-router',
    '/docs/sdks/tanstack-router',
    '/docs/sdks/rust',
    '/docs/sdks/node',
  ]);
  const lastModified = new Date();

  for (const page of source.getPages() as Array<{ url: string }>) {
    uniquePaths.add(page.url);
  }

  for (const params of getSharedSdkDocParams()) {
    uniquePaths.add(`/docs/${params.slug.join('/')}`);
  }

  for (const params of getSharedBackendDocParams()) {
    uniquePaths.add(`/docs/${params.slug.join('/')}`);
  }

  for (const params of getRustBackendDocParams()) {
    uniquePaths.add(`/docs/${params.slug.join('/')}`);
  }

  for (const tag of platformManifest.tags) {
    for (const op of tag.operations) {
      uniquePaths.add(`/docs/reference/backend-api/${tag.slug}/${op.slug}`);
    }
  }

  for (const tag of frontendManifest.tags) {
    for (const op of tag.operations) {
      uniquePaths.add(`/docs/reference/frontend-api/${tag.slug}/${op.slug}`);
    }
  }

  return [...uniquePaths]
    .sort((a, b) => a.localeCompare(b))
    .map((path) => ({
      url: asAbsoluteUrl(path),
      lastModified,
      changeFrequency: path.startsWith('/docs/reference/') ? 'weekly' : 'monthly',
      priority: pathPriority(path),
    }));
}
