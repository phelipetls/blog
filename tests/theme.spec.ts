import { test, expect } from '@playwright/test'

test.describe('On mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should be able to switch from light to dark theme', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page.locator('body')).not.toHaveClass(/dark/)

    await page.getByTestId('open-sidenav').click()
    const selectTheme = page.getByRole('combobox', {
      name: /choose a theme/i,
    })
    await selectTheme.selectOption('dark')

    await expect(page.locator('body')).toHaveClass(/dark/)
  })
})

test.describe('On desktop', () => {
  test('should be able to switch from light to dark theme', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page.locator('body')).not.toHaveClass(/dark/)

    await page
      .getByRole('combobox', { name: /choose a theme/i })
      .selectOption('dark')

    await expect(page.locator('body')).toHaveClass(/dark/)
  })

  test('should respect local storage', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).not.toHaveClass(/dark/)

    await page.evaluate(`window.localStorage.setItem('__theme', 'dark')`)
    await page.reload()

    await expect(page.locator('body')).toHaveClass(/dark/)
  })

  test('should show system theme as selected if there is no stored theme', async ({
    page,
  }) => {
    await page.goto('/')

    const selectTheme = page.getByRole('combobox', {
      name: /choose a theme/i,
    })
    await expect(
      selectTheme.getByRole('option', { selected: true })
    ).toHaveText('System')
  })

  test('should show stored theme as selected', async ({ page }) => {
    await page.goto('/')

    await page.evaluate(`window.localStorage.setItem('__theme', 'dark')`)
    await page.reload()

    const selectTheme = page.getByRole('combobox', {
      name: /choose a theme/i,
    })
    await expect(
      selectTheme.getByRole('option', { selected: true })
    ).toHaveText('Dark')
  })
})

test.describe('Prefers dark color scheme', () => {
  test.use({
    colorScheme: 'dark',
  })

  test('should respect user color-scheme system preference by default', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('body')).toHaveClass(/dark/)
  })

  test('should be able to switch to system preference', async ({ page }) => {
    await page.goto('/')

    // First, let's choose light theme first
    await page.evaluate(`window.localStorage.setItem('__theme', 'light')`)
    await page.reload()

    await expect(page.locator('body')).not.toHaveClass(/dark/)

    // Then switch to system theme
    const selectTheme = page.getByRole('combobox', {
      name: /choose a theme/i,
    })
    await selectTheme.selectOption('system')

    await expect(page.locator('body')).toHaveClass(/dark/)
  })

  test('should display correct icons according to theme', async ({ page }) => {
    await page.goto('/')

    const icon = page.locator('[data-theme-select-icon]').first()

    await expect(icon).toHaveAttribute('href', '#monitor')

    await page
      .getByRole('combobox', { name: /choose a theme/i })
      .selectOption('dark')
    await expect(icon).toHaveAttribute('href', '#moon')

    await page
      .getByRole('combobox', { name: /choose a theme/i })
      .selectOption('light')
    await expect(icon).toHaveAttribute('href', '#sun')

    await page
      .getByRole('combobox', { name: /choose a theme/i })
      .selectOption('system')
    await expect(icon).toHaveAttribute('href', '#monitor')
  })
})
