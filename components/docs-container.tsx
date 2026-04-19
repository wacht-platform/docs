'use client';

import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

export function DocsContainer(props: React.ComponentProps<'div'>) {
  const { slots } = useDocsLayout();
  const { collapsed } = slots.sidebar.useSidebar();
  const [previousCollapsed, setPreviousCollapsed] = useState(collapsed);
  const isCollapseChanged = previousCollapsed !== collapsed;

  useEffect(() => {
    if (isCollapseChanged) setPreviousCollapsed(collapsed);
  }, [collapsed, isCollapseChanged]);

  return (
    <div
      id="nd-docs-layout"
      data-sidebar-collapsed={collapsed}
      data-column-changed={isCollapseChanged}
      {...props}
      style={{
        gridTemplate: `"header header header"
"sidebar toc-popover toc"
"sidebar main toc" 1fr / var(--fd-sidebar-col) minmax(0, 1fr) var(--fd-toc-width)`,
        ['--fd-docs-row-1' as string]: 'var(--fd-banner-height, 0px)',
        ['--fd-docs-row-2' as string]: 'calc(var(--fd-docs-row-1) + var(--fd-header-height))',
        ['--fd-docs-row-3' as string]: 'calc(var(--fd-docs-row-2) + var(--fd-toc-popover-height))',
        ['--fd-sidebar-col' as string]: collapsed ? '0px' : 'var(--fd-sidebar-width)',
        ...props.style,
      }}
      className={cn(
        'grid overflow-x-clip min-h-(--fd-docs-height) [--fd-docs-height:100dvh] [--fd-header-height:--spacing(14)] [--fd-toc-popover-height:0px] [--fd-sidebar-width:0px] [--fd-toc-width:0px] [--landing-left-pane-width:280px] data-[column-changed=true]:transition-[grid-template-columns] md:[--fd-sidebar-width:var(--landing-left-pane-width,280px)] md:[--fd-toc-width:260px]',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
