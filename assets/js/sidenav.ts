import 'a11y-dialog'

const DIALOG_BACKDROP_ANIMATION_DURATION = 300
const DIALOG_CONTENT_ANIMATION_DURATION = 300
const maxAnimationDuration = Math.max(
  DIALOG_CONTENT_ANIMATION_DURATION,
  DIALOG_BACKDROP_ANIMATION_DURATION
)

;(() => {
  const dialogElement =
    document.querySelector<HTMLElement>('[data-a11y-dialog]')

  if (!dialogElement) {
    return
  }

  const backdrop = dialogElement.querySelector<HTMLElement>(
    '[data-a11y-dialog-hide]'
  )
  const content = dialogElement.querySelector<HTMLElement>('[role=document]')

  if (!backdrop || !content) {
    return
  }

  const hideSidenav = () => {
    backdrop.style.transition = `opacity ${DIALOG_BACKDROP_ANIMATION_DURATION}ms ease`
    content.style.transition = `transform ${DIALOG_CONTENT_ANIMATION_DURATION}ms ease`
    dialogElement.style.transition = `visibility 0ms ${maxAnimationDuration}ms`

    content.style.transform = 'translateX(100%)'
    backdrop.style.opacity = '0'
    dialogElement.style.visibility = 'hidden'
  }

  const showSidenav = () => {
    dialogElement.style.transition = `visibility 0ms`
    backdrop.style.transition = `opacity ${DIALOG_BACKDROP_ANIMATION_DURATION}ms ease`
    content.style.transition = `transform ${DIALOG_CONTENT_ANIMATION_DURATION}ms ease`

    dialogElement.style.visibility = 'visible'
    backdrop.style.opacity = '1'
    content.style.transform = 'translateX(0px)'

    dialogElement
      .querySelector<HTMLElement>('button[data-a11y-dialog-hide]')
      ?.focus()
  }

  hideSidenav()

  dialogElement.addEventListener('show', () => {
    showSidenav()
  })

  dialogElement.addEventListener('hide', () => {
    hideSidenav()
  })
})()

export {}
