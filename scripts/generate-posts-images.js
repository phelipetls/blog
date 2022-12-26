// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const puppeteer = require('puppeteer')

;(async () => {
  try {
    /**
     * @type {(...args: string[]) => string}
     */
    const createPath = (...args) => {
      return path.join(__dirname, '..', ...args)
    }

    await generatePostsImages({
      postsImagesUrl: 'http://localhost:3000/posts/images.json',
      getScreenshotPath: (image) => {
        if (process.env.NODE_ENV === 'development') {
          return createPath('screenshots', `${image}.png`)
        }

        return createPath('public', 'posts', image, 'image.png')
      },
    })

    await generatePostsImages({
      postsImagesUrl: 'http://localhost:3000/pt/posts/images.json',
      getScreenshotPath: (image) => {
        if (process.env.NODE_ENV === 'development') {
          return createPath('screenshots', `${image}.pt.png`)
        }

        return createPath('public', 'pt', 'posts', image, 'image.png')
      },
    })

    process.exit(0)
  } catch (err) {
    if (err instanceof Error) {
      console.error(err)
    }
    process.exit(1)
  }
})()

/**
 * @typedef Options
 * @property {string} postsImagesUrl
 * @property {(name: string) => string} getScreenshotPath
 */

/**
 * @type {(options: Options) => Promise<void>}
 */
async function generatePostsImages({ postsImagesUrl, getScreenshotPath }) {
  const response = await fetch.default(postsImagesUrl)
  const postsImages = await response.json()

  const browser = await puppeteer.launch({
    headless: true,
  })
  const page = await browser.newPage()

  page.on('requestfailed', (request) => {
    throw new Error(
      `Failed to generate post image due to request failure: ${
        request.failure().errorText
      }`
    )
  })

  page.setViewport({
    width: 1200,
    height: 630,
  })

  for (const postImage of postsImages) {
    await page.goto(postImage.url, {
      waitUntil: 'networkidle2',
    })

    const screenshotPath = getScreenshotPath(postImage.name)

    if (fs.existsSync(screenshotPath)) {
      console.log(
        'Skipping %s because screenshot already exists...',
        screenshotPath
      )
      continue
    }

    if (!fs.existsSync(path.dirname(screenshotPath))) {
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true })
    }

    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    })

    console.log(
      'Saved screenshot for %s in %s',
      new URL(postImage.url).pathname,
      screenshotPath.replace(path.join(__dirname, '..'), '')
    )
  }

  await browser.close()
}
