import { test, expect } from '@playwright/test'

test.describe('Copy code', () => {
  test('should copy code block contents with the click of a button', async ({
    page,
  }) => {
    page.goto('/posts/bash-for-javascript-developers')

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
