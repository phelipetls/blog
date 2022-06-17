const marquee = document.querySelector('[data-skill-icons-marquee]')
const skillIconsImage = marquee.querySelector('img')

// Wait for the skill-icons image to load to grab its width
skillIconsImage.onload = function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const skillIconsImageWidth = skillIconsImage.clientWidth
  skillIconsImage.remove()

  marquee.style.width = `calc(100vw + ${skillIconsImageWidth}px)`
  marquee.style.backgroundImage = `url('${skillIconsImage.src}')`
  marquee.style.backgroundRepeat = 'repeat-x'
  marquee.style.backgroundPosition = 'left top'
  marquee.style.backgroundSize = 'contain'
  marquee.style.animation = 'marquee-skill-icons 12s linear infinite'

  marquee.style.setProperty('--marquee-reset', `-${skillIconsImageWidth}px`)
}
