import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { transform } from 'esbuild';

const functionsDir = new URL('../base44/functions/', import.meta.url);
const functionNames = await readdir(functionsDir);

for (const functionName of functionNames) {
  const sourcePath = join(functionsDir.pathname, functionName, 'index.ts');
  const source = await readFile(sourcePath, 'utf8');
  await transform(source, { loader: 'ts', format: 'esm', target: 'es2022' });
}

console.log(`Validated ${functionNames.length} Base44 function source files.`);
