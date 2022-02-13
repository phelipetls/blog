import PDFObject from 'pdfobject'

const pdfContainer = document.querySelector('.resume-pdf')

if (PDFObject.supportsPDFs) {
  const resumeUrl = pdfContainer.dataset.resume

  PDFObject.embed(resumeUrl, pdfContainer, {
    height: '100vh'
  })

  pdfContainer.classList.remove('hidden')
} else {
  const pdfFallback = document.querySelector('.resume-pdf-fallback')

  pdfContainer.classList.add('hidden')
  pdfFallback.classList.remove('hidden')
}

const pdfLoading = document.querySelector('.resume-loading')
pdfLoading.classList.add('hidden')
