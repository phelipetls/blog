import { test, expect } from '@playwright/test'

test.describe('SEO', () => {
  for (const lang of ['en', 'pt']) {
    test(`blog post should have open graph/twitter cards meta tags for images (in ${lang})`, async ({
      page,
      request,
    }) => {
      const urlPrefix = lang === 'pt' ? '/pt' : ''

      await page.goto(`${urlPrefix}/posts/demystifying-git-rebase`)

      const ogImageUrl = await page
        .locator('head meta[property="og:image"]')
        .getAttribute('content')
      expect(ogImageUrl).toBeTruthy()

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const ogImageResponse = await request.get(ogImageUrl!)
      expect(ogImageResponse.status()).toBe(200)

      const twitterImageUrl = await page
        .locator('head meta[name="twitter:image"]')
        .getAttribute('content')
      expect(twitterImageUrl).toBeTruthy()

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const twitterImageResponse = await request.get(twitterImageUrl!)
      expect(twitterImageResponse.status()).toBe(200)

      await expect(
        page.locator('head meta[name="twitter:card"]')
      ).toHaveAttribute('content', 'summary_large_image')
    })
  }
})
