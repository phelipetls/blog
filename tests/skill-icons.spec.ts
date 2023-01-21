import { test, expect } from '@playwright/test'

test.describe('Skill icons', () => {
  for (const pageUrl of ['/projects']) {
    test(`should change skill icons URL when theme changes in ${pageUrl} page`, async ({
      page,
    }) => {
      await page.goto(pageUrl)

      await page.evaluate(`window.localStorage.setItem('__theme', 'light')`)

      for (const image of await page.locator('img[src*=skillicons]').all()) {
        expect(await image.getAttribute('src')).toMatch(/theme=light/)
      }

      await page
        .getByRole('combobox', { name: /choose a theme/i })
        .selectOption('dark')

      for (const image of await page.locator('img[src*=skillicons]').all()) {
        expect(await image.getAttribute('src')).toMatch(/theme=dark/)
      }
    })
  }
})
