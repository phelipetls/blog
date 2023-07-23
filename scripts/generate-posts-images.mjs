// @ts-check
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import playwright from 'playwright'
import * as url from 'url'
import z from 'zod'

const rootDir = url.fileURLToPath(new URL('..', import.meta.url))

const DEV = process.env.NODE_ENV === 'development'

await Promise.all([
  generatePostsImages({
    postsImagesUrl: 'http://localhost:3000/posts/images.json',
    getScreenshotPath: (image) => {
      if (DEV) {
        return path.join(rootDir, 'screenshots', `${image}.png`)
      }
      return path.join(rootDir, 'public', 'posts', image, 'image.png')
    },
  }),
  generatePostsImages({
    postsImagesUrl: 'http://localhost:3000/pt/posts/images.json',
    getScreenshotPath: (image) => {
      if (DEV) {
        return path.join(rootDir, 'screenshots', `${image}.pt.png`)
      }
      return path.join(rootDir, 'public', 'pt', 'posts', image, 'image.png')
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

  const postImageSchema = z.object({
    url: z.string(),
    name: z.string(),
  })

  /** @type {(() => void)[]} */
  const writeFileOperations = []

  for (const /** @type {unknown} */ postImage of postsImages) {
    const result = postImageSchema.safeParse(postImage)

    if (!result.success) {
      console.error('Malformed JSON payload: %s', result.error)
      process.exit(1)
    }

    const { name, url } = result.data

    await page.goto(url, { waitUntil: 'networkidle' })
    const screenshot = await page.screenshot()

    const screenshotPath = getScreenshotPath(name)

    writeFileOperations.push(() => {
      if (fs.existsSync(screenshotPath)) {
        console.log(
          'Skipping %s because screenshot already exists...',
          screenshotPath
        )
        return
      }

      if (!fs.existsSync(path.dirname(screenshotPath))) {
        fs.mkdirSync(path.dirname(screenshotPath), { recursive: true })
      }

      fs.writeFileSync(screenshotPath, screenshot)

      console.log(
        'Saved screenshot for %s in %s',
        new URL(url).pathname,
        stripRootDir(screenshotPath)
      )
    })
  }

  await context.close()
  await browser.close()

  // Delay saving the screeenshot into the file system so that the Astro dev
  // server does not slow down and fail to send the file when we request it to
  // screenshot it.
  for (const writeFileOperation of writeFileOperations) {
    writeFileOperation()
  }
}

/**
 * @type {(filePath: string) => string}
 */
function stripRootDir(filePath) {
  return filePath.replace(rootDir, '')
}
