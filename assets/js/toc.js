// @ts-check
const toc = document.querySelector('nav#TableOfContents')
const container = toc.closest('[data-toc-wrapper]')
const blogPost = document.querySelector('[data-blog-post]')
const firstTocItem = toc.querySelector('li')

/** @type {(listItem: HTMLLIElement) => void} */
function activate(listItem) {
  listItem.setAttribute('data-active', '')
}

/** @type {(listItem: HTMLLIElement) => void} */
function reset(listItem) {
  listItem.removeAttribute('data-active')
}

/** @type {() => void} */
function resetToc() {
  toc.querySelectorAll('li').forEach(reset)
}

/** @type {(heading: HTMLHeadingElement) => HTMLLIElement} */
function getTocItemByHeading(heading) {
  const anchorHref = heading.querySelector('a').getAttribute('href')
  const tocAnchorElem = toc.querySelector(`li a[href="${anchorHref}"]`)
  return tocAnchorElem.closest('li')
}

/** @type {(tocItem: HTMLLIElement) => HTMLHeadingElement} */
function getHeadingByTocItem(tocItem) {
  const anchorHref = tocItem.querySelector('a').getAttribute('href')
  return blogPost
    .querySelector(`a[href="${anchorHref}"]`)
    .closest('h2, h3, h4, h5, h6')
}

for (const tocListItem of toc.querySelectorAll('li a')) {
  // Add a onClick handler to add scroll-padding-top to document element,
  // equivalent to the navbar height, if the target heading is above the
  // viewport (in which case the navbar will show up, because the an upwards
  // scroll will happen). Otherwise, remove it.
  tocListItem.addEventListener('click', function (e) {
    const anchor = /** @type {HTMLAnchorElement} */ (e.target)
    const heading = getHeadingByTocItem(anchor.closest('li'))
    const headingCoords = heading.getBoundingClientRect()

    const headingTopPosition = Math.abs(headingCoords.top)
    const willScrollUp = headingTopPosition < window.scrollY

    if (willScrollUp) {
      document.documentElement.classList.add('scroll-pt-nav-height')
    } else {
      document.documentElement.classList.remove('scroll-pt-nav-height')
    }
  })
}

let timeout

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const heading = entry.target

    if (entry.isIntersecting) {
      const tocItem = getTocItemByHeading(
        /** @type {HTMLHeadingElement} */ (heading)
      )

      resetToc()
      activate(tocItem)

      if (timeout) {
        window.cancelAnimationFrame(timeout)
      }

      timeout = window.requestAnimationFrame(() => {
        const containerCoords = container.getBoundingClientRect()
        const tocItemCoords = tocItem.getBoundingClientRect()

        if (tocItem === firstTocItem) {
          container.scrollTop = 0
          return
        }

        // Is the item not visible because it's above the scrollable area? Then
        // make it visible by scrolling up.
        if (containerCoords.top > tocItemCoords.top) {
          container.scrollTop -= containerCoords.top - tocItemCoords.top
          return
        }

        if (tocItemCoords.bottom > containerCoords.bottom) {
          container.scrollTop += tocItemCoords.bottom - containerCoords.bottom
        }
      })
    }
  })
})

const headingsInBlogPost = blogPost.querySelectorAll('h2, h3, h4, h4, h6')

for (const headingInBlogPost of headingsInBlogPost) {
  observer.observe(headingInBlogPost)
}
