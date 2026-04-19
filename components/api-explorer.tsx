'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { cn } from '@/lib/cn';

export type ApiField = {
  name: string;
  type?: string;
  required?: boolean;
  description: string;
  children?: ApiField[];
};

function fieldSignature(field: ApiField) {
  const optional = field.required ? '' : '?';
  const type = field.children?.length ? '{ ... }' : field.type ?? 'unknown';
  return `${field.name}${optional}: ${type};`;
}

function typeSummary(field: ApiField) {
  if (field.children?.length) return 'object';
  return field.type ?? 'unknown';
}

export function ApiExplorer({ fields }: { fields: ApiField[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[minmax(180px,240px)_minmax(120px,180px)_1fr] gap-4 border-b border-border bg-muted/20 px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground/70">
        <div>Name</div>
        <div>Type</div>
        <div>Description</div>
      </div>
      <div>
        {fields.map((field, index) => (
          <ApiExplorerRow
            key={field.name}
            field={field}
            depth={0}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </div>
  );
}

function ApiExplorerRow({
  field,
  depth,
  defaultOpen,
}: {
  field: ApiField;
  depth: number;
  defaultOpen?: boolean;
}) {
  const hasChildren = Boolean(field.children?.length);
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const paddingLeft = useMemo(() => `${depth * 20 + 16}px`, [depth]);

  return (
    <div className="border-t border-border first:border-t-0">
      <button
        type="button"
        onClick={() => {
          if (hasChildren) setOpen((value) => !value);
        }}
        className={cn(
          'grid w-full grid-cols-[minmax(180px,240px)_minmax(120px,180px)_1fr] gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/20',
          !hasChildren && 'cursor-default hover:bg-transparent',
        )}
      >
        <div className="flex items-center gap-2" style={{ paddingLeft }}>
          {hasChildren ? (
            open ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            )
          ) : (
            <span className="block h-3.5 w-3.5 shrink-0" />
          )}
          <code className="text-[0.8125rem] text-foreground">{field.name}</code>
          {field.required ? (
            <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              required
            </span>
          ) : null}
        </div>
        <div className="flex items-center">
          <code className="text-[0.8125rem] text-muted-foreground">{typeSummary(field)}</code>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="line-clamp-2">{field.description}</span>
        </div>
      </button>

      {(open || !hasChildren) ? (
        <div className="border-t border-border/60 bg-card/20 px-4 py-4">
          <div className="ml-4 space-y-4" style={{ marginLeft: `${depth * 20 + 16}px` }}>
            <DynamicCodeBlock
              lang="ts"
              code={fieldSignature(field)}
              codeblock={{ allowCopy: true }}
            />

            <p className="text-sm text-muted-foreground">{field.description}</p>

            {field.children?.length ? (
              <div className="space-y-3">
                <p className="text-sm text-foreground">Nested properties</p>
                <div className="overflow-hidden rounded-xl border border-border/70">
                  {field.children.map((child) => (
                    <ApiExplorerRow
                      key={`${field.name}.${child.name}`}
                      field={child}
                      depth={depth + 1}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
