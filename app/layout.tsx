import { RootProvider } from 'fumadocs-ui/provider/next';
import Link from 'next/link';
import './global.css';
import type { Metadata, Viewport } from 'next';
import { appName, siteDescription, siteUrl } from '@/lib/shared';
import { DocsAnalyticsProvider } from '@/components/docs-analytics-provider';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: siteDescription,
  category: 'developer documentation',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/docs/console-favicon.ico' },
      { url: '/docs/Wacht.png', type: 'image/png' },
    ],
    apple: [{ url: '/docs/Wacht.png' }],
    shortcut: ['/docs/console-favicon.ico'],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: appName,
    title: appName,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: siteDescription,
    creator: '@wacht_platform',
    site: '@wacht_platform',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050507',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  const themeInitScript = `(function(){try{var stored=localStorage.getItem('wacht-docs-theme');var theme=(stored==='light'||stored==='dark'||stored==='system')?stored:'dark';var resolved=theme==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;document.documentElement.classList.toggle('dark',resolved==='dark');}catch(e){}})();`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..700&family=Geist+Mono:wght@300..600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          id="ld-json-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://wacht.dev/#organization',
              name: 'Wacht',
              legalName: 'Intellinesia Labs (OPC) Private Limited',
              url: 'https://wacht.dev',
              logo: 'https://wacht.dev/logo.png',
              sameAs: [
                'https://github.com/wacht-platform',
                'https://twitter.com/wacht_platform',
              ],
            }),
          }}
        />
        <script
          id="ld-json-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': `${siteUrl}/#website`,
              name: appName,
              url: siteUrl,
              publisher: { '@id': 'https://wacht.dev/#organization' },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${siteUrl}/api/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <style>{`:root { --fd-banner-height: 2.25rem; }`}</style>
        <DocsAnalyticsProvider>
          <RootProvider
            theme={{ enabled: false }}
            search={{ options: { api: '/docs/api/search' } }}
          >
            <div
              id="wacht-bench-launch"
              className="sticky top-0 z-40 flex h-9 items-center justify-center border-b border-[#1a1a22] bg-[#0a0a0e] px-4 text-center"
            >
              <Link
                href="/guides/wacht-bench"
                className="group inline-flex items-center gap-2.5 text-[12px] text-[#a0a0aa] hover:text-[#e8e8ee]"
              >
                <span className="rounded-full border border-violet-500/25 bg-violet-500/[0.08] px-2 py-[2px] text-[10px] font-medium uppercase tracking-wider text-violet-300">
                  New
                </span>
                <span>Wacht Bench is live — AI-assisted development for Wacht</span>
                <span aria-hidden className="text-[#5a5a64] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#e8e8ee]">
                  →
                </span>
              </Link>
            </div>
            {children}
          </RootProvider>
        </DocsAnalyticsProvider>
      </body>
    </html>
  );
}
