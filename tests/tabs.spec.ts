import { test, expect } from '@playwright/test'

test.describe('Tabs', () => {
  test('should correctly hide and show tab panels when selecting tabs', async ({
    page,
  }) => {
    await page.goto('/posts/bash-for-javascript-developers')

    const firstTablist = page.getByRole('tablist').first()
    const selectedTab = firstTablist.getByRole('tab', { selected: true })
    await selectedTab.scrollIntoViewIfNeeded()
    await selectedTab.focus()

    const selectedTabPanelId = await selectedTab.getAttribute('aria-controls')
    await expect(page.locator(`#${selectedTabPanelId}`)).toBeVisible()

    const unselectedTab = firstTablist.getByRole('tab', { selected: false })
    const unselectedTabPanelId = await unselectedTab.getAttribute(
      'aria-controls'
    )
    await expect(page.locator(`#${unselectedTabPanelId}`)).not.toBeVisible()

    await unselectedTab.click()
    await expect(page.locator(`#${unselectedTabPanelId}`)).toBeVisible()
    await expect(page.locator(`#${selectedTabPanelId}`)).not.toBeVisible()
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
