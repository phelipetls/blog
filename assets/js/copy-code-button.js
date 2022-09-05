import { computePosition, offset, shift, arrow } from '@floating-ui/dom'

const copyCodeButtons = document.querySelectorAll('[data-copy-code-button]')

for (const copyCodeButton of copyCodeButtons) {
  copyCodeButton.classList.remove('hidden')
  addEventHandlersToCopyCodeButton(copyCodeButton)
}

const tooltip = document.querySelector('[data-theme-copy-code-tooltip]')
const tooltipArrow = document.querySelector(
  '[data-theme-copy-code-tooltip-arrow]'
)

function addEventHandlersToCopyCodeButton(button) {
  button.addEventListener('focus', function () {
    button.classList.add('opacity-100')
    button.classList.remove('pointer-events-none')
  })

  button.addEventListener('blur', function () {
    button.classList.remove('opacity-100')
    button.classList.add('pointer-events-none')
  })

  button.addEventListener('click', async function () {
    const codeBlock = button.parentElement.querySelector('pre code')
    await navigator.clipboard.writeText(codeBlock.textContent.trimEnd())

    const { x, y, middlewareData } = await computePosition(button, tooltip, {
      placement: 'top',
      middleware: [
        shift({ padding: 8 }),
        offset(8),
        arrow({ element: tooltipArrow }),
      ],
    })

    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`,
      animation: 'tooltip-animation 1.5s',
    })

    setTimeout(() => {
      Object.assign(tooltip.style, {
        left: '0px',
        top: '0px',
        animation: '',
      })
    }, 1000)

    const { x: arrowX, y: arrowY } = middlewareData.arrow

    Object.assign(tooltipArrow.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      bottom: '-4px',
    })
  })
}
