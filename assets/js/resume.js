import PDFObject from 'pdfobject'
import * as params from '@params'

const resumeContainer = document.querySelector('[data-resume]')
const resumeUrl = resumeContainer.dataset.resume

const resumeLoading = document.querySelector('[data-resume-loading]')
const resumeDownloadButton = document.querySelector(
  '[data-resume-download-button]'
)

if (PDFObject.supportsPDFs) {
  PDFObject.embed(resumeUrl, resumeContainer)
} else {
  resumeLoading.classList.replace('hidden', 'flex')
  resumeDownloadButton.classList.replace('hidden', 'flex')

  const pdfWorkerScript = document.createElement('script')
  pdfWorkerScript.src = params.pdfjsWorkerUrl
  document.body.append(pdfWorkerScript)

  const resumePdfjsScript = document.createElement('script')
  resumePdfjsScript.src = params.resumePdfjsUrl
  document.body.append(resumePdfjsScript)
}
