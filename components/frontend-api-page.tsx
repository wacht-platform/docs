'use client';

import {
  createOpenAPIPage,
  type OperationItem,
  type OpenAPIPageProps_Spec,
} from 'fumadocs-openapi/ui';
import frontendSpec from '@/public/openapi/frontend-api.json';
import { sharedOpenAPIOptions } from '@/lib/openapi';

const Page = createOpenAPIPage(sharedOpenAPIOptions);
const payload = { bundled: frontendSpec } as unknown as OpenAPIPageProps_Spec['payload'];

export function FrontendAPIPage({ operations }: { operations: { path: string; method: string }[] }) {
  return <Page payload={payload} operations={operations as unknown as OperationItem[]} showTitle />;
}
