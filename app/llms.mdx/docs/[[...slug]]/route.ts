import { buildSharedSdkMarkdown, getSharedSdkDoc, getSharedSdkDocParams } from '@/components/shared-sdk-pages';
import { buildSharedBackendMarkdown, getSharedBackendDoc, getSharedBackendDocParams } from '@/components/shared-backend-pages';
import { buildRustBackendMarkdown, getRustBackendDoc, getRustBackendDocParams } from '@/components/rust-backend-pages';
import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;
const llmsHeaders = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'X-Robots-Tag': 'noindex',
};

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const page = source.getPage(slug?.slice(0, -1));
  if (page) {
    return new Response(await getLLMText(page), {
      headers: llmsHeaders,
    });
  }

  const sharedDoc =
    slug?.length === 5 && slug[0] === 'sdks' && (slug[2] === 'components' || slug[2] === 'hooks')
      ? getSharedSdkDoc(slug[1] as 'nextjs' | 'react-router' | 'tanstack-router', slug[2], slug[3])
      : null;
  const sharedBackendDoc =
    slug &&
    slug.length >= 5 &&
    slug[0] === 'sdks' &&
    slug[2] === 'backend' &&
    (slug[1] === 'nextjs' || slug[1] === 'react-router' || slug[1] === 'tanstack-router' || slug[1] === 'node')
      ? getSharedBackendDoc(slug[1], slug.slice(3, -1))
      : null;
  const rustBackendDoc =
    slug &&
    slug.length >= 5 &&
    slug[0] === 'sdks' &&
    slug[1] === 'rust' &&
    slug[2] === 'backend'
      ? getRustBackendDoc(slug.slice(3, -1))
      : null;

  if (!sharedDoc && !sharedBackendDoc && !rustBackendDoc) notFound();

  if (sharedBackendDoc) {
    return new Response(buildSharedBackendMarkdown({ doc: sharedBackendDoc }), {
      headers: llmsHeaders,
    });
  }
  if (rustBackendDoc) {
    return new Response(buildRustBackendMarkdown({ doc: rustBackendDoc }), {
      headers: llmsHeaders,
    });
  }

  return new Response(
    buildSharedSdkMarkdown({
      doc: sharedDoc!,
      framework: sharedDoc!.framework,
      kind: sharedDoc!.kind,
    }),
    {
      headers: llmsHeaders,
    },
  );
}

export function generateStaticParams() {
  const sharedParams = getSharedSdkDocParams().map(({ slug }) => ({
    lang: 'en',
    slug: [...slug, 'content.md'],
  }));
  const sharedBackendParams = getSharedBackendDocParams().map(({ slug }) => ({
    lang: 'en',
    slug: [...slug, 'content.md'],
  }));
  const rustBackendParams = getRustBackendDocParams().map(({ slug }) => ({
    lang: 'en',
    slug: [...slug, 'content.md'],
  }));

  return [
    ...source.getPages().map((page: any) => ({
      lang: page.locale,
      slug: getPageMarkdownUrl(page).segments,
    })),
    ...sharedParams,
    ...sharedBackendParams,
    ...rustBackendParams,
  ];
}
