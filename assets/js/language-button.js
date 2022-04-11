import { initialize } from './menu'

const button = document.querySelector('[data-language-button]')

if (button) {
  initialize(button, {
    onClick: function (item) {
      item.click()
    },
  })
}
