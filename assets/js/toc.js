// @ts-check
const toc = document.querySelector('nav#TableOfContents')
const blogPost = document.querySelector('[data-blog-post]')

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

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const heading = entry.target

    if (entry.isIntersecting) {
      resetToc()
      activate(getTocItemByHeading(/** @type {HTMLHeadingElement} */ (heading)))
    }
  })
})

const headingsInBlogPost = blogPost.querySelectorAll('h2, h3, h4, h4, h6')

for (const headingInBlogPost of headingsInBlogPost) {
  observer.observe(headingInBlogPost)
}
