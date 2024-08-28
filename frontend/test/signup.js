import { login } from './tools_tests.js';
describe('User sign up', function() {
    before(function (browser) {
        browser.navigateTo('http://localhost:5173/register');
    });

    it('should sign up and after login don_corleone and password 12345', function(browser) {
        browser
            .waitForElementVisible('#app > div > form', 5000)
            .setValue('input#username', 'don_corleone')
            .setValue('input#password', '12345')
            .setValue('input#confirmPassword', '12345')
            .setValue('input#fullName', 'Vito Andolini Corleone')
            .click('#app > div > form > button')
            .waitForElementVisible('#app > div > form > button', 5000);
        login(browser, 'don_corleone', '12345');
          browser
            .waitForElementVisible('#app > header > div > div.connexion > div > div:nth-child(1)', 5000)
            .assert.textContains('#app > header > div > div.connexion > div > div:nth-child(1)', 'Bienvenue, Vito Andolini Corleone')
            .waitForElementVisible('#app > header > div > div.connexion > div > div:nth-child(2) > a', 5000)
            .assert.textContains('#app > header > div > div.connexion > div > div:nth-child(2) > a', 'Déconnexion');
    });

    after(function (browser) {
        browser.end();
    });
});
