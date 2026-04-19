export type GeneratedMethodParam = { name: string; type: string; optional: boolean };
export type GeneratedMethodDocMeta = { signature: string; params: GeneratedMethodParam[]; returns: string };

export const generatedMethodDocMeta: Record<string, GeneratedMethodDocMeta> = {
  addEmail: {
    signature: "function addEmail(\n  userId: string,\n  request: AddEmailRequest,\n  client?: WachtClient,\n): Promise<UserEmail>",
    params: [
      { name: "userId", type: "string", optional: false },
      { name: "request", type: "AddEmailRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<UserEmail>",
  },
  addPhone: {
    signature: "function addPhone(\n  userId: string,\n  request: AddPhoneRequest,\n  client?: WachtClient,\n): Promise<UserPhone>",
    params: [
      { name: "userId", type: "string", optional: false },
      { name: "request", type: "AddPhoneRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<UserPhone>",
  },
  appendProjectTaskBoardItemJournal: {
    signature: "function appendProjectTaskBoardItemJournal(\n  projectId: string,\n  itemId: string,\n  request: AppendProjectTaskBoardItemJournalRequest,\n  client?: WachtClient,\n): Promise<ProjectTaskBoardItemEvent>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "itemId", type: "string", optional: false },
      { name: "request", type: "AppendProjectTaskBoardItemJournalRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ProjectTaskBoardItemEvent>",
  },
  appendWebhookEventCatalogEvents: {
    signature: "function appendWebhookEventCatalogEvents(\n  slug: string,\n  request: AppendWebhookEventCatalogEventsRequest,\n  client?: WachtClient,\n): Promise<WebhookEventCatalog>",
    params: [
      { name: "slug", type: "string", optional: false },
      { name: "request", type: "AppendWebhookEventCatalogEventsRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<WebhookEventCatalog>",
  },
  approveWaitlistUser: {
    signature: "function approveWaitlistUser(\n  waitlistUserId: string,\n  client?: WachtClient,\n): Promise<DeploymentInvitation>",
    params: [
      { name: "waitlistUserId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<DeploymentInvitation>",
  },
  archiveActorProject: {
    signature: "function archiveActorProject(\n  projectId: string,\n  client?: WachtClient,\n): Promise<ActorProject>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ActorProject>",
  },
  archiveAgentThread: {
    signature: "function archiveAgentThread(\n  threadId: string,\n  client?: WachtClient,\n): Promise<AgentThread>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AgentThread>",
  },
  archiveOAuthScope: {
    signature: "function archiveOAuthScope(\n  oauthAppSlug: string,\n  scope: string,\n  client?: WachtClient,\n): Promise<OAuthApp>",
    params: [
      { name: "oauthAppSlug", type: "string", optional: false },
      { name: "scope", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<OAuthApp>",
  },
  archiveProjectTaskBoardItem: {
    signature: "function archiveProjectTaskBoardItem(\n  projectId: string,\n  itemId: string,\n  client?: WachtClient,\n): Promise<ProjectTaskBoardItem>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "itemId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ProjectTaskBoardItem>",
  },
  archiveWebhookEventInCatalog: {
    signature: "function archiveWebhookEventInCatalog(\n  slug: string,\n  request: ArchiveWebhookEventInCatalogRequest,\n  client?: WachtClient,\n): Promise<WebhookEventCatalog>",
    params: [
      { name: "slug", type: "string", optional: false },
      { name: "request", type: "ArchiveWebhookEventInCatalogRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<WebhookEventCatalog>",
  },
  assignToSegment: {
    signature: "function assignToSegment(\n  segmentId: string,\n  entityId: string,\n  client?: WachtClient,\n): Promise<Record<string, unknown>>",
    params: [
      { name: "segmentId", type: "string", optional: false },
      { name: "entityId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<Record<string, unknown>>",
  },
  attachAgentKnowledgeBase: {
    signature: "function attachAgentKnowledgeBase(\n  agentId: string,\n  kbId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "kbId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  attachAgentSubAgent: {
    signature: "function attachAgentSubAgent(\n  agentId: string,\n  subAgentId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "subAgentId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  attachAgentTool: {
    signature: "function attachAgentTool(\n  agentId: string,\n  toolId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "toolId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  cancelWebhookReplayTask: {
    signature: "function cancelWebhookReplayTask(\n  appSlug: string,\n  taskId: string,\n  client?: WachtClient,\n): Promise<ReplayTaskCancelResponse>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "taskId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ReplayTaskCancelResponse>",
  },
  connectActorMcpServer: {
    signature: "function connectActorMcpServer(\n  actorId: string,\n  mcpServerId: string,\n  client?: WachtClient,\n): Promise<ActorMcpServerConnectResponse>",
    params: [
      { name: "actorId", type: "string", optional: false },
      { name: "mcpServerId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ActorMcpServerConnectResponse>",
  },
  createKnowledgeBase: {
    signature: "function createKnowledgeBase(\n  request: CreateAiKnowledgeBaseRequest,\n  client?: WachtClient,\n): Promise<AiKnowledgeBase>",
    params: [
      { name: "request", type: "CreateAiKnowledgeBaseRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AiKnowledgeBase>",
  },
  createMcpServer: {
    signature: "function createMcpServer(\n  request: CreateMcpServerRequest,\n  client?: WachtClient,\n): Promise<McpServerCreateResponse>",
    params: [
      { name: "request", type: "CreateMcpServerRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<McpServerCreateResponse>",
  },
  createProjectTaskBoardItem: {
    signature: "function createProjectTaskBoardItem(\n  projectId: string,\n  request: CreateProjectTaskBoardItemRequest,\n  client?: WachtClient,\n): Promise<ProjectTaskBoardItem>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "request", type: "CreateProjectTaskBoardItemRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ProjectTaskBoardItem>",
  },
  createSegment: {
    signature: "function createSegment(\n  request: CreateSegmentRequest,\n  client?: WachtClient,\n): Promise<Segment>",
    params: [
      { name: "request", type: "CreateSegmentRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<Segment>",
  },
  createSessionTicket: {
    signature: "function createSessionTicket(\n  request: CreateSessionTicketRequest,\n  client?: WachtClient,\n): Promise<SessionTicketResponse>",
    params: [
      { name: "request", type: "CreateSessionTicketRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<SessionTicketResponse>",
  },
  createTool: {
    signature: "function createTool(\n  request: CreateAiToolRequest,\n  client?: WachtClient,\n): Promise<AiTool>",
    params: [
      { name: "request", type: "CreateAiToolRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AiTool>",
  },
  deactivateOAuthClient: {
    signature: "function deactivateOAuthClient(\n  oauthAppSlug: string,\n  oauthClientId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "oauthAppSlug", type: "string", optional: false },
      { name: "oauthClientId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteAgent: {
    signature: "function deleteAgent(\n  agentId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteAgentSkill: {
    signature: "function deleteAgentSkill(\n  agentId: string,\n  skillSlug: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "skillSlug", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteApiAuthApp: {
    signature: "function deleteApiAuthApp(\n  appName: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "appName", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteEmail: {
    signature: "function deleteEmail(\n  userId: string,\n  emailId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "userId", type: "string", optional: false },
      { name: "emailId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteInvitation: {
    signature: "function deleteInvitation(\n  invitationId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "invitationId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteKnowledgeBase: {
    signature: "function deleteKnowledgeBase(\n  kbId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "kbId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteKnowledgeBaseDocument: {
    signature: "function deleteKnowledgeBaseDocument(\n  kbId: string,\n  documentId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "kbId", type: "string", optional: false },
      { name: "documentId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteMcpServer: {
    signature: "function deleteMcpServer(\n  mcpServerId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "mcpServerId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteOrganizationRole: {
    signature: "function deleteOrganizationRole(\n  organizationId: string,\n  roleId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "organizationId", type: "string", optional: false },
      { name: "roleId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deletePhone: {
    signature: "function deletePhone(\n  userId: string,\n  phoneId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "userId", type: "string", optional: false },
      { name: "phoneId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteSegment: {
    signature: "function deleteSegment(\n  segmentId: string,\n  client?: WachtClient,\n): Promise<Record<string, unknown>>",
    params: [
      { name: "segmentId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<Record<string, unknown>>",
  },
  deleteSocialConnection: {
    signature: "function deleteSocialConnection(\n  userId: string,\n  connectionId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "userId", type: "string", optional: false },
      { name: "connectionId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteTool: {
    signature: "function deleteTool(\n  toolId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "toolId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteWebhookApp: {
    signature: "function deleteWebhookApp(\n  appSlug: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteWebhookEndpoint: {
    signature: "function deleteWebhookEndpoint(\n  appSlug: string,\n  endpointId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "endpointId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  deleteWorkspaceRole: {
    signature: "function deleteWorkspaceRole(\n  workspaceId: string,\n  roleId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "workspaceId", type: "string", optional: false },
      { name: "roleId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  detachAgentKnowledgeBase: {
    signature: "function detachAgentKnowledgeBase(\n  agentId: string,\n  kbId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "kbId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  detachAgentSubAgent: {
    signature: "function detachAgentSubAgent(\n  agentId: string,\n  subAgentId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "subAgentId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  detachAgentTool: {
    signature: "function detachAgentTool(\n  agentId: string,\n  toolId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "toolId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  disconnectActorMcpServer: {
    signature: "function disconnectActorMcpServer(\n  actorId: string,\n  mcpServerId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "actorId", type: "string", optional: false },
      { name: "mcpServerId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  discoverMcpServerAuth: {
    signature: "function discoverMcpServerAuth(\n  request: DiscoverMcpServerAuthRequest,\n  client?: WachtClient,\n): Promise<McpServerDiscoveryResponse>",
    params: [
      { name: "request", type: "DiscoverMcpServerAuthRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<McpServerDiscoveryResponse>",
  },
  getActorProject: {
    signature: "function getActorProject(\n  projectId: string,\n  client?: WachtClient,\n): Promise<ActorProject>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ActorProject>",
  },
  getAgentDetails: {
    signature: "function getAgentDetails(\n  agentId: string,\n  client?: WachtClient,\n): Promise<AgentDetailsResponse>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AgentDetailsResponse>",
  },
  getAgentThread: {
    signature: "function getAgentThread(\n  threadId: string,\n  client?: WachtClient,\n): Promise<AgentThread>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AgentThread>",
  },
  getAiSettings: {
    signature: "function getAiSettings(\n  client?: WachtClient,\n): Promise<AiSettings>",
    params: [
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AiSettings>",
  },
  getApiAuditAnalytics: {
    signature: "function getApiAuditAnalytics(\n  appSlug: string,\n  options?: GetApiAuditAnalyticsOptions,\n  client?: WachtClient,\n): Promise<ApiAuditAnalyticsResponse>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "options", type: "GetApiAuditAnalyticsOptions", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ApiAuditAnalyticsResponse>",
  },
  getApiAuditLogs: {
    signature: "function getApiAuditLogs(\n  appSlug: string,\n  options?: ListApiAuditLogsOptions,\n  client?: WachtClient,\n): Promise<ApiAuditLogsResponse>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "options", type: "ListApiAuditLogsOptions", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ApiAuditLogsResponse>",
  },
  getApiAuditTimeseries: {
    signature: "function getApiAuditTimeseries(\n  appSlug: string,\n  options?: GetApiAuditTimeseriesOptions,\n  client?: WachtClient,\n): Promise<ApiAuditTimeseriesResponse>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "options", type: "GetApiAuditTimeseriesOptions", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ApiAuditTimeseriesResponse>",
  },
  getApiAuthApp: {
    signature: "function getApiAuthApp(\n  appName: string,\n  client?: WachtClient,\n): Promise<ApiAuthApp>",
    params: [
      { name: "appName", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ApiAuthApp>",
  },
  getKnowledgeBase: {
    signature: "function getKnowledgeBase(\n  kbId: string,\n  client?: WachtClient,\n): Promise<AiKnowledgeBaseWithDetails>",
    params: [
      { name: "kbId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AiKnowledgeBaseWithDetails>",
  },
  getLatestThreadTaskGraph: {
    signature: "function getLatestThreadTaskGraph(\n  threadId: string,\n  client?: WachtClient,\n): Promise<ThreadTaskGraph | null>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ThreadTaskGraph | null>",
  },
  getMcpServer: {
    signature: "function getMcpServer(\n  mcpServerId: string,\n  client?: WachtClient,\n): Promise<McpServer>",
    params: [
      { name: "mcpServerId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<McpServer>",
  },
  getProjectTaskBoardItem: {
    signature: "function getProjectTaskBoardItem(\n  projectId: string,\n  itemId: string,\n  client?: WachtClient,\n): Promise<ProjectTaskBoardItem>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "itemId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ProjectTaskBoardItem>",
  },
  getProjectTaskBoardItemFilesystemFile: {
    signature: "function getProjectTaskBoardItemFilesystemFile(\n  projectId: string,\n  itemId: string,\n  path: string,\n  client?: WachtClient,\n): Promise<TaskWorkspaceFileContent>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "itemId", type: "string", optional: false },
      { name: "path", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<TaskWorkspaceFileContent>",
  },
  getSegmentData: {
    signature: "function getSegmentData(\n  request: SegmentDataRequest,\n  client?: WachtClient,\n): Promise<PaginatedResponse<AnalyzedEntity>>",
    params: [
      { name: "request", type: "SegmentDataRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<AnalyzedEntity>>",
  },
  getThreadFilesystemFile: {
    signature: "function getThreadFilesystemFile(\n  threadId: string,\n  path: string,\n  client?: WachtClient,\n): Promise<BinaryFileResponse>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "path", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<BinaryFileResponse>",
  },
  getTool: {
    signature: "function getTool(\n  toolId: string,\n  client?: WachtClient,\n): Promise<AiToolWithDetails>",
    params: [
      { name: "toolId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AiToolWithDetails>",
  },
  getWebhookApp: {
    signature: "function getWebhookApp(\n  appSlug: string,\n  client?: WachtClient,\n): Promise<WebhookApp>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<WebhookApp>",
  },
  getWebhookCatalog: {
    signature: "function getWebhookCatalog(\n  appSlug: string,\n  client?: WachtClient,\n): Promise<WebhookEventCatalog>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<WebhookEventCatalog>",
  },
  getWebhookReplayTaskStatus: {
    signature: "function getWebhookReplayTaskStatus(\n  appSlug: string,\n  taskId: string,\n  client?: WachtClient,\n): Promise<ReplayTaskStatus>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "taskId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ReplayTaskStatus>",
  },
  importAgentSkillBundle: {
    signature: "function importAgentSkillBundle(\n  agentId: string,\n  file: Blob,\n  options: { replace_existing?: boolean; file_name?: string },\n  client?: WachtClient,\n): Promise<SkillTreeResponse>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "file", type: "Blob", optional: false },
      { name: "options", type: "{ replace_existing?: boolean; file_name?: string }", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<SkillTreeResponse>",
  },
  inviteUser: {
    signature: "function inviteUser(\n  request: InviteUserRequest,\n  client?: WachtClient,\n): Promise<DeploymentInvitation>",
    params: [
      { name: "request", type: "InviteUserRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<DeploymentInvitation>",
  },
  listActorMcpServers: {
    signature: "function listActorMcpServers(\n  actorId: string,\n  client?: WachtClient,\n): Promise<PaginatedResponse<ActorMcpServerSummary>>",
    params: [
      { name: "actorId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<ActorMcpServerSummary>>",
  },
  listAgentKnowledgeBases: {
    signature: "function listAgentKnowledgeBases(\n  agentId: string,\n  client?: WachtClient,\n): Promise<PaginatedResponse<AiKnowledgeBaseWithDetails>>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<AiKnowledgeBaseWithDetails>>",
  },
  listAgentSkillTree: {
    signature: "function listAgentSkillTree(\n  agentId: string,\n  scope: SkillScope,\n  path?: string,\n  client?: WachtClient,\n): Promise<SkillTreeResponse>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "scope", type: "SkillScope", optional: false },
      { name: "path", type: "string", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<SkillTreeResponse>",
  },
  listAgentSubAgents: {
    signature: "function listAgentSubAgents(\n  agentId: string,\n  client?: WachtClient,\n): Promise<PaginatedResponse<AiAgentWithDetails>>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<AiAgentWithDetails>>",
  },
  listAgentTools: {
    signature: "function listAgentTools(\n  agentId: string,\n  client?: WachtClient,\n): Promise<PaginatedResponse<AiTool>>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<AiTool>>",
  },
  listInvitations: {
    signature: "function listInvitations(\n  options?: ListOptions & { sort_key?: string; sort_order?: string; search?: string; },\n  client?: WachtClient,\n): Promise<PaginatedResponse<DeploymentInvitation>>",
    params: [
      { name: "options", type: "ListOptions & { sort_key?: string; sort_order?: string; search?: string; }", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<DeploymentInvitation>>",
  },
  listKnowledgeBaseDocuments: {
    signature: "function listKnowledgeBaseDocuments(\n  kbId: string,\n  options?: { limit?: number; offset?: number },\n  client?: WachtClient,\n): Promise<PaginatedResponse<AiKnowledgeBaseDocument>>",
    params: [
      { name: "kbId", type: "string", optional: false },
      { name: "options", type: "{ limit?: number; offset?: number }", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<AiKnowledgeBaseDocument>>",
  },
  listKnowledgeBases: {
    signature: "function listKnowledgeBases(\n  options?: ListOptions & { search?: string },\n  client?: WachtClient,\n): Promise<KnowledgeBaseListResponse>",
    params: [
      { name: "options", type: "ListOptions & { search?: string }", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<KnowledgeBaseListResponse>",
  },
  listMcpServers: {
    signature: "function listMcpServers(\n  options?: ListOptions,\n  client?: WachtClient,\n): Promise<PaginatedResponse<McpServer>>",
    params: [
      { name: "options", type: "ListOptions", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<McpServer>>",
  },
  listProjectTaskBoardItemAssignments: {
    signature: "function listProjectTaskBoardItemAssignments(\n  projectId: string,\n  itemId: string,\n  client?: WachtClient,\n): Promise<PaginatedResponse<ProjectTaskBoardItemAssignment>>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "itemId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<ProjectTaskBoardItemAssignment>>",
  },
  listProjectTaskBoardItemEvents: {
    signature: "function listProjectTaskBoardItemEvents(\n  projectId: string,\n  itemId: string,\n  client?: WachtClient,\n): Promise<PaginatedResponse<ProjectTaskBoardItemEvent>>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "itemId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<ProjectTaskBoardItemEvent>>",
  },
  listProjectTaskBoardItemFilesystem: {
    signature: "function listProjectTaskBoardItemFilesystem(\n  projectId: string,\n  itemId: string,\n  path?: string,\n  client?: WachtClient,\n): Promise<TaskWorkspaceListing>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "itemId", type: "string", optional: false },
      { name: "path", type: "string", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<TaskWorkspaceListing>",
  },
  listProjectTaskBoardItems: {
    signature: "function listProjectTaskBoardItems(\n  projectId: string,\n  client?: WachtClient,\n): Promise<PaginatedResponse<ProjectTaskBoardItem>>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<ProjectTaskBoardItem>>",
  },
  listSegments: {
    signature: "function listSegments(\n  options?: ListSegmentsOptions,\n  client?: WachtClient,\n): Promise<PaginatedResponse<Segment>>",
    params: [
      { name: "options", type: "ListSegmentsOptions", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<Segment>>",
  },
  listThreadAssignments: {
    signature: "function listThreadAssignments(\n  threadId: string,\n  client?: WachtClient,\n): Promise<PaginatedResponse<ProjectTaskBoardItemAssignment>>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<ProjectTaskBoardItemAssignment>>",
  },
  listThreadEvents: {
    signature: "function listThreadEvents(\n  threadId: string,\n  client?: WachtClient,\n): Promise<PaginatedResponse<ThreadEvent>>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<ThreadEvent>>",
  },
  listThreadFilesystem: {
    signature: "function listThreadFilesystem(\n  threadId: string,\n  path?: string,\n  client?: WachtClient,\n): Promise<TaskWorkspaceListing>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "path", type: "string", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<TaskWorkspaceListing>",
  },
  listThreadMessages: {
    signature: "function listThreadMessages(\n  threadId: string,\n  options: { limit?: number; before_id?: string; after_id?: string },\n  client?: WachtClient,\n): Promise<ThreadMessagesResponse>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "options", type: "{ limit?: number; before_id?: string; after_id?: string }", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ThreadMessagesResponse>",
  },
  listTools: {
    signature: "function listTools(\n  options?: ListOptions & { search?: string },\n  client?: WachtClient,\n): Promise<PaginatedResponse<AiToolWithDetails>>",
    params: [
      { name: "options", type: "ListOptions & { search?: string }", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<AiToolWithDetails>>",
  },
  listWaitlist: {
    signature: "function listWaitlist(\n  options?: ListOptions & { sort_key?: string; sort_order?: string; search?: string; },\n  client?: WachtClient,\n): Promise<PaginatedResponse<DeploymentWaitlistUser>>",
    params: [
      { name: "options", type: "ListOptions & { sort_key?: string; sort_order?: string; search?: string; }", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<PaginatedResponse<DeploymentWaitlistUser>>",
  },
  listWebhookEvents: {
    signature: "function listWebhookEvents(\n  appSlug: string,\n  client?: WachtClient,\n): Promise<WebhookAppEvent[]>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<WebhookAppEvent[]>",
  },
  listWebhookReplayTasks: {
    signature: "function listWebhookReplayTasks(\n  appSlug: string,\n  options?: ListOptions,\n  client?: WachtClient,\n): Promise<ReplayTaskListResponse>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "options", type: "ListOptions", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ReplayTaskListResponse>",
  },
  reactivateWebhookEndpoint: {
    signature: "function reactivateWebhookEndpoint(\n  endpointId: string,\n  client?: WachtClient,\n): Promise<ReactivateWebhookEndpointResponse>",
    params: [
      { name: "endpointId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ReactivateWebhookEndpointResponse>",
  },
  readAgentSkillFile: {
    signature: "function readAgentSkillFile(\n  agentId: string,\n  scope: SkillScope,\n  path: string,\n  client?: WachtClient,\n): Promise<SkillFileResponse>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "scope", type: "SkillScope", optional: false },
      { name: "path", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<SkillFileResponse>",
  },
  removeFromSegment: {
    signature: "function removeFromSegment(\n  segmentId: string,\n  entityId: string,\n  client?: WachtClient,\n): Promise<Record<string, unknown>>",
    params: [
      { name: "segmentId", type: "string", optional: false },
      { name: "entityId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<Record<string, unknown>>",
  },
  removeOrganizationMember: {
    signature: "function removeOrganizationMember(\n  organizationId: string,\n  memberId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "organizationId", type: "string", optional: false },
      { name: "memberId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  removeWorkspaceMember: {
    signature: "function removeWorkspaceMember(\n  workspaceId: string,\n  memberId: string,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "workspaceId", type: "string", optional: false },
      { name: "memberId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  rotateOAuthClientSecret: {
    signature: "function rotateOAuthClientSecret(\n  oauthAppSlug: string,\n  oauthClientId: string,\n  client?: WachtClient,\n): Promise<RotateOAuthClientSecretResponse>",
    params: [
      { name: "oauthAppSlug", type: "string", optional: false },
      { name: "oauthClientId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<RotateOAuthClientSecretResponse>",
  },
  rotateWebhookSecret: {
    signature: "function rotateWebhookSecret(\n  appSlug: string,\n  client?: WachtClient,\n): Promise<WebhookApp>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<WebhookApp>",
  },
  runAgentThread: {
    signature: "function runAgentThread(\n  threadId: string,\n  request: ExecuteAgentRequest,\n  client?: WachtClient,\n): Promise<ExecuteAgentResponse>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "request", type: "ExecuteAgentRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ExecuteAgentResponse>",
  },
  searchActorProjectThreads: {
    signature: "function searchActorProjectThreads(\n  actorId: string,\n  options: { q?: string; limit?: number; cursor?: string },\n  client?: WachtClient,\n): Promise<CursorPage<AgentThread>>",
    params: [
      { name: "actorId", type: "string", optional: false },
      { name: "options", type: "{ q?: string; limit?: number; cursor?: string }", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<CursorPage<AgentThread>>",
  },
  searchActorProjects: {
    signature: "function searchActorProjects(\n  actorId: string,\n  options: { q?: string; limit?: number; cursor?: string },\n  client?: WachtClient,\n): Promise<CursorPage<ActorProject>>",
    params: [
      { name: "actorId", type: "string", optional: false },
      { name: "options", type: "{ q?: string; limit?: number; cursor?: string }", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<CursorPage<ActorProject>>",
  },
  setOAuthScopeMapping: {
    signature: "function setOAuthScopeMapping(\n  oauthAppSlug: string,\n  scope: string,\n  request: SetOAuthScopeMappingRequest,\n  client?: WachtClient,\n): Promise<OAuthApp>",
    params: [
      { name: "oauthAppSlug", type: "string", optional: false },
      { name: "scope", type: "string", optional: false },
      { name: "request", type: "SetOAuthScopeMappingRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<OAuthApp>",
  },
  testWebhookEndpoint: {
    signature: "function testWebhookEndpoint(\n  appSlug: string,\n  endpointId: string,\n  request: TestWebhookEndpointRequest,\n  client?: WachtClient,\n): Promise<TestWebhookEndpointResponse>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "endpointId", type: "string", optional: false },
      { name: "request", type: "TestWebhookEndpointRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<TestWebhookEndpointResponse>",
  },
  triggerWebhook: {
    signature: "function triggerWebhook(\n  appSlug: string,\n  request: TriggerWebhookRequest,\n  client?: WachtClient,\n): Promise<TriggerWebhookResponse>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "request", type: "TriggerWebhookRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<TriggerWebhookResponse>",
  },
  unarchiveActorProject: {
    signature: "function unarchiveActorProject(\n  projectId: string,\n  client?: WachtClient,\n): Promise<ActorProject>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ActorProject>",
  },
  unarchiveAgentThread: {
    signature: "function unarchiveAgentThread(\n  threadId: string,\n  client?: WachtClient,\n): Promise<AgentThread>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AgentThread>",
  },
  unarchiveOAuthScope: {
    signature: "function unarchiveOAuthScope(\n  oauthAppSlug: string,\n  scope: string,\n  client?: WachtClient,\n): Promise<OAuthApp>",
    params: [
      { name: "oauthAppSlug", type: "string", optional: false },
      { name: "scope", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<OAuthApp>",
  },
  unarchiveProjectTaskBoardItem: {
    signature: "function unarchiveProjectTaskBoardItem(\n  projectId: string,\n  itemId: string,\n  client?: WachtClient,\n): Promise<ProjectTaskBoardItem>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "itemId", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ProjectTaskBoardItem>",
  },
  updateActorProject: {
    signature: "function updateActorProject(\n  projectId: string,\n  request: UpdateActorProjectRequest,\n  client?: WachtClient,\n): Promise<ActorProject>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "request", type: "UpdateActorProjectRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ActorProject>",
  },
  updateAgent: {
    signature: "function updateAgent(\n  agentId: string,\n  request: UpdateAiAgentRequest,\n  client?: WachtClient,\n): Promise<AiAgent>",
    params: [
      { name: "agentId", type: "string", optional: false },
      { name: "request", type: "UpdateAiAgentRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AiAgent>",
  },
  updateAgentThread: {
    signature: "function updateAgentThread(\n  threadId: string,\n  request: UpdateAgentThreadRequest,\n  client?: WachtClient,\n): Promise<AgentThread>",
    params: [
      { name: "threadId", type: "string", optional: false },
      { name: "request", type: "UpdateAgentThreadRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AgentThread>",
  },
  updateAiSettings: {
    signature: "function updateAiSettings(\n  request: UpdateAiSettingsRequest,\n  client?: WachtClient,\n): Promise<AiSettings>",
    params: [
      { name: "request", type: "UpdateAiSettingsRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AiSettings>",
  },
  updateApiAuthApp: {
    signature: "function updateApiAuthApp(\n  appName: string,\n  request: UpdateApiAuthAppRequest,\n  client?: WachtClient,\n): Promise<ApiAuthApp>",
    params: [
      { name: "appName", type: "string", optional: false },
      { name: "request", type: "UpdateApiAuthAppRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ApiAuthApp>",
  },
  updateEmail: {
    signature: "function updateEmail(\n  userId: string,\n  emailId: string,\n  request: UpdateEmailRequest,\n  client?: WachtClient,\n): Promise<UserEmail>",
    params: [
      { name: "userId", type: "string", optional: false },
      { name: "emailId", type: "string", optional: false },
      { name: "request", type: "UpdateEmailRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<UserEmail>",
  },
  updateKnowledgeBase: {
    signature: "function updateKnowledgeBase(\n  kbId: string,\n  request: UpdateAiKnowledgeBaseRequest,\n  client?: WachtClient,\n): Promise<AiKnowledgeBase>",
    params: [
      { name: "kbId", type: "string", optional: false },
      { name: "request", type: "UpdateAiKnowledgeBaseRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AiKnowledgeBase>",
  },
  updateMcpServer: {
    signature: "function updateMcpServer(\n  mcpServerId: string,\n  request: UpdateMcpServerRequest,\n  client?: WachtClient,\n): Promise<McpServer>",
    params: [
      { name: "mcpServerId", type: "string", optional: false },
      { name: "request", type: "UpdateMcpServerRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<McpServer>",
  },
  updateOAuthApp: {
    signature: "function updateOAuthApp(\n  oauthAppSlug: string,\n  request: UpdateOAuthAppRequest,\n  client?: WachtClient,\n): Promise<OAuthApp>",
    params: [
      { name: "oauthAppSlug", type: "string", optional: false },
      { name: "request", type: "UpdateOAuthAppRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<OAuthApp>",
  },
  updateOAuthClient: {
    signature: "function updateOAuthClient(\n  oauthAppSlug: string,\n  oauthClientId: string,\n  request: UpdateOAuthClientRequest,\n  client?: WachtClient,\n): Promise<OAuthClient>",
    params: [
      { name: "oauthAppSlug", type: "string", optional: false },
      { name: "oauthClientId", type: "string", optional: false },
      { name: "request", type: "UpdateOAuthClientRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<OAuthClient>",
  },
  updateOAuthScope: {
    signature: "function updateOAuthScope(\n  oauthAppSlug: string,\n  scope: string,\n  request: UpdateOAuthScopeRequest,\n  client?: WachtClient,\n): Promise<OAuthApp>",
    params: [
      { name: "oauthAppSlug", type: "string", optional: false },
      { name: "scope", type: "string", optional: false },
      { name: "request", type: "UpdateOAuthScopeRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<OAuthApp>",
  },
  updateOrganizationMember: {
    signature: "function updateOrganizationMember(\n  organizationId: string,\n  memberId: string,\n  request: UpdateOrganizationMemberRequest,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "organizationId", type: "string", optional: false },
      { name: "memberId", type: "string", optional: false },
      { name: "request", type: "UpdateOrganizationMemberRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  updateOrganizationRole: {
    signature: "function updateOrganizationRole(\n  organizationId: string,\n  roleId: string,\n  request: UpdateOrganizationRoleRequest,\n  client?: WachtClient,\n): Promise<OrganizationRole>",
    params: [
      { name: "organizationId", type: "string", optional: false },
      { name: "roleId", type: "string", optional: false },
      { name: "request", type: "UpdateOrganizationRoleRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<OrganizationRole>",
  },
  updatePhone: {
    signature: "function updatePhone(\n  userId: string,\n  phoneId: string,\n  request: UpdatePhoneRequest,\n  client?: WachtClient,\n): Promise<UserPhone>",
    params: [
      { name: "userId", type: "string", optional: false },
      { name: "phoneId", type: "string", optional: false },
      { name: "request", type: "UpdatePhoneRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<UserPhone>",
  },
  updateProjectTaskBoardItem: {
    signature: "function updateProjectTaskBoardItem(\n  projectId: string,\n  itemId: string,\n  request: UpdateProjectTaskBoardItemRequest,\n  client?: WachtClient,\n): Promise<ProjectTaskBoardItem>",
    params: [
      { name: "projectId", type: "string", optional: false },
      { name: "itemId", type: "string", optional: false },
      { name: "request", type: "UpdateProjectTaskBoardItemRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<ProjectTaskBoardItem>",
  },
  updateSegment: {
    signature: "function updateSegment(\n  segmentId: string,\n  request: UpdateSegmentRequest,\n  client?: WachtClient,\n): Promise<Segment>",
    params: [
      { name: "segmentId", type: "string", optional: false },
      { name: "request", type: "UpdateSegmentRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<Segment>",
  },
  updateTool: {
    signature: "function updateTool(\n  toolId: string,\n  request: UpdateAiToolRequest,\n  client?: WachtClient,\n): Promise<AiTool>",
    params: [
      { name: "toolId", type: "string", optional: false },
      { name: "request", type: "UpdateAiToolRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AiTool>",
  },
  updateWebhookApp: {
    signature: "function updateWebhookApp(\n  appSlug: string,\n  request: UpdateWebhookAppRequest,\n  client?: WachtClient,\n): Promise<WebhookApp>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "request", type: "UpdateWebhookAppRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<WebhookApp>",
  },
  updateWebhookEndpoint: {
    signature: "function updateWebhookEndpoint(\n  appSlug: string,\n  endpointId: string,\n  request: UpdateWebhookEndpointRequest,\n  client?: WachtClient,\n): Promise<WebhookEndpoint>",
    params: [
      { name: "appSlug", type: "string", optional: false },
      { name: "endpointId", type: "string", optional: false },
      { name: "request", type: "UpdateWebhookEndpointRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<WebhookEndpoint>",
  },
  updateWorkspaceMember: {
    signature: "function updateWorkspaceMember(\n  workspaceId: string,\n  memberId: string,\n  request: UpdateWorkspaceMemberRequest,\n  client?: WachtClient,\n): Promise<void>",
    params: [
      { name: "workspaceId", type: "string", optional: false },
      { name: "memberId", type: "string", optional: false },
      { name: "request", type: "UpdateWorkspaceMemberRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<void>",
  },
  updateWorkspaceRole: {
    signature: "function updateWorkspaceRole(\n  workspaceId: string,\n  roleId: string,\n  request: UpdateWorkspaceRoleRequest,\n  client?: WachtClient,\n): Promise<WorkspaceRole>",
    params: [
      { name: "workspaceId", type: "string", optional: false },
      { name: "roleId", type: "string", optional: false },
      { name: "request", type: "UpdateWorkspaceRoleRequest", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<WorkspaceRole>",
  },
  uploadImage: {
    signature: "function uploadImage(\n  imageType: | \"logo\" | \"favicon\" | \"user-profile\" | \"org-profile\" | \"workspace-profile\",\n  file: File,\n  client?: WachtClient,\n): Promise<{ url: string }>",
    params: [
      { name: "imageType", type: "| \"logo\" | \"favicon\" | \"user-profile\" | \"org-profile\" | \"workspace-profile\"", optional: false },
      { name: "file", type: "File", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<{ url: string }>",
  },
  uploadKnowledgeBaseDocument: {
    signature: "function uploadKnowledgeBaseDocument(\n  kbId: string,\n  file: File,\n  title?: string,\n  description?: string,\n  client?: WachtClient,\n): Promise<AiKnowledgeBaseDocument>",
    params: [
      { name: "kbId", type: "string", optional: false },
      { name: "file", type: "File", optional: false },
      { name: "title", type: "string", optional: true },
      { name: "description", type: "string", optional: true },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<AiKnowledgeBaseDocument>",
  },
  verifyOAuthAppDomain: {
    signature: "function verifyOAuthAppDomain(\n  oauthAppSlug: string,\n  client?: WachtClient,\n): Promise<OAuthDomainVerificationResponse>",
    params: [
      { name: "oauthAppSlug", type: "string", optional: false },
      { name: "client", type: "WachtClient", optional: true },
    ],
    returns: "Promise<OAuthDomainVerificationResponse>",
  },
};
