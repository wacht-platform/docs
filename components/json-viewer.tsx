'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface JsonViewerProps {
  data: unknown;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCollapse = (path: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const renderValue = (value: unknown, path: string) => {
    if (value === null) {
      return <span className="text-purple-600 dark:text-purple-400">null</span>;
    }

    if (typeof value === 'boolean') {
      return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-green-600 dark:text-green-400">{value}</span>;
    }

    if (typeof value === 'string') {
      return <span className="text-orange-600 dark:text-yellow-400">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      const isCollapsed = collapsed.has(path);
      return (
        <div>
          <button
            type="button"
            onClick={() => toggleCollapse(path)}
            className="inline-flex items-center gap-1 rounded px-1 -ml-1 transition-colors hover:bg-muted/50 dark:hover:bg-white/5"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground/50" />
            )}
            <span className="text-muted-foreground/60">[{value.length}]</span>
          </button>
          {!isCollapsed ? (
            <div className="ml-4 mt-1 border-l border-border/20 pl-3 dark:border-white/10">
              {value.map((item, index) => (
                <div key={index} className="mb-1">
                  <span className="text-blue-600 dark:text-blue-400">{index}</span>
                  <span className="text-muted-foreground/40">: </span>
                  {renderValue(item, `${path}.${index}`)}
                  {index < value.length - 1 ? (
                    <span className="text-muted-foreground/40">,</span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value);
      const isCollapsed = collapsed.has(path);
      return (
        <div>
          <button
            type="button"
            onClick={() => toggleCollapse(path)}
            className="inline-flex items-center gap-1 rounded px-1 -ml-1 transition-colors hover:bg-muted/50 dark:hover:bg-white/5"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground/50" />
            )}
            <span className="text-muted-foreground/60">{`{${entries.length}}`}</span>
          </button>
          {!isCollapsed ? (
            <div className="ml-4 mt-1 border-l border-border/20 pl-3 dark:border-white/10">
              {entries.map(([key, entryValue], index) => (
                <div key={key} className="mb-1">
                  <span className="text-blue-600 dark:text-blue-400">"{key}"</span>
                  <span className="text-muted-foreground/40">: </span>
                  {renderValue(entryValue, `${path}.${key}`)}
                  {index < entries.length - 1 ? (
                    <span className="text-muted-foreground/40">,</span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    return <span className="text-foreground/80">{String(value)}</span>;
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card/30 p-4 text-xs leading-relaxed font-mono shadow-sm">
      {typeof data === 'object' && data !== null ? (
        Array.isArray(data) ? (
          <div>
            <span className="text-muted-foreground/40">[</span>
            <div className="ml-4 border-l border-border/20 pl-3 dark:border-white/10">
              {data.map((item, index) => (
                <div key={index} className="my-1">
                  {renderValue(item, String(index))}
                  {index < data.length - 1 ? <span className="text-muted-foreground/40">,</span> : null}
                </div>
              ))}
            </div>
            <span className="text-muted-foreground/40">]</span>
          </div>
        ) : (
          <div>
            <span className="text-muted-foreground/40">{'{'}</span>
            <div className="ml-4 border-l border-border/20 pl-3 dark:border-white/10">
              {Object.entries(data).map(([key, value], index, all) => (
                <div key={key} className="my-1">
                  <span className="text-blue-600 dark:text-blue-400">"{key}"</span>
                  <span className="text-muted-foreground/40">: </span>
                  {renderValue(value, key)}
                  {index < all.length - 1 ? <span className="text-muted-foreground/40">,</span> : null}
                </div>
              ))}
            </div>
            <span className="text-muted-foreground/40">{'}'}</span>
          </div>
        )
      ) : (
        renderValue(data, 'root')
      )}
    </div>
  );
}
