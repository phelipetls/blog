describe('Dark, light and system theme', () => {
  it('should be able to switch from light to dark theme', () => {
    cy.visit('/')

    cy.get('body').should('not.have.class', 'dark')

    cy.findByRole('menu', { name: /theme options/i }).should('not.exist')
    cy.findByRole('button', { name: /change theme/i }).click()

    cy.findByRole('menu', { name: /theme options/i }).should('be.visible')

    cy.findByRole('menuitem', { name: /dark/i }).click()
    cy.findByRole('button', { name: /change theme/i }).should('be.visible')

    cy.get('body').should('have.class', 'dark')
  })

  it('should set theme from local storage', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('__theme', 'dark')
      },
    })

    cy.get('body').should('have.class', 'dark')
  })

  it('should respect system preferences by default', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        cy.stub(win, 'matchMedia')
          .withArgs('(prefers-color-scheme: dark)')
          .returns({
            matches: true,
          })
      },
    })

    cy.get('body').should('have.class', 'dark')
  })

  it('should remember to respect system preference', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('__theme', 'auto')

        cy.stub(win, 'matchMedia')
          .withArgs('(prefers-color-scheme: dark)')
          .returns({
            matches: true,
          })
      },
    })

    cy.get('body').should('have.class', 'dark')
  })

  it('should be able to switch to system preferred theme', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('__theme', 'light')

        cy.stub(win, 'matchMedia')
          .withArgs('(prefers-color-scheme: dark)')
          .returns({
            matches: true,
          })
      },
    })

    cy.get('body').should('not.have.class', 'dark')

    cy.findByRole('button', { name: /change theme/i }).click()
    cy.findByRole('menuitem', { name: /system/i }).click()

    cy.get('body').should('have.class', 'dark')
  })
})
