import { initialize } from './listbox'

const button = document.querySelector('[data-language-button]')

if (button) {
  initialize(button, {
    onClick: function (item) {
      item.querySelector('a').click()
    },
  })
}
