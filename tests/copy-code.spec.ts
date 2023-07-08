import { test, expect } from '@playwright/test'

test.describe('Copy code', () => {
  test.describe('With permission to write to clipboard', () => {
    test.skip(({ browserName }) => browserName !== 'chromium')
    test.use({ permissions: ['clipboard-write'] })

    test('should copy code block contents on button click and show a tooltip indicating success', async ({
      page,
    }) => {
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

  test.describe('Without permission to write to clipboard', () => {
    test.skip(({ browserName }) => browserName !== 'chromium')

    test('should show tooltip indicating the error', async ({ page }) => {
      await page.goto('/posts/bash-for-javascript-developers')

      await page.locator('pre').first().hover()
      await page
        .getByRole('button', { name: /copy code/i })
        .first()
        .click()

      await expect(page.getByRole('tooltip')).toBeVisible()
      await expect(page.getByRole('tooltip')).toHaveText('Failed to copy')

      await expect(page.getByRole('tooltip')).toBeVisible()
      await expect(page.getByRole('tooltip')).not.toBeVisible()
    })
  })
})
