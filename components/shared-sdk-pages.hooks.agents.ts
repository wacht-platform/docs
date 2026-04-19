import type { SharedGroup } from './shared-sdk-pages.types';

export const agentsHookGroup: SharedGroup = {
  label: 'Agents',
  docs: [
    {
      slug: 'use-agent-session',
      title: 'useAgentSession',
      description: 'Read the current agent console session.',
      importName: 'useAgentSession',
      intro:
        '`useAgentSession()` is the entry hook for the agents surface. It resolves the current agent session, returns the actor and the available agents for that session, and optionally exchanges a `ticket` before it loads the session.',
      example: `import { useAgentSession } from '@wacht/nextjs';

export default function AgentShell({
  ticket,
}: {
  ticket?: string | null;
}) {
  const {
    hasSession,
    sessionLoading,
    sessionError,
    actor,
    agents,
    ticketExchanged,
  } = useAgentSession(ticket);

  if (sessionLoading) {
    return <div>Loading agent session...</div>;
  }

  if (!hasSession || sessionError) {
    return <div>Access required</div>;
  }

  return (
    <div>
      <h1>{actor?.display_name ?? 'Actor'}</h1>
      <p>{agents.length} agents available</p>
      {ticket ? <p>Ticket exchanged: {String(ticketExchanged)}</p> : null}
    </div>
  );
}`,
      points: [],
      signature: `declare function useAgentSession(ticket?: string | null): {
  hasSession: boolean;
  sessionLoading: boolean;
  sessionError: Error | null;
  sessionId: string | null;
  actor: Actor | null;
  agents: Agent[];
  ticketExchanged: boolean;
  ticketLoading: boolean;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'The hook has two jobs. First, when a `ticket` is present, it exchanges that ticket once and waits for the exchange to finish. After that, it loads the current `/ai/session` state and keeps the resulting actor and agent list in memory through SWR.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useAgentSession()` at the boundary where your agents product becomes available, not deep inside every thread or project screen. It is the hook you use when you are building your own agent workspace and you want one place to resolve the session, the current actor, and the available agents before the rest of the UI mounts.',
            'That is the right pattern when your app has a distinct agents area. Let this hook answer access, actor identity, and available-agent questions at the top of that area, then let the deeper hooks focus on projects, threads, tasks, and conversation state.',
          ],
        },
        {
          title: 'Integration pattern',
          paragraphs: [
            'A common pattern is to read the `ticket` from the URL at the layout boundary, pass it into `useAgentSession(ticket)`, and then remove the query param after `ticketExchanged` becomes true. The rest of the agents UI can then read `hasSession`, `actor`, and `agents` from your own provider instead of calling the hook again in every page.',
          ],
        },
      ],
      api: [
        {
          name: 'ticket',
          type: 'string | null | undefined',
          description: 'Optional session ticket. When present, the hook tries to exchange it once before it fetches the agent session.',
        },
        { name: 'hasSession', type: 'boolean', description: 'Whether the current user has a valid agent session.' },
        { name: 'sessionLoading', type: 'boolean', description: 'True while the ticket exchange or the session fetch is still in flight.' },
        { name: 'sessionError', type: 'Error | null', description: 'Transport or exchange failure. Missing-session responses are not exposed here.' },
        { name: 'sessionId', type: 'string | null', description: 'Session identifier from the loaded agent session.' },
        {
          name: 'actor',
          type: 'Actor | null',
          description: 'Current actor that owns the agent session.',
          children: [
            { name: 'id', type: 'string', description: 'Actor identifier.' },
            { name: 'subject_type', type: 'string', description: 'Actor subject type.' },
            { name: 'external_key', type: 'string', description: 'External actor key.' },
            { name: 'display_name', type: 'string | undefined', description: 'Display name for the actor when one is present.' },
            { name: 'deployment_id', type: 'string | undefined', description: 'Deployment identifier when attached to the actor.' },
          ],
        },
        {
          name: 'agents',
          type: 'Agent[]',
          description: 'Agents available to the current session.',
          children: [
            { name: 'id', type: 'string', description: 'Agent identifier.' },
            { name: 'name', type: 'string', description: 'Human-readable agent name.' },
            { name: 'description', type: 'string', description: 'Optional agent description.' },
            { name: 'child_agents', type: 'Agent[] | undefined', description: 'Nested child agents when the deployment exposes them.' },
          ],
        },
        { name: 'ticketExchanged', type: 'boolean', description: 'Whether the supplied ticket has already been exchanged successfully.' },
        { name: 'ticketLoading', type: 'boolean', description: 'Whether the hook is still exchanging the supplied ticket.' },
        { name: 'refetch', type: '() => Promise<void>', description: 'Revalidates the loaded agent session.' },
      ],
    },
    {
      slug: 'use-actor-projects',
      title: 'useActorProjects',
      description: 'List and mutate actor projects.',
      importName: 'useActorProjects',
      intro:
        '`useActorProjects()` is the main project hook for the agents surface. It returns the current actor project list and the project-level mutations that create, update, archive, and unarchive those projects.',
      example: `import { useActorProjects } from '@wacht/nextjs';

export default function ProjectsPage() {
  const { projects, loading, createProject } = useActorProjects();

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div>
      <button
        onClick={async () => {
          await createProject({
            name: 'Planning',
            agent_id: 'agent_123',
          });
        }}
      >
        Create project
      </button>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
      points: [],
      signature: `declare function useActorProjects(options?: {
  includeArchived?: boolean;
  enabled?: boolean;
}): {
  projects: ActorProject[];
  loading: boolean;
  error: unknown;
  createProject: (request: CreateActorProjectRequest) => Promise<ApiResult<ActorProject>>;
  updateProject: (projectId: string, request: UpdateActorProjectRequest) => Promise<ApiResult<ActorProject>>;
  archiveProject: (projectId: string) => Promise<ApiResult<ActorProject>>;
  unarchiveProject: (projectId: string) => Promise<ApiResult<ActorProject>>;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This is the project list hook, not a route-selection hook. It fetches the actor project list, optionally includes archived projects, and revalidates the list after every project mutation.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useActorProjects()` anywhere you need the full project collection: project switchers, project overview screens, routed project shells, and project management dialogs.',
            'If you need filtered or search-oriented project results for a command palette, use `useActorProjectSearch()` instead.',
          ],
        },
      ],
      api: [
        {
          name: 'options',
          type: '{ includeArchived?: boolean; enabled?: boolean } | undefined',
          description: 'Optional list controls.',
          children: [
            { name: 'includeArchived', type: 'boolean | undefined', description: 'Include archived projects in the returned list.' },
            { name: 'enabled', type: 'boolean | undefined', description: 'Disable the query entirely when the surrounding session is not ready.' },
          ],
        },
        {
          name: 'projects',
          type: 'ActorProject[]',
          description: 'Projects for the current actor.',
          children: [
            { name: 'id', type: 'string', description: 'Project identifier.' },
            { name: 'name', type: 'string', description: 'Project name.' },
            { name: 'description', type: 'string | undefined', description: 'Optional project description.' },
            { name: 'status', type: 'string', description: 'Current project status.' },
            { name: 'coordinator_thread_id', type: 'string | undefined', description: 'Coordinator thread for the project when present.' },
            { name: 'review_thread_id', type: 'string | undefined', description: 'Review thread for the project when present.' },
            { name: 'updated_at', type: 'string', description: 'Last update timestamp.' },
            { name: 'archived_at', type: 'string | undefined', description: 'Archive timestamp when the project has been archived.' },
          ],
        },
        { name: 'createProject', type: '(request: CreateActorProjectRequest) => Promise<ApiResult<ActorProject>>', description: 'Creates a new project. The created project is available on `result.data`.' },
        { name: 'updateProject', type: '(projectId: string, request: UpdateActorProjectRequest) => Promise<ApiResult<ActorProject>>', description: 'Updates one project and returns the updated project on `result.data`.' },
        { name: 'archiveProject', type: '(projectId: string) => Promise<ApiResult<ActorProject>>', description: 'Archives one project and returns the archived project on `result.data`.' },
        { name: 'unarchiveProject', type: '(projectId: string) => Promise<ApiResult<ActorProject>>', description: 'Restores one archived project and returns the project on `result.data`.' },
      ],
      examples: [
        {
          title: 'Resolve the current routed project',
          code: `import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useActorProjects } from '@wacht/nextjs';

export default function RoutedProjectShell() {
  const pathname = usePathname();
  const routeProjectId = useMemo(() => {
    const match = pathname.match(/^\\/agents\\/p\\/([^/]+)/);
    return match?.[1] ?? null;
  }, [pathname]);

  const { projects } = useActorProjects();
  const project = projects.find((item) => item.id === routeProjectId) ?? null;

  return <div>{project?.name ?? 'No project selected'}</div>;
}`,
          lang: 'tsx',
        },
      ],
    },
    {
      slug: 'use-actor-project-search',
      title: 'useActorProjectSearch',
      description: 'Search actor projects.',
      importName: 'useActorProjectSearch',
      intro:
        '`useActorProjectSearch()` is the search-focused project hook. It returns paged project search results for a free-text query and is a better fit for palettes, jump menus, and search boxes than the full project list hook.',
      example: `import { useState } from 'react';
import { useActorProjectSearch } from '@wacht/nextjs';

export default function ProjectSearch() {
  const [query, setQuery] = useState('');
  const { projects, loading } = useActorProjectSearch({ query, limit: 12 });

  return (
    <div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      {loading ? <div>Searching…</div> : null}
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
      points: [],
      signature: `declare function useActorProjectSearch(options?: {
  enabled?: boolean;
  query?: string;
  limit?: number;
}): {
  projects: ActorProject[];
  loading: boolean;
  error: unknown;
  hasMore: boolean;
  nextCursor?: string;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'The hook trims the query before it builds the cache key, sends the search request to the project search endpoint, and returns the current page of matches plus the pagination metadata from the backend response.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useActorProjectSearch()` when the user is typing a query and you want matching projects instead of the full project list. It fits command menus, search inputs, and other transient navigation UI.',
          ],
        },
      ],
      api: [
        { name: 'projects', type: 'ActorProject[]', description: 'Current page of project matches.' },
        { name: 'loading', type: 'boolean', description: 'Whether the current search request is still loading.' },
        { name: 'hasMore', type: 'boolean', description: 'Whether the backend has more search results beyond this page.' },
        { name: 'nextCursor', type: 'string | undefined', description: 'Cursor for the next page when the backend returned one.' },
      ],
    },
    {
      slug: 'use-actor-thread-search',
      title: 'useActorThreadSearch',
      description: 'Search threads across the actor scope.',
      importName: 'useActorThreadSearch',
      intro:
        '`useActorThreadSearch()` is the search hook for the actor-wide thread surface. It returns matching threads across projects, which makes it useful for jump menus, global search palettes, and “open thread” UIs.',
      example: `import { useState } from 'react';
import { useActorThreadSearch } from '@wacht/nextjs';

export default function ThreadSearch() {
  const [query, setQuery] = useState('');
  const { threads } = useActorThreadSearch({ query, limit: 16 });

  return (
    <div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>{thread.title || thread.responsibility || thread.id}</li>
        ))}
      </ul>
    </div>
  );
}`,
      points: [],
      signature: `declare function useActorThreadSearch(options?: {
  enabled?: boolean;
  query?: string;
  limit?: number;
}): {
  threads: AgentThread[];
  loading: boolean;
  error: unknown;
  hasMore: boolean;
  nextCursor?: string;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook mirrors `useActorProjectSearch()`, but for threads. It is actor-wide rather than project-local, so the result set can include conversation threads and execution threads from different projects.',
          ],
        },
      ],
      api: [
        { name: 'threads', type: 'AgentThread[]', description: 'Current page of matching threads.' },
        { name: 'hasMore', type: 'boolean', description: 'Whether more thread search results are available.' },
        { name: 'nextCursor', type: 'string | undefined', description: 'Cursor for a later page when the backend returned one.' },
      ],
    },
    {
      slug: 'use-project-threads',
      title: 'useProjectThreads',
      description: 'List and mutate threads inside one project.',
      importName: 'useProjectThreads',
      intro:
        '`useProjectThreads()` is the project-local thread collection hook. It lists the threads that belong to one project and exposes the thread mutations that create, update, archive, and unarchive those threads.',
      example: `import { useProjectThreads } from '@wacht/nextjs';

export default function ProjectThreadList({
  projectId,
}: {
  projectId: string;
}) {
  const { threads, createThread } = useProjectThreads(projectId);

  return (
    <div>
      <button
        onClick={async () => {
          await createThread({
            title: 'Planning thread',
            agent_id: 'agent_123',
          });
        }}
      >
        New thread
      </button>

      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>{thread.title}</li>
        ))}
      </ul>
    </div>
  );
}`,
      points: [],
      signature: `declare function useProjectThreads(projectId?: string, options?: {
  includeArchived?: boolean;
  enabled?: boolean;
}): {
  threads: AgentThread[];
  loading: boolean;
  error: unknown;
  hasMore: boolean;
  nextCursor: string;
  createThread: (request: CreateAgentThreadRequest) => Promise<ApiResult<AgentThread>>;
  createThreadForProject: (targetProjectId: string, request: CreateAgentThreadRequest) => Promise<ApiResult<AgentThread>>;
  updateThread: (threadId: string, request: UpdateAgentThreadRequest) => Promise<ApiResult<AgentThread>>;
  archiveThread: (threadId: string) => Promise<ApiResult<AgentThread>>;
  unarchiveThread: (threadId: string) => Promise<ApiResult<AgentThread>>;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook reads one project thread list and keeps the write-side thread helpers beside it. The list itself is a single-page project thread read, while the thread feed hook covers the larger infinite-scroll sidebar pattern.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useProjectThreads()` when you need the canonical thread collection for one project, or when you want the project-scoped thread creation and archive helpers in the same place.',
          ],
        },
      ],
      api: [
        { name: 'threads', type: 'AgentThread[]', description: 'Threads in the current project.' },
        { name: 'createThread', type: '(request: CreateAgentThreadRequest) => Promise<ApiResult<AgentThread>>', description: 'Creates a thread in the current `projectId`. The created thread is available on `result.data`.' },
        { name: 'createThreadForProject', type: '(targetProjectId: string, request: CreateAgentThreadRequest) => Promise<ApiResult<AgentThread>>', description: 'Creates a thread for an explicit target project and is useful when the surrounding UI can switch project targets.' },
        { name: 'updateThread', type: '(threadId: string, request: UpdateAgentThreadRequest) => Promise<ApiResult<AgentThread>>', description: 'Updates a thread and returns the updated thread on `result.data`.' },
        { name: 'archiveThread', type: '(threadId: string) => Promise<ApiResult<AgentThread>>', description: 'Archives one thread and returns the archived thread on `result.data`.' },
        { name: 'unarchiveThread', type: '(threadId: string) => Promise<ApiResult<AgentThread>>', description: 'Restores one thread and returns the thread on `result.data`.' },
      ],
    },
    {
      slug: 'use-project-thread-feed',
      title: 'useProjectThreadFeed',
      description: 'Read the paged sidebar feed for one project.',
      importName: 'useProjectThreadFeed',
      intro:
        '`useProjectThreadFeed()` is the infinite-list thread feed hook. It returns a flattened thread list together with `loadMore()` and the archive/query controls that a project sidebar usually needs.',
      example: `import { useProjectThreadFeed } from '@wacht/nextjs';

export default function ThreadFeed({
  projectId,
}: {
  projectId: string;
}) {
  const { threads, hasMore, loadMore } = useProjectThreadFeed(projectId, {
    query: '',
  });

  return (
    <div>
      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>{thread.title}</li>
        ))}
      </ul>
      {hasMore ? <button onClick={() => void loadMore()}>Load more</button> : null}
    </div>
  );
}`,
      points: [],
      signature: `declare function useProjectThreadFeed(projectId?: string, options?: {
  includeArchived?: boolean;
  archivedOnly?: boolean;
  enabled?: boolean;
  query?: string;
  limit?: number;
}): {
  threads: AgentThread[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'The feed hook is the one that matches a sidebar or other infinite scroll surface. It can include archived threads, restrict the feed to archived threads only, or filter the returned feed with a free-text query.',
          ],
        },
      ],
      api: [
        { name: 'threads', type: 'AgentThread[]', description: 'Flattened thread feed across the currently loaded pages.' },
        { name: 'hasMore', type: 'boolean', description: 'Whether another page can be loaded.' },
        { name: 'loadingMore', type: 'boolean', description: 'Whether the next page is currently loading.' },
        { name: 'loadMore', type: '() => Promise<void>', description: 'Loads the next page when `hasMore` is true.' },
      ],
    },
    {
      slug: 'use-agent-thread',
      title: 'useAgentThread',
      description: 'Read and mutate one thread.',
      importName: 'useAgentThread',
      intro:
        '`useAgentThread()` is the single-thread hook. It loads one thread by id and exposes the thread-level update, archive, and unarchive helpers for detail pages and editors.',
      example: `import { useAgentThread } from '@wacht/nextjs';

export default function ThreadDetail({
  threadId,
}: {
  threadId: string;
}) {
  const { thread, updateThread } = useAgentThread(threadId, true);

  if (!thread) {
    return <div>Loading thread...</div>;
  }

  return (
    <button
      onClick={async () => {
        await updateThread({
          title: 'Updated title',
        });
      }}
    >
      {thread.title}
    </button>
  );
}`,
      points: [],
      signature: `declare function useAgentThread(threadId?: string, enabled?: boolean): {
  thread: AgentThread | null;
  loading: boolean;
  error: Error | null;
  updateThread: (request: UpdateAgentThreadRequest) => Promise<ApiResult<AgentThread>>;
  archiveThread: () => Promise<ApiResult<AgentThread>>;
  unarchiveThread: () => Promise<ApiResult<AgentThread>>;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'Use this hook when the UI already knows which thread it wants. It is the smallest thread read surface in the SDK, and it leaves events, assignments, conversation state, filesystem, and task graphs to the specialized hooks that sit beside it.',
          ],
        },
      ],
      api: [
        {
          name: 'thread',
          type: 'AgentThread | null',
          description: 'The loaded thread record.',
          children: [
            { name: 'id', type: 'string', description: 'Thread identifier.' },
            { name: 'project_id', type: 'string', description: 'Owning project identifier.' },
            { name: 'title', type: 'string', description: 'Thread title.' },
            { name: 'thread_purpose', type: 'string', description: 'Thread purpose such as conversation or review.' },
            { name: 'status', type: 'string', description: 'Current execution state.' },
            { name: 'execution_state', type: 'ThreadExecutionState | undefined', description: 'Execution-specific state such as pending approvals.' },
          ],
        },
      ],
    },
    {
      slug: 'use-agent-thread-conversation',
      title: 'useAgentThreadConversation',
      description: 'Drive the live conversation surface for one thread.',
      importName: 'useAgentThreadConversation',
      intro:
        '`useAgentThreadConversation()` is the live conversation hook behind the agent chat surface. It loads message history, subscribes to streaming updates, tracks pending submissions and approvals, and exposes the send, approval, and execution controls that the chat UI needs.',
      example: `import { useAgentThreadConversation } from '@wacht/nextjs';

export default function ThreadConversation({
  threadId,
}: {
  threadId: string;
}) {
  const {
    messages,
    sendMessage,
    pendingApprovalRequest,
    submitApprovalResponse,
  } = useAgentThreadConversation({ threadId });

  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.content.type}</li>
        ))}
      </ul>

      {pendingApprovalRequest ? (
        <button
          onClick={() =>
            submitApprovalResponse('allow_once', pendingApprovalRequest.request_message_id)
          }
        >
          Approve once
        </button>
      ) : null}

      <button onClick={() => void sendMessage('Continue with the plan')}>Send</button>
    </div>
  );
}`,
      points: [],
      signature: `declare function useAgentThreadConversation(options: {
  threadId: string;
  platformAdapter?: {
    onPlatformEvent?: (eventName: string, eventData: unknown) => void;
  };
}): {
  messages: ConversationMessage[];
  pendingMessage: string | null;
  pendingFiles: File[] | null;
  messagesLoading: boolean;
  messagesError: Error | null;
  hasMoreMessages: boolean;
  isLoadingMore: boolean;
  sendMessage: (message: string, files?: File[]) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  submitApprovalResponse: (mode: 'allow_once' | 'allow_always' | 'reject', requestMessageId?: string) => Promise<void>;
  cancelExecution: () => Promise<void>;
  hasActiveRun: boolean;
  isRunning: boolean;
  pendingApprovalRequest: ThreadPendingApprovalRequestState | null;
  activeApprovalRequestId: string | null;
  resolveMessageFileUrl: (file: FileData) => string;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook owns the live conversation state for one thread. It loads the initial message history, listens for streaming updates, merges new conversation messages into the list, tracks optimistic send state, and derives approval and execution state from the thread events it receives.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useAgentThreadConversation()` when you are building an interactive thread surface, not just a static history viewer. It is the right hook for chat panes, review conversations, and any thread page that needs sending, approvals, or streaming execution status.',
          ],
        },
      ],
      api: [
        { name: 'messages', type: 'ConversationMessage[]', description: 'Conversation history for the thread, kept sorted by timestamp.' },
        { name: 'pendingMessage', type: 'string | null', description: 'Optimistic outgoing message text while a send is still in progress.' },
        { name: 'pendingFiles', type: 'File[] | null', description: 'Optimistic outgoing file attachments while a send is still in progress.' },
        { name: 'messagesLoading', type: 'boolean', description: 'Whether the initial message history is still loading.' },
        { name: 'hasMoreMessages', type: 'boolean', description: 'Whether older history can still be loaded.' },
        { name: 'isLoadingMore', type: 'boolean', description: 'Whether older history is currently loading.' },
        { name: 'sendMessage', type: '(message: string, files?: File[]) => Promise<void>', description: 'Sends a new user message and optional file attachments into the thread.' },
        { name: 'loadMoreMessages', type: '() => Promise<void>', description: 'Loads older conversation history.' },
        { name: 'submitApprovalResponse', type: "(mode: 'allow_once' | 'allow_always' | 'reject', requestMessageId?: string) => Promise<void>", description: 'Responds to the current approval request.' },
        { name: 'cancelExecution', type: '() => Promise<void>', description: 'Cancels the current execution when the thread is running.' },
        { name: 'pendingApprovalRequest', type: 'ThreadPendingApprovalRequestState | null', description: 'Current approval request derived from the live execution state when one exists.' },
        { name: 'activeApprovalRequestId', type: 'string | null', description: 'Message id for the current approval request.' },
        { name: 'hasActiveRun', type: 'boolean', description: 'Whether the thread is currently in an active run state.' },
        { name: 'isRunning', type: 'boolean', description: 'Whether the execution state is currently running.' },
      ],
    },
    {
      slug: 'use-agent-thread-filesystem',
      title: 'useAgentThreadFilesystem',
      description: 'Browse and read the thread workspace filesystem.',
      importName: 'useAgentThreadFilesystem',
      intro:
        '`useAgentThreadFilesystem()` is the thread workspace file hook. It exposes the top-level listing for the thread filesystem and the helper methods that read individual files or nested directories inside that workspace.',
      example: `import { useEffect } from 'react';
import { useAgentThreadFilesystem } from '@wacht/nextjs';

export default function FilesystemPane({
  threadId,
}: {
  threadId: string;
}) {
  const { filesystem, getFile } = useAgentThreadFilesystem(threadId, true);

  useEffect(() => {
    const firstFile = filesystem.files.find((entry) => !entry.is_dir);
    if (firstFile) {
      void getFile(firstFile.path);
    }
  }, [filesystem.files, getFile]);

  return <div>{filesystem.files.length} items</div>;
}`,
      points: [],
      signature: `declare function useAgentThreadFilesystem(threadId?: string, enabled?: boolean): {
  filesystem: ProjectTaskWorkspaceListing;
  filesystemLoading: boolean;
  filesystemError: Error | null;
  getFile: (path: string) => Promise<ProjectTaskWorkspaceFileContent & { blob: Blob }>;
  listDirectory: (path?: string) => Promise<ProjectTaskWorkspaceListing>;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'The top-level hook state is a directory listing, not file content. File content stays on demand through `getFile()`, which is why the hook works well for explorer panes where the user navigates a tree and opens files lazily.',
          ],
        },
      ],
      api: [
        {
          name: 'filesystem',
          type: 'ProjectTaskWorkspaceListing',
          description: 'Current top-level filesystem listing.',
          children: [
            { name: 'exists', type: 'boolean', description: 'Whether the workspace exists at all.' },
            { name: 'files', type: 'ProjectTaskWorkspaceFileEntry[]', description: 'Current entries in the listing.' },
          ],
        },
        { name: 'getFile', type: '(path: string) => Promise<ProjectTaskWorkspaceFileContent & { blob: Blob }>', description: 'Loads one file from the thread workspace and returns file metadata plus a `Blob`.' },
        { name: 'listDirectory', type: '(path?: string) => Promise<ProjectTaskWorkspaceListing>', description: 'Reads a nested directory listing without replacing the hook API contract.' },
      ],
    },
    {
      slug: 'use-agent-thread-events',
      title: 'useAgentThreadEvents',
      description: 'Read the activity feed for one thread.',
      importName: 'useAgentThreadEvents',
      intro:
        '`useAgentThreadEvents()` reads the paged event feed for one thread. It is the right hook for activity timelines, execution logs, and review surfaces that need the thread event stream but not the full conversation surface.',
      example: `import { useAgentThreadEvents } from '@wacht/nextjs';

export default function ThreadEvents({
  threadId,
}: {
  threadId: string;
}) {
  const { events, hasMore, loadMore } = useAgentThreadEvents(threadId, {
    enabled: !!threadId,
  });

  return (
    <div>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.event_type}</li>
        ))}
      </ul>
      {hasMore ? <button onClick={() => void loadMore()}>More</button> : null}
    </div>
  );
}`,
      points: [],
      signature: `declare function useAgentThreadEvents(threadId?: string, options?: {
  enabled?: boolean;
  limit?: number;
}): {
  events: ThreadEvent[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook is a read-only event feed. It keeps a paged, periodically refreshed list of thread events and flattens the pages for the caller, which is why it works well for event timelines and activity drawers.',
          ],
        },
      ],
      api: [
        { name: 'events', type: 'ThreadEvent[]', description: 'Flattened event list for the current thread.' },
        { name: 'hasMore', type: 'boolean', description: 'Whether more event pages are available.' },
        { name: 'loadingMore', type: 'boolean', description: 'Whether the next event page is currently loading.' },
      ],
    },
    {
      slug: 'use-agent-thread-assignments',
      title: 'useAgentThreadAssignments',
      description: 'Read assignments attached to one thread.',
      importName: 'useAgentThreadAssignments',
      intro:
        '`useAgentThreadAssignments()` reads the assignment feed for one thread. It is useful for coordinator and review surfaces where you need the ordered assignment list without the larger task board item surface.',
      example: `import { useAgentThreadAssignments } from '@wacht/nextjs';

export default function ThreadAssignments({
  threadId,
}: {
  threadId: string;
}) {
  const { assignments } = useAgentThreadAssignments(threadId, {
    enabled: !!threadId,
  });

  return (
    <ul>
      {assignments.map((assignment) => (
        <li key={assignment.id}>{assignment.assignment_role}</li>
      ))}
    </ul>
  );
}`,
      points: [],
      signature: `declare function useAgentThreadAssignments(threadId?: string, options?: {
  enabled?: boolean;
  limit?: number;
}): {
  assignments: ProjectTaskBoardItemAssignment[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'Like `useAgentThreadEvents()`, this is a paged read-only list. It is focused on the assignment history and current assignment state that the thread participates in.',
          ],
        },
      ],
      api: [
        {
          name: 'assignments',
          type: 'ProjectTaskBoardItemAssignment[]',
          description: 'Flattened assignment list for the thread.',
          children: [
            { name: 'id', type: 'string', description: 'Assignment identifier.' },
            { name: 'assignment_role', type: 'string', description: 'Role this assignment plays in the task flow.' },
            { name: 'assignment_order', type: 'number', description: 'Execution order for the assignment.' },
            { name: 'status', type: 'string', description: 'Current assignment status.' },
            { name: 'result_status', type: 'string | undefined', description: 'Outcome status when the assignment has completed.' },
          ],
        },
      ],
    },
    {
      slug: 'use-project-tasks',
      title: 'useProjectTasks',
      description: 'List and mutate task board items for one project.',
      importName: 'useProjectTasks',
      intro:
        '`useProjectTasks()` is the project task board hook. It returns the current task items for one project and exposes the task-level create, archive, and unarchive helpers used by task board screens.',
      example: `import { useProjectTasks } from '@wacht/nextjs';

export default function ProjectTasks({
  projectId,
}: {
  projectId: string;
}) {
  const { tasks, createTask } = useProjectTasks(projectId, true, {
    limit: 40,
  });

  return (
    <div>
      <button
        onClick={async () => {
          await createTask({
            title: 'Review webhook errors',
            priority: 'high',
          });
        }}
      >
        New task
      </button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}`,
      points: [],
      signature: `declare function useProjectTasks(projectId?: string, enabled?: boolean, options?: {
  statuses?: string[];
  includeArchived?: boolean;
  archivedOnly?: boolean;
  limit?: number;
}): {
  tasks: ProjectTaskBoardItem[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => Promise<void>;
  createTask: (request: CreateProjectTaskBoardItemRequest, files?: File[]) => Promise<ApiResult<ProjectTaskBoardItem>>;
  archiveTask: (itemId: string) => Promise<ApiResult<ProjectTaskBoardItem>>;
  unarchiveTask: (itemId: string) => Promise<ApiResult<ProjectTaskBoardItem>>;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook is a paged task board list, not a single task detail hook. It can filter the task list by status, include archived items, or show archived items only, which is why it works for the active board and the archived column with the same API.',
          ],
        },
      ],
      api: [
        { name: 'tasks', type: 'ProjectTaskBoardItem[]', description: 'Flattened task items for the current filter.' },
        { name: 'createTask', type: '(request: CreateProjectTaskBoardItemRequest, files?: File[]) => Promise<ApiResult<ProjectTaskBoardItem>>', description: 'Creates a task board item and returns the created item on `result.data`.' },
        { name: 'archiveTask', type: '(itemId: string) => Promise<ApiResult<ProjectTaskBoardItem>>', description: 'Archives one task item and returns the archived item on `result.data`.' },
        { name: 'unarchiveTask', type: '(itemId: string) => Promise<ApiResult<ProjectTaskBoardItem>>', description: 'Restores one task item and returns the restored item on `result.data`.' },
      ],
    },
    {
      slug: 'use-project-task-board-item',
      title: 'useProjectTaskBoardItem',
      description: 'Read and mutate one task board item.',
      importName: 'useProjectTaskBoardItem',
      intro:
        '`useProjectTaskBoardItem()` is the detail hook for one task board item. It combines the item record, journal events, assignments, and workspace listing so a task detail screen can stay on one hook instead of composing those pieces manually.',
      example: `import { useProjectTaskBoardItem } from '@wacht/nextjs';

export default function TaskDetail({
  projectId,
  itemId,
}: {
  projectId: string;
  itemId: string;
}) {
  const { item, appendJournal, taskWorkspace } = useProjectTaskBoardItem(
    projectId,
    itemId,
    true,
  );

  return (
    <div>
      <h1>{item?.title}</h1>
      <p>{taskWorkspace.files.length} workspace entries</p>
      <button
        onClick={async () => {
          await appendJournal({
            summary: 'Reviewed task output',
          });
        }}
      >
        Add journal entry
      </button>
    </div>
  );
}`,
      points: [],
      signature: `declare function useProjectTaskBoardItem(projectId?: string, itemId?: string, enabled?: boolean, options?: {
  includeArchived?: boolean;
}): {
  item: ProjectTaskBoardItem | null;
  events: ProjectTaskBoardItemEvent[];
  assignments: ProjectTaskBoardItemAssignment[];
  eventsHasMore: boolean;
  eventsLoadingMore: boolean;
  loadMoreEvents: () => Promise<void>;
  assignmentsHasMore: boolean;
  assignmentsLoadingMore: boolean;
  loadMoreAssignments: () => Promise<void>;
  taskWorkspace: ProjectTaskWorkspaceListing;
  taskWorkspaceLoading: boolean;
  taskWorkspaceError: Error | null;
  loading: boolean;
  error: Error | null;
  updateItem: (request: UpdateProjectTaskBoardItemRequest, files?: File[]) => Promise<ApiResult<ProjectTaskBoardItem>>;
  archiveItem: () => Promise<ApiResult<ProjectTaskBoardItem>>;
  unarchiveItem: () => Promise<ApiResult<ProjectTaskBoardItem>>;
  getTaskWorkspaceFile: (path: string) => Promise<ApiResult<ProjectTaskWorkspaceFileContent>>;
  listTaskWorkspaceDirectory: (path?: string) => Promise<ApiResult<ProjectTaskWorkspaceListing>>;
  appendJournal: (request: AppendProjectTaskBoardItemJournalRequest, files?: File[]) => Promise<ApiResult<ProjectTaskBoardItemEvent>>;
  refetch: () => Promise<void>;
  refetchEvents: () => Promise<void>;
  refetchAssignments: () => Promise<void>;
  refetchTaskWorkspace: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'This hook is intentionally broad because the task detail screen itself is broad. It keeps the core task item, the task journal, the assignments, and the workspace listing in sync, and it revalidates the related pieces after mutations such as update or journal append.',
          ],
        },
      ],
      api: [
        { name: 'item', type: 'ProjectTaskBoardItem | null', description: 'The task board item itself.' },
        { name: 'events', type: 'ProjectTaskBoardItemEvent[]', description: 'Flattened task journal and event feed.' },
        { name: 'assignments', type: 'ProjectTaskBoardItemAssignment[]', description: 'Flattened assignment list for the task.' },
        { name: 'taskWorkspace', type: 'ProjectTaskWorkspaceListing', description: 'Current task workspace listing.' },
        { name: 'updateItem', type: '(request: UpdateProjectTaskBoardItemRequest, files?: File[]) => Promise<ApiResult<ProjectTaskBoardItem>>', description: 'Updates the item and returns the updated item on `result.data`.' },
        { name: 'appendJournal', type: '(request: AppendProjectTaskBoardItemJournalRequest, files?: File[]) => Promise<ApiResult<ProjectTaskBoardItemEvent>>', description: 'Appends a journal entry and returns the new event on `result.data`.' },
        { name: 'getTaskWorkspaceFile', type: '(path: string) => Promise<ApiResult<ProjectTaskWorkspaceFileContent>>', description: 'Reads one workspace file. The file payload is available on `result.data`.' },
      ],
    },
    {
      slug: 'use-agent-thread-task-graphs',
      title: 'useAgentThreadTaskGraphs',
      description: 'Read task graph bundles for one thread.',
      importName: 'useAgentThreadTaskGraphs',
      intro:
        '`useAgentThreadTaskGraphs()` reads the paged task graph bundles for one thread. It is the hook behind task graph drawers and graph timelines, where the UI needs the graph, nodes, edges, and summary together.',
      example: `import { useAgentThreadTaskGraphs } from '@wacht/nextjs';

export default function TaskGraphs({
  threadId,
}: {
  threadId: string;
}) {
  const { graphs, latestGraph } = useAgentThreadTaskGraphs(threadId, true);

  return (
    <div>
      <p>{graphs.length} graphs loaded</p>
      <p>Latest: {latestGraph?.graph.status ?? 'none'}</p>
    </div>
  );
}`,
      points: [],
      signature: `declare function useAgentThreadTaskGraphs(threadId?: string, enabled?: boolean): {
  graphs: ThreadTaskGraphBundle[];
  latestGraph: ThreadTaskGraphBundle | null;
  has_more: boolean;
  loadingMore: boolean;
  loading: boolean;
  error: unknown;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'The hook returns graph bundles instead of plain graph records because most graph UIs need the graph metadata, the nodes, the edges, and the current summary together. It also normalizes missing node, edge, and summary arrays so the caller can render the graph surface directly.',
          ],
        },
      ],
      api: [
        {
          name: 'graphs',
          type: 'ThreadTaskGraphBundle[]',
          description: 'Loaded task graph bundles for the thread.',
          children: [
            { name: 'graph', type: 'ThreadTaskGraph', description: 'Graph metadata.' },
            { name: 'nodes', type: 'ThreadTaskNode[]', description: 'Nodes in the graph.' },
            { name: 'edges', type: 'ThreadTaskEdge[]', description: 'Edges between nodes.' },
            { name: 'summary', type: 'ThreadTaskGraphSummary | null | undefined', description: 'Optional computed summary for the graph.' },
          ],
        },
        { name: 'latestGraph', type: 'ThreadTaskGraphBundle | null', description: 'Convenience handle for the first loaded graph bundle.' },
      ],
    },
    {
      slug: 'use-actor-mcp-servers',
      title: 'useActorMcpServers',
      description: 'List and connect deployment MCP servers.',
      importName: 'useActorMcpServers',
      intro:
        '`useActorMcpServers()` is the MCP server management hook for the agents surface. It lists the deployment MCP servers available to the current actor and exposes the two connection actions that open or revoke a user connection.',
      example: `import { useActorMcpServers } from '@wacht/nextjs';

export default function McpServers() {
  const { servers, connect, disconnect } = useActorMcpServers(true);

  return (
    <ul>
      {servers.map((server) => (
        <li key={server.id}>
          {server.name}
          <button
            onClick={async () => {
              const result = await connect(server.id);
              window.open(result.data.auth_url, '_blank', 'noopener,noreferrer');
            }}
          >
            Connect
          </button>
          <button onClick={() => void disconnect(server.id)}>Disconnect</button>
        </li>
      ))}
    </ul>
  );
}`,
      points: [],
      signature: `declare function useActorMcpServers(enabled?: boolean): {
  servers: ActorMcpServerSummary[];
  loading: boolean;
  error: unknown;
  connect: (mcpServerId: string) => Promise<ApiResult<{ auth_url: string }>>;
  disconnect: (mcpServerId: string) => Promise<ApiResult<{ success: boolean }>>;
  refetch: () => Promise<void>;
};`,
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'The read side of this hook is a simple MCP server list. The write side keeps the response envelope because the caller needs the returned `auth_url` on connect and the explicit success payload on disconnect.',
          ],
        },
        {
          title: 'When to use it',
          paragraphs: [
            'Use `useActorMcpServers()` when your agents workspace exposes user-facing MCP integrations. It fits an integrations page, an MCP settings panel, or any UI that needs to start a per-user connection flow for a deployment-level MCP server.',
          ],
        },
      ],
      api: [
        {
          name: 'servers',
          type: 'ActorMcpServerSummary[]',
          description: 'Current MCP servers available to the actor.',
          children: [
            { name: 'id', type: 'string', description: 'MCP server identifier.' },
            { name: 'name', type: 'string', description: 'Display name.' },
            { name: 'endpoint', type: 'string', description: 'Configured server endpoint.' },
            { name: 'auth_type', type: 'string', description: 'Authentication strategy for the server.' },
            { name: 'requires_user_connection', type: 'boolean', description: 'Whether the current actor must connect the server before it can be used.' },
            { name: 'connection_status', type: `"ready" | "connected" | "not_connected" | "expired"`, description: 'Current user connection status.' },
            { name: 'connected_at', type: 'string | undefined', description: 'Connection timestamp when the user has connected the server.' },
            { name: 'expires_at', type: 'string | undefined', description: 'Expiry timestamp for an expiring connection.' },
          ],
        },
        { name: 'connect', type: '(mcpServerId: string) => Promise<ApiResult<{ auth_url: string }>>', description: 'Starts the user connection flow and returns the authorization URL on `result.data.auth_url`.' },
        { name: 'disconnect', type: '(mcpServerId: string) => Promise<ApiResult<{ success: boolean }>>', description: 'Disconnects the current actor from the server and returns the success payload on `result.data`.' },
      ],
    },
  ],
};
