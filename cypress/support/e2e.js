// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

const isInViewport = (_chai) => {
  function assertIsInViewport() {
    const subject = this._obj

    const windowHeight = Cypress.$(cy.state('window')).height()
    const bottomOfCurrentViewport = windowHeight
    const rect = subject[0].getBoundingClientRect()

    this.assert(
      (rect.top > 0 && rect.top < bottomOfCurrentViewport) ||
        (rect.bottom > 0 && rect.bottom < bottomOfCurrentViewport),
      'expected #{this} to be in viewport',
      'expected #{this} to not be in viewport',
      subject
    )
  }

  _chai.Assertion.addMethod('inViewport', assertIsInViewport)
}

chai.use(isInViewport)
