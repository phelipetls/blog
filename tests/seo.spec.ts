import { test, expect } from '@playwright/test'

test.describe('SEO', () => {
  for (const lang of ['en', 'pt']) {
    test(`blog post should have open graph/twitter cards meta tags for images (in ${lang})`, async ({
      page,
      request,
    }) => {
      const urlPrefix = lang === 'pt' ? '/pt' : ''

      await page.goto(`${urlPrefix}/posts/demystifying-git-rebase`)

      const ogImageUrl =
        (await page
          .locator('head meta[property="og:image"]')
          .getAttribute('content')) ?? ''

      expect(ogImageUrl).toBe(
        lang === 'pt'
          ? 'https://phelipetls.github.io/pt/posts/demystifying-git-rebase/image.png'
          : 'https://phelipetls.github.io/posts/demystifying-git-rebase/image.png'
      )

      const ogImageResponse = await request.get(
        lang === 'pt'
          ? 'http://localhost:4321/pt/posts/demystifying-git-rebase/image.png'
          : 'http://localhost:4321/posts/demystifying-git-rebase/image.png'
      )
      expect(ogImageResponse.status()).toBe(200)

      const twitterImageUrl =
        (await page
          .locator('head meta[name="twitter:image"]')
          .getAttribute('content')) ?? ''

      expect(twitterImageUrl).toBe(
        lang === 'pt'
          ? 'https://phelipetls.github.io/pt/posts/demystifying-git-rebase/image.png'
          : 'https://phelipetls.github.io/posts/demystifying-git-rebase/image.png'
      )

      const twitterImageResponse = await request.get(
        lang === 'pt'
          ? 'http://localhost:4321/pt/posts/demystifying-git-rebase/image.png'
          : 'http://localhost:4321/posts/demystifying-git-rebase/image.png'
      )
      expect(twitterImageResponse.status()).toBe(200)

      await expect(
        page.locator('head meta[name="twitter:card"]')
      ).toHaveAttribute('content', 'summary_large_image')
    })
  }
})
