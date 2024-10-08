const HttpError = require("../error/HttpError");
const RecipeQueries = require('../queries/RecipeQueries.js');

class RecipeServices {
	static _addPropertiesToComment(comment, userId, recipeId) {
		comment.text = "" + comment.text;
		comment.publicationDate = new Date().toISOString();
		comment.userId = "" + userId;
		comment.recipeId = "" + recipeId;
	}

	static _checkRecipeDescription(recipe) {
		if (!recipe.name) {
			throw new HttpError(400, 'Le nom est requis');
		}

		if (!recipe.description) {
			throw new HttpError(400, 'La description est requise');
		}
		if (recipe.preparation_time) {
			if (!Number.isInteger(recipe.preparation_time)) {
				throw new HttpError(400, 'Le temps de préparation doit être un nombre entier');
			}
		}

		if (recipe.cooking_time && !Number.isInteger(recipe.cooking_time)) {
			throw new HttpError(400, 'Le temps de cuisson doit être un nombre entier');
		}

		if (recipe.servings && !Number.isInteger(recipe.servings)) {
			throw new HttpError(400, 'Le nombre de portions doit être un nombre entier');
		}
	}

	static _checkRecipeIngredients(recipe) {
		if (!recipe.ingredients || recipe.ingredients.length === 0) {
			throw new HttpError(400, 'Les ingrédients sont requis');
		}

		for (const ingredient of recipe.ingredients) {
			if (!ingredient.index || !Number.isInteger(ingredient.index)) {
				throw new HttpError(400, `Le numéro de l'ingrédient est requis`);
			}
			if (!ingredient.name) {
				throw new HttpError(400, `Le nom de l'ingrédient est requis`);
			}

			if (ingredient.quantity && isNaN(ingredient.quantity)) {
				throw new HttpError(400, `La quantité de l'ingrédient doit être un nombre`);
			}
		}
	}

	static _checkRecipeProperties(recipe) {
		this._checkRecipeDescription(recipe);
		this._checkRecipeIngredients(recipe);
		this._checkRecipeSteps(recipe);
	}

	static _checkRecipeSteps(recipe) {
		if (!recipe.steps || recipe.steps.length === 0) {
			throw new HttpError(400, 'Les étapes sont requises');
		}

		for (const step of recipe.steps) {
			if (!step.index || !Number.isInteger(step.index)) {
				throw new HttpError(400, `Le numéro de l'étape est requis`);
			}
			if (!step.description) {
				throw new HttpError(400, `La description de l'étape est requise`);
			}
		}
	}

	static _convertRecipePropertiesToString(recipe) {
		recipe.id = "" + recipe.id;
		recipe.name = "" + recipe.name;
		recipe.description = "" + recipe.description;
		if (recipe.preparation_time) {
			recipe.preparation_time = "" + recipe.preparation_time;
		}
		if (recipe.cooking_time) {
			recipe.cooking_time = "" + recipe.cooking_time;
		}
		if (recipe.servings) {
			recipe.servings = "" + recipe.servings;
		}
		for (const ingredient of recipe.ingredients) {
			ingredient.index = "" + ingredient.index;
			ingredient.name = "" + ingredient.name;
			if (ingredient.quantity) {
				ingredient.quantity = "" + ingredient.quantity;
			}
			if (ingredient.unit) {
				ingredient.unit = "" + ingredient.unit;
			}
		}
		for (const step of recipe.steps) {
			step.index = "" + step.index;
			step.description = "" + step.description;
		}
	}

	static _convertToRecipe(row) {
		return {
			id: row.recipe_id,
			name: row.name,
			description: row.description,
			preparation_time: row.preparation_time,
			cooking_time: row.cooking_time,
			servings: row.servings,
			image: this._getImagePathForRecipeId(row.recipe_id)
		};
	}

	static async _createRating(recipeId, userId, rating) {
		const createdRating = await RecipeQueries.insertRecipeRating(recipeId, userId, rating);
		if (!createdRating) {
			throw new Error("Erreur lors de la création de la note");
		}
		return this.getUserRatingForRecipe(recipeId, userId);
	}

	static _getImagePathForRecipeId(recipeId) {
		return `/recipes/${recipeId}/image`;
	}

	static _getRatingsStats(ratings) {
		const ratingCount = ratings.length;
		let total = 0;

		ratings.forEach(rating => {
			total += rating.rating;
		});

		const average = ratingCount > 0 ? total / ratingCount : undefined;

		return {
			ratingAverage: average,
			ratingCount: ratingCount
		};
	}

	static async _getRecipeComment(commentId) {
		const result = await RecipeQueries.getRecipeComment(commentId);
		if (result) {
			return {
				text: result.text,
				publicationDate: result.publication_date,
				fullname: result.full_name
			}
		}
		return undefined;
	}

	static async _getRecipeComments(recipeId) {
		const results = await RecipeQueries.getRecipeComments(recipeId);
		return results.map(result => ({
			text: result.text,
			publicationDate: result.publication_date,
			fullname: result.full_name
		}));
	}

	static async _updateRating(recipeId, userId, rating) {
		const isUpdated = await RecipeQueries.updateRecipeRating(recipeId, userId, rating);
		if (!isUpdated) {
			throw new Error("Erreur lors de la mise-à-jour de la note");
		}
		return this.getUserRatingForRecipe(recipeId, userId);
	}

	static async addOrUpdateRecipeRating(recipeId, userId, rating) {
		if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
			throw new HttpError(400, 'La note doit être un nombre entier compris entre 1 et 5');
		}

		const existingRating = await RecipeQueries.getUserRatingForRecipe(recipeId, userId);
		if (existingRating) {
			return await this._updateRating(recipeId, userId, rating);
		}
		return await this._createRating(recipeId, userId, rating);
	}

	static async createRecipe(recipe) {
		this._checkRecipeProperties(recipe);
		this._convertRecipePropertiesToString(recipe);
		await RecipeQueries.createRecipe(recipe);
		return this.getDetailedRecipeById(recipe.id);
	}

	static async createRecipeComment(recipeId, userId, comment) {
		if (!comment.text) {
			throw new HttpError(400, 'Le texte est requis');
		}

		this._addPropertiesToComment(comment, userId, recipeId);

		const commentId = await RecipeQueries.insertRecipeComment(comment);
		if (!commentId) {
			throw new Error("Erreur lors de la création du commentaire");
		}

		return this._getRecipeComment(commentId);
	}

	static async deleteRecipe(recipeId) {
		const isDeleted = await RecipeQueries.deleteRecipe(recipeId);
		if (!isDeleted) {
			throw new Error("Erreur lors de la suppression de la recette");
		}
	}

	static async getAllRecipes() {
		const results = await RecipeQueries.getAllRecipes();
		return results.map(result => this._convertToRecipe(result));
	}

	static async getDetailedRecipeById(recipeId) {
		const recipe = await this.getRecipeById(recipeId);
		if (recipe) {
			recipe.ingredients = await RecipeQueries.getRecipeIngredients(recipeId);
			recipe.steps = await RecipeQueries.getRecipeSteps(recipeId);
			recipe.comments = await this._getRecipeComments(recipeId);

			const ratings = await RecipeQueries.getRecipeRatings(recipeId);
			recipe.ratings = this._getRatingsStats(ratings);

			return recipe;
		}
		return undefined;
	}

	static async getRecipeById(recipeId) {
		const result = await RecipeQueries.getRecipeById(recipeId);

		if (result) {
			return this._convertToRecipe(result);
		}
		return undefined;
	}

	static async getRecipeImageContent(recipeId) {
		const result = await RecipeQueries.getRecipeImageContent(recipeId);

		if (result) {
			return {
				imageContent: result.image_content,
				imageContentType: result.image_content_type
			};
		}
		return undefined;
	}

	static async getUserRatingForRecipe(recipeId, userId) {
		const result = await RecipeQueries.getUserRatingForRecipe(recipeId, userId);
		return result;
	}

	static async updateRecipe(recipe) {
		this._checkRecipeProperties(recipe);
		this._convertRecipePropertiesToString(recipe);
		await RecipeQueries.updateRecipe(recipe);
		return this.getDetailedRecipeById(recipe.id);
	}

	static async updateRecipeImage(recipeId, imageBuffer, imageContentType) {
		const isUpdated = await RecipeQueries.updateRecipeImage(recipeId, imageBuffer, imageContentType);
		if (!isUpdated) {
			throw new Error("Erreur lors de la mise-à-jour de l'image");
		}

		return await this.getRecipeImageContent(recipeId);
	}
}

module.exports = RecipeServices;