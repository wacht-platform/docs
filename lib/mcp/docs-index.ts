import { create, insertMultiple, search } from '@orama/orama';
import path from 'node:path';
import { source } from '@/lib/source';

type IndexedDoc = {
  id: string;
  url: string;
  title: string;
  description: string;
  content: string;
};

type DocsIndex = {
  db: any;
  docs: IndexedDoc[];
  byUrl: Map<string, IndexedDoc>;
  graph: DocsGraph;
  builtAtMs: number;
};

type DocsGraphNode = {
  url: string;
  title: string;
  description: string;
  section: string;
  outbound_count: number;
  inbound_count: number;
};

type DocsGraphEdge = {
  from: string;
  to: string;
  kind: 'link' | 'hierarchy';
};

type DocsGraph = {
  nodes: DocsGraphNode[];
  edges: DocsGraphEdge[];
  outgoing: Map<string, Set<string>>;
  incoming: Map<string, Set<string>>;
};

declare global {
  // eslint-disable-next-line no-var
  var __wachtDocsMcpIndex: DocsIndex | undefined;
}

const INDEX_TTL_MS = 5 * 60 * 1000;

function clampLimit(limit: number | undefined, fallback = 5): number {
  const value = Number.isFinite(limit) ? Number(limit) : fallback;
  return Math.max(1, Math.min(20, value));
}

function cleanInternalUrl(target: string, baseUrl: string): string | null {
  const trimmed = target.trim();
  if (
    !trimmed ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('javascript:')
  ) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  const withoutHash = trimmed.split('#')[0].split('?')[0];
  if (!withoutHash) return null;

  let resolved = withoutHash;
  if (!resolved.startsWith('/')) {
    const baseDir = path.posix.dirname(baseUrl);
    resolved = path.posix.normalize(path.posix.join(baseDir, resolved));
  }

  if (!resolved.startsWith('/')) resolved = `/${resolved}`;
  if (resolved.length > 1 && resolved.endsWith('/')) resolved = resolved.slice(0, -1);
  return resolved;
}

function extractInternalLinks(content: string, baseUrl: string): string[] {
  const links = new Set<string>();
  const regex = /\[[^\]]*?\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const resolved = cleanInternalUrl(match[1] ?? '', baseUrl);
    if (resolved) links.add(resolved);
  }
  return [...links];
}

function sectionFromUrl(url: string): string {
  const first = url.split('/').filter(Boolean)[0];
  return first ?? 'root';
}

function buildGraph(docs: IndexedDoc[], byUrl: Map<string, IndexedDoc>): DocsGraph {
  const edges: DocsGraphEdge[] = [];
  const edgeKeys = new Set<string>();
  const outgoing = new Map<string, Set<string>>();
  const incoming = new Map<string, Set<string>>();

  const addEdge = (from: string, to: string, kind: DocsGraphEdge['kind']) => {
    if (!from || !to || from === to) return;
    if (!byUrl.has(from) || !byUrl.has(to)) return;

    const key = `${kind}:${from}->${to}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ from, to, kind });

    if (!outgoing.has(from)) outgoing.set(from, new Set());
    if (!incoming.has(to)) incoming.set(to, new Set());
    outgoing.get(from)!.add(to);
    incoming.get(to)!.add(from);
  };

  for (const doc of docs) {
    for (const target of extractInternalLinks(doc.content, doc.url)) {
      addEdge(doc.url, target, 'link');
    }

    const parts = doc.url.split('/').filter(Boolean);
    if (parts.length > 1) {
      const parent = `/${parts.slice(0, -1).join('/')}`;
      addEdge(parent, doc.url, 'hierarchy');
    }
  }

  const nodes: DocsGraphNode[] = docs.map((doc) => ({
    url: doc.url,
    title: doc.title,
    description: doc.description,
    section: sectionFromUrl(doc.url),
    outbound_count: outgoing.get(doc.url)?.size ?? 0,
    inbound_count: incoming.get(doc.url)?.size ?? 0,
  }));

  return { nodes, edges, outgoing, incoming };
}

export async function getDocsIndex(): Promise<DocsIndex> {
  const cached = globalThis.__wachtDocsMcpIndex;
  if (
    cached &&
    Date.now() - cached.builtAtMs < INDEX_TTL_MS &&
    cached.graph &&
    cached.docs
  ) {
    return cached;
  }

  const pages = source.getPages();
  const docs: IndexedDoc[] = await Promise.all(
    pages.map(async (page: any) => {
      const content = (await page.data.getText('processed')).trim();
      return {
        id: page.url,
        url: page.url,
        title: page.data.title,
        description: page.data.description ?? '',
        content,
      };
    }),
  );

  const db = await create({
    schema: {
      id: 'string',
      url: 'string',
      title: 'string',
      description: 'string',
      content: 'string',
    },
  });

  await insertMultiple(db, docs);

  const byUrl = new Map(docs.map((doc) => [doc.url, doc]));
  const graph = buildGraph(docs, byUrl);
  const next = { db, docs, byUrl, graph, builtAtMs: Date.now() };
  globalThis.__wachtDocsMcpIndex = next;
  return next;
}

export async function searchDocs(query: string, limit?: number) {
  const { db } = await getDocsIndex();
  const safeLimit = clampLimit(limit);
  const result = await search(db, {
    term: query,
    limit: safeLimit,
    properties: ['title', 'description', 'content'],
  });

  return result.hits.map((hit: any) => {
    const doc = hit.document as IndexedDoc;
    const snippet =
      doc.description ||
      doc.content.replace(/\s+/g, ' ').slice(0, 220) +
        (doc.content.length > 220 ? '...' : '');

    return {
      score: hit.score,
      url: doc.url,
      title: doc.title,
      snippet,
    };
  });
}

export async function getDocByUrl(url: string) {
  const { byUrl } = await getDocsIndex();
  return byUrl.get(url) ?? null;
}

type GraphOptions = {
  query?: string;
  focusUrl?: string;
  limit?: number;
  depth?: number;
};

export async function getDocsGraphView(options: GraphOptions = {}) {
  const { graph } = await getDocsIndex();
  const depth = Math.max(0, Math.min(3, options.depth ?? 1));
  const maxNodes = Math.max(10, Math.min(200, options.limit ?? 60));
  const focusUrl = options.focusUrl ? cleanInternalUrl(options.focusUrl, '/') : null;

  let seeds: string[] = [];
  if (options.query?.trim()) {
    const hits = await searchDocs(options.query, Math.min(10, maxNodes));
    seeds = hits.map((hit) => hit.url);
  } else if (focusUrl) {
    seeds = [focusUrl];
  }

  const selected = new Set<string>();

  if (seeds.length > 0) {
    for (const seed of seeds) {
      selected.add(seed);
    }

    for (let i = 0; i < depth; i += 1) {
      const snapshot = [...selected];
      for (const url of snapshot) {
        for (const out of graph.outgoing.get(url) ?? []) selected.add(out);
        for (const inc of graph.incoming.get(url) ?? []) selected.add(inc);
      }
    }
  } else {
    const ranked = [...graph.nodes]
      .sort(
        (a, b) =>
          b.outbound_count + b.inbound_count - (a.outbound_count + a.inbound_count),
      )
      .slice(0, maxNodes);
    for (const node of ranked) selected.add(node.url);
  }

  if (selected.size > maxNodes) {
    const keep = new Set(seeds);
    const ranked = [...selected]
      .map((url) => {
        const node = graph.nodes.find((n) => n.url === url);
        return {
          url,
          score: (node?.outbound_count ?? 0) + (node?.inbound_count ?? 0),
        };
      })
      .sort((a, b) => b.score - a.score);
    for (const item of ranked) {
      if (keep.size >= maxNodes) break;
      keep.add(item.url);
    }
    selected.clear();
    for (const url of keep) selected.add(url);
  }

  const nodes = graph.nodes.filter((node) => selected.has(node.url));
  const edges = graph.edges.filter(
    (edge) => selected.has(edge.from) && selected.has(edge.to),
  );

  return {
    node_count: nodes.length,
    edge_count: edges.length,
    seeds,
    nodes,
    edges,
  };
}
