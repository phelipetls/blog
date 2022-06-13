const slideshow = document.querySelector('[data-skillicons-slideshow]')
const slideshowImage = slideshow.querySelector('img')

// Wait for the skill-icons image to load to grab its width
slideshowImage.onload = function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const screenWidth = document.documentElement.clientWidth

  const slideshowPercentageOfScreenWidth =
    (slideshowImage.clientWidth / screenWidth) * 100

  const slideshowGaps = window.getComputedStyle(slideshow).gap

  // Calculate the point at which we must reset the animation to look like the
  // repeating images are wrapping aroung themselves.

  // This point is the percentage the image's width occupies in the viewport,
  // but we also need to subtract the space between the images, otherwise the
  // animation is janky at some point.
  const slideshowReset = `calc(-${slideshowPercentageOfScreenWidth}% - ${slideshowGaps})`
  slideshow.style.setProperty('--slideshow-reset', slideshowReset)
}
