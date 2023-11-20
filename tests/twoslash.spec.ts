import { test, expect } from '@playwright/test'

test('it should correctly render twoslash code blocks', async ({ page }) => {
  await page.goto('/posts/deriving-types-from-data-typescript')

  // We expect lines of code to be rendered
  await expect(
    page.locator('code', {
      has: page.locator('.line', {
        hasText: `const options = ['OPTION_1', 'OPTION_2'] as const`,
      }),
    })
  ).toBeVisible()

  // We expect type information from '// ^?' comments
  await expect(
    page.locator('code', {
      has: page.locator('.meta-line', {
        hasText: `type Option = "OPTION_1" | "OPTION_2"`,
      }),
    })
  ).toBeVisible()

  // We expect type information to appear on hover
  await page
    .locator('.line', { hasText: 'const hello = "hello";' })
    .locator('data-lsp', { hasText: 'hello' })
    .hover()
  await expect(page.getByText(`const hello: "hello"`)).toBeVisible()
})

test('it should show a link to open code blocks in TypeScript playground', async ({
  page,
}) => {
  await page.goto('/posts/deriving-types-from-data-typescript')

  await expect(
    page
      .locator('[data-codeblock]', {
        has: page.locator(`a[href*='typescriptlang.org/play/#code']`),
      })
      .first()
  ).toBeVisible()
})
