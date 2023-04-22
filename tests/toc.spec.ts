import { test, expect } from '@playwright/test'

test.describe('Table of contents interactive sidebar', () => {
  test('should highlight toc item when its corresponding heading comes into view', async ({
    page,
  }) => {
    await page.goto('/posts/bash-for-javascript-developers')

    await page
      .locator('h2', { hasText: 'Quoting and whitespace' })
      .scrollIntoViewIfNeeded()

    await expect(
      page.locator('nav[data-toc-wrapper]:visible li', {
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
      page.locator('nav[data-toc-wrapper]:visible a[href="#conclusion"]')
    ).not.toBeInViewport()

    // Scroll to bottom of page and it should be visible now
    await page.keyboard.down('End')
    await expect(
      page.locator('nav[data-toc-wrapper]:visible a[href="#conclusion"]')
    ).toBeInViewport()

    // Check if the same happens with an arbitrary heading
    await expect(
      page.locator('nav[data-toc-wrapper]:visible a[href="#redirections"]')
    ).not.toBeInViewport()

    await page
      .locator('h2', { hasText: 'Redirections' })
      .scrollIntoViewIfNeeded()
    await expect(
      page.locator('nav[data-toc-wrapper]:visible a[href="#redirections"]')
    ).toBeInViewport()

    // Scroll to top of page
    await page.keyboard.down('Home')
    await expect(
      page.locator('nav[data-toc-wrapper]:visible a[href="#hello-world"]')
    ).toBeInViewport()
  })
})
