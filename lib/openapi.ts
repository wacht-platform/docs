import { createShikiFactory } from 'fumadocs-core/highlight/shiki';
import { createHighlighter } from 'shiki';

const shiki = createShikiFactory({
  init: () =>
    createHighlighter({
      themes: ['github-dark'],
      langs: ['bash', 'typescript', 'javascript', 'python', 'json', 'go'],
    }),
});

// Shared render options for the OpenAPI page (fumadocs-openapi v11).
export const sharedOpenAPIOptions = {
  shiki,
  shikiOptions: {
    themes: {
      light: 'github-dark' as const,
      dark: 'github-dark' as const,
    },
  },
};
