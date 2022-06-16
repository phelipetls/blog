import PDFObject from 'pdfobject'

const resumeContainer = document.querySelector('[data-resume]')
const resumeUrl = resumeContainer.dataset.resume

if (PDFObject.supportsPDFs) {
  PDFObject.embed(resumeUrl, resumeContainer)
} else {
  const resumeJsScript = document.createElement('script')
  resumeJsScript.src = '/js/resume-pdfjs.js'
  document.body.append(resumeJsScript)
}
