import { defineConfig } from 'vitest/config'

export default defineConfig({
  // https://vitest.dev/guide/
  test: {
    includeSource: ['**/*.{js}']
  },
})