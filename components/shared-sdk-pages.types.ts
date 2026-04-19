import type { TOCItemType } from 'fumadocs-core/toc';
import type { ApiField } from '@/components/api-explorer';

export type FrameworkKey = 'nextjs' | 'react-router' | 'tanstack-router';
export type SharedKind = 'components' | 'hooks';

export type FrameworkMeta = {
  label: string;
  importPath: string;
};

export type SharedDoc = {
  slug: string;
  title: string;
  description: string;
  importName: string;
  intro: string;
  example: string;
  points: string[];
  sections?: Array<{
    title: string;
    paragraphs?: string[];
    points?: string[];
  }>;
  signature?: string;
  api?: ApiField[];
  details?: string[];
  examples?: Array<{
    title: string;
    code: string;
    lang?: string;
  }>;
};

export type SharedGroup = {
  label: string;
  docs: SharedDoc[];
};

export type ReferenceTarget = {
  href: string;
  kind: SharedKind;
  label: string;
};

export type SharedSdkTocItem = TOCItemType;
