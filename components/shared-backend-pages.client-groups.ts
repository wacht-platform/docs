// Client-safe merge of the hand-written catalog with the generated coverage doc list.
// Mirrors what `allBackendGroups` in shared-backend-pages.generated.ts produces, but
// without the fs / typescript compiler API calls — so this file can be imported from
// client components (e.g. the sidebar) without pulling node:fs into the browser bundle.

import { backendCoverageGroupOrder, classifyBackendCoverageDoc } from '@/components/backend-docs/grouping';
import { generatedBackendCoverageDocs } from '@/components/shared-backend-coverage';
import { backendGroups } from '@/components/shared-backend-pages.catalog';
import type { BackendDoc, BackendGroup } from '@/components/shared-backend-pages.types';

function inferTitle(method: string): string {
  return `${method}()`;
}

export const clientBackendGroups: BackendGroup[] = (() => {
  const seeded: BackendGroup[] = backendGroups.map((group) => ({
    ...group,
    docs: [...group.docs],
  }));
  const byLabel = new Map(seeded.map((group) => [group.label, group]));

  for (const entry of generatedBackendCoverageDocs) {
    const coverageGroup = classifyBackendCoverageDoc(entry);
    const groupLabel = coverageGroup.label;
    if (!groupLabel) continue;

    const normalizedPath: [string, string] = [coverageGroup.pathGroup, entry.path[1]];
    const slug = entry.path[1];
    const generatedKey = normalizedPath.join('/');

    let targetGroup = byLabel.get(groupLabel);
    if (!targetGroup) {
      targetGroup = { label: groupLabel, docs: [] };
      seeded.push(targetGroup);
      byLabel.set(groupLabel, targetGroup);
    }

    const existsInTarget = targetGroup.docs.some(
      (doc) => ((doc.path ?? [doc.slug]).join('/')) === generatedKey,
    );
    if (existsInTarget) continue;

    const inOtherGroup = seeded.some((group) =>
      group.docs.some(
        (doc) =>
          (doc.path ?? [doc.slug]).join('/') === generatedKey ||
          (doc.path ? doc.path[1] === slug : doc.slug === slug) ||
          doc.title === inferTitle(entry.method),
      ),
    );
    if (inOtherGroup) continue;

    const doc: BackendDoc = {
      slug,
      path: normalizedPath,
      title: inferTitle(entry.method),
      description: `${entry.endpoint.method} ${entry.endpoint.path}`,
      intro: '',
      usage: '',
      signature: '',
      params: [],
    };
    targetGroup.docs.push(doc);
  }

  const order = new Map(backendCoverageGroupOrder.map((label, index) => [label, index]));
  return seeded
    .filter((group) => group.docs.length > 0)
    .sort((a, b) => (order.get(a.label) ?? 999) - (order.get(b.label) ?? 999));
})();
