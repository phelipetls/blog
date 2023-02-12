import { test, expect } from '@playwright/test'

test.describe('Copy code', () => {
  test.use({ permissions: ['clipboard-write'] })
  test.skip(({ browserName }) => browserName !== 'chromium')

  test('should copy code block contents on button click', async ({ page }) => {
    await page.goto('/posts/bash-for-javascript-developers')

    const tooltip = page.getByRole('tooltip', { name: 'Copied' })

    await expect(tooltip).not.toBeVisible()

    await page.locator('pre').first().hover()
    await page
      .getByRole('button', { name: /copy code/i })
      .first()
      .click()

    await expect(tooltip).toBeVisible()
    await expect(tooltip).not.toBeVisible()
  })
})
