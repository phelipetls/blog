const toc = document.querySelector('nav#TableOfContents')

function activate(listItem) {
  listItem.setAttribute('data-active', '')
}

function reset(listItem) {
  listItem.removeAttribute('data-active')
}

function resetToc() {
  toc.querySelectorAll('li').forEach(reset)
}

function getTocItemByHeading(heading) {
  const anchorHref = heading.querySelector('a').getAttribute('href')
  const tocAnchorElem = toc.querySelector(`li a[href="${anchorHref}"]`)
  return tocAnchorElem.closest('li')
}

function getAllPreviousHeadingsUntilH2(initialElem) {
  const headings = []

  let prevElem = initialElem.previousElementSibling

  do {
    if (prevElem.tagName === 'H2') {
      headings.push(prevElem)
      break
    }

    if (['H3', 'H4', 'H5', 'H6'].includes(prevElem.tagName)) {
      headings.push(prevElem)
    }

    prevElem = prevElem.previousElementSibling
    // eslint-disable-next-line no-constant-condition
  } while (true)

  return headings
}

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

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const heading = entry.target

    if (entry.isIntersecting) {
      resetToc()
      handleChange(heading)
    }
  })
})

const headingsInBlogPost = document
  .querySelector('[data-blog-post]')
  .querySelectorAll('h2, h3, h4, h4, h6')

for (const headingInBlogPost of headingsInBlogPost) {
  observer.observe(headingInBlogPost)
}
