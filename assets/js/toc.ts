const toc = document.querySelector('nav[data-toc]') as HTMLElement
const container = toc.closest('[data-toc-wrapper]') as HTMLElement
const blogPost = document.querySelector('[data-blog-post]') as HTMLElement
const firstTocItem = toc.querySelector('li')

function activate(listItem: HTMLLIElement): void {
  listItem.setAttribute('data-active', '')
}

function reset(listItem: HTMLLIElement): void {
  listItem.removeAttribute('data-active')
}

function resetToc(): void {
  toc.querySelectorAll('li').forEach(reset)
}

function getTocItemByHeading(
  heading: HTMLHeadingElement
): HTMLLIElement | null {
  const anchorHref = heading.querySelector('a')?.getAttribute('href')
  const tocAnchorElem = toc.querySelector(`li a[href="${anchorHref}"]`)

  if (!tocAnchorElem) {
    return null
  }

  return tocAnchorElem.closest('li')
}

function getHeadingByTocItem(
  tocItem: HTMLLIElement
): HTMLHeadingElement | null {
  const tocItemAnchor = tocItem.querySelector('a')

  if (!tocItemAnchor) {
    return null
  }

  const headingAnchor = blogPost.querySelector(
    `a[href="${tocItemAnchor?.getAttribute('href')}"]`
  )

  if (!headingAnchor) {
    return null
  }

  return headingAnchor.closest('h2, h3, h4, h5, h6')
}

for (const tocListItem of toc.querySelectorAll('li a')) {
  // Add a onClick handler to add scroll-padding-top to document element,
  // equivalent to the navbar height, if the target heading is above the
  // viewport (in which case the navbar will show up, because the an upwards
  // scroll will happen). Otherwise, remove it.
  tocListItem.addEventListener('click', function (e) {
    const anchor = e.target as HTMLAnchorElement
    const listItem = anchor.closest('li')

    if (!listItem) {
      return
    }

    const heading = getHeadingByTocItem(listItem)

    if (!heading) {
      return
    }

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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const heading = entry.target

      if (entry.isIntersecting) {
        const tocItem = getTocItemByHeading(heading as HTMLHeadingElement)

        if (!tocItem) {
          return null
        }

        resetToc()
        activate(tocItem)

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
      }
    })
  },
  {
    threshold: 1,
  }
)

const headingsInBlogPost = blogPost.querySelectorAll('h2, h3, h4, h4, h6')

for (const headingInBlogPost of headingsInBlogPost) {
  observer.observe(headingInBlogPost)
}

export {}
