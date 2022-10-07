/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const puppeteer = require('puppeteer')
const hugoConfig = require('../config.json')

generatePostsImages({
  postsImagesUrl: 'http://localhost:1313/posts/images.json',
  screenshotFilename: hugoConfig.languages.en.params.postImageFilename,
})

generatePostsImages({
  postsImagesUrl: 'http://localhost:1313/pt/posts/images.json',
  screenshotFilename: hugoConfig.languages.pt.params.postImageFilename,
})

async function generatePostsImages({ postsImagesUrl, screenshotFilename }) {
  const response = await fetch(postsImagesUrl)
  const postsImages = await response.json()

  const browser = await puppeteer.launch({
    headless: true,
  })
  const page = await browser.newPage()

  page.setViewport({
    width: 1200,
    height: 630,
  })

  for (const postImage of postsImages) {
    await page.goto(postImage.url, {
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
        postImage.dir,
        screenshotFilename
      )
    } else {
      // In development, save them all in the same folder so we can easily see
      // how all of them look at once
      const SCREENSHOTS_DIRECTORY_DEV = 'post-images-screenshots'

      if (!fs.existsSync(SCREENSHOTS_DIRECTORY_DEV)) {
        fs.mkdirSync(SCREENSHOTS_DIRECTORY_DEV)
      }

      screenshotPath = path.join(
        SCREENSHOTS_DIRECTORY_DEV,
        `${path.basename(postImage.dir)}.png`
      )
    }

    if (fs.existsSync(screenshotPath)) {
      console.log('Screenshot %s already exists. Skipping...', screenshotPath)
      continue
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
