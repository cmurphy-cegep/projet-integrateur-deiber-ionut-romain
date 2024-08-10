const RecipeServices = require('../../src/services/RecipeServices');

jest.mock('../../src/queries/RecipeQueries');
const mockRecipeQueries = require('../../src/queries/RecipeQueries');
const HttpError = require("../../src/error/HttpError");

describe('Test recipe services', () => {
	describe('Recipe', () => {
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
				mockRecipeQueries.getRecipeIngredients.mockResolvedValue(mockGetRecipeIngredientsByRecipeId);
				mockRecipeQueries.getRecipeSteps.mockResolvedValue(mockGetRecipeStepsRecipeById);

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

		describe('createRecipe', () => {
			let recipe;

			beforeEach(() => {
				recipe = {
					id: 'recipeId',
					name: 'Test Recipe',
					description: 'Test Description',
					preparation_time: 10,
					cooking_time: 20,
					servings: 4,
					ingredients: [
						{index: 1, name: 'Ingredient 1', quantity: '2', unit: 'ml'},
						{index: 2, name: 'Ingredient 2', quantity: '1', unit: 'g'}
					],
					steps: [
						{index: 1, description: 'Step 1 description'},
						{index: 2, description: 'Step 2 description'}
					]
				};
			});

			it('should throw an error if name is undefined', async () => {
				recipe.name = undefined;

				const expectedError = new HttpError(400, "Le nom est requis");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if name is undefined', async () => {
				recipe.description = undefined;

				const expectedError = new HttpError(400, "La description est requise");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if preparation_time is not an integer', async () => {
				recipe.preparation_time = 1.5;

				const expectedError = new HttpError(400, "Le temps de préparation doit être un nombre entier");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if cooking_time is not an integer', async () => {
				recipe.cooking_time = 1.5;

				const expectedError = new HttpError(400, "Le temps de cuisson doit être un nombre entier");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if servings is not an integer', async () => {
				recipe.servings = 1.5;

				const expectedError = new HttpError(400, "Le nombre de portions doit être un nombre entier");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if no ingredient', async () => {
				recipe.ingredients = [];

				const expectedError = new HttpError(400, "Les ingrédients sont requis");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if ingredient index is undefined', async () => {
				recipe.ingredients.at(0).index = undefined;

				const expectedError = new HttpError(400, "Le numéro de l\'ingrédient est requis");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if ingredient index is not an integer', async () => {
				recipe.ingredients.at(0).index = 1.5;

				const expectedError = new HttpError(400, "Le numéro de l\'ingrédient est requis");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if ingredient name is undefined', async () => {
				recipe.ingredients.at(0).name = undefined;

				const expectedError = new HttpError(400, "Le nom de l\'ingrédient est requis");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if servings is not an integer', async () => {
				recipe.ingredients.at(0).quantity = "not a number";

				const expectedError = new HttpError(400, "La quantité de l\'ingrédient doit être un nombre");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if no step', async () => {
				recipe.steps = [];

				const expectedError = new HttpError(400, "Les étapes sont requises");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if step index is undefined', async () => {
				recipe.steps.at(0).index = undefined;

				const expectedError = new HttpError(400, "Le numéro de l\'étape est requis");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if step index is not an integer', async () => {
				recipe.steps.at(0).index = 1.5;

				const expectedError = new HttpError(400, "Le numéro de l\'étape est requis");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if step description is undefined', async () => {
				recipe.steps.at(0).description = undefined;

				const expectedError = new HttpError(400, "La description de l\'étape est requise");

				await expect(RecipeServices.createRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should return inserted recipe', async () => {
				const mockDetailedRecipe = {
					id: 'recipeId',
					name: 'Test Recipe',
					description: 'Test Description',
					preparation_time: 10,
					cooking_time: 20,
					servings: 4,
					ingredients: [
						{index: 1, name: 'Ingredient 1', quantity: '2', unit: 'ml'},
						{index: 2, name: 'Ingredient 2', quantity: '1', unit: 'g'}
					],
					steps: [
						{index: 1, description: 'Step 1 description'},
						{index: 2, description: 'Step 2 description'}
					]
				};

				const expectedDetailedRecipe = mockDetailedRecipe;

				jest.spyOn(RecipeServices, 'getDetailedRecipeById').mockResolvedValue(mockDetailedRecipe);

				const detailedRecipe = await RecipeServices.createRecipe(recipe);

				expect(mockRecipeQueries.createRecipe).toHaveBeenCalled();
				expect(detailedRecipe).toEqual(expectedDetailedRecipe);
			});
		});

		describe('updateRecipe', () => {
			let recipe;

			beforeEach(() => {
				recipe = {
					id: 'recipeId',
					name: 'Test Recipe',
					description: 'Test Description',
					preparation_time: 10,
					cooking_time: 20,
					servings: 4,
					ingredients: [
						{index: 1, name: 'Ingredient 1', quantity: '2', unit: 'ml'},
						{index: 2, name: 'Ingredient 2', quantity: '1', unit: 'g'}
					],
					steps: [
						{index: 1, description: 'Step 1 description'},
						{index: 2, description: 'Step 2 description'}
					]
				};
			});

			it('should throw an error if name is undefined', async () => {
				recipe.name = undefined;

				const expectedError = new HttpError(400, "Le nom est requis");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if name is undefined', async () => {
				recipe.description = undefined;

				const expectedError = new HttpError(400, "La description est requise");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if preparation_time is not an integer', async () => {
				recipe.preparation_time = 1.5;

				const expectedError = new HttpError(400, "Le temps de préparation doit être un nombre entier");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if cooking_time is not an integer', async () => {
				recipe.cooking_time = 1.5;

				const expectedError = new HttpError(400, "Le temps de cuisson doit être un nombre entier");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if servings is not an integer', async () => {
				recipe.servings = 1.5;

				const expectedError = new HttpError(400, "Le nombre de portions doit être un nombre entier");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if no ingredient', async () => {
				recipe.ingredients = [];

				const expectedError = new HttpError(400, "Les ingrédients sont requis");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if ingredient index is undefined', async () => {
				recipe.ingredients.at(0).index = undefined;

				const expectedError = new HttpError(400, "Le numéro de l\'ingrédient est requis");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if ingredient index is not an integer', async () => {
				recipe.ingredients.at(0).index = 1.5;

				const expectedError = new HttpError(400, "Le numéro de l\'ingrédient est requis");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if ingredient name is undefined', async () => {
				recipe.ingredients.at(0).name = undefined;

				const expectedError = new HttpError(400, "Le nom de l\'ingrédient est requis");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if servings is not an integer', async () => {
				recipe.ingredients.at(0).quantity = "not a number";

				const expectedError = new HttpError(400, "La quantité de l\'ingrédient doit être un nombre");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if no step', async () => {
				recipe.steps = [];

				const expectedError = new HttpError(400, "Les étapes sont requises");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if step index is undefined', async () => {
				recipe.steps.at(0).index = undefined;

				const expectedError = new HttpError(400, "Le numéro de l\'étape est requis");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if step index is not an integer', async () => {
				recipe.steps.at(0).index = 1.5;

				const expectedError = new HttpError(400, "Le numéro de l\'étape est requis");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should throw an error if step description is undefined', async () => {
				recipe.steps.at(0).description = undefined;

				const expectedError = new HttpError(400, "La description de l\'étape est requise");

				await expect(RecipeServices.updateRecipe(recipe)).rejects.toThrow(expectedError);
			});

			it('should return inserted recipe', async () => {
				const mockDetailedRecipe = {
					id: 'recipeId',
					name: 'Test Recipe',
					description: 'Test Description',
					preparation_time: 10,
					cooking_time: 20,
					servings: 4,
					ingredients: [
						{index: 1, name: 'Ingredient 1', quantity: '2', unit: 'ml'},
						{index: 2, name: 'Ingredient 2', quantity: '1', unit: 'g'}
					],
					steps: [
						{index: 1, description: 'Step 1 description'},
						{index: 2, description: 'Step 2 description'}
					]
				};

				const expectedDetailedRecipe = mockDetailedRecipe;

				jest.spyOn(RecipeServices, 'getDetailedRecipeById').mockResolvedValue(mockDetailedRecipe);

				const detailedRecipe = await RecipeServices.updateRecipe(recipe);

				expect(mockRecipeQueries.updateRecipe).toHaveBeenCalled();
				expect(detailedRecipe).toEqual(expectedDetailedRecipe);
			});
		});

		it('deleteRecipe should throw an error when no recipe is deleted', async () => {
			mockRecipeQueries.deleteRecipe.mockResolvedValue(false);

			const expectedError = new HttpError(500, "Erreur lors de la suppression de la recette");

			await expect(RecipeServices.deleteRecipe('recipeId')).rejects.toThrow(expectedError);
		});
	});

	describe('Image', () => {
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

		describe('updateRecipeImage', () => {
			it('should throw an error when image not updated', async () => {
				mockRecipeQueries.updateRecipeImage.mockResolvedValue(false);

				const expectedError = new Error("Erreur lors de la mise-à-jour de l'image");

				await expect(RecipeServices.updateRecipeImage('recipeId')).rejects.toThrow(expectedError);
			});

			it('updateRecipeImage should return updated image', async () => {
				const mockImageDetails = {
					imageContent: "image content",
					imageContentType: "image content type"
				}

				const expectedImageDetails = mockImageDetails;

				mockRecipeQueries.updateRecipeImage.mockResolvedValue(true);

				jest.spyOn(RecipeServices, 'getRecipeImageContent').mockResolvedValue(mockImageDetails);

				const imageDetails = await RecipeServices.updateRecipeImage("recipeId", "imageBuffer", "imageContentType")

				expect(imageDetails).toEqual(expectedImageDetails);
			});
		});
	});

	describe('Comment', () => {
		describe('_getRecipeComment', () => {
			it('should return a comment', async () => {
				const recipeId = "validId";
				const mockComment = {
					text: 'Test Comment',
					publication_date: '2024-08-10 18:30:00',
					full_name: 'user fullname'
				};

				mockRecipeQueries.getRecipeComment.mockResolvedValue(mockComment);

				const expectedComment = {
					text: 'Test Comment',
					publicationDate: '2024-08-10 18:30:00',
					fullname: 'user fullname'
				}

				const comment = await RecipeServices._getRecipeComment(recipeId);

				expect(comment).toEqual(expectedComment);
			});

			it('should return "undefined" if comment id not found ', async () => {
				mockRecipeQueries.getRecipeComment.mockResolvedValue(undefined);

				const comment = await RecipeServices._getRecipeComment("invalidId");

				expect(comment).toBeUndefined();
			});
		});

		it('_addPropertiesToComment should add properties to comment', async () => {
			const comment = {
				text: 'Text Comment'
			};
			const expectedComment = {
				text: 'Text Comment',
				publicationDate: new Date().toISOString(),
				userId: 'userId',
				recipeId: 'recipeId'
			};

			await RecipeServices._addPropertiesToComment(comment, 'userId', 'recipeId');

			expect(comment.text).toEqual(expectedComment.text);
			expect(comment.publicationDate).toBeDefined();
			expect(comment.userId).toEqual('userId');
			expect(comment.recipeId).toEqual('recipeId');
		});

		describe('createRecipeComment', () => {
			it('should throw an error if text is undefined', async () => {
				const comment = {};
				const expectedError = new HttpError(400, "Le texte est requis");

				await expect(RecipeServices.createRecipeComment('recipeId', 'userId', comment)).rejects.toThrow(expectedError);
			});

			it('createRecipeComment should throw an error if query fails', async () => {
				const comment = {
					text: 'Text Comment'
				};

				const expectedError = new Error("Erreur lors de la création du commentaire");

				jest.spyOn(RecipeServices, '_addPropertiesToComment');
				mockRecipeQueries.insertRecipeComment.mockResolvedValue(undefined);

				await expect(RecipeServices.createRecipeComment('recipeId', 'userId', comment)).rejects.toThrow(expectedError);
			});

			it('should return the inserted comment', async () => {
				const comment = {
					text: 'Text Comment'
				};

				const mockComment = {
					text: 'Test Comment',
					publicationDate: '2024-08-10 18:30:00',
					fullname: 'user fullname'
				}

				const expectedComment = mockComment;

				jest.spyOn(RecipeServices, '_addPropertiesToComment');
				mockRecipeQueries.insertRecipeComment.mockResolvedValue('commentId');
				jest.spyOn(RecipeServices, '_getRecipeComment').mockResolvedValue(mockComment);

				const resultComment = await RecipeServices.createRecipeComment('commentId', 'userId', comment);

				expect(resultComment).toEqual(expectedComment);
			});
		});
	});
});