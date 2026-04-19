import path from 'path';
import { createOpenAPI } from 'fumadocs-openapi/server';
import { createAPIPage } from 'fumadocs-openapi/ui';
import { createShikiFactory } from 'fumadocs-core/highlight/shiki';
import { curl } from 'fumadocs-openapi/requests/generators/curl';
import { javascript } from 'fumadocs-openapi/requests/generators/javascript';
import { python } from 'fumadocs-openapi/requests/generators/python';
import { createHighlighter } from 'shiki';

const shiki = createShikiFactory({
  init: () =>
    createHighlighter({
      themes: ['github-dark'],
      langs: ['bash', 'typescript', 'javascript', 'python', 'json', 'go'],
    }),
});

const shikiOptions = {
  themes: {
    light: 'github-dark' as const,
    dark: 'github-dark' as const,
  },
};

const sharedOptions = {
  shiki,
  shikiOptions,
  generateCodeSamples: () => [curl, javascript, python],
};

export const frontendApiServer = createOpenAPI({
  input: () => ({
    'frontend-api': path.join(process.cwd(), 'public/openapi/frontend-api.json'),
  }),
});

export const platformApiServer = createOpenAPI({
  input: () => ({
    'platform-api': path.join(process.cwd(), 'public/openapi/platform-api.json'),
  }),
});

export const FrontendAPIPage = createAPIPage(frontendApiServer, sharedOptions);
export const PlatformAPIPage = createAPIPage(platformApiServer, sharedOptions);
