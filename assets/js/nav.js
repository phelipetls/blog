import throttle from 'lodash.throttle'

const navContainer = document.querySelector('[data-nav-container]')

let lastScrollPosition = window.scrollY

function handleScroll() {
  const newScrollPosition = window.scrollY

  if (newScrollPosition > lastScrollPosition) {
    if (navContainer.classList.contains('stuck')) {
      navContainer.classList.add('is-scrolling-down')
    }
  } else {
    navContainer.classList.remove('is-scrolling-down')
  }

  lastScrollPosition = Math.max(newScrollPosition, 0)
}

window.addEventListener('scroll', throttle(handleScroll, 300), false)

const observer = new IntersectionObserver(
  function ([e]) {
    if (e.isIntersecting) {
      navContainer.classList.add('stuck')
    } else {
      navContainer.classList.remove('stuck')
    }
  },
  {
    root: document.querySelector('[data-scroll-container]'),
    rootMargin: `-${navContainer.clientHeight}px 0px 0px 0px`,
    threshold: 1
  }
)

observer.observe(navContainer)
