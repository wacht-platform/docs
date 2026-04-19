import type { SharedGroup } from './shared-sdk-pages.types';

export const organizationWorkspaceComponentGroup: SharedGroup = {
  label: 'Multi tenancy',
  docs: [
    {
      slug: 'organization-switcher',
      title: 'OrganizationSwitcher',
      description: 'Switch between organizations and workspaces from a single dropdown surface.',
      importName: 'OrganizationSwitcher',
      intro:
        '`OrganizationSwitcher` is the umbrella control for organization and workspace switching. It reads the current session, the available memberships, and the deployment permissions before it decides which switch, create, and manage actions to show.',
      example: `export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Wacht</span>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="/docs">Docs</a>
          <a href="/docs/sdks/nextjs">Next.js</a>
        </nav>
      </div>
      <OrganizationSwitcher />
    </header>
  );
}`,
      points: [
        'Use it when the app needs one place for org and workspace switching.',
        'It can also surface create and manage actions when the current deployment allows them.',
      ],
      sections: [
        {
          title: 'Overview',
          paragraphs: [
            'Mount it where a user needs to move between personal, organization, and workspace scope without leaving the current page.',
            'It fits well in the app header, sidebar, or any other top-level shell where the active tenancy matters.',
          ],
        },
        {
          title: 'What it shows',
          paragraphs: [
            'The switcher uses the active session and the current memberships to build the label shown on the button. For a personal account it shows the personal state; for a scoped session it shows the organization name and, when workspaces are enabled, the active workspace beside it.',
            'The trigger also reflects restrictions when the current org or workspace is blocked or needs attention.',
          ],
        },
        {
          title: 'Behavior',
          paragraphs: [
            'The switcher builds its state from the active session, organization memberships, workspace memberships, and deployment B2B settings. That is what lets it keep the current scope, the list of alternatives, and the available actions in sync.',
            'When the button is opened it renders a dropdown with the current personal account, the active organization, the available workspaces, and any permitted create or manage actions. The menu is driven by the current deployment rules, not by a fixed list of controls.',
          ],
          points: [
            'It can keep a personal account option visible when the deployment allows it.',
            'The create and manage actions are permission-aware and do not appear for every user.',
          ],
        },
        {
          title: 'Scope switching',
          paragraphs: [
            'The current organization stays pinned at the top of the menu, and workspaces are nested beneath it when the deployment has workspaces enabled.',
            'Switching the organization or workspace updates the active session scope and closes the menu once the switch is complete.',
          ],
          points: [
            'The active organization and active workspace are both read from the current session state.',
            'The switcher keeps a personal account entry available when personal mode is supported.',
          ],
        },
        {
          title: 'Create and manage actions',
          paragraphs: [
            'When the deployment allows it, the switcher can open the organization and workspace create dialogs, plus the manage dialogs for the current organization or workspace.',
            'Those actions are permission-aware. If the user cannot manage the current scope, the corresponding button never appears.',
          ],
          points: [
            'Create actions are surfaced only when the deployment lets users create new scopes.',
            'Manage actions are tied to the current membership permissions.',
          ],
        },
        {
          title: 'Loading and restrictions',
          paragraphs: [
            'While the organization or workspace data is still loading, the switcher shows a skeleton button instead of a half-populated menu.',
            'If the current organization or workspace is restricted, the switcher keeps the warning state visible and disables the actions that do not make sense in that state.',
          ],
        },
      ],
      examples: [
        {
          title: 'Header shell',
          code: `export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Wacht</span>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="/docs">Docs</a>
          <a href="/docs/sdks/nextjs">Next.js</a>
        </nav>
      </div>
      <OrganizationSwitcher />
    </header>
  );
}`,
        },
      ],
    },
    {
      slug: 'manage-organization',
      title: 'ManageOrganization',
      description: 'Render the organization management surface.',
      importName: 'ManageOrganization',
      intro:
        '`ManageOrganization` is the full organization settings surface. It is the page-sized companion to `OrganizationSwitcher` and exposes the organization tabs that the deployment enables.',
      example: `export default function OrganizationSettingsPage() {
  return <ManageOrganization />;
}`,
      points: [
        'Use it on a dedicated organization settings page or inside a dialog.',
        'The visible tabs depend on the deployment settings and the current organization permissions.',
      ],
      sections: [
        {
          title: 'Behavior',
          paragraphs: [
            'The component waits for the active organization to load, then renders the tabs that are actually enabled for the current deployment.',
            'It keeps the current organization sticky while the data refetches so the page does not flicker back to an empty state during normal updates.',
          ],
          points: [
            'General settings are always present.',
            'Domains, members, invitations, roles, and SSO appear only when the deployment and organization settings allow them.',
            'If there is no active organization, the page falls back to the empty state and asks the user to pick one first.',
          ],
        },
        {
          title: 'General',
          paragraphs: [
            'The general tab holds the organization name and the core settings that define the organization itself.',
            'It is the first tab the page opens because that is the default edit path for most teams.',
          ],
        },
        {
          title: 'Domains',
          paragraphs: [
            'The domains tab appears only when domain management is enabled for the deployment.',
            'It is the place for verified organization domains and the controls around them.',
          ],
        },
        {
          title: 'Members',
          paragraphs: [
            'The members tab lists the organization members and their roles.',
            'It is the tab users open when they need to review or change access inside the organization.',
          ],
        },
        {
          title: 'Invitations',
          paragraphs: [
            'The invitations tab is the place for pending invites and invite management.',
            'It only shows up when the deployment allows organization invitations.',
          ],
        },
        {
          title: 'Roles',
          paragraphs: [
            'The roles tab appears only when custom organization roles are enabled.',
            'It is where role definitions and role assignment live for the current organization.',
          ],
        },
        {
          title: 'SSO',
          paragraphs: [
            'The SSO tab appears only when the deployment has enterprise SSO turned on.',
            'It is the organization-level surface for identity provider settings and related controls.',
          ],
        },
      ],
      examples: [
        {
          title: 'Organization settings page',
          code: `export default function OrganizationSettingsPage() {
  return <ManageOrganization />;
}`,
        },
      ],
    },
    {
      slug: 'create-organization-form',
      title: 'CreateOrganizationForm',
      description: 'Create a new organization with a name, description, and optional image.',
      importName: 'CreateOrganizationForm',
      intro:
        '`CreateOrganizationForm` is the standalone organization creation form. It collects the organization name, optional description, and optional image before it creates the new organization and refreshes the current session state.',
      example: `export default function CreateOrganizationPage() {
  return <CreateOrganizationForm />;
}`,
      points: [
        'Use it inside a dedicated create-organization page or inside the organization management flow.',
        'The form validates the organization name before it submits anything.',
      ],
      signature: `type CreateOrganizationFormProps = {
  onSuccess?: (result?: ApiResult<{ organization: Organization; membership: OrganizationMembership }>) => void;
  onCancel?: () => void;
};`,
      api: [
        {
          name: 'onSuccess',
          type: '(result?: ApiResult<{ organization: Organization; membership: OrganizationMembership }>) => void',
          description: 'Called after the organization is created and the session has been refreshed.',
        },
        {
          name: 'onCancel',
          type: '() => void',
          description: 'Called when the user backs out of the form.',
        },
      ],
      sections: [
        {
          title: 'Behavior',
          paragraphs: [
            'The form keeps local state for the name, description, image upload, preview image, and submission state.',
            'It sanitizes the values before submit, rejects invalid names early, and refreshes the session after the organization is created.',
          ],
          points: [
            'The image is optional.',
            'The component uses the shared toast and default styles context for feedback and presentation.',
          ],
        },
      ],
      examples: [
        {
          title: 'Create organization page',
          code: `export default function CreateOrganizationPage() {
  return <CreateOrganizationForm />;
}`,
        },
      ],
    },
    {
      slug: 'create-workspace-form',
      title: 'CreateWorkspaceForm',
      description: 'Create a workspace inside the selected organization.',
      importName: 'CreateWorkspaceForm',
      intro:
        '`CreateWorkspaceForm` is the workspace creation surface. It works like the organization form, but it also needs an organization scope so the new workspace is created in the right place.',
      example: `export default function CreateWorkspacePage() {
  return <CreateWorkspaceForm organizationId="org_123" />;
}`,
      points: [
        'Use it when the product supports workspaces under organizations.',
        'It can either take the organization id directly or let the user choose the organization inside the form.',
      ],
      signature: `type CreateWorkspaceFormProps = {
  organizationId?: string;
  onSuccess?: (result?: { workspace: Workspace; membership: WorkspaceMembership }) => void;
  onCancel?: () => void;
  onCreateOrganization?: () => void;
};`,
      api: [
        {
          name: 'organizationId',
          type: 'string',
          description: 'The target organization scope for the new workspace.',
        },
        {
          name: 'onSuccess',
          type: '(result?: { workspace: Workspace; membership: WorkspaceMembership }) => void',
          description: 'Called after the workspace is created and the session has been refreshed.',
        },
        {
          name: 'onCancel',
          type: '() => void',
          description: 'Called when the user backs out of the form.',
        },
        {
          name: 'onCreateOrganization',
          type: '() => void',
          description: 'Called when the user needs to create an organization first.',
        },
      ],
      sections: [
        {
          title: 'Behavior',
          paragraphs: [
            'The form keeps local state for the workspace name, description, image upload, preview image, selected organization, and submission state.',
            'If the deployment allows organization creation from the workspace flow, the form can hand off to the organization form instead of blocking the user.',
          ],
          points: [
            'The workspace name is validated before submit.',
            'The selected organization must be present before the request can succeed.',
          ],
        },
      ],
      examples: [
        {
          title: 'Workspace creation page',
          code: `export default function CreateWorkspacePage() {
  const organizationId = "org_123";

  return <CreateWorkspaceForm organizationId={organizationId} />;
}`,
        },
      ],
    },
    {
      slug: 'manage-workspace',
      title: 'ManageWorkspace',
      description: 'Render the workspace management surface.',
      importName: 'ManageWorkspace',
      intro:
        '`ManageWorkspace` is the workspace settings surface. It is the page-sized companion to the workspace selector and exposes the workspace tabs that the deployment enables.',
      example: `export default function WorkspaceSettingsPage() {
  return <ManageWorkspace />;
}`,
      points: [
        'Use it on a dedicated workspace settings page or inside a dialog.',
        'The visible tabs depend on the deployment settings and the current workspace permissions.',
      ],
      sections: [
        {
          title: 'Behavior',
          paragraphs: [
            'The component waits for the active workspace to load, then renders the tabs that are actually enabled for the current deployment.',
            'It keeps the current workspace sticky while the data refetches so the page does not flicker back to an empty state during normal updates.',
          ],
          points: [
            'General settings are always present.',
            'Members, invitations, and roles appear only when the deployment and workspace settings allow them.',
            'If there is no active workspace, the page falls back to the empty state and asks the user to pick one first.',
          ],
        },
        {
          title: 'General',
          paragraphs: [
            'The general tab holds the workspace name and the core settings that define the workspace itself.',
            'It is the first tab the page opens because that is the default edit path for most teams.',
          ],
        },
        {
          title: 'Members',
          paragraphs: [
            'The members tab lists the workspace members and their roles.',
            'It is the tab users open when they need to review or change access inside the workspace.',
          ],
        },
        {
          title: 'Invitations',
          paragraphs: [
            'The invitations tab is the place for pending invites and invite management.',
            'It only shows up when the deployment allows workspace invitations.',
          ],
        },
        {
          title: 'Roles',
          paragraphs: [
            'The roles tab appears only when custom workspace roles are enabled.',
            'It is where role definitions and role assignment live for the current workspace.',
          ],
        },
      ],
      examples: [
        {
          title: 'Workspace settings page',
          code: `export default function WorkspaceSettingsPage() {
  return <ManageWorkspace />;
}`,
        },
      ],
    },
  ],
};
