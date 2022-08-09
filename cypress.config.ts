import { defineConfig } from 'cypress'

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1313',
    supportFile: 'cypress/support/e2e.js',
  },
})
