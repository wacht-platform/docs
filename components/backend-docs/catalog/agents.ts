import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const agentsBackendDocs: BackendDoc[] = [
{
        slug: 'list-agents',
        path: ['agents', 'list-agents'],
        title: 'listAgents()',
        description: 'List AI agents in the current deployment.',
        intro:
          'Returns agents as a paginated response with optional `limit`, `offset`, and `search` query params.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listAgents() {
  const client = await wachtClient();
  return client.ai.listAgents({ limit: 20, search: 'support' });
}`,
        signature: `function listAgents(
  options?: {
    limit?: number;
    offset?: number;
    search?: string;
  },
): Promise<PaginatedResponse<AiAgentWithDetails>>`,
        paramsTitle: 'ListAgentsOptions',
        params: [
          { name: 'limit', type: 'number | undefined', description: 'Maximum agents to return per page.' },
          { name: 'offset', type: 'number | undefined', description: 'Number of agents to skip.' },
          { name: 'search', type: 'string | undefined', description: 'Search term for agent name/metadata.' },
        ],
        api: [
          { name: 'data', type: 'AiAgentWithDetails[]', description: 'Agent rows in the current page.' },
          { name: 'has_more', type: 'boolean', description: 'Whether another page exists.' },
          { name: 'limit', type: 'number | undefined', description: 'Effective page size from backend response.' },
          { name: 'offset', type: 'number | undefined', description: 'Effective page offset from backend response.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Returns a backend-scoped list response for this resource.',
          'Use pagination and filters from this method to build admin list views.',
        ],
      },
    ],
  },
{
        slug: 'get-agent',
        path: ['agents', 'get-agent'],
        title: 'getAgent()',
        description: 'Load one AI agent by id.',
        intro:
          'Returns the full agent-with-details payload for the requested agent id.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getAgent(agentId: string) {
  const client = await wachtClient();
  return client.ai.getAgent(agentId);
}`,
        signature: `function getAgent(
  agentId: string,
): Promise<AiAgentWithDetails>`,
        params: [{ name: 'agentId', type: 'string', description: 'Target agent id.' }],
        api: [
          { name: 'id', type: 'string', description: 'Agent id.' },
          { name: 'name', type: 'string', description: 'Agent display name.' },
          { name: 'instructions', type: 'string | undefined', description: 'Agent instructions/system prompt.' },
          { name: 'model', type: 'string | undefined', description: 'Configured default model.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Fetches a single resource by identifier or query context.',
          'Use this result as the source of truth before update, replay, or delete flows.',
        ],
      },
    ],
  },
{
        slug: 'create-agent',
        path: ['agents', 'create-agent'],
        title: 'createAgent()',
        description: 'Create an AI agent.',
        intro:
          'Creates an AI agent from the request payload and returns the created agent object.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createAgent() {
  const client = await wachtClient();
  return client.ai.createAgent({
    name: 'Support Agent',
    model: 'gpt-5.4-mini',
  });
}`,
        signature: `function createAgent(
  request: CreateAiAgentRequest,
): Promise<AiAgent>`,
        paramsTitle: 'CreateAiAgentRequest',
        params: [
          { name: 'name', type: 'string', description: 'Agent display name.' },
          { name: 'instructions', type: 'string | undefined', description: 'Optional system instructions for this agent.' },
          { name: 'model', type: 'string | undefined', description: 'Optional default model identifier.' },
          { name: 'description', type: 'string | undefined', description: 'Optional agent description.' },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Created agent id.' },
          { name: 'name', type: 'string', description: 'Created agent display name.' },
          { name: 'instructions', type: 'string | undefined', description: 'Persisted instructions.' },
          { name: 'model', type: 'string | undefined', description: 'Persisted model setting.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Creates a new resource and returns the created object from the backend.',
          'Validate required fields before calling to avoid predictable request failures.',
        ],
      },
    ],
  },
{
        slug: 'list-actor-projects',
        path: ['agents', 'list-actor-projects'],
        title: 'listActorProjects()',
        description: 'List projects for one actor.',
        intro:
          'Returns actor projects in a paginated response. You must pass the actor id.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listActorProjects(actorId: string) {
  const client = await wachtClient();
  return client.ai.listActorProjects(actorId, false);
}`,
        signature: `function listActorProjects(
  actorId: string,
  includeArchived?: boolean,
): Promise<PaginatedResponse<ActorProject>>`,
        params: [
          { name: 'actorId', type: 'string', description: 'Actor id that owns the projects.' },
          { name: 'includeArchived', type: 'boolean | undefined', description: 'When true, include archived projects.' },
        ],
        api: [
          { name: 'data', type: 'ActorProject[]', description: 'Project rows in the current page.' },
          { name: 'has_more', type: 'boolean', description: 'Whether another page exists.' },
          { name: 'limit', type: 'number | undefined', description: 'Effective page size from backend response.' },
          { name: 'offset', type: 'number | undefined', description: 'Effective page offset from backend response.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Returns a backend-scoped list response for this resource.',
          'Use pagination and filters from this method to build admin list views.',
        ],
      },
    ],
  },
{
        slug: 'create-actor-project',
        path: ['agents', 'create-actor-project'],
        title: 'createActorProject()',
        description: 'Create an actor project.',
        intro:
          'Creates a project for the given actor id and returns the created actor project.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createActorProject(actorId: string) {
  const client = await wachtClient();
  return client.ai.createActorProject(actorId, {
    name: 'SDK Reliability',
  });
}`,
        signature: `function createActorProject(
  actorId: string,
  request: CreateActorProjectRequest,
): Promise<ActorProject>`,
        paramsTitle: 'CreateActorProjectRequest',
        params: [
          { name: 'actorId', type: 'string', description: 'Owner actor id.' },
          { name: 'name', type: 'string', description: 'Project display name.' },
          { name: 'description', type: 'string | undefined', description: 'Optional project description.' },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Created project id.' },
          { name: 'actor_id', type: 'string | undefined', description: 'Owning actor id.' },
          { name: 'name', type: 'string', description: 'Created project name.' },
          { name: 'archived_at', type: 'string | null | undefined', description: 'Archive timestamp when archived.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Creates a new resource and returns the created object from the backend.',
          'Validate required fields before calling to avoid predictable request failures.',
        ],
      },
    ],
  },
{
        slug: 'list-project-threads',
        path: ['agents', 'list-project-threads'],
        title: 'listProjectThreads()',
        description: 'List agent threads for one project.',
        intro:
          'Returns project threads in a paginated response with optional archived filtering.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function listProjectThreads(projectId: string) {
  const client = await wachtClient();
  return client.ai.listProjectThreads(projectId, false);
}`,
        signature: `function listProjectThreads(
  projectId: string,
  includeArchived?: boolean,
): Promise<PaginatedResponse<AgentThread>>`,
        params: [
          { name: 'projectId', type: 'string', description: 'Project id that owns the threads.' },
          { name: 'includeArchived', type: 'boolean | undefined', description: 'When true, include archived threads.' },
        ],
        api: [
          { name: 'data', type: 'AgentThread[]', description: 'Thread rows in the current page.' },
          { name: 'has_more', type: 'boolean', description: 'Whether another page exists.' },
          { name: 'limit', type: 'number | undefined', description: 'Effective page size from backend response.' },
          { name: 'offset', type: 'number | undefined', description: 'Effective page offset from backend response.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Returns a backend-scoped list response for this resource.',
          'Use pagination and filters from this method to build admin list views.',
        ],
      },
    ],
  },
{
        slug: 'create-agent-thread',
        path: ['agents', 'create-agent-thread'],
        title: 'createAgentThread()',
        description: 'Create a thread under a project.',
        intro:
          'Creates a new agent thread for a project and returns the created thread.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function createAgentThread(projectId: string) {
  const client = await wachtClient();
  return client.ai.createAgentThread(projectId, {
    title: 'Planning Thread',
  });
}`,
        signature: `function createAgentThread(
  projectId: string,
  request: CreateAgentThreadRequest,
): Promise<AgentThread>`,
        paramsTitle: 'CreateAgentThreadRequest',
        params: [
          { name: 'projectId', type: 'string', description: 'Parent project id.' },
          { name: 'title', type: 'string', description: 'Thread title.' },
          { name: 'description', type: 'string | undefined', description: 'Optional thread description.' },
        ],
        api: [
          { name: 'id', type: 'string', description: 'Created thread id.' },
          { name: 'project_id', type: 'string | undefined', description: 'Parent project id.' },
          { name: 'title', type: 'string | undefined', description: 'Created thread title.' },
          { name: 'archived_at', type: 'string | null | undefined', description: 'Archive timestamp when archived.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Creates a new resource and returns the created object from the backend.',
          'Validate required fields before calling to avoid predictable request failures.',
        ],
      },
    ],
  },
{
        slug: 'get-project-task-board',
        path: ['agents', 'get-project-task-board'],
        title: 'getProjectTaskBoard()',
        description: 'Load the task board for a project.',
        intro:
          'Returns the task board object associated with the given project id.',
        usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function getProjectTaskBoard(projectId: string) {
  const client = await wachtClient();
  return client.ai.getProjectTaskBoard(projectId);
}`,
        signature: `function getProjectTaskBoard(
  projectId: string,
): Promise<ProjectTaskBoard>`,
        params: [{ name: 'projectId', type: 'string', description: 'Project id whose task board should be loaded.' }],
        api: [
          { name: 'project_id', type: 'string | undefined', description: 'Parent project id.' },
          { name: 'columns', type: 'ProjectTaskBoardColumn[] | undefined', description: 'Board columns and ordering metadata.' },
          { name: 'items_count', type: 'number | undefined', description: 'Total number of board items.' },
        ],
    sections: [
      {
        title: 'Behavior',
        points: [
          'Fetches a single resource by identifier or query context.',
          'Use this result as the source of truth before update, replay, or delete flows.',
        ],
      },
    ],
  },
];
