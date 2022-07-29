import { initialize } from './listbox'

const button = document.querySelector<HTMLButtonElement>(
  '[data-language-button]'
)

if (button) {
  initialize(button, {
    onClick: function (item) {
      item?.querySelector('a')?.click()
    },
  })
}
