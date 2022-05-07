import PDFObject from 'pdfobject'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
import * as pdfjsLib from 'pdfjs-dist'

const resumeLoading = document.querySelector('[data-resume-loading]')
const resumeContainer = document.querySelector('[data-resume]')
const resumeCanvas = document.querySelector('[data-resume-canvas]')
const resumeDownloadButton = document.querySelector(
  '[data-resume-download-button]'
)

const resumeUrl = resumeContainer.dataset.resume

if (PDFObject.supportsPDFs) {
  PDFObject.embed(resumeUrl, resumeContainer)
} else {
  ;(async function () {
    try {
      resumeDownloadButton.classList.remove('hidden')

      const pdf = await pdfjsLib.getDocument(resumeUrl).promise
      const page = await pdf.getPage(1)

      const scale =
        resumeContainer.clientWidth / page.getViewport({ scale: 1 }).width
      const viewport = page.getViewport({ scale })
      const outputScale = window.devicePixelRatio || 1

      const context = resumeCanvas.getContext('2d')

      resumeCanvas.width = Math.floor(viewport.width * outputScale)
      resumeCanvas.height = Math.floor(viewport.height * outputScale)
      resumeCanvas.style.width = Math.floor(viewport.width) + 'px'
      resumeCanvas.style.height = Math.floor(viewport.height) + 'px'

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null

      const renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport,
      }

      page.render(renderContext)
    } finally {
      resumeLoading.classList.add('hidden')
    }
  })()
}
