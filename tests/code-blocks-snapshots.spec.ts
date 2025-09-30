import { test, expect } from '@playwright/test'

test.describe('Code Block Snapshots', () => {
  test('simple codeblock with highlighted lines snapshot', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium')

    await page.goto('/posts/debouncing-react')

    const highlightedCodeBlock = page
      .locator('[data-codeblock]')
      .first()

    await expect(highlightedCodeBlock).toHaveScreenshot('code-block-highlighted-lines.png')
  })

  test('simple codeblock with title', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium')

    await page.goto('/posts/using-storybook-and-msw-in-react-native')

    const codeBlockWithTitle = page
      .locator('[data-codeblock]')
      .first()

    await expect(codeBlockWithTitle).toHaveScreenshot('code-block-with-title.png')
  })

  test('twoslash code block with highlighted lines snapshot', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium')

    await page.goto('/posts/polymorphic-components-react-typescript')

    const twoslashCodeBlock = page
      .locator('[data-codeblock]')
      .nth(5)

    await expect(twoslashCodeBlock).toHaveScreenshot('twoslash-code-block.png')
  })

  test('twoslash code block with inline query', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium')

    await page.goto('/posts/deriving-types-from-data-typescript/')

    const twoslashInlineQuery = page
      .locator('[data-codeblock]')
      .first()

    await expect(twoslashInlineQuery).toHaveScreenshot('twoslash-inline-query.png')
  })
})
