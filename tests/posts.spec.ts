import { test, expect } from '@playwright/test'

test.describe('Posts', () => {
  for (const lang of ['en', 'pt']) {
    test(`blog post should have correct link (in ${lang})`, async ({
      page,
    }) => {
      const urlPrefix = lang === 'pt' ? '/pt' : ''

      await page.goto(`${urlPrefix}/posts`)

      if (lang === 'pt') {
        await expect(
          page.getByRole('link', { name: 'Desmistificando git rebase' })
        ).toHaveAttribute('href', `/pt/posts/demystifying-git-rebase`)
      } else {
        await expect(
          page.getByRole('link', { name: 'Demystifying git rebase' })
        ).toHaveAttribute('href', `/posts/demystifying-git-rebase`)
      }
    })
  }
})
