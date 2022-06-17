const marquee = document.querySelector('[data-skill-icons-marquee]')
const marqueeImage = marquee.querySelector('img')

// Wait for the skill-icons image to load to grab its width
marqueeImage.onload = function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const screenWidth = document.documentElement.clientWidth

  const marqueePercentageOfScreenWidth =
    (marqueeImage.clientWidth / screenWidth) * 100

  const marqueeGaps = Number(
    marquee.style.getPropertyValue('--gap').replace('px', '')
  )

  // Calculate the point at which we must reset the animation to look like the
  // repeating images are wrapping aroung themselves.

  // This point is the percentage the image's width occupies in the viewport,
  // but we also need to subtract the space between the images, otherwise the
  // animation is janky at some point.
  marquee.style.setProperty(
    '--marquee-reset',
    `-${marqueePercentageOfScreenWidth - marqueeGaps}%`
  )
}
