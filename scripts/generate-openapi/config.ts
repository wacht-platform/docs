import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Root of the wacht monorepo — adjust if repo layout changes
// scripts/generate-openapi → scripts → wacht-docs → wacht (monorepo root)
const MONOREPO_ROOT = path.resolve(__dirname, '../../..');

export const config = {
  // Source codebases to parse
  frontendApi: {
    dir: path.join(MONOREPO_ROOT, 'frontend-api'),
    routerDir: 'router',
    handlerDir: 'handler',
    modelDir: 'model',
  },
  platformApi: {
    dir: path.join(MONOREPO_ROOT, 'platform-api'),
    routerSubpath: 'platform/src/application/router',
    apiSubpath: 'platform/src/api',
    dtoSubpath: 'dto/src',
    modelsSubpath: 'models/src',
    extraStructSubpaths: ['queries/src', 'platform/src/api', 'platform/src/application', 'commands/src', 'common/src'],
  },
  reactSdk: {
    typesDir: path.join(MONOREPO_ROOT, 'react-sdk/wacht-types/src'),
  },

  // Where to write the generated specs
  output: {
    dir: path.join(__dirname, '../../public/openapi'),
    frontendApi: 'frontend-api.json',
    platformApi: 'platform-api.json',
  },
};
