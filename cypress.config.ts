import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      bundler: 'vite',
      framework: 'react',
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
    viewportHeight: 1049,
    viewportWidth: 1905,
  },
});