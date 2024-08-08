const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/queries/recipeQueries');
const recipeQueries = require('../../src/queries/recipeQueries');

describe('Test recipes routes', () => {
	describe('GET /recipes', () => {
		it('should return recipes in json with code 200', () => {
			const mockRecipes = [
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
			];
			recipeQueries.getAllRecipes.mockResolvedValue(mockRecipes);
			return request(app)
				.get('/recipes')
				.expect('Content-Type', /json/)
				.expect(200)
				.then(response => {
					expect(response.body).toEqual(mockRecipes);
				});
		});
		it('should return code 500 if query fails', () => {
			recipeQueries.getAllRecipes.mockRejectedValue(new Error('Database query failed'));
			return request(app)
				.get('/recipes')
				.expect(500)
		});
	});

	describe('GET /recipes/:id', () => {
		it('should return a recipe in json with code 200', () => {
			const mockRecipe = {
				id: 'validId',
				name: 'Test Recipe',
				description: 'Test Description',
				preparation_time: 10,
				cooking_time: 20,
				servings: 4,
				image: "/recipes/validId/image"
			};
			recipeQueries.getDetailedRecipeById.mockResolvedValue(mockRecipe);
			return request(app)
				.get('/recipes/validId')
				.expect('Content-Type', /json/)
				.expect(200)
				.then(response => {
					expect(response.body).toEqual(mockRecipe);
				});
		});
		it('throws error with code 404 if recipe not found', () => {
			recipeQueries.getDetailedRecipeById.mockResolvedValue(undefined);
			const expectedMessageError = 'Recette invalidId introuvable';
			return request(app)
				.get('/recipes/invalidId')
				.expect(404)
				.then(response => {
					expect(response.body.message).toEqual(expectedMessageError);
				});
		});
		it('should return code 500 if query fails', () => {
			recipeQueries.getDetailedRecipeById.mockRejectedValue(new Error('Database query failed'));
			return request(app)
				.get('/recipes/invalidId')
				.expect(500)
		});
	});

	describe('GET /recipes/:id/image', () => {
		const onePixelTransparentPngImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=", "base64");

		it('should return an image with code 200', () => {
			const imageInfo = {
				imageContent: onePixelTransparentPngImage,
				imageContentType: 'image/jpeg'
			};
			contentType = 'image/png';
			recipeQueries.getRecipeImageContent.mockResolvedValue(imageInfo);
			return request(app)
				.get('/recipes/validId/image')
				.expect('Content-Type', 'image/jpeg')
				.expect(200)
				.then(response => {
					expect(response.body).toEqual(imageInfo.imageContent);
				});
		});
		it('should return onePixelTransparentPngImage with code 200', () => {
			recipeQueries.getRecipeImageContent.mockResolvedValue(undefined);
			return request(app)
				.get('/recipes/invalidId/image')
				.expect(200)
				.expect('Content-Type', 'image/png')
				.then(response => {
					expect(response.body).toEqual(onePixelTransparentPngImage);
				});
		});
		it('should return code 500 if query fails', async () => {
			recipeQueries.getRecipeImageContent.mockRejectedValue(new Error('Database query failed'));
			return request(app)
				.get('/recipes/invalidId/image')
				.expect(500)
		});
	});
});