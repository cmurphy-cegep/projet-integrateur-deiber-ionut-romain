function loginUser(browser, username, password, callback) {
    browser
        .waitForElementVisible('form', 5000) // Ensure the form is visible before interacting
        .setValue('input#username', username)
        .setValue('input#password', password)
        .click('button.connection-button')
        .pause(3000) // Increase pause to ensure the error message has time to appear
        .elements('css selector', '#app > div > form > div.error-message', function(result) {
            if (result.value.length > 0) {
                callback(true);
            } else {
                callback(false);
            }
        });
}

function signUpUser(browser, username, password, fullName) {
    browser
        .navigateTo('http://localhost:5173/register')
        .waitForElementVisible('#app > div > form', 5000) // Increase wait time for the form to be visible
        .setValue('input#username', username)
        .setValue('input#password', password)
        .setValue('input#confirmPassword', password)
        .setValue('input#fullName', fullName)
        .click('#app > div > form > button')
        .waitForElementVisible('button.connection-button', 5000); // Increase wait time for the button to be visible
}

function verifyWelcomeMessage(browser, fullName) {
    browser
        .waitForElementVisible('div.connexion > div > div:nth-child(1)', 5000)
        .assert.textContains('div.connexion > div > div:nth-child(1)', `Bienvenue, ${fullName}`)
        .assert.textContains('div.connexion > div > div:nth-child(2) > a', 'Déconnexion');
}

describe('User login or sign up', function() {
    before(function (browser) {
        browser.navigateTo('http://localhost:5173/login');
    });

    it('should login with user don_corleone or sign up if user does not exist', function(browser) {
        loginUser(browser, 'don_corleone', '12345', function(errorVisible) {
            if (errorVisible) {
                // Error message is present, navigate to signup
                signUpUser(browser, 'don_corleone', '12345', 'Vito Andolini Corleone');
                loginUser(browser, 'don_corleone', '12345', function() {
                    verifyWelcomeMessage(browser, 'Vito Andolini Corleone');
                });
            } else {
                // Error message is not present, verify welcome message
                verifyWelcomeMessage(browser, 'Vito Andolini Corleone');
            }
        });
    });

    after(function (browser) {
        browser.end();
    });
});