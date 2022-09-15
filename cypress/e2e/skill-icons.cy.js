describe('Skill icons', () => {
  ;['/projects'].forEach((pageUrl) => {
    describe(`page: ${pageUrl}`, () => {
      it('should change skill icons URL when theme changes', () => {
        cy.visit(pageUrl, {
          onBeforeLoad(win) {
            win.localStorage.setItem('__theme', 'light')
          },
        })

        cy.get('img[src*=skillicons]').each(($img) => {
          expect($img.attr('src')).to.match(/theme=light/)
        })

        cy.findByRole('button', { name: /change theme/i }).click()
        cy.findByRole('option', { name: /dark/i }).click()

        cy.get('img[src*=skillicons]').each(($img) => {
          expect($img.attr('src')).to.match(/theme=dark/)
        })
      })
    })
  })
})
