const navContainer = document.querySelector('.nav-container')

let lastScrollPosition = window.scrollY

function handleScroll() {
  const newScrollPosition = window.scrollY

  if (newScrollPosition > lastScrollPosition) {
    navContainer.classList.add('is-scrolling-down')
  } else {
    navContainer.classList.remove('is-scrolling-down')
  }

  lastScrollPosition = Math.max(newScrollPosition, 0)
}

window.addEventListener('scroll', handleScroll, false)

const observer = new IntersectionObserver(
  function ([e]) {
    e.target.classList.toggle('stuck', e.intersectionRatio < 1)
  },
  { rootMargin: '-1px 0px 0px 0px', threshold: [1] }
)

observer.observe(navContainer)
