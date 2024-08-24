describe('Title Assertion', function () {
	before(function (browser) {
		browser.navigateTo('http://localhost:5173');
	});

	it('Test titre de la page', function (browser) {
		browser.assert.titleEquals('Les Recettes de Rodrigo');
	});

	after(function (browser) {
		browser.end();
	});
});