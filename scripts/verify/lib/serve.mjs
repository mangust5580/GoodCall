import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';

const BASE_PATH = '/GoodCall/';
const CONTENT_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};

export function serveStatic(rootDir) {
  const server = createServer((request, response) => {
    const url = new URL(request.url, 'http://127.0.0.1');
    let relative = decodeURIComponent(url.pathname);
    relative = relative.startsWith(BASE_PATH) ? relative.slice(BASE_PATH.length) : '';
    if (relative === '') relative = 'index.html';
    const file = path.join(rootDir, relative);
    if (!file.startsWith(rootDir) || !existsSync(file) || statSync(file).isDirectory()) {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200, {
      'content-type': CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream',
    });
    response.end(readFileSync(file));
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ base: `http://127.0.0.1:${port}${BASE_PATH}`, close: () => server.close() });
    });
  });
}
