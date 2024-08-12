const RecipeQueries = require('../../src/queries/RecipeQueries.js');

jest.mock('../../src/queries/dbPool');
const mockPool = require('../../src/queries/dbPool');
const mockClient = {
	query: jest.fn(),
	release: jest.fn()
};

describe('Test recipes queries', () => {
	describe('Recipe', () => {
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

			const expectedResult = [
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

			expect(result).toEqual(expectedResult);
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

				const expectedResult = {
					recipe_id: recipeId,
					name: 'Test Recipe',
					description: 'Test Description',
					preparation_time: 10,
					cooking_time: 20,
					servings: 4
				};

				mockPool.query.mockResolvedValue(mockResult);

				const result = await RecipeQueries.getRecipeById(recipeId);

				expect(result).toEqual(expectedResult);
			});

			it('should return "undefined" if recipe id not found', async () => {
				mockPool.query.mockResolvedValue({rows: []});

				const result = await RecipeQueries.getRecipeById("invalidId");

				expect(result).toBeUndefined();
			});
		});

		it('getRecipeIngredients should return recipe ingredients with valid recipe id', async () => {
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

			const expectedResult = [
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

			const result = await RecipeQueries.getRecipeIngredients(recipeId);

			expect(result).toEqual(expectedResult);
		});

		it('getRecipeSteps should return recipe steps with valid recipe id', async () => {
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

			const expectedResult = [
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

			const result = await RecipeQueries.getRecipeSteps(recipeId);

			expect(result).toEqual(expectedResult);
		});

		describe('createRecipe', () => {
			const recipe = {
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

			it('should call queries functions, commit the transaction and release client', async () => {
				mockPool.connect.mockResolvedValue(mockClient);
				jest.spyOn(RecipeQueries, '_insertRecipeDescription');
				jest.spyOn(RecipeQueries, '_insertRecipeIngredients');
				jest.spyOn(RecipeQueries, '_insertRecipeSteps');


				await RecipeQueries.createRecipe(recipe);

				expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
				expect(RecipeQueries._insertRecipeDescription).toHaveBeenCalled();
				expect(RecipeQueries._insertRecipeIngredients).toHaveBeenCalled();
				expect(RecipeQueries._insertRecipeSteps).toHaveBeenCalled();
				expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
				expect(mockClient.release).toHaveBeenCalled();
			});

			it('should roll back the transaction if an error occurs', async () => {
				jest.spyOn(RecipeQueries, '_insertRecipeDescription').mockRejectedValue(new Error('Test error'));

				await expect(RecipeQueries.createRecipe(recipe)).rejects.toThrow('Test error');
				expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
				expect(mockClient.release).toHaveBeenCalled();
			});
		});

		describe('updateRecipe', () => {
			const recipe = {
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

			it('should call queries functions, commit the transaction and release client', async () => {
				mockPool.connect.mockResolvedValue(mockClient);
				jest.spyOn(RecipeQueries, '_editRecipeDescription');
				jest.spyOn(RecipeQueries, '_deleteRecipeIngredients');
				jest.spyOn(RecipeQueries, '_insertRecipeIngredients');
				jest.spyOn(RecipeQueries, '_deleteRecipeSteps');
				jest.spyOn(RecipeQueries, '_insertRecipeSteps');

				await RecipeQueries.updateRecipe(recipe);

				expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
				expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
				expect(RecipeQueries._editRecipeDescription).toHaveBeenCalled();
				expect(RecipeQueries._deleteRecipeIngredients).toHaveBeenCalled();
				expect(RecipeQueries._insertRecipeIngredients).toHaveBeenCalled();
				expect(RecipeQueries._deleteRecipeSteps).toHaveBeenCalled();
				expect(RecipeQueries._insertRecipeSteps).toHaveBeenCalled();
				expect(mockClient.release).toHaveBeenCalled();
			});

			it('should roll back the transaction if an error occurs', async () => {
				jest.spyOn(RecipeQueries, '_editRecipeDescription').mockRejectedValue(new Error('Test error'));

				await expect(RecipeQueries.updateRecipe(recipe)).rejects.toThrow('Test error');
				expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
				expect(mockClient.release).toHaveBeenCalled();
			});
		});

		describe('deleteRecipe', () => {
			it('should return true when a recipe is deleted', async () => {
				mockPool.query.mockResolvedValue({rowCount: 1});

				const result = await RecipeQueries.deleteRecipe('validId');

				expect(result).toBeTruthy();
			});

			it('should return false when delete recipe fails', async () => {
				mockPool.query.mockResolvedValue({rowCount: 0});

				const result = await RecipeQueries.deleteRecipe('invalidId');

				expect(result).toBeFalsy();
			});
		});
	});

	describe('Image', () => {
		describe('getRecipeImageContent', () => {
			it('should return recipe image content and type with valid recipe id', async () => {
				const recipeId = 'validId';
				const mockResult = {
					rows: [{
						image_content: 'imageContent',
						image_content_type: 'image/jpeg'
					}]
				};

				const expectedResult = {
					image_content: 'imageContent',
					image_content_type: 'image/jpeg'
				};

				mockPool.query.mockResolvedValue(mockResult);

				const result = await RecipeQueries.getRecipeImageContent(recipeId);

				expect(result).toEqual(expectedResult);
			});

			it('should return "undefined" if recipe id not found', async () => {
				mockPool.query.mockResolvedValue({rows: []});

				const result = await RecipeQueries.getRecipeImageContent("invalidId");

				expect(result).toBeUndefined();
			});
		});

		describe('updateRecipeImage', () => {
			it('should return true when image is updated', async () => {
				mockPool.query.mockResolvedValue({rowCount: 1});

				const result = await RecipeQueries.updateRecipeImage('recipeId');

				expect(result).toBeTruthy();
			});

			it('should return false when image is not updated', async () => {
				mockPool.query.mockResolvedValue({rowCount: 0});

				const result = await RecipeQueries.updateRecipeImage('recipeId');

				expect(result).toBeFalsy();
			});
		});
	});

	describe('Comment', () => {
		describe('getRecipeComment', () => {
			it('should return comment details with valid comment id', async () => {
				const commenteId = 'validId';
				const mockResult = {
					rows: [{
						text: 'Test Comment',
						publication_date: '2024-08-10 18:30:00',
						full_name: 'user fullname'
					}]
				};

				const expectedResult = {
					text: 'Test Comment',
					publication_date: '2024-08-10 18:30:00',
					full_name: 'user fullname'
				};

				mockPool.query.mockResolvedValue(mockResult);

				const result = await RecipeQueries.getRecipeComment(commenteId);

				expect(result).toEqual(expectedResult);
			});

			it('should return "undefined" if comment id not found', async () => {
				mockPool.query.mockResolvedValue({rows: []});

				const result = await RecipeQueries.getRecipeComment("invalidId");

				expect(result).toBeUndefined();
			});
		});

		it('getRecipeComments should return recipe comments with valid recipe id', async () => {
			const recipeId = 'validId';
			const mockResult = {
				rows: [
					{
						text: 'Test Comment 1',
						publication_date: '2024-08-10 18:30:00',
						full_name: 'user fullname'
					},
					{
						text: 'Test Comment 2',
						publication_date: '2024-08-10 18:30:00',
						full_name: 'user fullname'
					}
				]
			};

			const expectedResult = [
				{
					text: 'Test Comment 1',
					publication_date: '2024-08-10 18:30:00',
					full_name: 'user fullname'
				},
				{
					text: 'Test Comment 2',
					publication_date: '2024-08-10 18:30:00',
					full_name: 'user fullname'
				}
			];

			mockPool.query.mockResolvedValue(mockResult);

			const result = await RecipeQueries.getRecipeComments(recipeId);

			expect(result).toEqual(expectedResult);
		});

		it('insertRecipeComment should return commentID', async () => {
			const commentId = 'validId';
			const comment = {
				text: 'Test Comment',
				publicationDate: '2024-08-10 18:30:00',
				userId: 'userId',
				recipeId: 'recipeId'
			}
			const mockResult = {
				rows: [
					{
						comment_id: commentId
					},
				]
			};

			mockPool.query.mockResolvedValue(mockResult);

			const result = await RecipeQueries.insertRecipeComment(comment);

			expect(result).toEqual(commentId);
		});
	});

	describe('Rating', () => {
		describe('getUserRatingForRecipe', () => {
			it('should return user rating if exists', async () => {
				const mockResult = {
					rows: [{
						rating: 3
					}]
				};
				const expectedResult = {
					rating: 3
				};

				mockPool.query.mockResolvedValue(mockResult);

				const result = await RecipeQueries.getUserRatingForRecipe('recipeId', 'userId');

				expect(result).toEqual(expectedResult);
			});

			it('should return "undefined" if comment id not found', async () => {
				mockPool.query.mockResolvedValue({rows: []});

				const result = await RecipeQueries.getUserRatingForRecipe('recipeId', 'userId');

				expect(result).toBeUndefined();
			});
		});

		it('getRecipeRatings should return recipe ratings', async () => {
			const mockResult = {rows: [{rating: 2}, {rating: 3}]};

			const expectedResult = [{rating: 2}, {rating: 3}];

			mockPool.query.mockResolvedValue(mockResult);

			const result = await RecipeQueries.getRecipeRatings('recipeId');

			expect(result).toEqual(expectedResult);
		});

		it('insertRecipeRating should return rating', async () => {
			const mockResult = {rows: [{rating: 3}]};
			const expectedResult = 3;

			mockPool.query.mockResolvedValue(mockResult);

			const result = await RecipeQueries.insertRecipeRating('recipeId', 'userId', 3);

			expect(result).toEqual(expectedResult);
		});

		describe('updateRecipeRating', () => {
			it('should return true when a rating is updated', async () => {
				mockPool.query.mockResolvedValue({rowCount: 1});

				const result = await RecipeQueries.updateRecipeRating('validId');

				expect(result).toBeTruthy();
			});

			it('should return false when rating update fails', async () => {
				mockPool.query.mockResolvedValue({rowCount: 0});

				const result = await RecipeQueries.updateRecipeRating('invalidId');

				expect(result).toBeFalsy();
			});
		});
	});
});