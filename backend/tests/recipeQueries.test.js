const recipeQueries = require('../src/queries/recipeQueries');

jest.mock('pg', () => {
	const mockQuery = jest.fn();
	return {
		Pool: jest.fn(() => ({
			query: mockQuery
		}))
	};
});

describe('Test recipe queries', () => {
	let mockQuery;

	beforeEach(() => {
		mockQuery = require('pg').Pool().query;
	});
	describe('getAllRecipes', () => {
		it('should return a list of recipes', async () => {
			const mockRecipes = [
				{
					recipe_id: 1,
					name: 'Test Recipe',
					description: 'Test Description',
					preparation_time: 10,
					cooking_time: 20,
					servings: 4
				},
				{
					recipe_id: 2,
					name: 'Test Recipe 2',
					description: 'Test Description',
					preparation_time: 5,
					cooking_time: 45,
					servings: 2
				}
			];

			mockQuery.mockResolvedValue({rows: mockRecipes});

			const expectedRecipes = [
				{
					id: 1,
					name: 'Test Recipe',
					description: 'Test Description',
					preparation_time: 10,
					cooking_time: 20,
					servings: 4
				},
				{
					id: 2,
					name: 'Test Recipe 2',
					description: 'Test Description',
					preparation_time: 5,
					cooking_time: 45,
					servings: 2
				}
			]
			const recipes = await recipeQueries.getAllRecipes();
			expect(recipes).toEqual(expectedRecipes);
		});
	});
});