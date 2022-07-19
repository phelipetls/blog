// @ts-check
import {
  changeUrlTheme,
  setCssBackgroundImageUrl,
} from 'js/theme-skill-icons.js'

/** @type {HTMLElement} */
const marquee = document.querySelector('[data-skill-icons-marquee]')
const skillIconsImage = marquee.querySelector('img')

// Wait for the skill-icons image to load to grab its width
skillIconsImage.onload = function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const skillIconsImageWidth = skillIconsImage.clientWidth
  const backgroundImageUrl = skillIconsImage.src
  skillIconsImage.remove()

  marquee.style.width = `calc(100vw + ${skillIconsImageWidth}px)`
  marquee.style.backgroundImage = `url('${backgroundImageUrl}')`
  marquee.style.backgroundRepeat = 'repeat-x'
  marquee.style.backgroundPosition = 'left top'
  marquee.style.backgroundSize = 'contain'
  marquee.style.animation = 'marquee-skill-icons 12s linear infinite'

  marquee.style.setProperty('--marquee-reset', `-${skillIconsImageWidth}px`)

  document.body.addEventListener('newTheme', function (/** @type {any} */ e) {
    const newUrl = changeUrlTheme(backgroundImageUrl, e.detail.theme)
    setCssBackgroundImageUrl(marquee, newUrl)
  })
}
