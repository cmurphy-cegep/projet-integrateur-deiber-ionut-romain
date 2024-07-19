const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/queries/recipeQueries');

const recipeQueries = require('../src/queries/recipeQueries');

describe('GET /recipes', () => {
	it('should return a code 200 with json', () => {
		recipeQueries.getAllRecipes.mockResolvedValue([
			{
				id: 1,
				name: 'Test Recipe',
				description: 'Test Description',
				preparation_time: 10,
				cooking_time: 20,
				servings: 4
			}
		]);
		return request(app)
			.get('/recipes')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				expect(response.body).toEqual([
					{
						id: 1,
						name: 'Test Recipe',
						description: 'Test Description',
						preparation_time: 10,
						cooking_time: 20,
						servings: 4
					}
				]);
			});
	});
});