const RecipeServices = require('../../src/services/RecipeServices');

jest.mock('../../src/queries/RecipeQueries');
const mockRecipeQueries = require('../../src/queries/RecipeQueries');

describe('Test recipe services', () => {
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

		mockRecipeQueries.getAllRecipes.mockResolvedValue(mockRecipes);

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

		const recipes = await RecipeServices.getAllRecipes();

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

			mockRecipeQueries.getRecipeById.mockResolvedValue(mockRecipe);

			const expectedRecipe = {
				id: recipeId,
				name: 'Test Recipe',
				description: 'Test Description',
				preparation_time: 10,
				cooking_time: 20,
				servings: 4,
				image: `/recipes/${recipeId}/image`
			}

			const recipe = await RecipeServices.getRecipeById(recipeId);

			expect(recipe).toEqual(expectedRecipe);
		});

		it('should return "undefined" if recipe id not found ', async () => {
			mockRecipeQueries.getRecipeById.mockResolvedValue(undefined);

			const recipe = await RecipeServices.getRecipeById("invalidId");

			expect(recipe).toBeUndefined();
		});
	});

	describe('getDetailedRecipeById', () => {
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

			jest.spyOn(RecipeServices, 'getRecipeById').mockResolvedValue(mockGetRecipeById);
			mockRecipeQueries.getRecipeIngredientsByRecipeId.mockResolvedValue(mockGetRecipeIngredientsByRecipeId);
			mockRecipeQueries.getRecipeStepsByRecipeId.mockResolvedValue(mockGetRecipeStepsRecipeById);

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

			const detailedRecipe = await RecipeServices.getDetailedRecipeById(recipeId);

			expect(detailedRecipe).toEqual(expectedDetailedRecipe);
		});

		it('should return "undefined" if recipe id not found ', async () => {
			jest.spyOn(RecipeServices, 'getRecipeById').mockResolvedValue(undefined);

			const detailedRecipe = await RecipeServices.getDetailedRecipeById("invalidId");

			expect(detailedRecipe).toBeUndefined();
		});
	});

	describe('getRecipeImageContent', () => {
		it('should return recipe image and type', async () => {
			const mockImageInfos = {
				image_content: "image content",
				image_content_type: "jpeg"
			};

			mockRecipeQueries.getRecipeImageContent.mockResolvedValue(mockImageInfos);

			const expectedImageInfos = {
				imageContent: "image content",
				imageContentType: "jpeg"
			};

			const imageInfos = await RecipeServices.getRecipeImageContent("validId");

			expect(imageInfos).toEqual(expectedImageInfos);
		});

		it('should return "undefined" if image not found', async () => {
			mockRecipeQueries.getRecipeImageContent.mockResolvedValue(undefined);

			const detailedRecipe = await RecipeServices.getRecipeImageContent("invalidId");

			expect(detailedRecipe).toBeUndefined();
		});
	});
});