import { RootProvider } from 'fumadocs-ui/provider/next';
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
  keywords: ['Wacht', 'Wacht Docs', 'SDK', 'API', 'backend API', 'frontend API', 'OAuth', 'webhooks'],
  category: 'developer documentation',
  robots: {
    index: true,
    follow: true,
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
    images: [{ url: '/docs/Wacht.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: siteDescription,
    images: ['/docs/Wacht.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  const themeInitScript = `(function(){try{var stored=localStorage.getItem('wacht-docs-theme');var theme=(stored==='light'||stored==='dark'||stored==='system')?stored:'system';var resolved=theme==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;document.documentElement.classList.toggle('dark',resolved==='dark');}catch(e){}})();`;

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <DocsAnalyticsProvider>
          <RootProvider theme={{ enabled: false }}>{children}</RootProvider>
        </DocsAnalyticsProvider>
      </body>
    </html>
  );
}
