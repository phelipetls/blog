import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.js'

const resumeContainer = document.querySelector('[data-resume]')
const resumeUrl = resumeContainer.dataset.resume
const resumeCanvas = document.querySelector('[data-resume-canvas]')
const resumeLoading = document.querySelector('[data-resume-loading]')
const resumeDownloadButton = document.querySelector(
  '[data-resume-download-button]'
)

resumeLoading.classList.replace('hidden', 'flex')
resumeDownloadButton.classList.replace('hidden', 'flex')

const pdfWorkerScript = document.createElement('script')
pdfWorkerScript.src = '/js/pdf.worker.js'
document.body.append(pdfWorkerScript)

pdfWorkerScript.onload = function () {
  pdfjsLib
    .getDocument(resumeUrl)
    .promise.then(function (pdf) {
      pdf.getPage(1).then(function (page) {
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

        const renderTask = page.render(renderContext)
        return renderTask.promise
      })
    })
    .catch(function () {
      resumeContainer.classList.add('hidden')
    })
    .then(function () {
      resumeCanvas.classList.remove('hidden')
      resumeLoading.classList.add('hidden')
    })
}
