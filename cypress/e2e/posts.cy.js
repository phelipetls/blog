describe('Blog posts', () => {
  it('Blog post about syntax highlight of Python f-strings in Vim should load Cocoen script and CSS', () => {
    cy.intercept('**/cocoen.min.js').as('cocoenScript')
    cy.intercept('**/cocoen.min.css').as('cocoenCss')
    cy.intercept('**/script.js').as('script')

    cy.visit('/posts/f-strings-syntax-highlighting-in-vim')

    cy.wait('@script')
    cy.wait('@cocoenScript')
    cy.wait('@cocoenCss')
  })
})
