import { computePosition, shift, offset } from '@floating-ui/dom'

const button = document.querySelector('[data-theme-button]')
const menu = document.querySelector('[data-theme-menu]')
const menuItems = menu.querySelectorAll('[role="menuitem"]')

function getActiveMenuItem() {
  for (const item of menuItems) {
    if (item.id === menu.getAttribute('aria-activedescendant')) {
      return item
    }
  }
}

function getSelectedMenuItem() {
  for (const item of menuItems) {
    if (item.getAttribute('aria-selected') === 'true') {
      return item
    }
  }
}

function focusMenuItem(newItem) {
  menuItems.forEach(function (item) {
    if (item !== newItem) {
      item.removeAttribute('data-focus')
    } else {
      item.setAttribute('data-focus', '')
      menu.setAttribute('aria-activedescendant', item.id)
    }
  })
}

function showMenu() {
  button.setAttribute('aria-expanded', 'true')

  menu.classList.remove('hidden')
  menu.setAttribute('aria-descendant', getSelectedMenuItem())
  focusMenuItem(getSelectedMenuItem())
  menu.focus()
}

function hideMenu() {
  button.setAttribute('aria-expanded', 'false')
  button.focus()

  menu.removeAttribute('aria-activedescendant')
  menu.classList.add('hidden')
}

function setMenuItemTheme(item) {
  window.__setTheme(item.dataset.theme)
  hideMenu()
}

button.addEventListener('click', async function () {
  if (button.getAttribute('aria-expanded') === 'true') {
    hideMenu()
  } else {
    showMenu()

    const { x, y } = await computePosition(button, menu, {
      placement: 'bottom',
      middleware: [offset(8), shift({ padding: 16 })],
    })

    Object.assign(menu.style, {
      left: `${x}px`,
      top: `${y}px`,
    })
  }
})

let hideMenuOnBlurTimeout

menu.addEventListener('blur', function () {
  hideMenuOnBlurTimeout = setTimeout(hideMenu, 300)
})

menu.addEventListener('click', function () {
  setMenuItemTheme(getActiveMenuItem())
  clearTimeout(hideMenuOnBlurTimeout)
})

menuItems.forEach((item) =>
  item.addEventListener('mouseover', function () {
    focusMenuItem(item)
  })
)

menu.addEventListener('keydown', function (e) {
  const activeItem = getActiveMenuItem()

  let nextActiveItem
  let shouldPreventDefault

  switch (e.key) {
    case 'Escape':
      hideMenu()
      shouldPreventDefault = true
      break
    case 'Enter':
    case ' ':
      setMenuItemTheme(activeItem)
      shouldPreventDefault = true
      break
    case 'ArrowDown':
      nextActiveItem = activeItem.nextElementSibling || menu.firstElementChild
      break
    case 'ArrowUp':
      nextActiveItem =
        activeItem.previousElementSibling || menu.lastElementChild
      break
    case 'Home':
    case 'PageUp':
      nextActiveItem = menu.firstElementChild
      break
    case 'End':
    case 'PageDown':
      nextActiveItem = menu.lastElementChild
      break
  }

  if (nextActiveItem) {
    focusMenuItem(nextActiveItem)
    shouldPreventDefault = true
  }

  if (shouldPreventDefault) {
    e.preventDefault()
  }
})

document.body.addEventListener('newTheme', function (e) {
  function selectMenuItem(theme) {
    for (const item of menuItems) {
      if (item.dataset.theme === theme) {
        item.setAttribute('aria-selected', 'true')
      } else {
        item.removeAttribute('aria-selected')
      }
    }
  }

  function changeButtonIcon(theme) {
    const icon = {
      dark: '#moon',
      light: '#sun',
      auto: '#monitor',
    }[theme]

    const buttonIcon = document.querySelector('[data-theme-button-svg-icon]')
    buttonIcon.setAttribute('href', icon)
  }

  const theme = e.detail.theme
  changeButtonIcon(theme)
  selectMenuItem(theme)
})
