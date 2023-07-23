// @ts-check
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import playwright from 'playwright'
import * as url from 'url'

const dirname = url.fileURLToPath(new URL('.', import.meta.url))

await Promise.all([
  generatePostsImages({
    postsImagesUrl: 'http://localhost:3000/posts/images.json',
    getScreenshotPath: (image) => {
      if (process.env.NODE_ENV === 'development') {
        return createPath('screenshots', `${image}.png`)
      }
      return createPath('public', 'posts', image, 'image.png')
    },
  }),
  generatePostsImages({
    postsImagesUrl: 'http://localhost:3000/pt/posts/images.json',
    getScreenshotPath: (image) => {
      if (process.env.NODE_ENV === 'development') {
        return createPath('screenshots', `${image}.pt.png`)
      }
      return createPath('public', 'pt', 'posts', image, 'image.png')
    },
  }),
])

/**
 * @typedef Options
 * @property {string} postsImagesUrl
 * @property {(name: string) => string} getScreenshotPath
 */

/**
 * @type {(options: Options) => Promise<void>}
 */
async function generatePostsImages({ postsImagesUrl, getScreenshotPath }) {
  const response = await fetch(postsImagesUrl)
  const postsImages = await response.json()

  const browser = await playwright.chromium.launch()
  const context = await browser.newContext(playwright.devices['Desktop Chrome'])
  const page = await context.newPage()

  page.on('requestfailed', (request) => {
    throw new Error(
      `Failed to generate post image due to request failure: ${
        request.failure()?.errorText
      }`
    )
  })

  for (const postImage of postsImages) {
    await page.goto(postImage.url, { waitUntil: 'networkidle' })

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
      stripDirname(screenshotPath)
    )
  }

  await context.close()
  await browser.close()
}

/**
 * @type {(...args: string[]) => string}
 */
function createPath(...args) {
  return path.join(dirname, '..', ...args)
}

/**
 * @type {(filePath: string) => string}
 */
function stripDirname(filePath) {
  return filePath.replace(path.join(dirname, '..'), '')
}
