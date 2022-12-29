describe(
  'Tabs', // cypress-real-events only works in Chromium-based browsers
  { browser: '!firefox' },
  () => {
    it('should correctly hide and show tab panels when selecting tabs', () => {
      cy.visit('/posts/bash-for-javascript-developers')

      cy.findAllByRole('tablist')
        .first()
        .within(() => {
          let previousSelectedTabPanelId

          cy.findByRole('tab', { selected: true })
            // I need to click here first, because of some unknown bug in Cypress
            .click()
            .invoke('attr', 'aria-controls')
            .then(($tabPanelId) => {
              previousSelectedTabPanelId = $tabPanelId

              cy.root()
                .closest('body')
                .find('#' + $tabPanelId)
                .should('have.attr', 'role', 'tabpanel')
                .should('be.visible')
            })

          cy.findByRole('tab', { selected: false })
            .click()
            .invoke('attr', 'aria-controls')
            .then(($tabPanelId) => {
              cy.root()
                .closest('body')
                .within(() => {
                  cy.get('#' + $tabPanelId)
                    .should('have.attr', 'role', 'tabpanel')
                    .should('be.visible')

                  cy.get('#' + previousSelectedTabPanelId)
                    .should('have.attr', 'role', 'tabpanel')
                    .should('not.be.visible')
                })
            })
        })
    })

    it('should support keyboard navigation', () => {
      cy.visit('/posts/bash-for-javascript-developers')

      cy.findAllByRole('tablist')
        .first()
        .within(() => {
          cy.findByRole('tab', { selected: true })
            // Bash is the first tab
            .should('have.text', 'Bash')
            // Not sure why I need to click first
            .click()
            .invoke('attr', 'aria-controls')

          cy.realType('{rightarrow}').realType('{enter}')

          // JavaScript is the second tab
          cy.findByRole('tab', { selected: true })
            .should('have.text', 'JavaScript')
            .invoke('attr', 'aria-controls')

          cy.realType('{leftarrow}').realType('{enter}')

          // There are only two tabs in total
          // We should also support Home and End keys
          cy.realType('{end}').realType(' ')

          cy.findByRole('tab', { selected: true }).should(
            'have.text',
            'JavaScript'
          )

          cy.realType('{home}').realType(' ')

          cy.findByRole('tab', { selected: true }).should('have.text', 'Bash')
        })
    })
  }
)
