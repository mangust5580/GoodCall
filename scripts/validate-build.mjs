import path from 'path';
import { fileURLToPath } from 'url';
import { validateBuildArtifact } from './build-validation.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist');

function validateBuild() {
  console.log('\n🔍 Validating build artifact...\n');

  const result = validateBuildArtifact(distPath);

  if (result.valid) {
    console.log('✓ Found index.html');
    console.log('✓ Found 404.html');
    console.log('✓ Found .nojekyll');
    console.log('ℹ Note: Verify base path is correctly configured');
  }

  for (const error of result.errors) {
    console.error(`✗ ${error}`);
  }

  if (result.valid) {
    console.log('\n✓ Build validation passed\n');
    process.exit(0);
  } else {
    console.error('\n✗ Build validation failed\n');
    process.exit(1);
  }
}

validateBuild();
