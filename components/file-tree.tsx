import { FileText, Folder } from 'lucide-react';
import { cn } from '@/lib/cn';

type ParsedLine = {
  depth: number;
  name: string;
  isDirectory: boolean;
};

function parseTree(source: string): ParsedLine[] {
  const parsed = source
    .split('\n')
    .map((line) => line.replace(/\t/g, '  '))
    .map((line) => {
      const match = line.match(/^(\s*)(.+)$/);
      if (!match) return null;
      const rawName = match[2].trim();
      if (!rawName) return null;
      return {
        indent: match[1].length,
        name: rawName,
      };
    })
    .filter((line): line is { indent: number; name: string } => line !== null);

  const nonRootIndents = parsed.map((line) => line.indent).filter((indent) => indent > 0);
  const baseIndent = nonRootIndents.length > 0 ? Math.min(...nonRootIndents) : 0;

  return parsed.map((line) => {
    const depth =
      line.indent === 0 ? 0 : Math.floor(Math.max(0, line.indent - baseIndent) / 2) + 1;
    return {
      depth,
      name: line.name,
      isDirectory: line.name.endsWith('/'),
    } satisfies ParsedLine;
  });
}

export function FileTree({
  title,
  children,
  className,
}: {
  title?: string;
  children: string;
  className?: string;
}) {
  const lines = parseTree(children);

  return (
    <div className={cn('my-5 overflow-hidden rounded-xl border border-fd-border bg-fd-card/40', className)}>
      {title ? (
        <div className="border-b border-fd-border bg-fd-muted/30 px-4 py-2.5 text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
          {title}
        </div>
      ) : null}
      <div className="p-3">
        {lines.map((line, index) => (
          <div
            key={`${line.name}-${index}`}
            className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-fd-muted/40"
          >
            <div
              aria-hidden
              className="shrink-0"
              style={{ width: `${line.depth * 20}px` }}
            />
            {line.isDirectory ? (
              <Folder className="size-3.5 shrink-0 text-amber-500" />
            ) : (
              <FileText className="size-3.5 shrink-0 text-sky-500" />
            )}
            <span className={cn('truncate font-mono text-[13px] text-fd-foreground', line.isDirectory && 'font-semibold')}>
              {line.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
