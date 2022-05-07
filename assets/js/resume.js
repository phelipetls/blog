import PDFObject from 'pdfobject'

const resumeLoading = document.querySelector('[data-resume-loading]')
const resumeContainer = document.querySelector('[data-resume]')
const resumeFallback = document.querySelector('[data-resume-fallback]')

if (PDFObject.supportsPDFs) {
  const resumeUrl = resumeContainer.dataset.resume

  PDFObject.embed(resumeUrl, resumeContainer)
} else {
  resumeContainer.classList.add('hidden')
  resumeFallback.classList.remove('hidden')
}

resumeLoading.classList.add('hidden')
