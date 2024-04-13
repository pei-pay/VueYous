import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { MarkdownTransform } from './plugins/markdownTransform';


export default defineConfig({
  server: {
    fs: {
      allow: [
        resolve(__dirname, '..'),
      ],
    },
  },
  plugins: [MarkdownTransform()],
  resolve: {
    alias: {
      '@vueyous/shared': resolve(__dirname, '../shared/index.ts'),
      '@vueyous/core': resolve(__dirname, '../core/index.ts'),
      '@vueyous/metadata': resolve(__dirname, '../metadata/index.ts'),
    },
    dedupe: ['vue'],
  }
});
