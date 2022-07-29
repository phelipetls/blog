export function changeUrlTheme(rawUrl: string, theme: Theme) {
  const url = new URL(rawUrl)
  url.searchParams.set('theme', theme)
  return url.toString()
}

document.body.addEventListener('newTheme', function (e: NewThemeEvent) {
  document.querySelectorAll('img[src*=skillicons]').forEach(function (img) {
    const url = img.getAttribute('src')

    if (!url) {
      return
    }

    img.setAttribute('src', changeUrlTheme(url, e.detail.theme))
  })
} as EventListener)
