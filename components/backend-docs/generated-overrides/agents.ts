import type { BackendDoc } from '@/components/shared-backend-pages.types';

export const agentsGeneratedDocOverrides: Record<string, Partial<BackendDoc>> = {
  appendProjectTaskBoardItemJournal: {
    description: 'Append project task board item journal.',
    intro: 'This method operates on actor project task board items and their related data.',
  },
  archiveActorProject: {
    description: 'Archive actor project.',
    intro: 'This method manages actor projects and actor-scoped project discovery.',
  },
  archiveAgentThread: {
    description: 'Archive agent thread.',
    intro: 'This method operates on actor project threads and thread-scoped resources.',
  },
  archiveProjectTaskBoardItem: {
    description: 'Archive project task board item.',
    intro: 'This method operates on actor project task board items and their related data.',
  },
  attachAgentKnowledgeBase: {
    description: 'Attach agent knowledge base.',
    intro: 'This method manages AI knowledge base resources or their linked documents.',
  },
  attachAgentSubAgent: {
    description: 'Attach agent sub-agent.',
    intro: 'This method manages parent/child relationships between agents.',
  },
  attachAgentTool: {
    description: 'Attach agent tool.',
    intro: 'This method manages AI tool definitions or agent-to-tool bindings.',
  },
  connectActorMcpServer: {
    description: 'Connect actor MCP server.',
    intro: 'This method manages MCP server configuration or actor-level MCP connectivity.',
  },
  createKnowledgeBase: {
    description: 'Create knowledge base.',
    intro: 'This method manages AI knowledge base resources or their linked documents.',
  },
  createMcpServer: {
    description: 'Create MCP server.',
    intro: 'This method manages MCP server configuration or actor-level MCP connectivity.',
  },
  createProjectTaskBoardItem: {
    description: 'Create project task board item.',
    intro: 'This method operates on actor project task board items and their related data.',
  },
  createTool: {
    description: 'Create tool.',
    intro: 'This method manages AI tool definitions or agent-to-tool bindings.',
  },
  deleteAgent: {
    description: 'Delete agent.',
    intro: 'This method deletes one AI agent resource.',
  },
  deleteAgentSkill: {
    description: 'Delete agent skill.',
    intro: 'This method manages agent skill bundles or files.',
  },
  deleteKnowledgeBase: {
    description: 'Delete knowledge base.',
    intro: 'This method manages AI knowledge base resources or their linked documents.',
  },
  deleteKnowledgeBaseDocument: {
    description: 'Delete knowledge base document.',
    intro: 'This method manages AI knowledge base resources or their linked documents.',
  },
  deleteMcpServer: {
    description: 'Delete MCP server.',
    intro: 'This method manages MCP server configuration or actor-level MCP connectivity.',
  },
  deleteTool: {
    description: 'Delete tool.',
    intro: 'This method manages AI tool definitions or agent-to-tool bindings.',
  },
  detachAgentKnowledgeBase: {
    description: 'Detach agent knowledge base.',
    intro: 'This method manages AI knowledge base resources or their linked documents.',
  },
  detachAgentSubAgent: {
    description: 'Detach agent sub-agent.',
    intro: 'This method manages parent/child relationships between agents.',
  },
  detachAgentTool: {
    description: 'Detach agent tool.',
    intro: 'This method manages AI tool definitions or agent-to-tool bindings.',
  },
  disconnectActorMcpServer: {
    description: 'Disconnect actor MCP server.',
    intro: 'This method manages MCP server configuration or actor-level MCP connectivity.',
  },
  discoverMcpServerAuth: {
    description: 'Discover MCP server auth requirements.',
    intro: 'This method discovers authentication configuration required by a target MCP server endpoint.',
  },
  getActorProject: {
    description: 'Get actor project.',
    intro: 'This method manages actor projects and actor-scoped project discovery.',
  },
  getAgentThread: {
    description: 'Get agent thread.',
    intro: 'This method operates on actor project threads and thread-scoped resources.',
  },
  getAiSettings: {
    description: 'Get AI settings.',
    intro: 'This method reads deployment-level AI settings.',
  },
  getKnowledgeBase: {
    description: 'Get knowledge base.',
    intro: 'This method manages AI knowledge base resources or their linked documents.',
  },
  getLatestThreadTaskGraph: {
    description: 'Get latest thread task graph.',
    intro: 'This method returns the most recent task graph for a thread when available.',
  },
  getMcpServer: {
    description: 'Get MCP server.',
    intro: 'This method manages MCP server configuration or actor-level MCP connectivity.',
  },
  getProjectTaskBoardItem: {
    description: 'Get project task board item.',
    intro: 'This method operates on actor project task board items and their related data.',
  },
  getProjectTaskBoardItemFilesystemFile: {
    description: 'Get project task board item filesystem file.',
    intro: 'This method reads one file from the task board item filesystem.',
  },
  getTool: {
    description: 'Get tool.',
    intro: 'This method manages AI tool definitions or agent-to-tool bindings.',
  },
  importAgentSkillBundle: {
    description: 'Import agent skill bundle.',
    intro: 'This method imports a zipped skill bundle and refreshes the agent skill tree.',
  },
  listActorMcpServers: {
    description: 'List actor MCP servers.',
    intro: 'This method lists MCP servers connected for one actor.',
  },
  listAgentKnowledgeBases: {
    description: 'List agent knowledge bases.',
    intro: 'This method lists knowledge bases attached to one agent.',
  },
  listAgentSkillTree: {
    description: 'List agent skill tree.',
    intro: 'This method returns the virtual skill tree for one agent and scope.',
  },
  listAgentSubAgents: {
    description: 'List agent sub-agents.',
    intro: 'This method lists child agents attached to a parent agent.',
  },
  listAgentTools: {
    description: 'List agent tools.',
    intro: 'This method lists tool bindings for one agent.',
  },
  listKnowledgeBaseDocuments: {
    description: 'List knowledge base documents.',
    intro: 'This method lists documents indexed in a knowledge base.',
  },
  listKnowledgeBases: {
    description: 'List knowledge bases.',
    intro: 'This method lists deployment knowledge bases.',
  },
  listMcpServers: {
    description: 'List MCP servers.',
    intro: 'This method lists deployment MCP servers.',
  },
  listProjectTaskBoardItemAssignments: {
    description: 'List project task board item assignments.',
    intro: 'This method lists assignments associated with a task board item.',
  },
  listProjectTaskBoardItemEvents: {
    description: 'List project task board item events.',
    intro: 'This method lists timeline/activity events for a task board item.',
  },
  listProjectTaskBoardItemFilesystem: {
    description: 'List project task board item filesystem.',
    intro: 'This method lists files and directories for one task board item workspace.',
  },
  listProjectTaskBoardItems: {
    description: 'List project task board items.',
    intro: 'This method lists task board items for one actor project.',
  },
  listThreadAssignments: {
    description: 'List thread assignments.',
    intro: 'This method lists assignment records linked to a thread.',
  },
  listThreadEvents: {
    description: 'List thread events.',
    intro: 'This method lists timeline/activity events for a thread.',
  },
  listThreadFilesystem: {
    description: 'List thread filesystem.',
    intro: 'This method lists files and directories available in a thread workspace.',
  },
  listTools: {
    description: 'List tools.',
    intro: 'This method lists deployment AI tools.',
  },
  readAgentSkillFile: {
    description: 'Read agent skill file.',
    intro: 'This method reads one file from the agent skill virtual filesystem.',
  },
  searchActorProjects: {
    description: 'Search actor projects.',
    intro: 'This method performs cursor-based search across projects for one actor.',
  },
  searchActorProjectThreads: {
    description: 'Search actor project threads.',
    intro: 'This method performs cursor-based search across threads for one actor.',
  },
  unarchiveActorProject: {
    description: 'Restore actor project from archive.',
    intro: 'This method restores an archived actor project.',
  },
  unarchiveAgentThread: {
    description: 'Restore agent thread from archive.',
    intro: 'This method restores an archived agent thread.',
  },
  unarchiveProjectTaskBoardItem: {
    description: 'Restore project task board item from archive.',
    intro: 'This method restores an archived task board item.',
  },
  updateActorProject: {
    description: 'Update actor project.',
    intro: 'This method updates metadata/configuration for an actor project.',
  },
  updateAgentThread: {
    description: 'Update agent thread.',
    intro: 'This method updates metadata/configuration for an agent thread.',
  },
  updateKnowledgeBase: {
    description: 'Update knowledge base.',
    intro: 'This method updates knowledge base metadata.',
  },
  updateMcpServer: {
    description: 'Update MCP server.',
    intro: 'This method updates MCP server configuration.',
  },
  updateProjectTaskBoardItem: {
    description: 'Update project task board item.',
    intro: 'This method updates a task board item payload.',
  },
  updateTool: {
    description: 'Update tool.',
    intro: 'This method updates an AI tool definition.',
  },
  uploadKnowledgeBaseDocument: {
    description: 'Upload knowledge base document.',
    intro: 'This method uploads and indexes a document in a knowledge base.',
  },
  getAgentDetails: {
    description: 'Get full agent details and attached resources.',
    intro: 'Returns detailed agent payload (beyond list/get summary fields).',
  },
  updateAgent: {
    description: 'Update one AI agent.',
    intro: 'Patches agent configuration and metadata.',
    signature: `function updateAgent(
  agentId: string,
  request: UpdateAiAgentRequest,
): Promise<AiAgent>`,
    paramsTitle: 'UpdateAiAgentRequest',
  },
  runAgentThread: {
    description: 'Run execution for one agent thread.',
    intro: 'Starts an agent run on a thread with an execution payload.',
    usage: `import { wachtClient } from '@wacht/nextjs/server';

export async function runThread(threadId: string) {
  const client = await wachtClient();
  return client.ai.runAgentThread(threadId, {
    prompt: 'Summarize open tasks and blockers.',
  });
}`,
    signature: `function runAgentThread(
  threadId: string,
  request: ExecuteAgentRequest,
): Promise<ExecuteAgentResponse>`,
    paramsTitle: 'ExecuteAgentRequest',
  },
  listThreadMessages: {
    description: 'List messages for one agent thread.',
    intro: 'Returns thread message history with optional pagination anchors.',
    signature: `function listThreadMessages(
  threadId: string,
  options?: { limit?: number; before_id?: string; after_id?: string },
): Promise<ThreadMessagesResponse>`,
    paramsTitle: 'Message query options',
  },
  getThreadFilesystemFile: {
    description: 'Download one file from thread filesystem.',
    intro: 'Returns file content as binary payload and metadata.',
    signature: `function getThreadFilesystemFile(
  threadId: string,
  path: string,
): Promise<BinaryFileResponse>`,
    api: [
      { name: 'data', type: 'ArrayBuffer', description: 'Binary file data.' },
      { name: 'mime_type', type: 'string | undefined', description: 'Detected MIME type when available.' },
      { name: 'file_name', type: 'string | undefined', description: 'Resolved filename when available.' },
    ],
  },
  updateAiSettings: {
    description: 'Update deployment AI settings.',
    intro: 'Sends a full/partial settings update to the AI settings route and returns the resolved settings.',
    signature: `function updateAiSettings(
  request: UpdateAiSettingsRequest,
): Promise<AiSettings>`,
    paramsTitle: 'UpdateAiSettingsRequest',
  },
};
