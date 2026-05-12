import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute } from '@/lib/shared';

// path-to-regexp v8: a leading `/` before `{/*path}` would force a double-slash
// at match time and break every nested path. Keep the optional-prefix group as
// the only `/` source.
const { rewrite: rewriteDocs } = rewritePath(
  `{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteMdxSuffix } = rewritePath(
  `{/*path}.mdx`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteMdSuffix } = rewritePath(
  `{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

function rewriteSuffix(pathname: string): string | false {
  return rewriteMdSuffix(pathname) || rewriteMdxSuffix(pathname);
}

function rewriteTo(request: NextRequest, target: string) {
  const url = request.nextUrl.clone();
  url.pathname = target;
  return NextResponse.rewrite(url);
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const suffixResult = rewriteSuffix(pathname);
  if (suffixResult) {
    return rewriteTo(request, suffixResult);
  }

  if (isMarkdownPreferred(request)) {
    const docsResult = rewriteDocs(pathname);
    if (docsResult) {
      return rewriteTo(request, docsResult);
    }
  }

  return NextResponse.next();
}
