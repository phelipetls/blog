const visit = (url, { prefersDarkColorScheme = false, ...visitOptions }) =>
  cy.visit(url, {
    onBeforeLoad(win) {
      visitOptions?.onBeforeLoad?.(win)

      cy.stub(win, 'matchMedia')
        .returns({
          matches: false,
        })
        .withArgs('(prefers-color-scheme: dark)')
        .returns({
          matches: prefersDarkColorScheme,
        })
    },
  })

describe('Dark, light and system theme', () => {
  it('should be able to switch from light to dark theme', () => {
    visit('/', { prefersDarkColorScheme: false })

    cy.get('body').should('not.have.class', 'dark')

    cy.findByRole('listbox', { name: /theme options/i }).should('not.exist')
    cy.findByRole('button', { name: /change theme/i }).click()
    cy.findByRole('listbox', { name: /theme options/i }).should('be.visible')

    cy.findByRole('option', { name: /dark/i }).click()
    cy.get('body').should('have.class', 'dark')
  })

  it('should set theme from local storage', () => {
    visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('__theme', 'dark')
      },
    })

    cy.get('body').should('have.class', 'dark')
  })

  it('should respect system preferences by default', () => {
    visit('/', { prefersDarkColorScheme: true })

    cy.get('body').should('have.class', 'dark')
  })

  it('should remember to respect system preference', () => {
    visit('/', {
      prefersDarkColorScheme: true,
      onBeforeLoad: (win) => {
        win.localStorage.setItem('__theme', 'auto')
      },
    })

    cy.get('body').should('have.class', 'dark')
  })

  it('should be able to switch to system preferred theme', () => {
    visit('/', {
      prefersDarkColorScheme: true,
      onBeforeLoad: (win) => {
        win.localStorage.setItem('__theme', 'light')
      },
    })

    cy.get('body').should('not.have.class', 'dark')

    cy.findByRole('button', { name: /change theme/i }).click()
    cy.findByRole('option', { name: /system/i }).click()

    cy.get('body').should('have.class', 'dark')
  })
})
