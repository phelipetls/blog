describe('Skill icons', () => {
  ;['/projects'].forEach((pageUrl) => {
    it(`should change skill icons URL when theme changes in ${pageUrl} page`, () => {
      cy.visit(pageUrl, {
        onBeforeLoad(win) {
          win.localStorage.setItem('__theme', 'light')
        },
      })

      cy.get('img[src*=skillicons]').each(($img) => {
        expect($img.attr('src')).to.match(/theme=light/)
      })

      cy.findByRole('combobox', { name: /choose a theme/i }).select('dark')

      cy.get('img[src*=skillicons]').each(($img) => {
        expect($img.attr('src')).to.match(/theme=dark/)
      })
    })
  })
})
