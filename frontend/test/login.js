import { login } from './tools_tests.js';
describe('User login', function () {

	it('should login josbleau and password 12345', function (browser) {
		login(browser, 'josbleau', '12345');
		browser
			.waitForElementVisible('#app > header > div > div.connexion > div > div:nth-child(1)', 5000)
			.assert.textContains('#app > header > div > div.connexion > div > div:nth-child(1)', 'Bienvenue, Jos Bleau')
			.waitForElementVisible('#app > header > div > div.connexion > div > div:nth-child(2) > a', 5000)
			.assert.textContains('#app > header > div > div.connexion > div > div:nth-child(2) > a', 'Déconnexion');
	});

	after(function (browser) {
		browser.end();
	});
});
