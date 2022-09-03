import { computePosition, offset, shift, arrow } from '@floating-ui/dom'
import * as params from '@params'

const clipboardIconSvg = params.clipboardIcon

const tooltip = document.querySelector('[data-theme-copy-code-tooltip]')
const tooltipArrow = document.querySelector(
  '[data-theme-copy-code-tooltip-arrow]'
)

function createCopyCodeButton() {
  const button = document.createElement('button')

  button.classList.add(
    'btn',
    'btn-icon',
    'btn-icon-action',
    'pointer-events-none',
    'group-hover:pointer-events-auto',
    'opacity-0',
    'group-hover:opacity-100',
    'absolute',
    'right-0',
    '-translate-x-1/2',
    'top-3',
    'transition',
    'transition-opacity',
    'duration-500'
  )
  button.setAttribute('aria-label', params.copyCodeButtonLabel)

  button.innerHTML = clipboardIconSvg

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

  return button
}

function wrapAroundElement(wrapper, element) {
  element.insertAdjacentElement('afterend', wrapper)
  wrapper.append(element)
}

function isHighlightedCodeBlock(element) {
  const parentElement = element.parentElement
  return parentElement.classList.contains('highlight')
}

const codeBlocks = document.querySelectorAll('pre')

for (const codeBlock of codeBlocks) {
  let codeBlockParent = codeBlock.parentElement

  if (!isHighlightedCodeBlock(codeBlock)) {
    const wrapper = document.createElement('div')
    wrapAroundElement(wrapper, codeBlock)
    codeBlockParent = wrapper
  }

  codeBlockParent.classList.add('relative', 'group')
  codeBlock.append(createCopyCodeButton())
}
