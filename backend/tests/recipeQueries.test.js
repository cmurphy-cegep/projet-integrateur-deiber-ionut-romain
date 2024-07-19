const recipeQueries = require('../src/queries/recipeQueries');
const pool = require('../src/queries/dbPool');

pool.query = jest.fn().mockReturnThis();

describe('Test recipe queries', () => {
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
			pool.query.mockResolvedValue({rows: mockRecipes});
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