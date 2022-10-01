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
  it(`should be able to switch from light to dark theme in desktop`, () => {
    cy.viewport('macbook-11')
    visit('/', { prefersDarkColorScheme: false })

    cy.get('body').should('not.have.class', 'dark')

    cy.findByRole('combobox', { name: /choose a theme/i })
      .should('be.visible')
      .select('dark')

    cy.get('body').should('have.class', 'dark')
  })

  it(
    'should be able to switch from light to dark theme in mobile',
    { retries: { runMode: 5, openMode: 0 } },
    () => {
      cy.viewport('iphone-6')
      visit('/', { prefersDarkColorScheme: false })

      cy.get('body').should('not.have.class', 'dark')

      cy.findByRole('button', { name: /open navigation sidebar/i }).click()
      cy.findByRole('combobox', { name: /choose a theme/i })
        .should('be.visible')
        .select('dark')

      cy.get('body').should('have.class', 'dark')
    }
  )

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
        win.localStorage.setItem('__theme', 'system')
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

    cy.findByRole('combobox', { name: /choose a theme/i }).select('system')

    cy.get('body').should('have.class', 'dark')
  })

  it('should show system theme as selected if there is no stored theme', () => {
    cy.visit('/')

    cy.findByRole('combobox', { name: /choose a theme/i })
      .findByRole('option', { name: /system/i })
      .should('be.selected')
  })

  it('should show stored theme as selected', () => {
    visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('__theme', 'dark')
      },
    })

    cy.findByRole('combobox', { name: /choose a theme/i })
      .findByRole('option', { name: /dark/i })
      .should('be.selected')
  })
})
