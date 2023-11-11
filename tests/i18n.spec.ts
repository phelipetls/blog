import { test, expect } from '@playwright/test'

test.describe('Internationalization', () => {
  const toPortugueseUrls = [
    ['/', '/pt/'],
    ['/posts', '/pt/posts'],
    ['/posts/demystifying-git-rebase', '/pt/posts/demystifying-git-rebase'],
    ['/tags/git', '/pt/tags/git'],
  ]

  toPortugueseUrls.forEach(([initial, expected]) => {
    test(`should be able to switch to portuguese (from ${initial} to ${expected})`, async ({
      page,
    }) => {
      await page.goto(initial)

      await page
        .getByRole('combobox', { name: 'Choose a language' })
        .selectOption({ label: 'Português' })

      await expect(page).toHaveURL(expected)
    })
  })

  const toEnglishUrls = [
    ['/pt', '/'],
    ['/pt/posts', '/posts'],
    ['/pt/posts/demystifying-git-rebase', '/posts/demystifying-git-rebase'],
    ['/pt/tags/git', '/tags/git'],
  ]

  toEnglishUrls.forEach(([initial, expected]) => {
    test(`should be able to switch to english (from url ${initial} to ${expected})`, async ({
      page,
    }) => {
      await page.goto(initial)

      await page
        .getByRole('combobox', { name: 'Escolha a linguagem' })
        .selectOption({ label: 'English' })

      await expect(page).toHaveURL(expected)
    })
  })

  test("shouldn't have language switcher if page is not translated", async ({
    page,
  }) => {
    await page.goto('/posts/deriving-types-from-data-typescript')

    await expect(
      page.getByRole('combobox', {
        name: 'Choose a language',
      })
    ).toBeHidden()
  })
})
