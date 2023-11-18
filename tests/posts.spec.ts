import { test, expect } from '@playwright/test'
import { cartesianProduct } from '@utils/tests'

test.describe('Posts', () => {
  for (const [path, lang] of cartesianProduct(
    ['/posts', '/tags/git'],
    ['en', 'pt']
  )) {
    test(`blog post should have correct link (in ${lang} and ${path})`, async ({
      page,
    }) => {
      const urlPrefix = lang === 'pt' ? '/pt' : ''

      await page.goto(`${urlPrefix}${path}`)

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

  test('english blog post should have a link to edit on GitHub', async ({
    page,
  }) => {
    await page.goto('/posts/demystifying-git-rebase')
    await expect(page.getByText('Why learn git rebase?').first()).toBeVisible()

    await page.getByRole('link', { name: /edit on github/i }).click()
    await expect(page).toHaveURL(
      `https://github.com/phelipetls/blog/blob/master/src/content/posts/demystifying-git-rebase/index.mdx`
    )
    await expect(page.getByText('Why learn `git rebase`?')).toBeVisible()
  })

  test('portuguese blog post should have a link to edit on GitHub', async ({
    page,
  }) => {
    await page.goto('/pt/posts/demystifying-git-rebase')
    await expect(
      page.getByText('Por que aprender git rebase?').first()
    ).toBeVisible()

    await page.getByRole('link', { name: /editar no github/i }).click()
    await expect(page).toHaveURL(
      `https://github.com/phelipetls/blog/blob/master/src/content/posts/demystifying-git-rebase/index.pt.mdx`
    )
    await expect(page.getByText('Por que aprender `git rebase`?')).toBeVisible()
  })
})
