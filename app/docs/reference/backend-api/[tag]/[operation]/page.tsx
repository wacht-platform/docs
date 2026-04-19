import { PlatformAPIPage, platformApiServer } from '@/lib/openapi';
import { DocsPage, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import platformManifest from '@/public/openapi/platform-api-manifest.json';
import type { Metadata } from 'next';
import { buildDocsMetadata } from '@/lib/seo';

export default async function Page(props: PageProps<'/docs/reference/backend-api/[tag]/[operation]'>) {
  const { tag, operation } = await props.params;
  const tagEntry = platformManifest.tags.find(t => t.slug === tag);
  const opEntry = tagEntry?.operations.find(op => op.slug === operation);
  if (!opEntry) notFound();

  return (
    <DocsPage full className="pt-6 md:pt-6 xl:pt-6">
      <DocsBody>
        <div className="openapi-page">
          <PlatformAPIPage
            document="platform-api"
            operations={[{ path: opEntry.path, method: opEntry.method.toLowerCase() as any }]}
            showTitle
          />
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return platformManifest.tags.flatMap(tag =>
    tag.operations.map(op => ({ tag: tag.slug, operation: op.slug }))
  );
}

export async function generateMetadata(props: PageProps<'/docs/reference/backend-api/[tag]/[operation]'>): Promise<Metadata> {
  const { tag, operation } = await props.params;
  const tagEntry = platformManifest.tags.find(t => t.slug === tag);
  const opEntry = tagEntry?.operations.find(op => op.slug === operation);
  if (!opEntry) {
    return buildDocsMetadata({
      title: 'Backend API',
      description: 'Reference for Wacht backend API operations.',
      path: '/docs/reference/backend-api',
      keywords: ['Wacht backend API', 'API reference', 'OpenAPI'],
      category: 'api reference',
    });
  }

  return buildDocsMetadata({
    title: `${opEntry.name} — Backend API`,
    description: `${opEntry.method} ${opEntry.path}`,
    path: `/docs/reference/backend-api/${tag}/${operation}`,
    keywords: ['Wacht backend API', tag, opEntry.method, opEntry.path, opEntry.name],
    category: 'api reference',
  });
}
