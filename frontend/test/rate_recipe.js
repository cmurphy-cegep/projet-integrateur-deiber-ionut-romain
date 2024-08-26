import { login } from './tools_tests.js';
describe('Rate Recipe', function () {
	before(function (browser) {
		login(browser, 'josbleau', '12345');
		browser
			.waitForElementVisible('#app > header > div > div.connexion > div > div:nth-child(1)', 10000);
	});
	it('should rating user display after user rate a recipe', function (browser) {
		browser
			.click('#recipe-list > div:nth-child(1) > div.recipe-name > a')
			.waitForElementVisible('#app > div > div:nth-child(5) > div > div:nth-child(2) > button', 1000)
			.click('#app > div > div:nth-child(5) > div > div:nth-child(2) > button')
			.waitForElementVisible('#app > div > div:nth-child(5) > div > div:nth-child(2) > form', 1000)
			.setValue('#rating', '5')
			.click('#app > div > div:nth-child(5) > div > div:nth-child(2) > form > button')
			.refresh()
			.waitForElementVisible('#app > div > div:nth-child(5) > div > div:nth-child(2) > span', 15000)
			.assert.textContains('#app > div > div:nth-child(5) > div > div:nth-child(2) > span', 'Votre appréciation: 5')
			.waitForElementVisible('#app > div > div:nth-child(5) > div > div:nth-child(2) > button', 10000)
			.assert.textContains('#app > div > div:nth-child(5) > div > div:nth-child(2) > button', 'Modifier votre appréciation');
	});
	after(function (browser) {
		browser.end();
	});
});
