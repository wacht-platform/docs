import type { Metadata } from 'next';
import { appName, siteDescription, siteUrl } from '@/lib/shared';

const defaultOgImage = '/Wacht.png';

export function getAbsoluteUrl(path: string) {
  return new URL(path, siteUrl);
}

export function buildDocsMetadata({
  title,
  description,
  path,
  ogImagePath,
  keywords,
  category,
}: {
  title: string;
  description?: string | null;
  path: string;
  ogImagePath?: string;
  keywords?: string[];
  category?: string;
}): Metadata {
  const resolvedDescription = description?.trim() || siteDescription;
  const absoluteUrl = getAbsoluteUrl(path).toString();
  const absoluteImageUrl = getAbsoluteUrl(ogImagePath || defaultOgImage).toString();
  const resolvedKeywords = keywords?.length
    ? keywords
    : ['Wacht', 'Wacht Docs', 'SDK', 'API', 'authentication', 'webhooks', 'OAuth'];

  return {
    title,
    description: resolvedDescription,
    keywords: resolvedKeywords,
    category: category || 'developer documentation',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      type: 'article',
      siteName: appName,
      title,
      description: resolvedDescription,
      url: absoluteUrl,
      images: [{ url: absoluteImageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: resolvedDescription,
      images: [absoluteImageUrl],
    },
  };
}
