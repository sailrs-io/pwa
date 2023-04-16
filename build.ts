import * as esbuild from 'esbuild';
import { globSync } from 'glob';

const isProduction = process.env.NODE_ENV === 'production';

const target = ['ES2019', 'node14.17'];
console.log('isProduction', isProduction);

const subModules = ['notifications'];

esbuild.buildSync({
  entryPoints: globSync('src/**/*.ts'),
  format: 'cjs',
  outdir: 'dist/cjs',
  bundle: false,
  minify: isProduction,
  sourcemap: !isProduction,
  platform: 'node',
  target,
});

esbuild.buildSync({
  entryPoints: [
    'src/index.ts',
    ...subModules.map((module) => `src/${module}/index.ts`),
  ],
  format: 'esm',
  outdir: 'dist/esm',
  bundle: true,
  minify: isProduction,
  sourcemap: !isProduction,
  splitting: true,
  outExtension: { '.js': '.mjs' },
  target,
});
