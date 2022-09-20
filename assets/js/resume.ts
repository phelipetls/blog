import * as PDFObject from 'pdfobject'
import * as params from '@params'

declare module '@params' {
  export const pdfjsWorkerUrl: string
  export const resumePdfjsUrl: string
}

const resumeContainer = document.querySelector<HTMLElement>(
  '[data-resume-container]'
)
const resumeUrl = resumeContainer?.dataset.resumeUrl || ''

const resumeLoading = document.querySelector('[data-resume-loading]')
const resumeDownloadButton = document.querySelector(
  '[data-resume-download-button]'
)

if (PDFObject.supportsPDFs) {
  PDFObject.embed(resumeUrl, resumeContainer)
} else {
  resumeLoading?.classList.replace('hidden', 'flex')
  resumeDownloadButton?.classList.replace('hidden', 'flex')

  const pdfWorkerScript = document.createElement('script')
  pdfWorkerScript.src = params.pdfjsWorkerUrl
  document.body.append(pdfWorkerScript)

  const resumePdfjsScript = document.createElement('script')
  resumePdfjsScript.src = params.resumePdfjsUrl
  document.body.append(resumePdfjsScript)
}
