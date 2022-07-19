// @ts-check

/** @type {(rawUrl: string, theme: Theme) => string} */
export function changeUrlTheme(rawUrl, theme) {
  const url = new URL(rawUrl)
  url.searchParams.set('theme', theme)
  return url.toString()
}

document.body.addEventListener('newTheme', function (/** @type {any} */ e) {
  document.querySelectorAll('img[src*=skillicons]').forEach(function (img) {
    const url = img.getAttribute('src')
    img.setAttribute('src', changeUrlTheme(url, e.detail.theme))
  })
})
