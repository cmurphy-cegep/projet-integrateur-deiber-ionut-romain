const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/services/RecipeServices');
const mockRecipeServices = require('../../src/services/RecipeServices');

jest.mock('../../src/services/UserAccountServices');
const mockUserAccountServices = require('../../src/services/UserAccountServices');

describe('Test recipes routes', () => {
	describe('GET /recipes', () => {
		it('should return recipes in json with code 200', async () => {
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

			mockRecipeServices.getAllRecipes.mockResolvedValue(mockRecipes);

			const response = await request(app)
				.get('/recipes')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(response.body).toEqual(mockRecipes);
		});

		it('should return code 500 if query fails', async () => {
			mockRecipeServices.getAllRecipes.mockRejectedValue(new Error('Database query failed'));

			await request(app)
				.get('/recipes')
				.expect(500)
		});
	});

	describe('GET /recipes/:id', () => {
		it('should return a recipe in json with code 200', async () => {
			const mockRecipe = {
				id: 'validId',
				name: 'Test Recipe',
				description: 'Test Description',
				preparation_time: 10,
				cooking_time: 20,
				servings: 4,
				image: "/recipes/validId/image"
			};

			mockRecipeServices.getDetailedRecipeById.mockResolvedValue(mockRecipe);

			const response = await request(app)
				.get('/recipes/validId')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(response.body).toEqual(mockRecipe);
		});

		it('throws error with code 404 if recipe not found', async () => {
			const expectedMessageError = 'Recette invalidId introuvable';

			mockRecipeServices.getDetailedRecipeById.mockResolvedValue(undefined);

			const response = await request(app)
				.get('/recipes/invalidId')
				.expect(404)

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should return code 500 if query fails', async () => {
			mockRecipeServices.getDetailedRecipeById.mockRejectedValue(new Error('Database query failed'));

			await request(app)
				.get('/recipes/invalidId')
				.expect(500)
		});
	});

	describe('GET /recipes/:id/image', () => {
		const onePixelTransparentPngImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=", "base64");

		it('should return an image with code 200', async () => {
			const imageInfo = {
				imageContent: onePixelTransparentPngImage,
				imageContentType: 'image/jpeg'
			};

			mockRecipeServices.getRecipeImageContent.mockResolvedValue(imageInfo);

			const response = await request(app)
				.get('/recipes/validId/image')
				.expect('Content-Type', 'image/jpeg')
				.expect(200)

			expect(response.body).toEqual(imageInfo.imageContent);
		});

		it('should return onePixelTransparentPngImage with code 200', async () => {
			mockRecipeServices.getRecipeImageContent.mockResolvedValue(undefined);

			const response = await request(app)
				.get('/recipes/invalidId/image')
				.expect(200)
				.expect('Content-Type', 'image/png')

			expect(response.body).toEqual(onePixelTransparentPngImage);
		});

		it('should return code 500 if query fails', async () => {
			mockRecipeServices.getRecipeImageContent.mockRejectedValue(new Error('Database query failed'));

			await request(app)
				.get('/recipes/invalidId/image')
				.expect(500)
		});
	});

	describe('POST /recipes', () => {
		let mockUserDetails;
		let recipe;

		beforeEach(() => {
			mockUserDetails = {
				userId: 'userId',
				passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				fullname: 'fullname',
				isAdmin: true
			};

			mockUserAccountServices.getUserByUserId.mockResolvedValue(mockUserDetails);

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
			}
		});

		it('should throw an error with code 403 if user is not admin', async () => {
			const expectedMessageError = `Vous n'avez pas les permissions`;

			mockUserDetails.isAdmin = false;

			const response = await request(app)
				.post('/recipes/')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(403)

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should throw an error with code 400 if no recipeId', async () => {
			const expectedMessageError = `L'identifiant est requis`;

			recipe.id = undefined;

			const response = await request(app)
				.post('/recipes/')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(400)

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should throw an error with forbidden character in recipeId', async () => {
			const expectedMessageError = `L'identifiant contient des caractères interdits`;

			recipe.id = 'ma recette';

			const response = await request(app)
				.post('/recipes/')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(400)

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should throw an error recipeId already exists', async () => {
			const expectedMessageError = `Une recette avec l'id recipeId existe déjà`;

			mockRecipeServices.getRecipeById.mockResolvedValue(true);

			const response = await request(app)
				.post('/recipes/')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(400)

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('with successful creation should return recipe information in json with code 201', async () => {
			mockRecipeServices.getRecipeById.mockResolvedValue(false);
			mockRecipeServices.createRecipe.mockResolvedValue(recipe);

			const response = await request(app)
				.post('/recipes/')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(201)

			expect(response.body).toEqual(recipe);
		});

		it('should return code 500 if query fails', async () => {
			mockRecipeServices.getRecipeById.mockRejectedValue(new Error('Database query failed'));
			await request(app)
				.post('/recipes/')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(500);
		});
	});

	describe('PUT /recipes/:id', () => {
		let mockUserDetails;
		let recipe;

		beforeEach(() => {
			mockUserDetails = {
				userId: 'userId',
				passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				fullname: 'fullname',
				isAdmin: true
			};

			mockUserAccountServices.getUserByUserId.mockResolvedValue(mockUserDetails);

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
			}
		});

		it('should throw an error with code 403 if user is not admin', async () => {
			const expectedMessageError = `Vous n'avez pas les permissions`;

			mockUserDetails.isAdmin = false;

			const response = await request(app)
				.put('/recipes/recipeId')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(403)

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should throw an error with code 400 if parameter recipeId do not match body recipeId', async () => {
			const expectedMessageError = `Le paramètre spécifie l'id recipeId alors que la recette fournie a l'id` +
				' wrongRecipeId';

			recipe.id = 'wrongRecipeId'

			const response = await request(app)
				.put('/recipes/recipeId')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(400)

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should throw an error recipeId do not exist', async () => {
			const expectedMessageError = `L'id recipeId ne correspond à aucune recette existante`;

			mockRecipeServices.getRecipeById.mockResolvedValue(false);

			const response = await request(app)
				.put('/recipes/recipeId')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(404)

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('with successful update should return recipe information in json with code 200', async () => {
			mockRecipeServices.getRecipeById.mockResolvedValue(true);
			mockRecipeServices.updateRecipe.mockResolvedValue(recipe);

			const response = await request(app)
				.put('/recipes/recipeId')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(200)

			expect(response.body).toEqual(recipe);
		});

		it('should return code 500 if query fails', async () => {
			mockRecipeServices.getRecipeById.mockRejectedValue(new Error('Database query failed'));
			await request(app)
				.put('/recipes/recipeId')
				.auth('userId', 'topsecret')
				.send(recipe)
				.expect(500);
		});
	});

	describe('DELETE /recipes/:id', () => {
		let mockUserDetails;

		beforeEach(() => {
			mockUserDetails = {
				userId: 'userId',
				passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				fullname: 'fullname',
				isAdmin: true
			};

			mockUserAccountServices.getUserByUserId.mockResolvedValue(mockUserDetails);
		});

		it('should throw an error with code 403 if user is not admin', async () => {
			const expectedMessageError = `Vous n'avez pas les permissions`;

			mockUserDetails.isAdmin = false;

			const response = await request(app)
				.delete('/recipes/recipeId')
				.auth('userId', 'topsecret')
				.expect(403)

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should throw an error recipeId do not exist', async () => {
			const expectedMessageError = `L'id recipeId ne correspond à aucune recette existante`;

			mockRecipeServices.getRecipeById.mockResolvedValue(false);

			const response = await request(app)
				.delete('/recipes/recipeId')
				.auth('userId', 'topsecret')
				.expect(404)

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('with successful delete should return code 200', async () => {
			mockRecipeServices.getRecipeById.mockResolvedValue(true);

			const response = await request(app)
				.delete('/recipes/recipeId')
				.auth('userId', 'topsecret')
				.expect(200)

			expect(response.body).toEqual({});
		});

		it('should return code 500 if query fails', async () => {
			mockRecipeServices.getRecipeById.mockRejectedValue(new Error('Database query failed'));

			await request(app)
				.delete('/recipes/recipeId')
				.auth('userId', 'topsecret')
				.expect(500);
		});
	});

	describe('POST /recipes/:id/image', () => {
		let mockUserDetails;

		beforeEach(() => {
			mockUserDetails = {
				userId: 'userId',
				passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				fullname: 'fullname',
				isAdmin: true
			};

			mockUserAccountServices.getUserByUserId.mockResolvedValue(mockUserDetails);
		});

		it('should throw an error with code 403 if user is not admin', async () => {
			const expectedMessageError = `Vous n'avez pas les permissions`;

			mockUserDetails.isAdmin = false;

			const response = await request(app)
				.post('/recipes/recipeId/image')
				.auth('userId', 'topsecret')
				.attach('recipe-image', Buffer.from('image content'), 'image.jpg')
				.expect(403);

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should throw an error with code 404 if recipe does not exist', async () => {
			const expectedMessageError = `L'id recipeId ne correspond à aucune recette existante`;

			mockRecipeServices.getRecipeById.mockResolvedValue(false);

			const response = await request(app)
				.post('/recipes/recipeId/image')
				.auth('userId', 'topsecret')
				.attach('recipe-image', Buffer.from('image content'), 'image.jpg')
				.expect(404);

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should successfully update the image and return code 200', async () => {
			mockRecipeServices.getRecipeById.mockResolvedValue(true);

			const response = await request(app)
				.post('/recipes/recipeId/image')
				.auth('userId', 'topsecret')
				.attach('recipe-image', Buffer.from('image content'), 'image.jpg')
				.expect(200);

			expect(response.body).toEqual("");
		});

		it('should return code 500 if query fails', async () => {
			mockRecipeServices.getRecipeById.mockRejectedValue(new Error('Database query failed'));

			await request(app)
				.post('/recipes/recipeId/image')
				.auth('userId', 'topsecret')
				.attach('recipe-image', Buffer.from('image content'), 'image.jpg')
				.expect(500);
		});
	});

	describe('POST /recipes/:id/comments', () => {
		let mockUserDetails;
		let comment

		beforeEach(() => {
			mockUserDetails = {
				userId: 'userId',
				passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				fullname: 'fullname',
				isAdmin: false
			};

			mockUserAccountServices.getUserByUserId.mockResolvedValue(mockUserDetails);

			comment = {
				text: "Text Comment"
			}
		});

		it('should throw an error with code 404 if recipe does not exist', async () => {
			const expectedMessageError = `L'id recipeId ne correspond à aucune recette existante`;

			mockRecipeServices.getRecipeById.mockResolvedValue(false);

			const response = await request(app)
				.post('/recipes/recipeId/comments')
				.auth('userId', 'topsecret')
				.send(comment)
				.expect(404);

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should successfully create the comment and return code 201 with comment', async () => {
			const mockComment = {
				text: 'Test Comment',
				publicationDate: '2024-08-10 18:30:00',
				fullname: 'user fullname'
			};
			const expectedComment = mockComment;

			mockRecipeServices.getRecipeById.mockResolvedValue(true);
			mockRecipeServices.createRecipeComment.mockResolvedValue(mockComment);

			const response = await request(app)
				.post('/recipes/recipeId/comments')
				.auth('userId', 'topsecret')
				.send(comment)
				.expect(201);

			expect(response.body).toEqual(expectedComment);
		});

		it('should return code 500 if query fails', async () => {
			mockRecipeServices.getRecipeById.mockRejectedValue(new Error('Database query failed'));

			await request(app)
				.post('/recipes/recipeId/comments')
				.auth('userId', 'topsecret')
				.send(comment)
				.expect(500);
		});
	});

	describe('POST /recipes/:id/ratings', () => {
		let mockUserDetails;
		let rating

		beforeEach(() => {
			mockUserDetails = {
				userId: 'userId',
				passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				fullname: 'fullname',
				isAdmin: false
			};

			mockUserAccountServices.getUserByUserId.mockResolvedValue(mockUserDetails);

			rating = {rating: 3}
		});

		it('should throw an error with code 404 if recipe does not exist', async () => {
			const expectedMessageError = `L'id recipeId ne correspond à aucune recette existante`;

			mockRecipeServices.getRecipeById.mockResolvedValue(false);

			const response = await request(app)
				.post('/recipes/recipeId/ratings')
				.auth('userId', 'topsecret')
				.send(rating)
				.expect(404);

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should successfully add or update the rating and return code 200 with comment', async () => {
			const mockRating = {rating: 3};
			const expectedRating = mockRating;

			mockRecipeServices.getRecipeById.mockResolvedValue(true);
			mockRecipeServices.addOrUpdateRecipeRating.mockResolvedValue(mockRating);

			const response = await request(app)
				.post('/recipes/recipeId/ratings')
				.auth('userId', 'topsecret')
				.send(rating)
				.expect(200);

			expect(response.body).toEqual(expectedRating);
		});

		it('should return code 500 if query fails', async () => {
			mockRecipeServices.getRecipeById.mockRejectedValue(new Error('Database query failed'));

			await request(app)
				.post('/recipes/recipeId/ratings')
				.auth('userId', 'topsecret')
				.send(rating)
				.expect(500);
		});
	});

	describe('GET /recipes/:id/ratings/user-rating', () => {
		let mockUserDetails;

		beforeEach(() => {
			mockUserDetails = {
				userId: 'userId',
				passwordHash: 'UeexcyA2hWKIZejQoV2ajaqhdvxqyZHXGmfRzg3TwJLhhmiBVGzYh8bUkKCsWJZ4E9oFmuQwEHYBI63pQK47Vw==',
				passwordSalt: 'HLq2XxQQdDT/Fj0pRI3JNA==',
				fullname: 'fullname',
				isAdmin: false
			};

			mockUserAccountServices.getUserByUserId.mockResolvedValue(mockUserDetails);
		});

		it('should throw an error with code 404 if recipe does not exist', async () => {
			const expectedMessageError = `L'id recipeId ne correspond à aucune recette existante`;

			mockRecipeServices.getRecipeById.mockResolvedValue(false);

			const response = await request(app)
				.get('/recipes/recipeId/ratings/user-rating')
				.auth('userId', 'topsecret')
				.expect(404);

			expect(response.body.message).toEqual(expectedMessageError);
		});

		it('should return a rating in json with code 200', async () => {
			const mockRating = {rating: 3};

			mockRecipeServices.getRecipeById.mockResolvedValue(true);
			mockRecipeServices.getUserRatingForRecipe.mockResolvedValue(mockRating);

			const response = await request(app)
				.get('/recipes/recipeId/ratings/user-rating')
				.auth('userId', 'topsecret')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(response.body).toEqual(mockRating);
		});

		it('should return code 500 if query fails', async () => {
			mockRecipeServices.getRecipeById.mockRejectedValue(new Error('Database query failed'));

			await request(app)
				.get('/recipes/recipeId/ratings/user-rating')
				.auth('userId', 'topsecret')
				.expect(500)
		});
	});
});