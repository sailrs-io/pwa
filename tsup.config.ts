import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entryPoints: [
    'src/index.ts',
    'src/notifications/index.ts'
  ],
  format: ['esm', 'cjs'],
  splitting: false,
  dts: true,
  clean: true,
  sourcemap: true,
  minify: !options.watch,
  external: ['react', 'react-dom'],
  banner: {
    js: `/* @license MIT Sailrs GmbH */`,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}))
