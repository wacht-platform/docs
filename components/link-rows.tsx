import Link from 'fumadocs-core/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

export function LinkRows({ children }: { children: ReactNode }) {
  return <div className="not-prose my-6 border-t border-fd-border">{children}</div>;
}

export function LinkRow({
  href,
  title,
  children,
}: {
  href: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border-b border-fd-border px-1 py-3 text-sm no-underline transition-colors hover:bg-fd-accent/50"
    >
      <span className="w-40 shrink-0 font-medium text-fd-foreground sm:w-52">{title}</span>
      <span className="flex-1 text-fd-muted-foreground">{children}</span>
      <ArrowRight
        aria-hidden
        className="size-4 shrink-0 text-fd-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-fd-foreground"
      />
    </Link>
  );
}
