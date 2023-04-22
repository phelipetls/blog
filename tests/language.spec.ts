import { test, expect } from '@playwright/test'

test.describe('Multi-language', () => {
  const toPortugueseUrls = [
    ['/', '/pt/'],
    ['/posts', '/pt/posts'],
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
})
