describe('Listbox', () => {
  it('should be keyboard accessible', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('__theme', 'light')
      },
    })

    cy.findByRole('button', { name: /change theme/i })
      .should('have.attr', 'aria-expanded', 'false')
      .click()
      .should('have.attr', 'aria-expanded', 'true')

    cy.findByRole('option', { name: /light/i }).should(
      'have.attr',
      'aria-selected',
      'true'
    )

    cy.findByRole('listbox')
      .should('be.visible')
      .and('have.focus')
      .and('have.attr', 'aria-activedescendant', 'theme-option-light')
      .type('{downArrow}')
      .should('have.attr', 'aria-activedescendant', 'theme-option-dark')
      .type('{upArrow}')
      .should('have.attr', 'aria-activedescendant', 'theme-option-light')
      .type('{pageDown}')
      .should('have.attr', 'aria-activedescendant', 'theme-option-auto')
      .type('{pageUp}')
      .should('have.attr', 'aria-activedescendant', 'theme-option-light')
      .type('{home}')
      .should('have.attr', 'aria-activedescendant', 'theme-option-light')
      .type('{end}')
      .should('have.attr', 'aria-activedescendant', 'theme-option-auto')
      .type('{esc}')

    cy.findByRole('button', { name: /change theme/i })
      .should('be.focused')
      .and('have.attr', 'aria-expanded', 'false')
  })

  it('should focus on button after escaping listbox', () => {
    cy.visit('/')

    cy.findByRole('button', { name: /change theme/i }).click()
    cy.findByRole('listbox').type('{esc}')
    cy.findByRole('button', { name: /change theme/i }).should('be.focused')
  })

  it('should focus on button after clicking on a listbox item', () => {
    cy.visit('/')

    cy.findByRole('button', { name: /change theme/i }).click()
    cy.findByRole('option', { name: /system/i }).click()
    cy.findByRole('button', { name: /change theme/i }).should('be.focused')
  })

  it('should be able to change theme with keyboard consecutively', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('__theme', 'light')
      },
    })

    cy.findByRole('button', { name: /change theme/i }).click()
    cy.findByRole('listbox').should('be.focused').type('{downArrow}{enter}')

    cy.get('body').should('have.class', 'dark')

    cy.findByRole('button', { name: /change theme/i })
      .should('be.focused')
      .click()
    cy.findByRole('listbox').type('{upArrow}{enter}')

    cy.get('body').should('not.have.class', 'dark')
  })
})
