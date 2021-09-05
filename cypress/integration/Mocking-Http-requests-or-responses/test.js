/// <reference types="Cypress" />

describe('Mocking Http requests/responses with Cypress (XHR Testing)', function () {

    // Intercept method Spy and stub network requests and responses

    it('Mock HTTP Responses for generating Stub Data to test edge Scenarios', function () {

        cy.visit("https://rahulshettyacademy.com/angularAppdemo/")

        // Here the Intercept command will wait for a network call with GET Method and URL https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty. Whenever the network call will be made, the response will be intercepted and the modified response will be shown.

        cy.intercept(
            {
                method: 'GET',
                url: 'https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty'
            },
            {
                "body": [
                    {
                        "book_name": "Stubbed Book",
                        "isbn": "SB1",
                        "aisle": "01"
                    }
                ]
            }).as('booklist')

        cy.get('.btn-primary').click()

        cy.wait('@booklist')

        // Verifying the expected result in the UI
        cy.get('tr').should('have.length', 1 + 1)
        cy.get('tbody > tr > :nth-child(2)').should('have.text', 'SB1');
        cy.get('tbody > tr > :nth-child(3)').should('have.text', '01');
        cy.get('tbody > tr > :nth-child(4)').should('have.text', 'Stubbed Book');
        cy.get('p').should('have.text', 'Oops only 1 Book available');

    })

    it('Integration Testing with Front end and Back End response validation assertions', function () {

        cy.visit("https://rahulshettyacademy.com/angularAppdemo/")

        cy.intercept(
            {
                method: 'GET',
                url: 'https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty'
            },
            {
                "body": [
                    {
                        "book_name": "Stubbed Book",
                        "isbn": "SB1",
                        "aisle": "01"
                    }
                ]
            }).as('booklist')

        cy.get('.btn-primary').click()

        cy.wait('@booklist').should(({ request, response }) => {

            // Verifying the response is correctly mapped in the UI or not
            cy.get('tr').should('have.length', response.body.length + 1)
            cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', response.body[0].isbn);
            cy.get('tbody > :nth-child(1) > :nth-child(3)').should('have.text', response.body[0].aisle);
            cy.get('tbody > :nth-child(1) > :nth-child(4)').should('have.text', response.body[0].book_name);

        })

    })

    it('Intercepting HTTP request details to test Security Scenarios', function () {

        cy.visit("https://rahulshettyacademy.com/angularAppdemo/")

        // Here the Intercept command will wait for a network call with GET Method and URL https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty. Whenever the network call will be made, the request will be intercepted and the modified request will be made.

        cy.intercept(
            {
                method: 'GET',
                url: 'https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty'
            }, (req) => {
                req.url = "https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=rojal"
                req.continue((res) => {
                    expect(res.statusCode).to.equal(404)
                })
            }
        ).as('booklist')

        cy.get('.btn-primary').click()

        cy.wait('@booklist')

    })

})
