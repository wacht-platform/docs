import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound, permanentRedirect } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import {
  buildSharedSdkToc,
  getSharedSdkMarkdownUrl,
  getSharedSdkDoc,
  getSharedSdkDocParams,
  SharedSdkDocPage,
} from '@/components/shared-sdk-pages';
import {
  buildSharedBackendToc,
  getSharedBackendMarkdownUrl,
  getSharedBackendDoc,
  getSharedBackendDocParams,
  SharedBackendDocPage,
} from '@/components/shared-backend-pages';
import {
  buildRustBackendToc,
  getRustBackendDoc,
  getRustBackendDocParams,
  getRustBackendMarkdownUrl,
  RustBackendDocPage,
} from '@/components/rust-backend-pages';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { buildDocsMetadata } from '@/lib/seo';

function frameworkSeoLabel(framework: 'nextjs' | 'react-router' | 'tanstack-router' | 'node' | 'rust') {
  if (framework === 'nextjs') return 'Next.js SDK';
  if (framework === 'react-router') return 'React Router SDK';
  if (framework === 'tanstack-router') return 'TanStack Router SDK';
  if (framework === 'node') return 'Node SDK';
  return 'Rust SDK';
}

function frameworkSeoKeywords(framework: 'nextjs' | 'react-router' | 'tanstack-router' | 'node' | 'rust') {
  if (framework === 'nextjs') return ['Next.js', 'Wacht Next.js SDK', 'React Server Components'];
  if (framework === 'react-router') return ['React Router', 'Wacht React Router SDK'];
  if (framework === 'tanstack-router') return ['TanStack Router', 'Wacht TanStack Router SDK'];
  if (framework === 'node') return ['Node.js', 'Wacht Node SDK'];
  return ['Rust', 'wacht crate', 'wacht-rs'];
}

export default async function Page(props: PageProps<'/[...slug]'>) {
  const params = await props.params;

  if (params.slug?.length === 1 && params.slug[0] === 'sdks') {
    permanentRedirect('/sdks/nextjs');
  }

  if (
    params.slug?.length === 2 &&
    params.slug[0] === 'sdks' &&
    (params.slug[1] === 'react-router' || params.slug[1] === 'tanstack-router')
  ) {
    permanentRedirect(`/sdks/${params.slug[1]}/quickstart`);
  }

  if (params.slug?.length === 2 && params.slug[0] === 'sdks' && params.slug[1] === 'nextjs') {
    permanentRedirect('/sdks/nextjs/quickstart');
  }

  const page = source.getPage(params.slug);
  const sharedDoc =
    params.slug.length === 4 &&
    params.slug[0] === 'sdks' &&
    (params.slug[1] === 'nextjs' || params.slug[1] === 'react-router' || params.slug[1] === 'tanstack-router') &&
    (params.slug[2] === 'components' || params.slug[2] === 'hooks')
      ? getSharedSdkDoc(params.slug[1], params.slug[2], params.slug[3])
      : null;
  const sharedBackendDoc =
    params.slug.length >= 4 &&
    params.slug[0] === 'sdks' &&
    (params.slug[1] === 'nextjs' || params.slug[1] === 'react-router' || params.slug[1] === 'tanstack-router' || params.slug[1] === 'node') &&
    params.slug[2] === 'backend'
      ? getSharedBackendDoc(params.slug[1], params.slug.slice(3))
      : null;
  const rustBackendDoc =
    params.slug.length >= 4 &&
    params.slug[0] === 'sdks' &&
    params.slug[1] === 'rust' &&
    params.slug[2] === 'backend'
      ? getRustBackendDoc(params.slug.slice(3))
      : null;

  if (!page && !sharedDoc && !sharedBackendDoc && !rustBackendDoc) notFound();

  if (!page && sharedDoc) {
    return (
      <DocsPage toc={buildSharedSdkToc(sharedDoc, sharedDoc.kind)} className="pt-12 md:pt-12 xl:pt-12">
        <DocsBody>
          <SharedSdkDocPage
            framework={sharedDoc.framework}
            kind={sharedDoc.kind}
            slug={sharedDoc.slug}
            markdownUrl={getSharedSdkMarkdownUrl(sharedDoc.framework, sharedDoc.kind, sharedDoc.slug)}
          />
        </DocsBody>
      </DocsPage>
    );
  }

  if (!page && sharedBackendDoc) {
    return (
      <DocsPage toc={buildSharedBackendToc(sharedBackendDoc)} className="pt-12 md:pt-12 xl:pt-12">
        <DocsBody>
          <SharedBackendDocPage
            framework={sharedBackendDoc.framework}
            slug={sharedBackendDoc.slug}
            markdownUrl={getSharedBackendMarkdownUrl(sharedBackendDoc.framework, sharedBackendDoc.slug)}
          />
        </DocsBody>
      </DocsPage>
    );
  }
  if (!page && rustBackendDoc) {
    return (
      <DocsPage toc={buildRustBackendToc(rustBackendDoc)} className="pt-12 md:pt-12 xl:pt-12">
        <DocsBody>
          <RustBackendDocPage
            slug={rustBackendDoc.slug}
            markdownUrl={getRustBackendMarkdownUrl(rustBackendDoc.slug)}
          />
        </DocsBody>
      </DocsPage>
    );
  }

  const MDX = page!.data.body;
  const markdownUrl = getPageMarkdownUrl(page!).url;

  return (
    <DocsPage
      toc={page!.data.toc}
      full={page!.data.full}
      className="pt-6 md:pt-6 xl:pt-6"
    >
      <DocsTitle className="text-2xl font-normal">{page!.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page!.data.description}</DocsDescription>
      <div className="flex flex-row items-center gap-2 pb-4">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page!.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page!),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return [...source.generateParams(), ...getSharedSdkDocParams(), ...getSharedBackendDocParams(), ...getRustBackendDocParams()];
}

export async function generateMetadata(props: PageProps<'/[...slug]'>): Promise<Metadata> {
  const params = await props.params;
  const slugSegments = params.slug;
  const page = source.getPage(slugSegments);
  const sharedDoc =
    slugSegments?.length === 4 &&
    slugSegments[0] === 'sdks' &&
    (slugSegments[1] === 'nextjs' || slugSegments[1] === 'react-router' || slugSegments[1] === 'tanstack-router') &&
    (slugSegments[2] === 'components' || slugSegments[2] === 'hooks')
      ? getSharedSdkDoc(slugSegments[1], slugSegments[2], slugSegments[3])
      : null;
  const sharedBackendDoc =
    slugSegments?.length !== undefined &&
    slugSegments.length >= 4 &&
    slugSegments[0] === 'sdks' &&
    (slugSegments[1] === 'nextjs' || slugSegments[1] === 'react-router' || slugSegments[1] === 'tanstack-router' || slugSegments[1] === 'node') &&
    slugSegments[2] === 'backend'
      ? getSharedBackendDoc(slugSegments[1], slugSegments.slice(3))
      : null;
  const rustBackendDoc =
    slugSegments?.length !== undefined &&
    slugSegments.length >= 4 &&
    slugSegments[0] === 'sdks' &&
    slugSegments[1] === 'rust' &&
    slugSegments[2] === 'backend'
      ? getRustBackendDoc(slugSegments.slice(3))
      : null;

  if (!page && !sharedDoc && !sharedBackendDoc && !rustBackendDoc) notFound();

  if (!page && sharedDoc) {
    const frameworkLabel = frameworkSeoLabel(sharedDoc.framework);
    return buildDocsMetadata({
      title: `${sharedDoc.title} — ${frameworkLabel}`,
      description: `${sharedDoc.description} ${frameworkLabel} usage, API shape, and examples.`,
      path: `/docs/sdks/${sharedDoc.framework}/${sharedDoc.kind}/${sharedDoc.slug}`,
      keywords: [...frameworkSeoKeywords(sharedDoc.framework), sharedDoc.kind, sharedDoc.slug, 'Wacht SDK'],
      category: 'sdk documentation',
    });
  }

  if (!page && sharedBackendDoc) {
    const frameworkLabel = frameworkSeoLabel(sharedBackendDoc.framework);
    return buildDocsMetadata({
      title: `${sharedBackendDoc.title} — ${frameworkLabel}`,
      description: `${sharedBackendDoc.description} ${frameworkLabel} backend method usage, parameters, return types, and examples.`,
      path: `/docs/sdks/${sharedBackendDoc.framework}/backend/${sharedBackendDoc.slug}`,
      keywords: [...frameworkSeoKeywords(sharedBackendDoc.framework), 'backend SDK', sharedBackendDoc.slug, 'Wacht backend'],
      category: 'api reference',
    });
  }
  if (!page && rustBackendDoc) {
    const frameworkLabel = frameworkSeoLabel('rust');
    return buildDocsMetadata({
      title: `${rustBackendDoc.title} — ${frameworkLabel}`,
      description: `${rustBackendDoc.description} Rust backend method usage with typed request builders and async examples.`,
      path: `/docs/sdks/rust/backend/${rustBackendDoc.slug}`,
      keywords: [...frameworkSeoKeywords('rust'), 'Rust backend SDK', rustBackendDoc.slug],
      category: 'api reference',
    });
  }

  return buildDocsMetadata({
    title: page!.data.title,
    description: page!.data.description,
    path: page!.url,
    ogImagePath: getPageImage(page!).url,
    keywords: [page!.data.title, ...(slugSegments ?? []), 'Wacht Docs'],
    category: page!.url.startsWith('/docs/reference') ? 'api reference' : 'developer documentation',
  });
}
