document.body.addEventListener('newTheme', function (e) {
  document.querySelectorAll('img[src*=skillicons]').forEach(function (img) {
    const url = new URL(img.getAttribute('src'))
    url.searchParams.set('theme', e.detail.theme)
    img.setAttribute('src', url)
  })
})
