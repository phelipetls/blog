import { test, expect } from '@playwright/test'

test.describe('Copy code', () => {
  // FIXME: this test should have been passing, but it doens't for some reason
  test.describe.skip('With permission to write to clipboard', () => {
    test.skip(({ browserName }) => browserName !== 'chromium')
    test.use({ permissions: ['clipboard-write'] })

    test('should copy code block on button click', async ({ page }) => {
      await page.goto('/posts/bash-for-javascript-developers')

      const button = page.locator('[data-copy-codeblock-button]').first()
      await button.click()
      await expect(button).toHaveAttribute('aria-label', 'Copied!')
    })
  })

  test.describe.skip('Without permission to write to clipboard', () => {
    test.skip(({ browserName }) => browserName !== 'chromium')

    test('should indicate an error occurred if copying code block failed', async ({
      page,
    }) => {
      await page.goto('/posts/bash-for-javascript-developers')

      const button = page.getByRole('button', { name: /copy code/i }).first()
      await button.click()
      await expect(button).toHaveAttribute('aria-label', 'Failed to copy')
    })
  })
})
