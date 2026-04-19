'use client';

import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import {
  Blocks,
  ChevronDownIcon,
  Building2,
  FileCode2,
  FileText,
  KeyRound,
  Code2,
  Layers3,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  X,
  type LucideIcon,
} from 'lucide-react';
import Link from 'fumadocs-core/link';
import { usePathname } from 'fumadocs-core/framework';
import { useDocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ComponentType } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { generatedBackendCoverageDocs } from '@/components/shared-backend-coverage';
import { backendCoverageGroupOrder, classifyBackendCoverageDoc } from '@/components/backend-docs/grouping';
import { backendGroups } from '@/components/shared-backend-pages.catalog';
import { rustBackendMethodLabel } from '@/components/rust-backend-labels';
import { cn } from '@/lib/cn';
import frontendApiManifest from '@/public/openapi/frontend-api-manifest.json';
import platformApiManifest from '@/public/openapi/platform-api-manifest.json';

type NavPage = {
  name: string;
  url: string;
  icon?: IconComponent;
  method?: string;
};

type NavGroup = {
  name: string;
  icon?: IconComponent;
  pages: NavPage[];
};

type NavEntry =
  | {
      type: 'header';
      name: string;
    }
  | {
      type: 'page';
      page: NavPage;
    }
  | {
      type: 'group';
      group: NavGroup;
    };

type SharedNavGroup = {
  name: string;
  pages: NavPage[];
};

type NavSection = {
  key: string;
  name: string;
  match: string;
  entries: NavEntry[];
};

type IconComponent = LucideIcon | ComponentType<{ className?: string }>;

function page(name: string, url: string, icon?: IconComponent, method?: string): NavPage {
  return { name, url, icon, method };
}

function group(name: string, pages: NavPage[], icon?: IconComponent): NavEntry {
  return {
    type: 'group',
    group: {
      name,
      icon,
      pages,
    },
  };
}

function topPage(name: string, url: string, icon?: IconComponent): NavEntry {
  return {
    type: 'page',
    page: { name, url, icon },
  };
}

function header(name: string): NavEntry {
  return { type: 'header', name };
}

function rustifyBackendGroup(group: SharedNavGroup): SharedNavGroup {
  return {
    ...group,
    pages: group.pages.map((entry) => ({
      ...entry,
      name: rustBackendMethodLabel(entry.name),
    })),
  };
}

function sharedComponentGroups(base: string): SharedNavGroup[] {
  return [
    {
      name: 'Control',
      pages: [
        page('<DeploymentProvider />', `${base}/components/deployment-provider`),
        page('<DeploymentInitialized />', `${base}/components/deployment-initialized`),
        page('<DeploymentInitializing />', `${base}/components/deployment-initializing`),
        page('<DefaultStylesProvider />', `${base}/components/default-styles-provider`),
        page('<SignedIn />', `${base}/components/signed-in`),
        page('<SignedOut />', `${base}/components/signed-out`),
        page('<NavigateToSignIn />', `${base}/components/navigate-to-sign-in`),
        page('<RequireActiveTenancy />', `${base}/components/require-active-tenancy`),
      ],
    },
    {
      name: 'Auth UI',
      pages: [
        page('<SignInForm />', `${base}/components/sign-in-form`),
        page('<SignUpForm />', `${base}/components/sign-up-form`),
        page('<WaitlistForm />', `${base}/components/waitlist-form`),
        page('<SSOCallback />', `${base}/components/sso-callback`),
        page('<MagicLinkVerification />', `${base}/components/magic-link-verification`),
        page('<AcceptInvite />', `${base}/components/accept-invite`),
        page('<SignedInAccounts />', `${base}/components/signed-in-accounts`),
      ],
    },
    {
      name: 'Account',
      pages: [
        page('<UserButton />', `${base}/components/user-button`),
        page('<UserControls />', `${base}/components/user-controls`),
        page('<ManageAccount />', `${base}/components/manage-account`),
      ],
    },
    {
      name: 'Multi tenancy',
      pages: [
        page('<OrganizationSwitcher />', `${base}/components/organization-switcher`, Building2),
        page('<ManageOrganization />', `${base}/components/manage-organization`, Building2),
        page('<ManageWorkspace />', `${base}/components/manage-workspace`, Layers3),
        page('<CreateOrganizationForm />', `${base}/components/create-organization-form`, Building2),
        page('<CreateWorkspaceForm />', `${base}/components/create-workspace-form`, Layers3),
      ],
    },
    {
      name: 'Notifications',
      pages: [
        page('<NotificationBell />', `${base}/components/notification-bell`),
        page('<NotificationPopover />', `${base}/components/notification-popover`),
        page('<NotificationPanel />', `${base}/components/notification-panel`),
      ],
    },
  ];
}

function sharedHookGroups(base: string): SharedNavGroup[] {
  return [
    {
      name: 'State and context',
      pages: [
        page('useDeployment()', `${base}/hooks/use-deployment`),
        page('useClient()', `${base}/hooks/use-client`),
        page('useSession()', `${base}/hooks/use-session`),
        page('useUser()', `${base}/hooks/use-user`),
        page('useNavigation()', `${base}/hooks/use-navigation`),
      ],
    },
    {
      name: 'Auth flows',
      pages: [
        page('useSignIn()', `${base}/hooks/use-sign-in`),
        page('useSignUp()', `${base}/hooks/use-sign-up`),
        page('useSSOCallback()', `${base}/hooks/use-sso-callback`),
        page('useWaitlist()', `${base}/hooks/use-waitlist`),
        page('useForgotPassword()', `${base}/hooks/use-forgot-password`),
        page('useMagicLinkVerification()', `${base}/hooks/use-magic-link-verification`),
        page('useInvitation()', `${base}/hooks/use-invitation`),
        page('useUserSignins()', `${base}/hooks/use-user-signins`),
      ],
    },
    {
      name: 'Multi tenancy',
      pages: [
        page('useOrganizationList()', `${base}/hooks/use-organization-list`),
        page('useActiveOrganization()', `${base}/hooks/use-active-organization`),
        page('useActiveTenancy()', `${base}/hooks/use-active-tenancy`),
        page('useWorkspaceList()', `${base}/hooks/use-workspace-list`),
        page('useActiveWorkspace()', `${base}/hooks/use-active-workspace`),
        page('useOrganizationMemberships()', `${base}/hooks/use-organization-memberships`),
        page('useWorkspaceMemberships()', `${base}/hooks/use-workspace-memberships`),
      ],
    },
    {
      name: 'Notifications',
      pages: [
        page('useNotifications()', `${base}/hooks/use-notifications`),
        page('useNotificationStream()', `${base}/hooks/use-notification-stream`),
        page('useNotificationUnreadCount()', `${base}/hooks/use-notification-unread-count`),
      ],
    },
    {
      name: 'Agents',
      pages: [
        page('useAgentSession()', `${base}/hooks/use-agent-session`),
        page('useActorProjects()', `${base}/hooks/use-actor-projects`),
        page('useActorProjectSearch()', `${base}/hooks/use-actor-project-search`),
        page('useActorThreadSearch()', `${base}/hooks/use-actor-thread-search`),
        page('useProjectThreads()', `${base}/hooks/use-project-threads`),
        page('useProjectThreadFeed()', `${base}/hooks/use-project-thread-feed`),
        page('useAgentThread()', `${base}/hooks/use-agent-thread`),
        page('useAgentThreadConversation()', `${base}/hooks/use-agent-thread-conversation`),
        page('useAgentThreadFilesystem()', `${base}/hooks/use-agent-thread-filesystem`),
        page('useAgentThreadEvents()', `${base}/hooks/use-agent-thread-events`),
        page('useAgentThreadAssignments()', `${base}/hooks/use-agent-thread-assignments`),
        page('useProjectTasks()', `${base}/hooks/use-project-tasks`),
        page('useProjectTaskBoardItem()', `${base}/hooks/use-project-task-board-item`),
        page('useAgentThreadTaskGraphs()', `${base}/hooks/use-agent-thread-task-graphs`),
        page('useActorMcpServers()', `${base}/hooks/use-actor-mcp-servers`),
      ],
    },
    {
      name: 'Webhooks',
      pages: [
        page('useWebhookAppSession()', `${base}/hooks/use-webhook-app-session`),
        page('useWebhookStats()', `${base}/hooks/use-webhook-stats`),
        page('useWebhookEndpoints()', `${base}/hooks/use-webhook-endpoints`),
        page('useCreateWebhookEndpoint()', `${base}/hooks/use-create-webhook-endpoint`),
        page('useWebhookDeliveries()', `${base}/hooks/use-webhook-deliveries`),
        page('useWebhookEvents()', `${base}/hooks/use-webhook-events`),
        page('useWebhookAnalytics()', `${base}/hooks/use-webhook-analytics`),
        page('useWebhookTimeseries()', `${base}/hooks/use-webhook-timeseries`),
      ],
    },
    {
      name: 'API Identity',
      pages: [
        page('useApiAuthAppSession()', `${base}/hooks/use-api-auth-app-session`),
        page('useApiAuthKeys()', `${base}/hooks/use-api-auth-keys`),
        page('useApiAuthAuditLogs()', `${base}/hooks/use-api-auth-audit-logs`),
        page('useApiAuthAuditAnalytics()', `${base}/hooks/use-api-auth-audit-analytics`),
        page('useApiAuthAuditTimeseries()', `${base}/hooks/use-api-auth-audit-timeseries`),
      ],
    },
  ];
}

function sharedBackendGroups(base: string): SharedNavGroup[] {
  const groups: SharedNavGroup[] = [
    {
      name: 'Foundation',
      pages: [
        page('Overview', `${base}/backend/overview`),
        page('Initialize client', `${base}/backend/initialize-client`),
        page('Client access', `${base}/backend/foundation/client-access`),
      ],
    },
    {
      name: 'Users',
      pages: [
        page('listUsers()', `${base}/backend/users/list-users`),
        page('getUser()', `${base}/backend/users/get-user`),
        page('createUser()', `${base}/backend/users/create-user`),
        page('updateUser()', `${base}/backend/users/update-user`),
        page('updatePassword()', `${base}/backend/users/update-password`),
        page('deleteUser()', `${base}/backend/users/delete-user`),
      ],
    },
    {
      name: 'Invitations',
      pages: [
        page('listInvitations()', `${base}/backend/invitations/list-invitations`),
        page('inviteUser()', `${base}/backend/invitations/invite-user`),
        page('deleteInvitation()', `${base}/backend/invitations/delete-invitation`),
        page('listWaitlist()', `${base}/backend/invitations/list-waitlist`),
        page('approveWaitlistUser()', `${base}/backend/invitations/approve-waitlist-user`),
      ],
    },
    {
      name: 'Sessions',
      pages: [page('createSessionTicket()', `${base}/backend/sessions/create-session-ticket`)],
    },
    {
      name: 'Organizations',
      pages: [
        page('listOrganizations()', `${base}/backend/organizations/list-organizations`),
        page('getOrganization()', `${base}/backend/organizations/get-organization`),
        page('createOrganization()', `${base}/backend/organizations/create-organization`),
        page('updateOrganization()', `${base}/backend/organizations/update-organization`),
        page('deleteOrganization()', `${base}/backend/organizations/delete-organization`),
        page('listOrganizationMembers()', `${base}/backend/organizations/list-organization-members`),
        page('addOrganizationMember()', `${base}/backend/organizations/add-organization-member`),
        page('listOrganizationRoles()', `${base}/backend/organizations/list-organization-roles`),
        page('createOrganizationRole()', `${base}/backend/organizations/create-organization-role`),
        page('createWorkspaceForOrganization()', `${base}/backend/organizations/create-workspace-for-organization`),
      ],
    },
    {
      name: 'Workspaces',
      pages: [
        page('listWorkspaces()', `${base}/backend/workspaces/list-workspaces`),
        page('getWorkspace()', `${base}/backend/workspaces/get-workspace`),
        page('updateWorkspace()', `${base}/backend/workspaces/update-workspace`),
        page('deleteWorkspace()', `${base}/backend/workspaces/delete-workspace`),
        page('listWorkspaceMembers()', `${base}/backend/workspaces/list-workspace-members`),
        page('addWorkspaceMember()', `${base}/backend/workspaces/add-workspace-member`),
        page('listWorkspaceRoles()', `${base}/backend/workspaces/list-workspace-roles`),
        page('createWorkspaceRole()', `${base}/backend/workspaces/create-workspace-role`),
      ],
    },
    {
      name: 'API auth apps',
      pages: [
        page('listApiAuthApps()', `${base}/backend/api-keys/list-api-auth-apps`),
        page('createApiAuthApp()', `${base}/backend/api-keys/create-api-auth-app`),
      ],
    },
    {
      name: 'API auth keys',
      pages: [
        page('listApiKeys()', `${base}/backend/api-keys/list-api-keys`),
        page('createApiKey()', `${base}/backend/api-keys/create-api-key`),
        page('rotateApiKey()', `${base}/backend/api-keys/rotate-api-key`),
        page('revokeApiKey()', `${base}/backend/api-keys/revoke-api-key`),
      ],
    },
    {
      name: 'API auth audit',
      pages: [
        page('getApiAuditLogs()', `${base}/backend/api-keys/get-api-audit-logs`),
        page('getApiAuditAnalytics()', `${base}/backend/api-keys/get-api-audit-analytics`),
        page('getApiAuditTimeseries()', `${base}/backend/api-keys/get-api-audit-timeseries`),
      ],
    },
    {
      name: 'API auth rate limits',
      pages: [
        page('listRateLimitSchemes()', `${base}/backend/api-keys/list-rate-limit-schemes`),
        page('getRateLimitScheme()', `${base}/backend/api-keys/get-rate-limit-scheme`),
        page('createRateLimitScheme()', `${base}/backend/api-keys/create-rate-limit-scheme`),
        page('updateRateLimitScheme()', `${base}/backend/api-keys/update-rate-limit-scheme`),
        page('deleteRateLimitScheme()', `${base}/backend/api-keys/delete-rate-limit-scheme`),
      ],
    },
    {
      name: 'Webhooks apps',
      pages: [
        page('listWebhookApps()', `${base}/backend/webhooks/list-webhook-apps`),
        page('createWebhookApp()', `${base}/backend/webhooks/create-webhook-app`),
      ],
    },
    {
      name: 'Webhook catalogs',
      pages: [
        page('listWebhookEventCatalogs()', `${base}/backend/webhooks/list-webhook-event-catalogs`),
        page('getWebhookEventCatalog()', `${base}/backend/webhooks/get-webhook-event-catalog`),
        page('createWebhookEventCatalog()', `${base}/backend/webhooks/create-webhook-event-catalog`),
        page('updateWebhookEventCatalog()', `${base}/backend/webhooks/update-webhook-event-catalog`),
      ],
    },
    {
      name: 'Webhook endpoints',
      pages: [
        page('listWebhookEndpoints()', `${base}/backend/webhooks/list-webhook-endpoints`),
        page('createWebhookEndpoint()', `${base}/backend/webhooks/create-webhook-endpoint`),
      ],
    },
    {
      name: 'Webhook deliveries',
      pages: [
        page('listWebhookDeliveries()', `${base}/backend/webhooks/list-webhook-deliveries`),
        page('getWebhookDelivery()', `${base}/backend/webhooks/get-webhook-delivery`),
        page('replayWebhookDelivery()', `${base}/backend/webhooks/replay-webhook-delivery`),
      ],
    },
    {
      name: 'Webhook analytics',
      pages: [
        page('getWebhookStats()', `${base}/backend/webhooks/get-webhook-stats`),
        page('getWebhookAnalytics()', `${base}/backend/webhooks/get-webhook-analytics`),
        page('getWebhookTimeseries()', `${base}/backend/webhooks/get-webhook-timeseries`),
      ],
    },
    {
      name: 'AI configuration',
      pages: [
        page('listAgents()', `${base}/backend/agents/list-agents`),
        page('getAgent()', `${base}/backend/agents/get-agent`),
        page('createAgent()', `${base}/backend/agents/create-agent`),
      ],
    },
    {
      name: 'AI runtime',
      pages: [
        page('listActorProjects()', `${base}/backend/agents/list-actor-projects`),
        page('createActorProject()', `${base}/backend/agents/create-actor-project`),
        page('listProjectThreads()', `${base}/backend/agents/list-project-threads`),
        page('createAgentThread()', `${base}/backend/agents/create-agent-thread`),
        page('getProjectTaskBoard()', `${base}/backend/agents/get-project-task-board`),
      ],
    },
    {
      name: 'OAuth apps',
      pages: [
        page('listOAuthApps()', `${base}/backend/oauth/list-oauth-apps`),
        page('createOAuthApp()', `${base}/backend/oauth/create-oauth-app`),
      ],
    },
    {
      name: 'OAuth clients',
      pages: [
        page('listOAuthClients()', `${base}/backend/oauth/list-oauth-clients`),
        page('createOAuthClient()', `${base}/backend/oauth/create-oauth-client`),
      ],
    },
    {
      name: 'OAuth grants',
      pages: [
        page('listOAuthGrants()', `${base}/backend/oauth/list-oauth-grants`),
        page('revokeOAuthGrant()', `${base}/backend/oauth/revoke-oauth-grant`),
      ],
    },
    {
      name: 'Utility',
      pages: [
        page('healthCheck()', `${base}/backend/operations/health-check`),
        page('createNotification()', `${base}/backend/operations/create-notification`),
        page('getAnalyticsSummary()', `${base}/backend/operations/get-analytics-summary`),
      ],
    },
    {
      name: 'Settings',
      pages: [
        page('getDeploymentSettings()', `${base}/backend/settings/get-deployment-settings`),
        page('updateDeploymentRestrictions()', `${base}/backend/settings/update-deployment-restrictions`),
        page('updateB2BSettings()', `${base}/backend/settings/update-b2b-settings`),
        page('updateAuthSettings()', `${base}/backend/settings/update-auth-settings`),
        page('updateDisplaySettings()', `${base}/backend/settings/update-display-settings`),
        page('listJwtTemplates()', `${base}/backend/settings/list-jwt-templates`),
        page('createJwtTemplate()', `${base}/backend/settings/create-jwt-template`),
        page('updateJwtTemplate()', `${base}/backend/settings/update-jwt-template`),
        page('deleteJwtTemplate()', `${base}/backend/settings/delete-jwt-template`),
        page('getEmailTemplate()', `${base}/backend/settings/get-email-template`),
        page('updateEmailTemplate()', `${base}/backend/settings/update-email-template`),
        page('getSocialConnections()', `${base}/backend/settings/get-social-connections`),
        page('upsertSocialConnection()', `${base}/backend/settings/upsert-social-connection`),
        page('updateSmtpConfig()', `${base}/backend/settings/update-smtp-config`),
        page('verifySmtpConnection()', `${base}/backend/settings/verify-smtp-connection`),
        page('removeSmtpConfig()', `${base}/backend/settings/remove-smtp-config`),
      ],
    },
  ];

  for (const entry of generatedBackendCoverageDocs) {
    const grouping = classifyBackendCoverageDoc(entry);
    const url = `${base}/backend/${grouping.pathGroup}/${entry.path[1]}`;
    const label = `${entry.method}()`;

    let group = groups.find((item) => item.name === grouping.label);
    if (!group) {
      group = { name: grouping.label, pages: [] };
      groups.push(group);
    }

    if (!group.pages.some((page) => page.url === url)) {
      group.pages.push(page(label, url));
    }
  }

  for (const catalogGroup of backendGroups) {
    let group = groups.find((item) => item.name === catalogGroup.label);
    if (!group) {
      group = { name: catalogGroup.label, pages: [] };
      groups.push(group);
    }

    for (const doc of catalogGroup.docs) {
      const path = doc.path?.join('/') ?? doc.slug;
      const url = `${base}/backend/${path}`;
      const label = doc.title;
      if (!group.pages.some((page) => page.url === url)) {
        group.pages.push(page(label, url));
      }
    }
  }

  const order = new Map(backendCoverageGroupOrder.map((name, index) => [name, index]));
  return groups.sort((a, b) => (order.get(a.name) ?? 999) - (order.get(b.name) ?? 999));
}

const documentationSections: NavSection[] = [
  {
    key: 'nextjs',
    name: 'Next.js',
    match: '/docs/sdks/nextjs',
    entries: [
      group('Getting Started', [
        page('Quick Start', '/docs/sdks/nextjs/quickstart', Rocket),
        page('Integration model', '/docs/sdks/nextjs/integration-model', FileText),
      ], Rocket),
      group('Authentication', [
        page('Authentication', '/docs/sdks/nextjs/client-side', FileText),
        page('Client-side Auth', '/docs/sdks/nextjs/client-side-auth', FileText),
        page('Middleware', '/docs/sdks/nextjs/middleware', ShieldCheck),
        page('Server-side Auth', '/docs/sdks/nextjs/server-side', KeyRound),
      ], ShieldCheck),
      header('Components'),
      ...sharedComponentGroups('/docs/sdks/nextjs').map((item) => group(item.name, item.pages, Blocks)),
      header('Hooks'),
      ...sharedHookGroups('/docs/sdks/nextjs').map((item) => group(item.name, item.pages, Code2)),
      header('Backend SDK'),
      ...sharedBackendGroups('/docs/sdks/nextjs').map((item) => group(item.name, item.pages, FileCode2)),
    ],
  },
  {
    key: 'react-router',
    name: 'React Router',
    match: '/docs/sdks/react-router',
    entries: [
      group('Getting Started', [
        page('Integration model', '/docs/sdks/react-router/integration-model', FileText),
        page('Quick Start', '/docs/sdks/react-router/quickstart', Rocket),
      ], Rocket),
      group('Authentication', [
        page('Authentication', '/docs/sdks/react-router/authentication', ShieldCheck),
        page('Client-side Auth', '/docs/sdks/react-router/client-side-auth', FileText),
        page('Server Auth', '/docs/sdks/react-router/server-auth', KeyRound),
      ], ShieldCheck),
      header('Components'),
      ...sharedComponentGroups('/docs/sdks/react-router').map((item) => group(item.name, item.pages, Blocks)),
      header('Hooks'),
      ...sharedHookGroups('/docs/sdks/react-router').map((item) => group(item.name, item.pages, Code2)),
      header('Backend SDK'),
      ...sharedBackendGroups('/docs/sdks/react-router').map((item) => group(item.name, item.pages, FileCode2)),
    ],
  },
  {
    key: 'tanstack-router',
    name: 'TanStack Router',
    match: '/docs/sdks/tanstack-router',
    entries: [
      group('Getting Started', [
        page('Integration model', '/docs/sdks/tanstack-router/integration-model', FileText),
        page('Quick Start', '/docs/sdks/tanstack-router/quickstart', Rocket),
      ], Rocket),
      group('Authentication', [
        page('Authentication', '/docs/sdks/tanstack-router/authentication', ShieldCheck),
        page('Client-side Auth', '/docs/sdks/tanstack-router/client-side-auth', FileText),
        page('Server Auth', '/docs/sdks/tanstack-router/server-auth', KeyRound),
      ], ShieldCheck),
      header('Components'),
      ...sharedComponentGroups('/docs/sdks/tanstack-router').map((item) => group(item.name, item.pages, Blocks)),
      header('Hooks'),
      ...sharedHookGroups('/docs/sdks/tanstack-router').map((item) => group(item.name, item.pages, Code2)),
      header('Backend SDK'),
      ...sharedBackendGroups('/docs/sdks/tanstack-router').map((item) => group(item.name, item.pages, FileCode2)),
    ],
  },
  {
    key: 'node',
    name: 'Backend JS',
    match: '/docs/sdks/node',
    entries: [
      group('Getting Started', [
        page('Overview', '/docs/sdks/node', FileText),
        page('Runtime Environments', '/docs/sdks/node/runtime-environments', Rocket),
        page('Runtime Playbook', '/docs/sdks/node/framework-interop', Layers3),
        page('Server Auth', '/docs/sdks/node/server-auth', ShieldCheck),
      ], Rocket),
      header('Runtime Guides'),
      group('Node.js', [
        page('Overview', '/docs/sdks/node/runtimes/nodejs', Layers3),
        page('Extress', '/docs/sdks/node/runtimes/nodejs/express-integration', ShieldCheck),
        page('Fartify', '/docs/sdks/node/runtimes/nodejs/fastify-integration', ShieldCheck),
        page('NestJS', '/docs/sdks/node/runtimes/nodejs/nest-integration', ShieldCheck),
        page('Koa', '/docs/sdks/node/runtimes/nodejs/koa-integration', ShieldCheck),
        page('Hapi', '/docs/sdks/node/runtimes/nodejs/hapi-integration', ShieldCheck),
        page('Restify', '/docs/sdks/node/runtimes/nodejs/restify-integration', ShieldCheck),
      ], Layers3),
      group('Bun', [
        page('Overview', '/docs/sdks/node/runtimes/bun', Layers3),
        page('HTTP Handlers', '/docs/sdks/node/runtimes/bun/http-handlers', ShieldCheck),
        page('Framework Patterns', '/docs/sdks/node/runtimes/bun/framework-patterns', ShieldCheck),
      ], Layers3),
      group('Deno', [
        page('Overview', '/docs/sdks/node/runtimes/deno', Layers3),
        page('Framework Patterns', '/docs/sdks/node/runtimes/deno/framework-patterns', ShieldCheck),
      ], Layers3),
      group('Hono', [
        page('Overview', '/docs/sdks/node/runtimes/hono', Layers3),
        page('Middleware and Auth', '/docs/sdks/node/runtimes/hono/middleware-auth', ShieldCheck),
      ], Layers3),
      group('Cloudflare Workers', [
        page('Overview', '/docs/sdks/node/runtimes/cloudflare-workers', Layers3),
        page('JWT and API key/OAuth auth', '/docs/sdks/node/runtimes/cloudflare-workers/auth-and-gateway', ShieldCheck),
        page('Framework Patterns', '/docs/sdks/node/runtimes/cloudflare-workers/framework-patterns', ShieldCheck),
      ], Layers3),
      group('Netlify Functions', [
        page('Overview', '/docs/sdks/node/runtimes/netlify-functions', Layers3),
        page('JWT and API key/OAuth auth', '/docs/sdks/node/runtimes/netlify-functions/auth-and-headers', ShieldCheck),
        page('Framework Patterns', '/docs/sdks/node/runtimes/netlify-functions/framework-patterns', ShieldCheck),
      ], Layers3),
      group('Serverless Workers', [
        page('Overview', '/docs/sdks/node/runtimes/serverless-workers', Layers3),
        page('Production Patterns', '/docs/sdks/node/runtimes/serverless-workers/production-patterns', ShieldCheck),
        page('Platform Patterns', '/docs/sdks/node/runtimes/serverless-workers/platform-patterns', ShieldCheck),
      ], Layers3),
      header('Backend SDK'),
      ...sharedBackendGroups('/docs/sdks/node').map((item) => group(item.name, item.pages, FileCode2)),
    ],
  },
  {
    key: 'rust',
    name: 'Rust',
    match: '/docs/sdks/rust',
    entries: [
      topPage('Getting Started', '/docs/sdks/rust/getting-started', Rocket),
      header('Framework Guides'),
      group('Axum', [
        page('Overview', '/docs/sdks/rust/frameworks/axum', FileText),
        page('Auth Layer Setup', '/docs/sdks/rust/frameworks/axum/auth-layer-setup', ShieldCheck),
        page('Extractors and Permissions', '/docs/sdks/rust/frameworks/axum/extractors-and-permissions', ShieldCheck),
        page('Gateway Authorization', '/docs/sdks/rust/frameworks/axum/gateway-authorization', KeyRound),
      ], Layers3),
      header('SDK Methods'),
      ...sharedBackendGroups('/docs/sdks/rust').map((item) => {
        const rustItem = rustifyBackendGroup(item);
        return group(rustItem.name, rustItem.pages, FileCode2);
      }),
      group('Category Guides', [
        page('Organizations and Workspaces', '/docs/sdks/rust/organizations-workspaces', Building2),
        page('API Auth and OAuth', '/docs/sdks/rust/api-auth-oauth', KeyRound),
        page('Webhooks', '/docs/sdks/rust/webhooks', Server),
        page('AI Runtime and Configuration', '/docs/sdks/rust/ai-runtime', Layers3),
      ], Layers3),
      group('Validation', [page('Contract Validation', '/docs/sdks/rust/contract-validation', FileCode2)], FileCode2),
    ],
  },
] as const;

const guidesSection: NavSection = {
  key: 'guides',
  name: 'Guides',
  match: '/docs/guides',
  entries: [
    topPage('Overview', '/docs/guides', FileText),
    group('API Auth', [
      page('Overview', '/docs/guides/api-auth/overview'),
      page('Custom Hook Flow Implementation', '/docs/guides/api-auth/custom-hook-flow-implementation'),
      page('Audit Observability Screens', '/docs/guides/api-auth/audit-observability-screens'),
      page('Vanity Pages Implementation', '/docs/guides/api-auth/vanity-pages-implementation'),
    ], KeyRound),
    group('Webhook Apps', [
      page('Overview', '/docs/guides/webhook-apps/overview'),
      page('Vanity Pages Implementation', '/docs/guides/webhook-apps/vanity-pages-implementation'),
      page('Custom Hook Flow Implementation', '/docs/guides/webhook-apps/custom-hook-flow-implementation'),
      page('Deliveries, Replay, and Observability', '/docs/guides/webhook-apps/deliveries-replay-and-observability'),
    ], Server),
    group('OAuth Apps', [
      page('Overview', '/docs/guides/oauth-apps/overview'),
      page('Create OAuth App And Clients', '/docs/guides/oauth-apps/create-oauth-app-and-clients'),
      page('Implement Consent Flow', '/docs/guides/oauth-apps/implement-consent-flow'),
      page('Verify Access Tokens And Operate Clients', '/docs/guides/oauth-apps/verify-access-tokens-and-operate-clients'),
    ], KeyRound),
    group('Notifications', [
      page('Overview', '/docs/guides/notifications/overview-scope-design'),
      page('Backend Sending Patterns', '/docs/guides/notifications/backend-sending-patterns'),
      page('Frontend Inbox With Hooks', '/docs/guides/notifications/frontend-inbox-with-hooks'),
      page('Realtime Stream Handling', '/docs/guides/notifications/realtime-stream-handling'),
      page('Actionable Notification UX', '/docs/guides/notifications/actionable-notification-ux'),
    ], FileText),
    group('Deployment Events', [
      page('Use Webhooks To Keep Backend In Sync', '/docs/guides/deployment-events/use-webhooks-to-keep-backend-in-sync'),
    ], Rocket),
  ],
};

const FRONTEND_API_GROUPS: Record<string, string[]> = {
  'Authentication': ['Auth', 'API Auth', 'Session', 'OAuth', 'Well Known'],
  'User': ['Me'],
  'Organizations & Workspaces': ['Organizations', 'Workspaces'],
  'Notifications & Webhooks': ['Notifications', 'Webhook'],
  'Infrastructure': ['AI', 'Deployment', 'SCIM', 'Waitlist'],
};

const PLATFORM_API_GROUPS: Record<string, string[]> = {
  'Users': ['Users', 'Invitations'],
  'Authentication': ['Auth', 'API Auth', 'Session', 'OAuth', 'JWT Templates'],
  'Organizations & Workspaces': ['Organizations', 'Workspaces'],
  'Platform': ['AI', 'Analytics', 'Notifications', 'Webhooks', 'Settings', 'Segments'],
  'Other': ['Default', 'Waitlist'],
};

function apiRefSection(
  key: string,
  name: string,
  baseUrl: string,
  manifest: typeof frontendApiManifest,
  tagGroups: Record<string, string[]>,
): NavSection {
  const tagByName = new Map(manifest.tags.map(t => [t.name, t]));
  const entries: NavEntry[] = [topPage('Overview', baseUrl, FileCode2)];

  for (const [groupName, tagNames] of Object.entries(tagGroups)) {
    const matchedTags = tagNames.map(n => tagByName.get(n)).filter(Boolean) as typeof manifest.tags;
    if (matchedTags.length === 0) continue;
    entries.push(header(groupName));
    for (const tag of matchedTags) {
      entries.push(group(tag.name, tag.operations.map(op =>
        page(op.path, `${baseUrl}/${tag.slug}/${op.slug}`, undefined, op.method)
      )));
    }
  }

  // ungrouped tags fall through at the end
  const groupedTagNames = new Set(Object.values(tagGroups).flat());
  const ungrouped = manifest.tags.filter(t => !groupedTagNames.has(t.name));
  if (ungrouped.length > 0) {
    for (const tag of ungrouped) {
      entries.push(group(tag.name, tag.operations.map(op =>
        page(op.path, `${baseUrl}/${tag.slug}/${op.slug}`, undefined, op.method)
      )));
    }
  }

  return { key, name, match: baseUrl, entries };
}

const referenceSections: NavSection[] = [
  apiRefSection('frontend-api', 'Frontend API', '/docs/reference/frontend-api', frontendApiManifest, FRONTEND_API_GROUPS),
  apiRefSection('backend-api', 'Backend API', '/docs/reference/backend-api', platformApiManifest, PLATFORM_API_GROUPS),
];

export function DocsSidebar() {
  const pathname = usePathname();
  const { setOpenSearch } = useSearchContext();
  const { open, setOpen } = useDocsLayout().slots.sidebar.useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    setIsMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const isGuides = pathname.startsWith('/docs/guides');
  const sidebarMode = pathname.startsWith('/docs/reference')
    ? 'reference'
    : isGuides
      ? 'guides'
      : 'documentation';

  const activeSdk =
    documentationSections.find((sdk) => pathname === sdk.match || pathname.startsWith(`${sdk.match}/`)) ??
    documentationSections[0];

  const activeRefSection =
    referenceSections.find(s => pathname === s.match || pathname.startsWith(`${s.match}/`)) ??
    referenceSections[0];

  const currentSection = sidebarMode === 'reference'
    ? activeRefSection
    : sidebarMode === 'guides'
      ? guidesSection
      : activeSdk;

  return (
    <>
      <aside className="docs-sidebar sticky top-(--fd-header-height) [grid-area:sidebar] h-[calc(100vh-var(--fd-header-height))] w-[var(--landing-left-pane-width,280px)] hidden md:flex flex-col bg-fd-background border-r border-border transition-[width] duration-300 ease-out">
        <button
          type="button"
          className="flex h-12 w-full items-center gap-2.5 border-b border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-white/2 hover:text-foreground"
          onClick={() => setOpenSearch(true)}
        >
          <Search className="size-4 shrink-0" strokeWidth={1.8} />
          <span className="truncate">Search</span>
          <kbd className="ml-auto inline-flex h-6 items-center gap-0.5 shrink-0 border border-border px-1.5 text-[11px] font-medium text-muted-foreground/70">
            <span>⌘</span>K
          </kbd>
        </button>

        {sidebarMode === 'documentation' ? (
          <SdkSwitcher sections={documentationSections} activeSection={activeSdk} />
        ) : sidebarMode === 'reference' ? (
          <SdkSwitcher sections={referenceSections} activeSection={activeRefSection} />
        ) : null}

        <nav className="flex-1 overflow-y-auto overflow-x-hidden fd-scroll-container">
          <div className="flex flex-col">
            {currentSection.entries.map((entry, index) => (
              entry.type === 'header' ? (
                <div
                  key={`${currentSection.key}-header-${index}-${entry.name}`}
                  className="px-4 pt-4 pb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/70"
                >
                  {entry.name}
                </div>
              ) : entry.type === 'page' ? (
                <SidebarPageEntry
                  key={`${currentSection.key}-page-${index}-${entry.page.url}`}
                  page={entry.page}
                />
              ) : (
                <SidebarGroup
                  key={`${currentSection.key}-group-${index}-${entry.group.name}`}
                  group={entry.group}
                  pathname={pathname}
                />
              )
            ))}
          </div>
        </nav>
      </aside>

      {isMobile ? (
        <>
          <div
            className={cn(
              'fixed inset-0 z-40 bg-black/60 transition-opacity md:hidden',
              open ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            onClick={() => setOpen(false)}
          />
          <aside
            className={cn(
              'fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-[380px] flex-col border-l border-border bg-fd-background shadow-lg transition-transform md:hidden',
              open ? 'translate-x-0' : 'translate-x-full',
            )}
          >
            <div className="flex h-12 items-center border-b border-border px-4">
              <span className="text-sm font-medium text-foreground">Navigation</span>
              <button
                type="button"
                className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>

            {sidebarMode === 'documentation' ? (
              <SdkSwitcher sections={documentationSections} activeSection={activeSdk} />
            ) : sidebarMode === 'reference' ? (
              <SdkSwitcher sections={referenceSections} activeSection={activeRefSection} />
            ) : null}

            <nav className="flex-1 overflow-y-auto overflow-x-hidden fd-scroll-container">
              <div className="flex flex-col">
                {currentSection.entries.map((entry, index) => (
                  entry.type === 'header' ? (
                    <div
                      key={`mobile-${currentSection.key}-header-${index}-${entry.name}`}
                      className="px-4 pt-4 pb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/70"
                    >
                      {entry.name}
                    </div>
                  ) : entry.type === 'page' ? (
                    <SidebarPageEntry
                      key={`mobile-${currentSection.key}-page-${index}-${entry.page.url}`}
                      page={entry.page}
                    />
                  ) : (
                    <SidebarGroup
                      key={`mobile-${currentSection.key}-group-${index}-${entry.group.name}`}
                      group={entry.group}
                      pathname={pathname}
                    />
                  )
                ))}
              </div>
            </nav>
          </aside>
        </>
      ) : null}
    </>
  );
}

function SidebarGroup({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  const hasActivePage = useMemo(
    () => group.pages.some((page) => page.url === pathname),
    [group.pages, pathname],
  );
  const [open, setOpen] = useState(hasActivePage);

  useEffect(() => {
    if (hasActivePage) {
      setOpen(true);
    }
  }, [hasActivePage]);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 w-full items-center gap-2.5 px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-white/2 hover:text-foreground"
      >
        {group.icon ? <group.icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{group.name}</span>
        <ChevronDownIcon
          className={cn(
            'ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open ? (
        <div className="ml-8 mr-2 mb-2 border-l border-border/70 pl-2">
          {group.pages.map((page) => (
            <SidebarLinkNode
              key={page.url}
              name={page.name}
              url={page.url}
              method={page.method}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SidebarPageEntry({
  page,
}: {
  page: NavPage;
}) {
  return (
    <div className="border-b border-border">
      <Link
        href={page.url}
        className="flex h-12 w-full items-center gap-2.5 px-4 text-sm text-muted-foreground transition-colors hover:bg-white/2 hover:text-foreground"
      >
        {page.icon ? <page.icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{page.name}</span>
      </Link>
    </div>
  );
}

function SdkSwitcher({
  sections,
  activeSection,
}: {
  sections: readonly NavSection[] | NavSection[];
  activeSection: NavSection;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-12 w-full items-center gap-2.5 border-b border-border px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-white/2 hover:text-foreground data-[state=open]:bg-white/2 data-[state=open]:text-foreground">
        <SectionIcon sectionKey={activeSection.key} className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-foreground">{activeSection.name}</span>
        <ChevronDownIcon
          className={cn('ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[calc(var(--landing-left-pane-width,280px)-20px)] border border-border bg-background p-1"
      >
        <div className="flex flex-col">
          {sections.map((section) => {
            const selected = section.key === activeSection.key;
            const href = section.key === 'rust' ? '/docs/sdks/rust/getting-started' : section.match;

            return (
              <Link
                key={section.key}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                  selected
                    ? 'bg-white/4 font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-white/4 hover:text-foreground'
                )}
              >
                <SectionIcon sectionKey={section.key} className="size-4 shrink-0" />
                <span className="truncate">{section.name}</span>
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const METHOD_STYLES: Record<string, string> = {
  GET:    'bg-emerald-500/15 text-emerald-400',
  POST:   'bg-blue-500/15 text-blue-400',
  PUT:    'bg-amber-500/15 text-amber-400',
  PATCH:  'bg-amber-500/15 text-amber-400',
  DELETE: 'bg-red-500/15 text-red-400',
};

function SidebarLinkNode({
  name,
  url,
  method,
}: {
  name: string;
  url: string;
  method?: string;
}) {
  return (
    <Link
      href={url}
      className="flex items-center gap-2 rounded px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-white/2 hover:text-foreground"
    >
      {method ? (
        <span className={cn('shrink-0 rounded px-1 py-0.5 font-mono text-[10px] font-semibold uppercase', METHOD_STYLES[method] ?? 'bg-muted text-muted-foreground')}>
          {method}
        </span>
      ) : null}
      <span className="truncate font-mono">{name}</span>
    </Link>
  );
}

function SectionIcon({
  sectionKey,
  className,
}: {
  sectionKey: string;
  className?: string;
}) {
  switch (sectionKey) {
    case 'react-router':
      return <ReactIcon className={className} />;
    case 'nextjs':
      return <NextjsIcon className={className} />;
    case 'tanstack-router':
      return <TanStackIcon className={className} />;
    case 'node':
      return <NodeIcon className={className} />;
    case 'rust':
      return <RustIcon className={className} />;
    case 'frontend-api':
      return <Blocks className={className} />;
    case 'backend-api':
      return <Server className={className} />;
    default:
      return <FileText className={className} />;
  }
}

function ReactIcon({ className }: { className?: string }) {
  return <BrandIcon src="/icons/react.svg" alt="React" className={className} />;
}

function NextjsIcon({ className }: { className?: string }) {
  return <BrandIcon src="/icons/nextjs.svg" alt="Next.js" className={className} />;
}

function TanStackIcon({ className }: { className?: string }) {
  return <BrandIcon src="/icons/tanstack.svg" alt="TanStack" className={className} />;
}

function NodeIcon({ className }: { className?: string }) {
  return <BrandIcon src="/icons/nodejs.svg" alt="Node.js" className={className} />;
}

function RustIcon({ className }: { className?: string }) {
  return <BrandIcon src="/icons/rust.svg" alt="Rust" className={className} />;
}

function BrandIcon({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      title={alt}
      className={cn('bg-current', className)}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  );
}
