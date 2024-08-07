const recipeQueries = require('../src/queries/recipeQueries');

jest.mock('../src/queries/dbPool');
const pool = require('../src/queries/dbPool');

describe('Test recipes queries', () => {
	it('getAllRecipes should return a list of recipes', async () => {
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
				servings: 4,
				image: "/recipes/1/image"
			},
			{
				id: 2,
				name: 'Test Recipe 2',
				description: 'Test Description',
				preparation_time: 5,
				cooking_time: 45,
				servings: 2,
				image: "/recipes/2/image"
			}
		]
		const recipes = await recipeQueries.getAllRecipes();
		expect(recipes).toEqual(expectedRecipes);
	});

	describe('getRecipeById', () => {
		it('should return a recipe', async () => {
			const recipeId = "validId";
			const mockRecipe = {
				recipe_id: recipeId,
				name: 'Test Recipe',
				description: 'Test Description',
				preparation_time: 10,
				cooking_time: 20,
				servings: 4
			};

			pool.query.mockResolvedValue({rows: [mockRecipe]});

			const expectedRecipe = {
				id: recipeId,
				name: 'Test Recipe',
				description: 'Test Description',
				preparation_time: 10,
				cooking_time: 20,
				servings: 4,
				image: `/recipes/${recipeId}/image`
			}

			const recipe = await recipeQueries.getRecipeById(recipeId);
			expect(recipe).toEqual(expectedRecipe);
		});
		it('should return "undefined" if recipe id not found ', async () => {
			pool.query.mockResolvedValue({rows: []});
			const recipe = await recipeQueries.getRecipeById("invalidId");
			expect(recipe).toBeUndefined();
		});
	});

	it('getRecipeIngredientsByRecipeId should return a list of ingredients', async () => {
		const mockIngredients = [
			{index: 1, name: 'Ingredient 1', quantity: '2', unit: 'ml'},
			{index: 2, name: 'Ingredient 2', quantity: '1', unit: 'g'}
		];

		pool.query.mockResolvedValue({rows: mockIngredients});

		const expectedIngredients = [
			{index: 1, name: 'Ingredient 1', quantity: '2', unit: 'ml'},
			{index: 2, name: 'Ingredient 2', quantity: '1', unit: 'g'}
		];

		const ingredients = await recipeQueries._getRecipeIngredientsByRecipeId("validId");
		expect(ingredients).toEqual(expectedIngredients);
	});

	it('getRecipeStepsRecipeById should return a list of steps', async () => {
		const mockSteps = [
			{index: 1, description: 'Step 1 description'},
			{index: 2, description: 'Step 2 description'}
		];

		pool.query.mockResolvedValue({rows: mockSteps});

		const expectedSteps = [
			{index: 1, description: 'Step 1 description'},
			{index: 2, description: 'Step 2 description'}
		];

		const steps = await recipeQueries._getRecipeStepsRecipeById("validId");
		expect(steps).toEqual(expectedSteps);
	});

	describe('getDetailedRecipeById', (object, method) => {
		it('should return a detailed recipe with valid id', async () => {
			const recipeId = "validId";
			const mockGetRecipeById = {
				id: recipeId,
				name: 'Test Recipe',
				description: 'Test Description',
				preparation_time: 10,
				cooking_time: 20,
				servings: 4,
				image: `/recipes/${recipeId}/image`
			};
			const mockGetRecipeIngredientsByRecipeId = [
				{index: 1, name: 'Ingredient 1', quantity: '2', unit: 'ml'},
				{index: 2, name: 'Ingredient 2', quantity: '1', unit: 'g'}
			];
			const mockGetRecipeStepsRecipeById = [
				{index: 1, description: 'Step 1 description'},
				{index: 2, description: 'Step 2 description'}
			];

			jest.spyOn(recipeQueries, '_getRecipeById').mockResolvedValue(mockGetRecipeById);
			jest.spyOn(recipeQueries, '_getRecipeIngredientsByRecipeId').mockResolvedValue(mockGetRecipeIngredientsByRecipeId);
			jest.spyOn(recipeQueries, '_getRecipeStepsRecipeById').mockResolvedValue(mockGetRecipeStepsRecipeById);

			const expectedDetailedRecipe = {
				id: recipeId,
				name: 'Test Recipe',
				description: 'Test Description',
				preparation_time: 10,
				cooking_time: 20,
				servings: 4,
				image: `/recipes/${recipeId}/image`,
				ingredients: [
					{index: 1, name: 'Ingredient 1', quantity: '2', unit: 'ml'},
					{index: 2, name: 'Ingredient 2', quantity: '1', unit: 'g'}
				],
				steps: [
					{index: 1, description: 'Step 1 description'},
					{index: 2, description: 'Step 2 description'}
				]
			};

			const detailedRecipe = await recipeQueries.getDetailedRecipeById(recipeId);
			expect(detailedRecipe).toEqual(expectedDetailedRecipe);
		});

		it('should return "undefined" if recipe id not found ', async () => {
			jest.spyOn(recipeQueries, '_getRecipeById').mockResolvedValue(undefined);
			const detailedRecipe = await recipeQueries.getDetailedRecipeById("invalidId");
			expect(detailedRecipe).toBeUndefined();
		});
	});

	describe('getRecipeImageContent', () => {
		it('should return recipe image and type', async () => {
			const mockImageInfos = {
				image_content: "image content",
				image_content_type: "jpeg"
			};

			pool.query.mockResolvedValue({rows: [mockImageInfos]});

			const expectedImageInfos = {
				imageContent: "image content",
				imageContentType: "jpeg"
			};
			const imageInfos = await recipeQueries.getRecipeImageContent("validId");
			expect(imageInfos).toEqual(expectedImageInfos);
		});
		it('should return "undefined" if image not found', async () => {
			pool.query.mockResolvedValue({rows: []});
			const detailedRecipe = await recipeQueries.getRecipeImageContent("invalidId");
			expect(detailedRecipe).toBeUndefined();
		});
	});
});