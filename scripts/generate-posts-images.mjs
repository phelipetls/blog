// @ts-check
import fs from 'fs'
import path from 'path'
import playwright from 'playwright'
import * as url from 'url'

const rootDir = url.fileURLToPath(new URL('..', import.meta.url))

const DEV = process.env.NODE_ENV === 'development'

console.log('Preparing Playwright to generate posts images...')

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

/** @typedef {() => void} NoOp */
/** @type {NoOp[]} */
const operations = []

for (const {
  name,
  url,
  getScreenshotPath,
} of await getPostImagesToScreenshot()) {
  await page.goto(url, { waitUntil: 'networkidle' })

  const screenshot = await page.screenshot()
  const screenshotPath = getScreenshotPath(name)

  const blogPostPath = new URL(url).pathname

  operations.push(() => {
    saveScreenshot(screenshot, screenshotPath)

    console.log(
      'Saved post image for %s in path %s',
      blogPostPath,
      stripRootDir(screenshotPath)
    )
  })

  console.log(`Prepared image of post ${blogPostPath}`)
}

for (const operation of operations) {
  operation()
}

await context.close()
await browser.close()

/**
 * @typedef {object} PostImage
 * @property {string} url
 * @property {string} name
 */

async function fetchPostImages(/** @type {string} */ url) {
  const response = await fetch(url)
  const json = response.json()
  return /** @type {PostImage[]} */ json
}

/**
 * @typedef {PostImage} PostImageToScrenshot
 * @property {(name: string) => name} getScrenshotPath
 */

export async function getPostImagesToScreenshot() {
  const [englishPostImages, portuguesePostImages] = await Promise.all([
    fetchPostImages('http://localhost:4321/posts/images.json'),
    fetchPostImages('http://localhost:4321/pt/posts/images.json'),
  ])

  return [
    ...englishPostImages.map((/** @type {PostImage} */ postImage) => ({
      ...postImage,
      getScreenshotPath: () => {
        if (DEV) {
          return path.join(rootDir, 'screenshots', `${postImage.name}.png`)
        }
        return path.join(
          rootDir,
          'public',
          'posts',
          postImage.name,
          'image.png'
        )
      },
    })),
    ...portuguesePostImages.map((/** @type {PostImage} */ postImage) => ({
      ...postImage,
      getScreenshotPath: () => {
        if (DEV) {
          return path.join(rootDir, 'screenshots', `${postImage.name}.pt.png`)
        }
        return path.join(
          rootDir,
          'public',
          'pt',
          'posts',
          postImage.name,
          'image.png'
        )
      },
    })),
  ]
}

/** @type {(screenshot: Buffer, filePath: string) => void} */
function saveScreenshot(screenshot, filePath) {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
  }

  fs.writeFileSync(filePath, screenshot)
}

/**
 * @type {(filePath: string) => string}
 */
function stripRootDir(filePath) {
  return filePath.replace(rootDir, '')
}
