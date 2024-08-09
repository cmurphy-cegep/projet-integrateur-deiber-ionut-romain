const RecipeQueries = require('../../src/queries/RecipeQueries.js');

jest.mock('../../src/queries/dbPool');
const mockPool = require('../../src/queries/dbPool');

describe('Test recipes queries', () => {
	it('getAllRecipes should return a list of recipes', async () => {
		const mockResult = {
			rows: [
				{
					recipe_id: 1,
					name: 'Recipe 1',
					description: 'Description 1',
					preparation_time: 10,
					cooking_time: 20,
					servings: 2
				},
				{
					recipe_id: 2,
					name: 'Recipe 2',
					description: 'Description 2',
					preparation_time: 15,
					cooking_time: 25,
					servings: 4
				}
			]
		};

		const expectResult = [
			{
				recipe_id: 1,
				name: 'Recipe 1',
				description: 'Description 1',
				preparation_time: 10,
				cooking_time: 20,
				servings: 2
			},
			{
				recipe_id: 2,
				name: 'Recipe 2',
				description: 'Description 2',
				preparation_time: 15,
				cooking_time: 25,
				servings: 4
			}
		];

		mockPool.query.mockResolvedValue(mockResult);

		const result = await RecipeQueries.getAllRecipes();

		expect(result).toEqual(expectResult);
	});

	describe('getRecipeById', () => {
		it('should return recipe details with valid recipe id', async () => {
			const recipeId = 'validId';
			const mockResult = {
				rows: [{
					recipe_id: recipeId,
					name: 'Test Recipe',
					description: 'Test Description',
					preparation_time: 10,
					cooking_time: 20,
					servings: 4
				}]
			};

			const expectResult = {
				recipe_id: recipeId,
				name: 'Test Recipe',
				description: 'Test Description',
				preparation_time: 10,
				cooking_time: 20,
				servings: 4
			};

			mockPool.query.mockResolvedValue(mockResult);

			const result = await RecipeQueries.getRecipeById(recipeId);

			expect(result).toEqual(expectResult);
		});

		it('should return "undefined" if recipe id not found', async () => {
			mockPool.query.mockResolvedValue({rows: []});

			const result = await RecipeQueries.getRecipeById("invalidId");

			expect(result).toBeUndefined();
		});
	});

	describe('getRecipeImageContent', () => {
		it('should return recipe image content and type with valid recipe id', async () => {
			const recipeId = 'validId';
			const mockResult = {
				rows: [{
					image_content: 'imageContent',
					image_content_type: 'image/jpeg'
				}]
			};

			const expectResult = {
				image_content: 'imageContent',
				image_content_type: 'image/jpeg'
			};

			mockPool.query.mockResolvedValue(mockResult);

			const result = await RecipeQueries.getRecipeImageContent(recipeId);

			expect(result).toEqual(expectResult);
		});

		it('should return "undefined" if recipe id not found', async () => {
			mockPool.query.mockResolvedValue({rows: []});

			const result = await RecipeQueries.getRecipeImageContent("invalidId");

			expect(result).toBeUndefined();
		});
	});

	describe('getRecipeIngredientsByRecipeId', () => {
		it('should return recipe ingredients with valid recipe id', async () => {
			const recipeId = 'validId';
			const mockResult = {
				rows: [
					{
						index: 1,
						name: 'Ingredient 1',
						quantity: 100,
						unit: 'g'
					},
					{
						index: 2,
						name: 'Ingredient 2',
						quantity: 200,
						unit: 'ml'
					}
				]
			};

			const expectResult = [
				{
					index: 1,
					name: 'Ingredient 1',
					quantity: 100,
					unit: 'g'
				},
				{
					index: 2,
					name: 'Ingredient 2',
					quantity: 200,
					unit: 'ml'
				}
			];

			mockPool.query.mockResolvedValue(mockResult);

			const result = await RecipeQueries.getRecipeIngredientsByRecipeId(recipeId);

			expect(result).toEqual(expectResult);
		});

		it('should return an empty array if recipe id not found', async () => {
			mockPool.query.mockResolvedValue({rows: []});

			const result = await RecipeQueries.getRecipeIngredientsByRecipeId("invalidId");

			expect(result).toEqual([]);
		});
	});

	describe('getRecipeStepsByRecipeId', () => {
		it('should return recipe steps with valid recipe id', async () => {
			const recipeId = 'validId';
			const mockResult = {
				rows: [
					{
						index: 1,
						description: 'Step 1'
					},
					{
						index: 2,
						description: 'Step 2'
					}
				]
			};

			const expectResult = [
				{
					index: 1,
					description: 'Step 1'
				},
				{
					index: 2,
					description: 'Step 2'
				}
			];

			mockPool.query.mockResolvedValue(mockResult);

			const result = await RecipeQueries.getRecipeStepsByRecipeId(recipeId);

			expect(result).toEqual(expectResult);
		});

		it('should return an empty array if recipe id not found', async () => {
			mockPool.query.mockResolvedValue({rows: []});

			const result = await RecipeQueries.getRecipeStepsByRecipeId("invalidId");

			expect(result).toEqual([]);
		});
	});
});