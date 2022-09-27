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
  const viewports = ['iphone-6', 'macbook-11']

  viewports.forEach((viewport) => {
    it(`should be able to switch from light to dark theme in ${viewport}`, () => {
      cy.viewport(viewport)

      visit('/', { prefersDarkColorScheme: false })

      cy.get('body').should('not.have.class', 'dark')

      if (viewport === 'iphone-6') {
        cy.findByRole('button', { name: /open navigation sidebar/i }).click()
      }

      cy.findByRole('combobox', { name: /choose a theme/i })
        .should('be.visible')
        .select('dark')

      cy.get('body').should('have.class', 'dark')
    })
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

  viewports.forEach((viewport) => {
    it(`should be able to switch to system preferred theme in ${viewport}`, () => {
      cy.viewport(viewport)

      visit('/', {
        prefersDarkColorScheme: true,
        onBeforeLoad: (win) => {
          win.localStorage.setItem('__theme', 'light')
        },
      })

      cy.get('body').should('not.have.class', 'dark')

      if (viewport === 'iphone-6') {
        cy.findByRole('button', { name: /open navigation sidebar/i }).click()
      }
      cy.findByRole('combobox', { name: /choose a theme/i }).select('auto')

      cy.get('body').should('have.class', 'dark')
    })
  })
})
