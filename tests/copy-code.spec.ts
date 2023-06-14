import { test, expect } from '@playwright/test'

test.describe('Copy code', () => {
  test('Button to copy code should be visible when focused', async ({
    page,
  }) => {
    await page.goto('/posts/bash-for-javascript-developers')

    const copyCodeButton = page
      .getByRole('button', { name: /copy code/i })
      .first()
    await copyCodeButton.focus()

    await expect(copyCodeButton).toBeVisible()
    await expect(copyCodeButton).not.toHaveCSS('opacity', '0')
  })

  test.describe('Clipboard', () => {
    test.skip(({ browserName }) => browserName !== 'chromium')

    test.describe('With permission to write to clipboard', () => {
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
      test('should show tooltip indicating the error', async ({ page }) => {
        await page.goto('/posts/bash-for-javascript-developers')

        const tooltip = page.getByRole('tooltip', { name: 'Failed to copy' })

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
  })
})
