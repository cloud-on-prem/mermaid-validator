import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/cli/index.ts',
      name: 'mermaid-validate',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['mermaid', 'commander', 'chalk', 'fs', 'path', 'marked', 'url'],
    },
    target: 'node18',
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
  },
});
