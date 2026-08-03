import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const EXCLUDED_DIRS = new Set([
  'node_modules',
  'dist',
  'coverage',
  'playwright-report',
  'test-results',
  '.git',
  '.github',
]);

const EXCLUDED_FILES = new Set(['package-lock.json', 'mockServiceWorker.js']);

const FILE_PATTERNS = {
  ts: /\.(ts|tsx|js|jsx|mts|mjs|cts|cjs)$/,
  scss: /\.(scss|css)$/,
  yaml: /\.(yml|yaml)$/,
  html: /\.html$/,
};

function isExcluded(filePath) {
  const relativePath = path.relative(rootDir, filePath);
  const parts = relativePath.split(path.sep);

  if (EXCLUDED_FILES.has(path.basename(filePath))) {
    return true;
  }

  for (const part of parts) {
    if (EXCLUDED_DIRS.has(part)) {
      return true;
    }
  }

  if (filePath.includes('node_modules') || filePath.includes('dist')) {
    return true;
  }

  return false;
}

function isSourceFile(filePath) {
  return (
    FILE_PATTERNS.ts.test(filePath) ||
    FILE_PATTERNS.scss.test(filePath) ||
    FILE_PATTERNS.yaml.test(filePath) ||
    FILE_PATTERNS.html.test(filePath)
  );
}

function checkComments(filePath) {
  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (FILE_PATTERNS.ts.test(filePath)) {
      if (detectTSComment(line)) {
        issues.push({ line: lineNum, text: line.trim() });
      }
    } else if (FILE_PATTERNS.scss.test(filePath)) {
      if (detectSCSSComment(line)) {
        issues.push({ line: lineNum, text: line.trim() });
      }
    } else if (FILE_PATTERNS.yaml.test(filePath)) {
      if (detectYAMLComment(line)) {
        issues.push({ line: lineNum, text: line.trim() });
      }
    } else if (FILE_PATTERNS.html.test(filePath)) {
      if (detectHTMLComment(line)) {
        issues.push({ line: lineNum, text: line.trim() });
      }
    }
  }

  return issues;
}

function detectTSComment(line) {
  const trimmed = line.trim();

  if (trimmed.startsWith('///')) {
    return false;
  }

  if (trimmed.startsWith('//') && !isInString(line, line.indexOf('//'))) {
    return true;
  }

  if (trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('*/')) {
    return true;
  }

  if (trimmed.startsWith('/**')) {
    return true;
  }

  const lineCommentIdx = line.indexOf('//');
  if (lineCommentIdx !== -1 && !isInString(line, lineCommentIdx)) {
    const beforeComment = line.substring(0, lineCommentIdx);
    if (beforeComment.trim().length > 0) {
      return true;
    }
  }

  return false;
}

function detectSCSSComment(line) {
  const trimmed = line.trim();

  if (trimmed.startsWith('//') && !isInString(line, line.indexOf('//'))) {
    return true;
  }

  if (trimmed.startsWith('/*') || trimmed.startsWith('*/')) {
    return true;
  }

  if (trimmed.startsWith('*') && trimmed.length > 1) {
    const nextChar = trimmed[1];
    if (nextChar === ' ' && !trimmed.includes('{')) {
      return true;
    }
  }

  const lineCommentIdx = line.indexOf('//');
  if (lineCommentIdx !== -1 && !isInString(line, lineCommentIdx)) {
    const beforeComment = line.substring(0, lineCommentIdx);
    if (beforeComment.trim().length > 0) {
      return true;
    }
  }

  return false;
}

function detectYAMLComment(line) {
  const trimmed = line.trim();
  const hashIdx = line.indexOf('#');

  if (hashIdx === -1) {
    return false;
  }

  if (hashIdx === 0) {
    return true;
  }

  const beforeHash = line.substring(0, hashIdx).trim();
  if (beforeHash.length > 0 && !isInString(line, hashIdx)) {
    return true;
  }

  return false;
}

function detectHTMLComment(line) {
  return line.includes('<!--') || line.includes('-->');
}

function isInString(line, index) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;

  for (let i = 0; i < index && i < line.length; i++) {
    const char = line[i];
    const prevChar = i > 0 ? line[i - 1] : '';

    if (prevChar !== '\\') {
      if (char === '"' && !inSingleQuote && !inBacktick) {
        inDoubleQuote = !inDoubleQuote;
      } else if (char === "'" && !inDoubleQuote && !inBacktick) {
        inSingleQuote = !inSingleQuote;
      } else if (char === '`' && !inSingleQuote && !inDoubleQuote) {
        inBacktick = !inBacktick;
      }
    }
  }

  return inSingleQuote || inDoubleQuote || inBacktick;
}

function scanDirectory(dir) {
  const results = [];

  function walk(currentPath) {
    if (isExcluded(currentPath)) {
      return;
    }

    const stat = fs.statSync(currentPath);

    if (stat.isDirectory()) {
      const entries = fs.readdirSync(currentPath);
      for (const entry of entries) {
        walk(path.join(currentPath, entry));
      }
    } else if (stat.isFile() && isSourceFile(currentPath)) {
      const issues = checkComments(currentPath);
      if (issues.length > 0) {
        results.push({
          file: path.relative(rootDir, currentPath),
          issues,
        });
      }
    }
  }

  walk(dir);
  return results;
}

function main() {
  let scanRoot = rootDir;

  if (process.argv[2]) {
    scanRoot = path.resolve(process.argv[2]);
  }

  const results = scanDirectory(scanRoot);

  if (results.length === 0) {
    console.log('✓ No authored comments found\n');
    process.exit(0);
  }

  console.error('✗ Found authored comments:\n');
  for (const result of results) {
    console.error(`${result.file}`);
    for (const issue of result.issues) {
      console.error(`  Line ${issue.line}: ${issue.text}`);
    }
  }
  console.error();
  process.exit(1);
}

main();
