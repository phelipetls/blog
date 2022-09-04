const toc = document.querySelector<HTMLElement>('nav[data-toc]')
const container = toc?.closest<HTMLElement>('[data-toc-wrapper]')
const blogPost = document.querySelector('[data-blog-post]') as HTMLElement
const firstTocItem = toc?.querySelector('li')

function activate(listItem: HTMLLIElement): void {
  listItem.setAttribute('data-active', '')
}

function reset(listItem: HTMLLIElement): void {
  listItem.removeAttribute('data-active')
}

function resetToc(): void {
  toc?.querySelectorAll('li').forEach(reset)
}

function getTocItemByHeading(
  heading: HTMLHeadingElement
): HTMLLIElement | null {
  const headingId = heading.getAttribute('id')
  const tocAnchorElem = toc?.querySelector(`li a[href="#${headingId}"]`)

  if (!tocAnchorElem) {
    return null
  }

  return tocAnchorElem.closest('li')
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const heading = entry.target

      if (entry.isIntersecting) {
        const tocItem = getTocItemByHeading(heading as HTMLHeadingElement)

        if (!tocItem || !container) {
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
