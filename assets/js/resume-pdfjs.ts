import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
import * as params from '@params'

// FIXME: this compiles only because I already augmented the @params module in
// another, but I wish it would compile only after I augmented the module
// locally, but not sure if possible
pdfjsLib.GlobalWorkerOptions.workerSrc = params.pdfjsWorkerUrl

const resumeContainer = document.querySelector<HTMLElement>(
  '[data-resume-container]'
)
const resumeUrl = resumeContainer?.dataset.resumeUrl
const resumeCanvas = document.querySelector<HTMLCanvasElement>(
  '[data-resume-canvas]'
)
const resumeLoading = document.querySelector('[data-resume-loading]')

;(() => {
  if (!resumeUrl || !resumeCanvas) {
    return
  }

  pdfjsLib
    .getDocument(resumeUrl)
    .promise.then(function (pdf) {
      pdf.getPage(1).then(function (page) {
        const scale =
          resumeContainer.clientWidth / page.getViewport({ scale: 1 }).width
        const viewport = page.getViewport({ scale })
        const outputScale = window.devicePixelRatio || 1

        const context = resumeCanvas.getContext('2d')

        if (!context) {
          return
        }

        resumeCanvas.width = Math.floor(viewport.width * outputScale)
        resumeCanvas.height = Math.floor(viewport.height * outputScale)
        resumeCanvas.style.width = Math.floor(viewport.width) + 'px'
        resumeCanvas.style.height = Math.floor(viewport.height) + 'px'

        const transform = [outputScale, 0, 0, outputScale, 0, 0]

        const renderTask = page.render({
          canvasContext: context,
          transform: transform,
          viewport: viewport,
        })
        return renderTask.promise
      })
    })
    .catch(function () {
      resumeContainer.classList.add('hidden')
    })
    .then(function () {
      resumeCanvas.classList.remove('hidden')
      resumeLoading?.classList.add('hidden')
    })
})()
