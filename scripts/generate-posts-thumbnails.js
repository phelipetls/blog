/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const puppeteer = require('puppeteer')
const hugoConfig = require('../config.json')

generateThumbnails(
  'http://localhost:1313/posts/thumbnails.json',
  hugoConfig.languages.en.images[0]
)
generateThumbnails(
  'http://localhost:1313/pt/posts/thumbnails.json',
  hugoConfig.languages.pt.images[0]
)

async function generateThumbnails(thumbnailsUrl, screenshotFilename) {
  const response = await fetch(thumbnailsUrl)
  const thumbnails = await response.json()

  const browser = await puppeteer.launch({
    headless: true,
  })
  const page = await browser.newPage()

  for (const thumbnail of thumbnails) {
    await page.goto(thumbnail.url, {
      waitUntil: 'networkidle2',
    })

    let screenshotPath

    // In production, save screenshots in page bundles, with thumbnail in its
    // name, to make Hugo's internal templates for Open Graph and Twitter Cards
    // use it.
    if (process.env.NODE_ENV === 'production') {
      screenshotPath = path.join(
        __dirname,
        '..',
        'content',
        path.join(thumbnail.dir),
        screenshotFilename
      )
    } else {
      // In development, save them all in the same folder so we can easily see
      // how all of them look at once
      const SCREENSHOTS_DIRECTORY_DEV = 'thumbnail-screenshots'

      if (!fs.existsSync(SCREENSHOTS_DIRECTORY_DEV)) {
        fs.mkdirSync(SCREENSHOTS_DIRECTORY_DEV)
      }

      screenshotPath = path.join(
        SCREENSHOTS_DIRECTORY_DEV,
        `${path.basename(thumbnail.dir)}.png`
      )
    }

    if (fs.existsSync(screenshotPath)) {
      console.log('Skipping overwriting thumbnail %s', screenshotPath)
      continue
    }

    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    })

    console.log(
      'Saved screenshot for %s in %s',
      new URL(thumbnail.url).pathname,
      screenshotPath.replace(path.join(__dirname, '..'), '')
    )
  }

  await browser.close()
}
