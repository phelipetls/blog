// @ts-check
import { computePosition, shift, offset } from '@floating-ui/dom'

/**
 * @type {(listbox: HTMLElement) => NodeListOf<HTMLElement>}
 */
export function getOptions(listbox) {
  return listbox.querySelectorAll('[role="option"]')
}

/**
 * @type {(listbox: HTMLElement) => HTMLElement}
 */
function getActiveDescendant(listbox) {
  let activeDescendant

  getOptions(listbox).forEach(function (item) {
    if (item.id === listbox.getAttribute('aria-activedescendant')) {
      activeDescendant = item
    }
  })

  return activeDescendant
}

/**
 * @type {(listbox: HTMLElement) => HTMLElement}
 */
function getSelectedOption(listbox) {
  let selectedListboxitem

  getOptions(listbox).forEach(function (item) {
    if (item.getAttribute('aria-selected') === 'true') {
      selectedListboxitem = item
    }
  })

  return selectedListboxitem
}

const focusedStyle = ['bg-background']
const selectedStyle = ['text-primary']

/**
 * @type {(item: HTMLElement) => void}
 */
function applyFocusedStyle(item) {
  item.classList.add(...focusedStyle)
}

/**
 * @type {(item: HTMLElement) => void}
 */
function removeFocusedStyle(item) {
  item.classList.remove(...focusedStyle)
}

/**
 * @type {(item: HTMLElement) => void}
 */
function applySelectedStyle(item) {
  item.classList.add(...selectedStyle)
}

/**
 * @type {(item: HTMLElement) => void}
 */
function removeSelectedStyle(item) {
  item.classList.remove(...selectedStyle)
}

/**
 * @type {(listbox: HTMLElement, targetItem: EventTarget) => void}
 */
function focusOption(listbox, targetOption) {
  getOptions(listbox).forEach(function (option) {
    if (option !== targetOption) {
      removeFocusedStyle(option)
    } else {
      applyFocusedStyle(option)
      listbox.setAttribute('aria-activedescendant', option.id)
    }
  })
}

/**
 * @type {(listbox: HTMLElement, targetItem: EventTarget) => void}
 */
function selectOption(listbox, targetItem) {
  getOptions(listbox).forEach(function (item) {
    if (item === targetItem) {
      item.setAttribute('aria-selected', 'true')
      applySelectedStyle(item)
    } else {
      item.removeAttribute('aria-selected')
      removeSelectedStyle(item)
    }
  })
}

/**
 * @type {(element: HTMLElement, duration: number) => void}
 */
function fadeIn(element, duration) {
  element.style.transition = `visibility 0s linear, opacity ${duration}ms`
  element.style.pointerEvents = 'auto'
  element.style.opacity = '1'
  element.style.visibility = 'visible'
}

/**
 * @type {(element: HTMLElement, duration: number) => void}
 */
function fadeOut(element, duration) {
  element.style.transition = `visibility 0s linear ${duration}ms, opacity ${duration}ms`
  element.style.pointerEvents = 'none'
  element.style.opacity = '0'
  element.style.visibility = 'hidden'
}

/**
 * @type {(listbox: HTMLElement, button: HTMLButtonElement) => void}
 */
function showListbox(listbox, button) {
  button.setAttribute('aria-expanded', 'true')

  fadeIn(listbox, 500)
  listbox.focus()

  const selectedListboxItem = getSelectedOption(listbox)
  if (selectedListboxItem) {
    focusOption(listbox, selectedListboxItem)
  }
}

/**
 * @type {(listbox: HTMLElement, button: HTMLButtonElement) => void}
 */
function hideListbox(listbox, button) {
  fadeOut(listbox, 500)

  button.setAttribute('aria-expanded', 'false')
  if (
    document.activeElement === listbox ||
    document.activeElement === getActiveDescendant(listbox)
  ) {
    button.focus()
  }

  listbox.removeAttribute('aria-activedescendant')
}

/**
 * @typedef {object} InitializeOptions
 * @property {(item: HTMLElement) => void} onClick
 * @property {(item: HTMLElement) => boolean} isSelectedItem
 */

let hideListboxOnBlurTimeout

/**
 * @type {(button: HTMLButtonElement, options: InitializeOptions) => void}
 */
export function initialize(button, options) {
  const listbox = document.getElementById(button.getAttribute('aria-controls'))

  button.addEventListener('click', async function () {
    clearTimeout(hideListboxOnBlurTimeout)

    if (button.getAttribute('aria-expanded') === 'true') {
      hideListbox(listbox, button)
    } else {
      showListbox(listbox, button)

      const { x, y } = await computePosition(button, listbox, {
        placement: 'bottom',
        middleware: [offset(8), shift({ padding: 16 })],
      })

      Object.assign(listbox.style, {
        left: `${x}px`,
        top: `${y}px`,
      })
    }
  })

  listbox.addEventListener('blur', function () {
    hideListboxOnBlurTimeout = setTimeout(function () {
      hideListbox(listbox, button)
    }, 300)
  })

  listbox.addEventListener('click', function (e) {
    if (options.onClick) {
      options.onClick(getActiveDescendant(listbox))
      selectOption(listbox, e.target)
      hideListbox(listbox, button)
    }

    clearTimeout(hideListboxOnBlurTimeout)
  })

  getOptions(listbox).forEach(function (item) {
    item.addEventListener('mouseover', function () {
      focusOption(listbox, item)
    })
  })

  getOptions(listbox).forEach(function (item) {
    if (item.getAttribute('aria-selected') === 'true') {
      applySelectedStyle(item)
      return
    }

    if (
      typeof options.isSelectedItem === 'function' &&
      options.isSelectedItem(item)
    ) {
      selectOption(listbox, item)
    }
  })

  listbox.addEventListener('keydown', function (e) {
    const activeItem = getActiveDescendant(listbox)

    let nextActiveItem
    let shouldPreventDefault

    switch (e.key) {
      case 'Escape':
        hideListbox(listbox, button)
        shouldPreventDefault = true
        break
      case 'Enter':
      case ' ':
        if (options.onClick) {
          options.onClick(getActiveDescendant(listbox))
          selectOption(listbox, getActiveDescendant(listbox))
          hideListbox(listbox, button)
        }
        shouldPreventDefault = true
        break
      case 'ArrowDown':
        nextActiveItem =
          activeItem.nextElementSibling || listbox.firstElementChild
        break
      case 'ArrowUp':
        nextActiveItem =
          activeItem.previousElementSibling || listbox.lastElementChild
        break
      case 'Home':
      case 'PageUp':
        nextActiveItem = listbox.firstElementChild
        break
      case 'End':
      case 'PageDown':
        nextActiveItem = listbox.lastElementChild
        break
    }

    if (nextActiveItem) {
      focusOption(listbox, nextActiveItem)
      shouldPreventDefault = true
    }

    if (shouldPreventDefault) {
      e.preventDefault()
    }
  })
}
