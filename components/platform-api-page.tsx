'use client';

import {
  createOpenAPIPage,
  type OperationItem,
  type OpenAPIPageProps_Spec,
} from 'fumadocs-openapi/ui';
import platformSpec from '@/public/openapi/platform-api.json';
import { sharedOpenAPIOptions } from '@/lib/openapi';

const Page = createOpenAPIPage(sharedOpenAPIOptions);
const payload = { bundled: platformSpec } as unknown as OpenAPIPageProps_Spec['payload'];

export function PlatformAPIPage({ operations }: { operations: { path: string; method: string }[] }) {
  return <Page payload={payload} operations={operations as unknown as OperationItem[]} showTitle />;
}
