import {login} from "./tools_tests.js";

describe('Add comment', function () {
	before(function (browser) {
		login(browser, 'josbleau', '12345');
		browser
			.waitForElementVisible('#app > header > div > div.connexion > div > div:nth-child(1)', 5000);
	});
	it('add a comment to the recipe and after that the comment should be displayed', function (browser) {
		const comment = 'Jos Bleau is the best';
		const expectedComment = comment;

		browser
			.click('#recipe-list > div:nth-child(1) > div > div.recipe-name > a')
			.waitForElementVisible('#app > div > div:nth-child(3) > div.recipe-add-comment > button', 1000)
			.click('#app > div > div:nth-child(3) > div.recipe-add-comment > button')
			.waitForElementVisible('#app > div > div:nth-child(3) > div.recipe-add-comment > form', 1000)
			.setValue('#app > div > div:nth-child(3) > div.recipe-add-comment > form > textarea', comment)
			.click('#app > div > div:nth-child(3) > div.recipe-add-comment > form > button')
			.assert.textContains('#app > div > div:nth-child(3) > div.recipe-comments > div:last-child > p:nth-child(2)', expectedComment);
	});
	after(function (browser) {
		browser.end();
	});
});
