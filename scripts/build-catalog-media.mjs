import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';

import sharp from 'sharp';

const WIDTHS = [320, 640, 1024];
const KEY_PATTERN = /^products\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/hero-v[1-9][0-9]*$/;
const CACHE_CONTROL = 'public, max-age=31536000, immutable';
const QA_BACKGROUNDS = [
  { name: 'light', hex: '#F5F5F5' },
  { name: 'dark', hex: '#181818' },
];
const BBOX_ALPHA_THRESHOLD = 16;
const BBOX_TOLERANCE_PX = 2;

const FORMATS = [
  {
    extension: 'avif',
    contentType: 'image/avif',
    encode: (pipeline) => pipeline.avif({ quality: 60, effort: 6 }),
  },
  {
    extension: 'webp',
    contentType: 'image/webp',
    encode: (pipeline) => pipeline.webp({ quality: 84, alphaQuality: 100, effort: 6 }),
  },
  {
    extension: 'png',
    contentType: 'image/png',
    encode: (pipeline) => pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }),
  },
];

const { values: options } = parseArgs({
  options: {
    master: { type: 'string' },
    key: { type: 'string' },
    out: { type: 'string' },
  },
});

if (options.master === undefined || options.key === undefined || options.out === undefined) {
  throw new Error(
    'Usage: node scripts/build-catalog-media.mjs --master <png> --key <base key> --out <dir>',
  );
}

if (!KEY_PATTERN.test(options.key)) {
  throw new Error(
    `Base key does not match products/<category>/<model>/<colour>/hero-v<n>: ${options.key}`,
  );
}

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

const alphaBox = async (input) => {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = info.width;
  let top = info.height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[y * info.width + x] >= BBOX_ALPHA_THRESHOLD) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }

  return {
    left: left / info.width,
    top: top / info.height,
    right: (right + 1) / info.width,
    bottom: (bottom + 1) / info.height,
    cornerAlpha: [
      data[0],
      data[info.width - 1],
      data[(info.height - 1) * info.width],
      data[info.height * info.width - 1],
    ],
  };
};

const masterPath = path.resolve(options.master);
const outDir = path.resolve(options.out);
const masterBuffer = await readFile(masterPath);
const masterHash = sha256(masterBuffer);
const masterMeta = await sharp(masterBuffer).metadata();

if (masterMeta.format !== 'png' || !masterMeta.hasAlpha || masterMeta.width !== masterMeta.height) {
  throw new Error('Master must be a square PNG with an alpha channel');
}

if (existsSync(outDir) && (await readdir(outDir)).length > 0) {
  throw new Error(
    `Output directory is not empty; versioned renditions are never overwritten: ${outDir}`,
  );
}

await mkdir(path.join(outDir, 'qa'), { recursive: true });

const masterBox = await alphaBox(masterBuffer);
const baseName = path.posix.basename(options.key);
const renditions = [];

for (const width of WIDTHS) {
  for (const format of FORMATS) {
    const fileName = `${baseName}-${String(width)}.${format.extension}`;
    const buffer = await format
      .encode(sharp(masterBuffer).resize({ width, height: width, fit: 'fill', kernel: 'lanczos3' }))
      .toBuffer();
    const meta = await sharp(buffer).metadata();
    const box = await alphaBox(buffer);
    const boxDrift = Math.max(
      Math.abs(box.left - masterBox.left),
      Math.abs(box.top - masterBox.top),
      Math.abs(box.right - masterBox.right),
      Math.abs(box.bottom - masterBox.bottom),
    );
    const checks = {
      format: meta.format === (format.extension === 'avif' ? 'heif' : format.extension),
      dimensions: meta.width === width && meta.height === width,
      alpha: meta.hasAlpha === true,
      transparentCorners: box.cornerAlpha.every((value) => value === 0),
      geometry: boxDrift <= BBOX_TOLERANCE_PX / width,
      underBucketLimit: buffer.length <= 10 * 1024 * 1024,
    };

    await writeFile(path.join(outDir, fileName), buffer, { flag: 'wx' });
    renditions.push({
      file: fileName,
      objectKey: `${options.key}-${String(width)}.${format.extension}`,
      contentType: format.contentType,
      cacheControl: CACHE_CONTROL,
      format: format.extension,
      width: meta.width,
      height: meta.height,
      channels: meta.channels,
      hasAlpha: meta.hasAlpha,
      bytes: buffer.length,
      sha256: sha256(buffer),
      alphaBoxDrift: Number(boxDrift.toFixed(4)),
      checks,
      pass: Object.values(checks).every(Boolean),
    });
  }
}

const sheetCell = 640;
const sheetFormats = FORMATS.map((format) => format.extension);
const sheetTiles = [];

for (const [row, background] of QA_BACKGROUNDS.entries()) {
  for (const [column, extension] of sheetFormats.entries()) {
    const tile = await sharp(path.join(outDir, `${baseName}-640.${extension}`))
      .flatten({ background: background.hex })
      .png()
      .toBuffer();
    sheetTiles.push({ input: tile, left: column * sheetCell, top: row * sheetCell });
  }
}

await sharp({
  create: {
    width: sheetCell * sheetFormats.length,
    height: sheetCell * QA_BACKGROUNDS.length,
    channels: 3,
    background: '#ffffff',
  },
})
  .composite(sheetTiles)
  .png({ compressionLevel: 9 })
  .toFile(path.join(outDir, 'qa', `${baseName}-640-theme-comparison.png`));

const manifest = {
  baseKey: options.key,
  bucket: 'catalog-media',
  master: {
    path: path.relative(process.cwd(), masterPath).split(path.sep).join('/'),
    sha256: masterHash,
    width: masterMeta.width,
    height: masterMeta.height,
    note: 'Generator delivered 1254 px; the 2048 px master is an upscale, so no rendition exceeds 1024 px',
  },
  encoder: { sharp: sharp.versions.sharp, libvips: sharp.versions.vips },
  qa: {
    sheet: `qa/${baseName}-640-theme-comparison.png`,
    layout: `rows ${QA_BACKGROUNDS.map((background) => `${background.name} ${background.hex}`).join(', ')}; columns ${sheetFormats.join(', ')}`,
    bboxAlphaThreshold: BBOX_ALPHA_THRESHOLD,
    bboxTolerancePx: BBOX_TOLERANCE_PX,
    masterAlphaBox: masterBox,
  },
  renditions,
  pass: renditions.every((rendition) => rendition.pass),
};

await writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, {
  flag: 'wx',
});

if (sha256(await readFile(masterPath)) !== masterHash) {
  throw new Error('Master changed during conversion');
}

for (const rendition of renditions) {
  console.log(
    `${rendition.pass ? 'PASS' : 'FAIL'} ${rendition.file} ${String(rendition.width)}x${String(rendition.height)} ${String(rendition.bytes)} B`,
  );
}

if (!manifest.pass) {
  process.exitCode = 1;
}
