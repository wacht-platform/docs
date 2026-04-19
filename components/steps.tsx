import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type StepGroup = {
  heading: ReactNode;
  content: ReactNode[];
};

export function Steps({ children, className }: { children: ReactNode; className?: string }) {
  const nodes = Children.toArray(children);
  const groups: StepGroup[] = [];
  let current: StepGroup | null = null;

  for (const node of nodes) {
    const isHeading =
      isValidElement<{ className?: string }>(node) &&
      (node.type === 'h2' ||
        (typeof node.type === 'function' && (node.type as { displayName?: string; name?: string }).displayName === 'h2') ||
        (typeof node.type === 'function' && (node.type as { displayName?: string; name?: string }).name === 'h2'));

    if (isHeading) {
      current = {
        heading: node,
        content: [],
      };
      groups.push(current);
      continue;
    }

    if (!current) {
      continue;
    }

    current.content.push(node);
  }

  if (groups.length === 0) {
    return <div className={cn('my-6', className)}>{children}</div>;
  }

  return (
    <div className={cn('my-6', className)}>
      {groups.map((group, index) => (
        <section
          key={index}
          className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 last:pb-0"
        >
          <div className="relative flex justify-center">
            {index < groups.length - 1 ? (
              <div className="absolute top-8 bottom-0 w-px bg-fd-border" />
            ) : null}
            <div className="relative z-10 flex size-8 items-center justify-center rounded-full border border-fd-border bg-fd-background text-sm font-medium text-fd-foreground shadow-sm">
              {index + 1}
            </div>
          </div>
          <div className="min-w-0 pb-10">
            <div className="flex min-h-8 items-center">
              {isValidElement<{ className?: string }>(group.heading)
                ? cloneElement(group.heading, {
                    className: cn(
                      '!m-0 text-lg font-medium leading-8 text-fd-foreground',
                      group.heading.props.className,
                    ),
                  })
                : group.heading}
            </div>
            <div className="mt-3 text-sm leading-7 text-fd-muted-foreground [&>p:first-child]:mt-0 [&_pre]:mt-0 [&_pre]:mb-0 [&_ul]:my-4 [&_ol]:my-4">
              {group.content}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
