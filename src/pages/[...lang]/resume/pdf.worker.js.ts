import type { APIRoute } from 'astro'
import fs from 'node:fs'

export function getStaticPaths() {
  return [{ params: { lang: undefined } }, { params: { lang: '/pt' } }]
}

export const get: APIRoute = () => {
  return {
    headers: {
      'Content-Type': 'text/javascript',
    },
    body: fs.readFileSync(
      new URL(
        '../../../../node_modules/pdfjs-dist/build/pdf.worker.js',
        import.meta.url
      ),
      'utf-8'
    ),
  }
}
