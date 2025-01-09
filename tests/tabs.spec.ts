import { test, expect } from '@playwright/test'

test.describe('Tabs', () => {
  test('should correctly hide and show tab panels when selecting tabs', async ({
    page,
  }) => {
    await page.goto('/posts/bash-for-javascript-developers')

    await page.getByRole('tablist').first().scrollIntoViewIfNeeded()

    await expect(page.getByRole('tab', { selected: true }).first()).toHaveText(
      'Bash'
    )
    await expect(page.getByRole('tabpanel').first()).toContainText(
      'echo Hello World'
    )

    await page.getByRole('tab', { name: 'JavaScript' }).first().click()
    await expect(page.getByRole('tab', { selected: true }).first()).toHaveText(
      'JavaScript'
    )
    await expect(page.getByRole('tabpanel').first()).toContainText(
      'console.log("Hello World")'
    )
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/posts/bash-for-javascript-developers')

    const firstTablist = page.getByRole('tablist').first()
    const selectedTab = firstTablist.getByRole('tab', { selected: true })
    await selectedTab.scrollIntoViewIfNeeded()
    await selectedTab.focus()

    // Bash is the first tab
    await expect(selectedTab).toHaveText('Bash')

    // JavaScript is the second tab
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    await expect(selectedTab).toHaveText('JavaScript')

    // Let's navigate to the start again
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('Enter')
    await expect(selectedTab).toHaveText('Bash')

    // We should support End key to navigate to the end
    await page.keyboard.press('End')
    // and space key to select
    await page.keyboard.press(' ')
    await expect(selectedTab).toHaveText('JavaScript')

    // And Home key to navigate to the beginning
    await page.keyboard.press('Home')
    await page.keyboard.press(' ')
    await expect(selectedTab).toHaveText('Bash')
  })
})
