// @ts-check

/** @type {(rawUrl: string, theme: Theme) => string} */
export function changeUrlTheme(rawUrl, theme) {
  const url = new URL(rawUrl)
  url.searchParams.set('theme', theme)
  return url.toString()
}

/** @type {(elem: HTMLElement) => string} */
function getUrlInCssBackgroundImage(elem) {
  return elem.style.backgroundImage
    .replace(/^url\(['"]/, '')
    .replace(/['"]\)$/, '')
}

/** @type {(elem: HTMLElement, url: string) => void} */
export function setCssBackgroundImageUrl(elem, url) {
  elem.style.backgroundImage = `url('${url}')`
}

document.body.addEventListener('newTheme', function (/** @type {any} */ e) {
  document.querySelectorAll('img[src*=skillicons]').forEach(function (img) {
    const url = img.getAttribute('src')
    img.setAttribute('src', changeUrlTheme(url, e.detail.theme))
  })

  document
    .querySelectorAll('[data-skill-icons-bg-image]')
    .forEach(function (/** @type {HTMLElement} */ elem) {
      const backgroundImageUrl = getUrlInCssBackgroundImage(elem)
      const newUrl = changeUrlTheme(backgroundImageUrl, e.detail.theme)
      setCssBackgroundImageUrl(elem, newUrl)
    })
})
