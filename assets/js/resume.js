import PDFObject from 'pdfobject'
import * as params from '@params'

const resumeContainer = document.querySelector('[data-resume]')
const resumeUrl = resumeContainer.dataset.resume

if (PDFObject.supportsPDFs) {
  PDFObject.embed(resumeUrl, resumeContainer)
} else {
  const resumePdfjsScript = document.createElement('script')
  resumePdfjsScript.src = params.resumePdfjsUrl
  document.body.append(resumePdfjsScript)
}
