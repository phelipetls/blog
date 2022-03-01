import throttle from 'lodash.throttle'

const navContainer = document.querySelector('[data-nav-container]')

const observer = new IntersectionObserver(
  function (entries) {
    const entry = entries[0]

    if (entry.isIntersecting) {
      navContainer.classList.add('shadow', 'shadow-divider')
    } else {
      navContainer.classList.remove('shadow', 'shadow-divider')
    }
  },
  {
    root: document.querySelector('[data-scroll-container]'),
    rootMargin: `-${navContainer.clientHeight}px 0px 0px 0px`,
    threshold: 1
  }
)

observer.observe(navContainer)

let lastScrollPosition = window.scrollY

function handleScroll() {
  const newScrollPosition = window.scrollY

  const isScrollingDown = newScrollPosition > lastScrollPosition

  if (isScrollingDown) {
    navContainer.style.transform = `translateY(-100%)`
    navContainer.classList.add('!shadow-none')
  } else {
    navContainer.style.transform = `translateY(0%)`
    navContainer.classList.remove('!shadow-none')
  }

  lastScrollPosition = Math.max(newScrollPosition, 0)
}

window.addEventListener('scroll', throttle(handleScroll, 300), false)
