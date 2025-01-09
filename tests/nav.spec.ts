import { test, expect } from '@playwright/test'

test.describe('Navbar', () => {
  test.describe('Desktop', () => {
    test.describe('English', () => {
      test(`should highlight about page link in nav`, async ({ page }) => {
        await page.goto('/')

        const nav = page.getByRole('navigation', {
          name: /main navigation/i,
        })

        const aboutPageLink = nav.getByRole('link', { name: 'About' })
        const postsLink = nav.getByRole('link', { name: 'Posts' })

        await expect(aboutPageLink).toHaveAttribute('aria-current', 'page')
        await expect(postsLink).not.toHaveAttribute('aria-current', 'page')
      })

      test(`should highlight posts page link in nav`, async ({ page }) => {
        await page.goto('/posts')

        const nav = page.getByRole('navigation', {
          name: /main navigation/i,
        })

        const aboutPageLink = nav.getByRole('link', { name: 'About' })
        const postsLink = nav.getByRole('link', { name: 'Posts' })

        await expect(postsLink).toHaveAttribute('aria-current', 'page')
        await expect(aboutPageLink).not.toHaveAttribute('aria-current', 'page')
      })
    })

    test.describe('Portuguese', () => {
      test(`should highlight about page link in nav`, async ({ page }) => {
        await page.goto('/pt')

        const nav = page.getByRole('navigation', {
          name: /navegação principal/i,
        })

        const aboutPageLink = nav.getByRole('link', { name: 'Sobre' })
        const postsLink = nav.getByRole('link', { name: 'Posts' })

        await expect(aboutPageLink).toHaveAttribute('aria-current', 'page')
        await expect(postsLink).not.toHaveAttribute('aria-current', 'page')
      })

      test(`should highlight posts page link in nav`, async ({ page }) => {
        await page.goto('/pt/posts')

        const nav = page.getByRole('navigation', {
          name: /navegação principal/i,
        })

        const aboutPageLink = nav.getByRole('link', { name: 'Sobre' })
        const postsLink = nav.getByRole('link', { name: 'Posts' })

        await expect(postsLink).toHaveAttribute('aria-current', 'page')
        await expect(aboutPageLink).not.toHaveAttribute('aria-current', 'page')
      })
    })
  })

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test.describe('English', () => {
      test(`should highlight about page link in nav`, async ({ page }) => {
        await page.goto('/')
        await page.getByTestId('open-sidenav').click()

        const nav = page.getByRole('navigation', {
          name: /main navigation/i,
        })

        const aboutPageLink = nav.getByRole('link', { name: 'About' })
        const postsLink = nav.getByRole('link', { name: 'Posts' })

        await expect(aboutPageLink).toHaveAttribute('aria-current', 'page')
        await expect(postsLink).not.toHaveAttribute('aria-current', 'page')
      })

      test(`should highlight posts page link in nav`, async ({ page }) => {
        await page.goto('/posts')
        await page.getByTestId('open-sidenav').click()

        const nav = page.getByRole('navigation', {
          name: /main navigation/i,
        })

        const aboutPageLink = nav.getByRole('link', { name: 'About' })
        const postsLink = nav.getByRole('link', { name: 'Posts' })

        await expect(postsLink).toHaveAttribute('aria-current', 'page')
        await expect(aboutPageLink).not.toHaveAttribute('aria-current', 'page')
      })
    })

    test.describe('Portuguese', () => {
      test(`should highlight about page link in nav`, async ({ page }) => {
        await page.goto('/pt')
        await page.getByTestId('open-sidenav').click()

        const nav = page.getByRole('navigation', {
          name: /navegação principal/i,
        })

        const aboutPageLink = nav.getByRole('link', { name: 'Sobre' })
        const postsLink = nav.getByRole('link', { name: 'Posts' })

        await page.pause()

        await expect(aboutPageLink).toHaveAttribute('aria-current', 'page')
        await expect(postsLink).not.toHaveAttribute('aria-current', 'page')
      })

      test(`should highlight posts page link in nav`, async ({ page }) => {
        await page.goto('/pt/posts')
        await page.getByTestId('open-sidenav').click()

        const nav = page.getByRole('navigation', {
          name: /navegação principal/i,
        })

        const aboutPageLink = nav.getByRole('link', { name: 'Sobre' })
        const postsLink = nav.getByRole('link', { name: 'Posts' })

        await expect(postsLink).toHaveAttribute('aria-current', 'page')
        await expect(aboutPageLink).not.toHaveAttribute('aria-current', 'page')
      })
    })
  })
})
