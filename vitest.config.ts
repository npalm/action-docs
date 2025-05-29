/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      reporter: ['lcov', 'text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,js,jsx}'],
      exclude: ['**/*cli*.ts'],
      thresholds: {
        lines: 100,
        statements: 100,
        functions: 96.66,
        branches: 98.14
      }
    },
    clearMocks: true,
    include: ['**/*.{test,spec}.{ts,js}'],
    watch: false,
    testTimeout: 10000,
    globals: true,
  },
});

