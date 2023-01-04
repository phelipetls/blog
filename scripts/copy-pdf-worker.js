// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * This is just a script to copy the pdfjs worker script into the public
 * folder, because I use pdfjs to preview my resumé.
 *
 * Astro does not seem to provide an obvious way to publish JavaScript files from
 * node_modules, in the same way that's possible in Hugo (say with .Publish)
 */
const fs = require('fs')
const path = require('path')

fs.copyFileSync(
  path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js'),
  path.join(__dirname, '../public/pdf.worker.min.js')
)
