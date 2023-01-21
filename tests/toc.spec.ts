import { test, expect, Locator } from '@playwright/test'

// TODO: remove this function once .viewportRatio or .toIntersectViewport
// method comes into a stable Playwright release.
// See https://github.com/microsoft/playwright/issues/8740
function isIntersectingViewport(locator: Locator): Promise<boolean> {
  return locator.evaluate(async (element) => {
    const visibleRatio: number = await new Promise((resolve) => {
      const observer = new IntersectionObserver((entries) => {
        resolve(entries[0].intersectionRatio)
        observer.disconnect()
      })
      observer.observe(element)
      // Firefox doesn't call IntersectionObserver callback unless
      // there are rafs.
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      requestAnimationFrame(() => {})
    })
    return visibleRatio > 0
  })
}

test.describe('Table of contents interactive sidebar', () => {
  test('should highlight toc item when its corresponding heading comes into view', async ({
    page,
  }) => {
    await page.goto('/posts/bash-for-javascript-developers')

    await page
      .locator('h2', { hasText: 'Quoting and whitespace' })
      .scrollIntoViewIfNeeded()

    await expect(
      page.locator('nav[data-toc]:visible li', {
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
    await expect
      .poll(
        async () =>
          await isIntersectingViewport(
            page.locator('nav[data-toc]:visible a[href="#conclusion"]')
          )
      )
      .toBeFalsy()

    // Scroll to bottom of page and it should be visible now
    await page.keyboard.down('End')
    await expect
      .poll(
        async () =>
          await isIntersectingViewport(
            page.locator('nav[data-toc]:visible a[href="#conclusion"]')
          )
      )
      .toBeTruthy()

    // Check if the same happens with an arbitrary heading
    await expect
      .poll(
        async () =>
          await isIntersectingViewport(
            page.locator('nav[data-toc]:visible a[href="#redirections"]')
          )
      )
      .toBeFalsy()

    await page
      .locator('h2', { hasText: 'Redirections' })
      .scrollIntoViewIfNeeded()
    await expect
      .poll(
        async () =>
          await isIntersectingViewport(
            page.locator('nav[data-toc]:visible a[href="#redirections"]')
          )
      )
      .toBeTruthy()

    // Scroll to top of page
    await page.keyboard.down('Home')
    await expect
      .poll(
        async () =>
          await isIntersectingViewport(
            page.locator('nav[data-toc]:visible a[href="#hello-world"]')
          )
      )
      .toBeTruthy()
  })
})
