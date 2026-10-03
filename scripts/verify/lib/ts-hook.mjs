import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export async function resolve(specifier, context, next) {
  if (/\.(svg|png|jpe?g|webp|avif)(\?.*)?$/.test(specifier))
    return { url: `data:text/javascript,export default 'asset'`, shortCircuit: true };
  if (
    (specifier.startsWith('.') || specifier.startsWith('/')) &&
    context.parentURL?.startsWith('file:')
  ) {
    const [path, query = ''] = specifier.split('?');
    for (const ext of ['', '.ts', '.tsx', '/index.ts']) {
      const url = new URL(path + ext, context.parentURL);
      if (ext === '' && !/\.(ts|tsx|js|mjs)$/.test(path)) continue;
      if (existsSync(fileURLToPath(url)))
        return { url: url.href + (query ? `?${query}` : ''), shortCircuit: true };
    }
  }
  return next(specifier, context);
}
