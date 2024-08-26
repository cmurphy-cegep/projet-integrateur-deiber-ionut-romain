describe('User sign up', function() {
    before(function (browser) {
        browser.navigateTo('http://localhost:5173/register');
    });

    it('should sign up with user don_corleone', function(browser) {
        browser
            .waitForElementVisible('#app > div > form', 5000)
            .setValue('input#username', 'don_corleone')
            .setValue('input#password', '12345')
            .setValue('input#confirmPassword', '12345')
            .setValue('input#fullName', 'Vito Andolini Corleone')
            .click('#app > div > form > button')
            .waitForElementVisible('button.connection-button', 5000);
    });

    after(function (browser) {
        browser.end();
    });
});
