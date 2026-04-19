import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from 'fumadocs-ui/layouts/docs/slots/sidebar';
import { baseOptions } from '@/lib/layout.shared';
import { DocsContainer } from '@/components/docs-container';
import { DocsHeader } from '@/components/docs-header';
import { DocsSidebar } from '@/components/docs-sidebar';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      tabs={false}
      tabMode="auto"
      slots={{
        container: DocsContainer,
        header: DocsHeader,
        sidebar: {
          provider: SidebarProvider,
          root: DocsSidebar,
          trigger: SidebarTrigger,
          useSidebar,
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
