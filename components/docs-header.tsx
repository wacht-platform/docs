'use client';

import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import { Logo } from '@/components/logo';
import { ArrowUpRight, Check, Laptop, Menu, Moon, Sun } from 'lucide-react';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { useEffect, useState, type ReactNode } from 'react';

const topNav = [
  { label: 'Documentation', href: '/docs/sdks/nextjs' },
  { label: 'Guides', href: '/docs/guides' },
  { label: 'API Reference', href: '/docs/reference' },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DocsHeader() {
  const { slots } = useDocsLayout();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 [grid-area:header]">
      {/* Mobile */}
      <div className="border-b border-fd-border bg-fd-background md:hidden">
        <div className="flex h-12 items-center gap-3 px-4">
          <Logo />
          <div className="flex-1" />
          <ThemeDropdown />
          {slots.sidebar ? (
            <slots.sidebar.trigger className="inline-flex size-8 items-center justify-center rounded border border-fd-border text-fd-muted-foreground">
              <Menu className="size-4" />
            </slots.sidebar.trigger>
          ) : null}
        </div>
        <nav className="flex h-10 items-stretch border-t border-fd-border">
          {topNav.map((item) => (
            <Link
              key={`mobile-${item.href}`}
              href={item.href}
              className="relative flex-1 items-center justify-center border-r border-fd-border px-4 text-center text-xs font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground data-[active=true]:text-fd-foreground after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-fd-foreground after:opacity-0 data-[active=true]:after:opacity-100 last:border-r-0 inline-flex"
              data-active={isActive(pathname, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop — full-width bar with logo | nav tabs | right */}
      <div className="hidden border-b border-fd-border bg-fd-background md:block">
        <div className="flex h-[52px] items-stretch">
          <div
            className="flex shrink-0 items-center px-6"
            style={{ width: 'var(--landing-left-pane-width, 280px)' }}
          >
            <Logo />
          </div>
          <div className="w-px bg-fd-border" />
          <nav className="flex h-full items-stretch">
            {topNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex min-w-48 items-center justify-center border-r border-fd-border px-6 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground data-[active=true]:text-fd-foreground after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-fd-foreground after:opacity-0 data-[active=true]:after:opacity-100"
                data-active={isActive(pathname, item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex-1" />
          <div className="flex shrink-0 items-center gap-3 border-l border-fd-border px-4">
            <ThemeDropdown />
          </div>
          <a
            href="https://console.wacht.dev"
            className="flex shrink-0 items-center gap-2 border-l border-fd-border px-5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-muted/40"
          >
            <span>Console</span>
            <ArrowUpRight className="size-4 shrink-0 text-fd-muted-foreground" />
          </a>
        </div>
      </div>
    </header>
  );
}

function ThemeDropdown() {
  const [current, setCurrent] = useState<'light' | 'dark' | 'system'>('system');
  const [effective, setEffective] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('wacht-docs-theme');
    const initial = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    setCurrent(initial);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const resolved = current === 'system' ? (media.matches ? 'dark' : 'light') : current;

    document.documentElement.classList.toggle('dark', resolved === 'dark');
    localStorage.setItem('wacht-docs-theme', current);
    setEffective(resolved);

    if (current !== 'system') return;
    const onChange = (event: MediaQueryListEvent) => {
      const next = event.matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      setEffective(next);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [current]);

  return (
    <Popover>
      <PopoverTrigger
        aria-label="Theme"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border-0 bg-transparent text-fd-muted-foreground shadow-none transition-colors hover:bg-fd-muted/45 hover:text-fd-foreground"
      >
        {effective === 'dark' ? <Moon className="size-5" /> : <Sun className="size-5" />}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-1">
        <ThemeOption
          icon={<Sun className="size-5" />}
          label="Light"
          active={current === 'light'}
          onSelect={() => setCurrent('light')}
        />
        <ThemeOption
          icon={<Moon className="size-5" />}
          label="Dark"
          active={current === 'dark'}
          onSelect={() => setCurrent('dark')}
        />
        <ThemeOption
          icon={<Laptop className="size-5" />}
          label="System"
          active={current === 'system'}
          onSelect={() => setCurrent('system')}
        />
      </PopoverContent>
    </Popover>
  );
}

function ThemeOption({
  icon,
  label,
  active,
  onSelect,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-fd-popover-foreground hover:bg-fd-accent/80"
    >
      <span className="text-fd-muted-foreground">{icon}</span>
      <span className="flex-1">{label}</span>
      {active ? <Check className="size-4 text-fd-primary" /> : null}
    </button>
  );
}
