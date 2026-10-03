import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { MOCK_SUPABASE_URL } from './build.mjs';

const [sourceRoot, outDir, envDir] = process.argv.slice(2);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const require = createRequire(path.join(repoRoot, 'package.json'));
const { build } = await import(pathToFileURL(require.resolve('vite')).href);

const environmentGuard = {
  name: 'goodcall-verify-environment-guard',
  configResolved(config) {
    const token = config.env.VITE_DADATA_TOKEN;
    const supabaseUrl = config.env.VITE_SUPABASE_URL;
    const dadataMode = token === '' ? 'unconfigured' : 'configured';
    const supabaseMode = supabaseUrl === MOCK_SUPABASE_URL ? 'mock' : 'not-mock';
    console.log(`Build env: DaData mode ${dadataMode}, Supabase mode ${supabaseMode}`);
    if (dadataMode !== 'unconfigured' || supabaseMode !== 'mock') {
      throw new Error(
        'Verification builds must use an empty DaData token and the mock Supabase URL',
      );
    }
  },
};

await build({
  root: sourceRoot,
  configFile: path.join(sourceRoot, 'vite.config.ts'),
  envDir,
  logLevel: 'error',
  plugins: [environmentGuard],
  build: { outDir, emptyOutDir: true },
});
