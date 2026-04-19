import { getDocByUrl, getDocsGraphView, searchDocs } from '@/lib/mcp/docs-index';

type JsonRpcRequest = {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
};

function jsonRpcResult(id: JsonRpcRequest['id'], result: unknown) {
  return Response.json({ jsonrpc: '2.0', id: id ?? null, result });
}

function jsonRpcError(
  id: JsonRpcRequest['id'],
  code: number,
  message: string,
  data?: unknown,
) {
  return Response.json(
    {
      jsonrpc: '2.0',
      id: id ?? null,
      error: { code, message, data },
    },
    { status: 400 },
  );
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function resolveMcpEndpoint(baseUrl?: string): string {
  const base = (baseUrl ?? process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://wacht.dev/docs').trim();
  if (base.endsWith('/mcp')) return base;
  return `${base.replace(/\/$/, '')}/mcp`;
}

function getSetupTemplates(baseUrl?: string) {
  const endpoint = resolveMcpEndpoint(baseUrl);
  return {
    endpoint,
    cursor: {
      mcpServers: {
        'wacht-docs': {
          url: endpoint,
        },
      },
    },
    claude_desktop: {
      mcpServers: {
        'wacht-docs': {
          command: 'npx',
          args: ['-y', 'mcp-remote', endpoint],
        },
      },
    },
    generic_jsonrpc: {
      initialize: {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: {
            name: 'your-client',
            version: '1.0.0',
          },
        },
      },
      tools_list: {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      },
    },
  };
}

type PromptArgument = {
  name: string;
  description: string;
  required?: boolean;
};

type PromptDefinition = {
  name: string;
  description: string;
  arguments?: PromptArgument[];
};

function listPrompts(): { prompts: PromptDefinition[] } {
  return {
    prompts: [
      {
        name: 'mcp_setup_guide',
        description:
          'Generate complete MCP client setup snippets for this docs MCP server.',
        arguments: [
          {
            name: 'base_url',
            description:
              'Optional docs base URL (example: https://wacht.dev/docs). /mcp is appended automatically.',
            required: false,
          },
        ],
      },
      {
        name: 'docs_graph_navigation_guide',
        description:
          'Guide the LLM to use docs_graph_view + search_docs + get_doc effectively.',
        arguments: [
          {
            name: 'query',
            description: 'Optional topic query to focus navigation.',
            required: false,
          },
        ],
      },
    ],
  };
}

function getPromptMessages(
  name: string,
  args: Record<string, unknown> | undefined,
) {
  if (name === 'mcp_setup_guide') {
    const templates = getSetupTemplates(asOptionalString(args?.base_url));
    return {
      description: 'MCP setup guide with ready-to-use configuration snippets.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Use the following MCP setup templates exactly, then verify by calling initialize and tools/list.',
              '',
              `Endpoint: ${templates.endpoint}`,
              '',
              'Cursor config:',
              JSON.stringify(templates.cursor, null, 2),
              '',
              'Claude Desktop config:',
              JSON.stringify(templates.claude_desktop, null, 2),
              '',
              'JSON-RPC examples:',
              JSON.stringify(templates.generic_jsonrpc, null, 2),
            ].join('\n'),
          },
        },
      ],
    };
  }

  if (name === 'docs_graph_navigation_guide') {
    const query = asOptionalString(args?.query)?.trim();
    return {
      description: 'Graph-first docs navigation playbook.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Use this docs MCP server with the following sequence:',
              '1) Call docs_graph_view with query/focus to map connected pages.',
              '2) Call search_docs to rank likely pages for the user intent.',
              '3) Call get_doc on best URLs for full grounded content.',
              '4) Cite URLs from tool output in final answer.',
              query ? `Initial query hint: ${query}` : 'Initial query hint: none',
            ].join('\n'),
          },
        },
      ],
    };
  }

  throw new Error(`Prompt not found: ${name}`);
}

async function listTools() {
  return {
    tools: [
      {
        name: 'search_docs',
        description:
          'Search Wacht documentation and return top matching pages with citations.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query text.' },
            limit: {
              type: 'number',
              description: 'Max number of matches. Defaults to 5, max 20.',
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
      },
      {
        name: 'get_doc',
        description: 'Fetch a full processed documentation page by URL/path.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Docs URL path, for example /sdks/rust/getting-started.',
            },
          },
          required: ['url'],
          additionalProperties: false,
        },
      },
      {
        name: 'docs_graph_view',
        description:
          'Return a connected graph view of docs nodes/edges, optionally focused by query or URL.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Optional search query used to seed the graph view.',
            },
            focus_url: {
              type: 'string',
              description: 'Optional docs URL to center the graph around.',
            },
            depth: {
              type: 'number',
              description: 'Neighborhood expansion depth (0-3). Default 1.',
            },
            limit: {
              type: 'number',
              description: 'Maximum nodes in returned graph (10-200). Default 60.',
            },
          },
          required: [],
          additionalProperties: false,
        },
      },
    ],
  };
}

async function callTool(params: Record<string, unknown> | undefined) {
  const name = asString(params?.name);
  const args = (params?.arguments as Record<string, unknown> | undefined) ?? {};

  if (name === 'search_docs') {
    const query = asString(args.query).trim();
    if (!query) {
      throw new Error('search_docs requires a non-empty query.');
    }

    const results = await searchDocs(query, asOptionalNumber(args.limit));
    const lines = results.map(
      (item, index) =>
        `${index + 1}. ${item.title}\nurl: ${item.url}\nscore: ${item.score.toFixed(3)}\nsummary: ${item.snippet}`,
    );

    return {
      content: [
        {
          type: 'text',
          text: lines.length > 0 ? lines.join('\n\n') : 'No matching docs found.',
        },
      ],
      structuredContent: {
        query,
        results,
      },
    };
  }

  if (name === 'get_doc') {
    const url = asString(args.url).trim();
    if (!url) {
      throw new Error('get_doc requires a url.');
    }

    const doc = await getDocByUrl(url);
    if (!doc) {
      return {
        content: [{ type: 'text', text: `No docs page found for url: ${url}` }],
        structuredContent: { found: false, url },
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `# ${doc.title}\nurl: ${doc.url}\n\n${doc.content}`,
        },
      ],
      structuredContent: {
        found: true,
        doc,
      },
    };
  }

  if (name === 'docs_graph_view') {
    const graph = await getDocsGraphView({
      query: asOptionalString(args.query),
      focusUrl: asOptionalString(args.focus_url),
      depth: asOptionalNumber(args.depth),
      limit: asOptionalNumber(args.limit),
    });

    const top = graph.nodes
      .slice()
      .sort(
        (a, b) =>
          b.outbound_count + b.inbound_count - (a.outbound_count + a.inbound_count),
      )
      .slice(0, 10)
      .map(
        (node, idx) =>
          `${idx + 1}. ${node.title}\nurl: ${node.url}\nsection: ${node.section}\nconnections: ${node.outbound_count + node.inbound_count}`,
      );

    return {
      content: [
        {
          type: 'text',
          text: [
            `Graph nodes: ${graph.node_count}`,
            `Graph edges: ${graph.edge_count}`,
            graph.seeds.length > 0 ? `Seed URLs: ${graph.seeds.join(', ')}` : 'Seed URLs: none',
            '',
            'Top connected nodes:',
            ...(top.length > 0 ? top : ['No nodes found.']),
          ].join('\n'),
        },
      ],
      structuredContent: graph,
    };
  }

  throw new Error(`Unsupported tool: ${name}`);
}

export async function GET() {
  return Response.json({
    name: 'wacht-docs-mcp',
    transport: 'streamable-http',
    endpoint: '/mcp',
    tools: ['search_docs', 'get_doc', 'docs_graph_view'],
    prompts: ['mcp_setup_guide', 'docs_graph_navigation_guide'],
  });
}

export async function POST(request: Request) {
  let body: JsonRpcRequest;
  try {
    body = (await request.json()) as JsonRpcRequest;
  } catch {
    return jsonRpcError(null, -32700, 'Invalid JSON');
  }

  const { id, method, params } = body;

  try {
    if (method === 'initialize') {
      return jsonRpcResult(id, {
        protocolVersion: '2025-03-26',
        capabilities: {
          tools: {},
          prompts: {},
        },
        serverInfo: {
          name: 'wacht-docs-mcp',
          version: '0.1.0',
        },
      });
    }

    if (method === 'notifications/initialized') {
      return new Response(null, { status: 204 });
    }

    if (method === 'tools/list') {
      return jsonRpcResult(id, await listTools());
    }

    if (method === 'tools/call') {
      return jsonRpcResult(id, await callTool(params));
    }

    if (method === 'prompts/list') {
      return jsonRpcResult(id, listPrompts());
    }

    if (method === 'prompts/get') {
      const promptName = asString(params?.name).trim();
      if (!promptName) {
        return jsonRpcError(id, -32602, 'prompts/get requires params.name');
      }
      const promptArgs =
        (params?.arguments as Record<string, unknown> | undefined) ?? {};
      return jsonRpcResult(id, getPromptMessages(promptName, promptArgs));
    }

    return jsonRpcError(id, -32601, `Method not found: ${method}`);
  } catch (error) {
    return jsonRpcError(
      id,
      -32000,
      error instanceof Error ? error.message : 'Internal error',
    );
  }
}
