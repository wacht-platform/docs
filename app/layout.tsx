import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Geist_Mono, Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import { appName, siteDescription, siteUrl } from '@/lib/shared';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

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
      { url: '/console-favicon.ico' },
      { url: '/Wacht.png', type: 'image/png' },
    ],
    apple: [{ url: '/Wacht.png' }],
    shortcut: ['/console-favicon.ico'],
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
    images: [{ url: '/Wacht.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: siteDescription,
    images: ['/Wacht.png'],
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
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <RootProvider theme={{ enabled: false }}>{children}</RootProvider>
      </body>
    </html>
  );
}
