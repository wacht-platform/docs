import type { ApiField } from '@/components/api-explorer';

export type BackendFrameworkKey = 'nextjs' | 'react-router' | 'tanstack-router' | 'node';

export type BackendDoc = {
  slug: string;
  path?: string[];
  title: string;
  description: string;
  intro: string;
  usage: string;
  signature?: string;
  paramsTitle?: string;
  params?: ApiField[];
  api?: ApiField[];
  endpoint?: {
    method: string;
    path: string;
    description?: string;
  };
  sections?: Array<{
    title: string;
    paragraphs?: string[];
    points?: string[];
  }>;
  examples?: Array<{
    title: string;
    code: string;
    lang?: string;
  }>;
};

export type BackendGroup = {
  label: string;
  docs: BackendDoc[];
};

export type BackendMeta = {
  label: string;
  importPath: string;
  defaultClientExpression: string;
};
