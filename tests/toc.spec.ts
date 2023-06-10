import { test, expect } from '@playwright/test'

test.describe('Table of contents interactive sidebar', () => {
  test.describe('On mobile', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('should be visible by default on mobile', async ({ page }) => {
      await page.goto('/posts/deriving-types-from-data-typescript')

      await expect(
        page.getByRole('heading', { name: 'Table of contents' })
      ).toBeVisible()

      await expect(
        page.getByRole('button', { name: 'Close table of contents' })
      ).toBeHidden()
    })
  })

  test('should be visible by default', async ({ page }) => {
    await page.goto('/posts/deriving-types-from-data-typescript')

    await expect(
      page.getByRole('heading', { name: 'Table of contents' })
    ).toBeVisible()
  })

  test('should be able to toggle toc visibility', async ({ page }) => {
    await page.goto('/posts/deriving-types-from-data-typescript')

    const tocHeading = page.getByRole('heading', { name: 'Table of contents' })

    await expect(tocHeading).toBeVisible()
    await page.getByRole('button', { name: 'Close table of contents' }).click()
    await expect(tocHeading).toBeHidden()

    await page.getByRole('button', { name: 'Open table of contents' }).click()
    await expect(tocHeading).toBeVisible()

    await page.getByRole('button', { name: 'Close table of contents' }).click()
    await expect(tocHeading).toBeHidden()
  })

  test('should remember user preference about toc being open/closed', async ({
    page,
  }) => {
    await page.goto('/posts/deriving-types-from-data-typescript')

    const tocHeading = page.getByRole('heading', { name: 'Table of contents' })

    await page.getByRole('button', { name: 'Close table of contents' }).click()
    await page.reload()
    await expect(tocHeading).toBeHidden()

    await page.getByRole('button', { name: 'Open table of contents' }).click()
    await page.reload()
    await expect(tocHeading).toBeVisible()
  })

  test('should highlight toc item when its corresponding heading comes into view', async ({
    page,
  }) => {
    await page.goto('/posts/bash-for-javascript-developers')

    await page
      .locator('h2', { hasText: 'Quoting and whitespace' })
      .scrollIntoViewIfNeeded()

    await expect(
      page.locator('nav:visible li', {
        has: page.locator('a[href="#quoting-and-whitespace"]'),
      })
    ).toHaveAttribute('data-active', '')
  })

  test('should scroll to make toc item visible when its corresponding heading comes into view', async ({
    page,
  }) => {
    await page.goto('/posts/bash-for-javascript-developers')

    // Check if conclusion link is not on viewport first, since it's the last
    // link in table of contents
    await expect(
      page.locator('nav:visible a[href="#conclusion"]')
    ).not.toBeInViewport()

    // Scroll to bottom of page and it should be visible now
    await page.keyboard.down('End')
    await expect(
      page.locator('nav:visible a[href="#conclusion"]')
    ).toBeInViewport()

    // Check if the same happens with an arbitrary heading
    await expect(
      page.locator('nav:visible a[href="#redirections"]')
    ).not.toBeInViewport()

    await page
      .locator('h2', { hasText: 'Redirections' })
      .scrollIntoViewIfNeeded()
    await expect(
      page.locator('nav:visible a[href="#redirections"]')
    ).toBeInViewport()

    // Scroll to top of page
    await page.keyboard.down('Home')
    await expect(
      page.locator('nav:visible a[href="#hello-world"]')
    ).toBeInViewport()
  })
})
