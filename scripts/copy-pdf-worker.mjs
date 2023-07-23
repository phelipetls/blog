// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * This is just a script to copy the pdfjs worker script into the public
 * folder, because I use pdfjs to preview my resumé.
 *
 * Astro does not seem to provide an obvious way to publish JavaScript files from
 * node_modules, in the same way that's possible in Hugo (say with .Publish)
 */
import fs from 'fs'
import path from 'path'
import * as url from 'url'

const dirname = url.fileURLToPath(new URL('.', import.meta.url))

fs.copyFileSync(
  path.join(dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js'),
  path.join(dirname, '../public/pdf.worker.min.js')
)
