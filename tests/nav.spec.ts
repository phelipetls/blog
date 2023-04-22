import { test, expect } from '@playwright/test'
import { cartesianProduct } from '@utils/tests'

test.describe('Navbar', () => {
  const matrix = cartesianProduct(
    ['desktop', 'mobile'],
    ['pt', 'en'],
    ['/', '/posts']
  )

  for (const [viewport, lang, pathname] of matrix) {
    if (viewport === 'mobile') {
      test.use({ viewport: { width: 375, height: 667 } })
    }

    const urlPrefix = lang === 'pt' ? '/pt' : ''
    const url = urlPrefix + pathname

    test(`should highlight link for ${url} in nav (on ${viewport})`, async ({
      page,
    }) => {
      await page.goto(url)

      if (viewport === 'mobile') {
        await page.getByTestId('open-sidenav').click()
      }

      const nav = page.getByRole('navigation', {
        name: lang === 'pt' ? /navegação principal/i : /main navigation/i,
      })

      for (const link of await nav.locator('a').all()) {
        if ((await link.getAttribute('href')) === url) {
          await expect(link).toHaveAttribute('aria-current', 'page')
          await expect(link).toHaveClass(/bg-primary/)
        } else {
          await expect(link).not.toHaveAttribute('aria-current', 'page')
          await expect(link).not.toHaveClass(/bg-primary/)
        }
      }
    })
  }
})
