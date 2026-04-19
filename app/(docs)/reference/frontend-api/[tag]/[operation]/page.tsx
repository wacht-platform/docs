import { FrontendAPIPage, frontendApiServer } from '@/lib/openapi';
import { DocsPage, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import frontendManifest from '@/public/openapi/frontend-api-manifest.json';
import type { Metadata } from 'next';
import { buildDocsMetadata } from '@/lib/seo';

export default async function Page(props: PageProps<'/reference/frontend-api/[tag]/[operation]'>) {
  const { tag, operation } = await props.params;
  const tagEntry = frontendManifest.tags.find(t => t.slug === tag);
  const opEntry = tagEntry?.operations.find(op => op.slug === operation);
  if (!opEntry) notFound();

  return (
    <DocsPage full className="pt-6 md:pt-6 xl:pt-6">
      <DocsBody>
        <div className="openapi-page">
          <FrontendAPIPage
            document="frontend-api"
            operations={[{ path: opEntry.path, method: opEntry.method.toLowerCase() as any }]}
            showTitle
          />
        </div>
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return frontendManifest.tags.flatMap(tag =>
    tag.operations.map(op => ({ tag: tag.slug, operation: op.slug }))
  );
}

export async function generateMetadata(props: PageProps<'/reference/frontend-api/[tag]/[operation]'>): Promise<Metadata> {
  const { tag, operation } = await props.params;
  const tagEntry = frontendManifest.tags.find(t => t.slug === tag);
  const opEntry = tagEntry?.operations.find(op => op.slug === operation);
  if (!opEntry) {
    return buildDocsMetadata({
      title: 'Frontend API',
      description: 'Reference for Wacht frontend API operations.',
      path: '/docs/reference/frontend-api',
      keywords: ['Wacht frontend API', 'API reference', 'OpenAPI'],
      category: 'api reference',
    });
  }

  return buildDocsMetadata({
    title: `${opEntry.name} — Frontend API`,
    description: `${opEntry.method} ${opEntry.path}`,
    path: `/docs/reference/frontend-api/${tag}/${operation}`,
    keywords: ['Wacht frontend API', tag, opEntry.method, opEntry.path, opEntry.name],
    category: 'api reference',
  });
}
