import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { MOCK_SUPABASE_URL } from './build.mjs';

const [sourceRoot, outDir, envDir, chunkReportFile] = process.argv.slice(2);
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

function sourceRelative(id) {
  return path.relative(sourceRoot, id.split('?')[0]).replaceAll('\\', '/');
}

const chunkReport = {
  name: 'goodcall-verify-chunk-report',
  generateBundle(_options, bundle) {
    const chunks = [];
    const assets = [];
    for (const output of Object.values(bundle)) {
      if (output.type === 'chunk') {
        chunks.push({
          fileName: output.fileName,
          isEntry: output.isEntry,
          isDynamicEntry: output.isDynamicEntry,
          facadeModule: output.facadeModuleId ? sourceRelative(output.facadeModuleId) : null,
          bytes: Buffer.byteLength(output.code),
          imports: output.imports,
          dynamicImports: output.dynamicImports,
          importedCss: [...(output.viteMetadata?.importedCss ?? [])],
          modules: Object.entries(output.modules).map(([id, module]) => ({
            id: sourceRelative(id),
            renderedLength: module.renderedLength,
          })),
        });
      } else {
        const bytes =
          typeof output.source === 'string'
            ? Buffer.byteLength(output.source)
            : output.source.byteLength;
        assets.push({ fileName: output.fileName, bytes });
      }
    }
    writeFileSync(chunkReportFile, JSON.stringify({ chunks, assets }, null, 2));
  },
};

await build({
  root: sourceRoot,
  configFile: path.join(sourceRoot, 'vite.config.ts'),
  envDir,
  logLevel: 'error',
  plugins: chunkReportFile ? [environmentGuard, chunkReport] : [environmentGuard],
  build: { outDir, emptyOutDir: true },
});
