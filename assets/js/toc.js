// @ts-check
const toc = document.querySelector('nav#TableOfContents')

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
  return document
    .querySelector('[data-blog-post]')
    .querySelector(`a[href="${anchorHref}"]`)
    .closest('h2, h3, h4, h5, h6')
}

/** @type {(initialElem: HTMLHeadingElement) => HTMLHeadingElement[]} */
function getAllPreviousHeadingsUntilH2(initialElem) {
  const headings = /** @type {HTMLHeadingElement[]} */ []

  let prevElem = initialElem.previousElementSibling

  do {
    if (prevElem.tagName === 'H2') {
      headings.push(/** @type {HTMLHeadingElement} */ (prevElem))
      break
    }

    if (['H3', 'H4', 'H5', 'H6'].includes(prevElem.tagName)) {
      headings.push(/** @type {HTMLHeadingElement} */ (prevElem))
    }

    prevElem = prevElem.previousElementSibling
    // eslint-disable-next-line no-constant-condition
  } while (true)

  return headings
}

/** @type {(heading: HTMLHeadingElement) => void} */
function handleChange(heading) {
  if (heading.tagName === 'H2') {
    activate(getTocItemByHeading(heading))
    return
  }

  activate(getTocItemByHeading(heading))

  getAllPreviousHeadingsUntilH2(heading).forEach((prevSiblingHeading) =>
    activate(getTocItemByHeading(prevSiblingHeading))
  )
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
      handleChange(/** @type {HTMLHeadingElement} */ (heading))
    }
  })
})

const headingsInBlogPost = document
  .querySelector('[data-blog-post]')
  .querySelectorAll('h2, h3, h4, h4, h6')

for (const headingInBlogPost of headingsInBlogPost) {
  observer.observe(headingInBlogPost)
}
