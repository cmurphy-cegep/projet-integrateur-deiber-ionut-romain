const HttpError = require("../error/HttpError");
const RecipeQueries = require('../queries/RecipeQueries.js');

class RecipeServices {
	static _checkRecipeProperties(recipe) {
		if (!recipe.name) {
			throw new HttpError(400, 'Le nom est requis');
		}

		if (!recipe.description) {
			throw new HttpError(400, 'La description est requise');
		}

		if (recipe.preparation_time !== '' && !Number.isInteger(recipe.preparation_time)) {
			throw new HttpError(400, 'Le temps de préparation doit être un nombre entier');
		}

		if (recipe.cooking_time !== '' && !Number.isInteger(recipe.cooking_time)) {
			throw new HttpError(400, 'Le temps de cuisson doit être un nombre entier');
		}

		if (recipe.servings !== '' && !Number.isInteger(recipe.servings)) {
			throw new HttpError(400, 'Le nombre de portions doit être un nombre entier');
		}

		if (!recipe.ingredients || recipe.ingredients.length === 0) {
			throw new HttpError(400, 'Les ingrédients sont requis');
		}

		for (const ingredient of recipe.ingredients) {
			if (!ingredient.index || !Number.isInteger(ingredient.index)) {
				throw new HttpError(400, 'Le numéro de l\'ingrédient est requis');
			}
			if (!ingredient.name) {
				throw new HttpError(400, 'Le nom de l\'ingrédient est requis');
			}

			if (ingredient.quantity !== '' && isNaN(ingredient.quantity)) {
				throw new HttpError(400, 'La quantité de l\'ingrédient doit être un nombre');
			}
		}

		if (!recipe.steps || recipe.steps.length === 0) {
			throw new HttpError(400, 'Les étapes sont requises');
		}

		for (const step of recipe.steps) {
			if (!step.index || !Number.isInteger(step.index)) {
				throw new HttpError(400, 'Le numéro de l\'étape est requis');
			}
			if (!step.description) {
				throw new HttpError(400, 'La description de l\'étape est requise');
			}
		}
	}

	static _convertRecipePropertiesToString(recipe) {
		recipe.id = "" + recipe.id;
		recipe.name = "" + recipe.name;
		recipe.description = "" + recipe.description;
		recipe.preparation_time = "" + recipe.preparation_time;
		recipe.cooking_time = "" + recipe.cooking_time;
		recipe.serving = "" + recipe.servings;
		recipe.ingredients = recipe.ingredients.map(ingredient => ({
			index: "" + ingredient.index,
			name: "" + ingredient.name,
			quantity: "" + ingredient.quantity,
			unit: "" + ingredient.unit
		}));
		recipe.steps = recipe.steps.map(step => ({
			index: "" + step.index,
			description: "" + step.description
		}))
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

	static _getImagePathForRecipeId(recipeId) {
		return `/recipes/${recipeId}/image`;
	}

	static async createRecipe(recipe) {
		this._checkRecipeProperties(recipe);
		this._convertRecipePropertiesToString(recipe);
		await RecipeQueries.createRecipe(recipe);
		return this.getDetailedRecipeById(recipe.id);
	}

	static async getAllRecipes() {
		const results = await RecipeQueries.getAllRecipes();
		return results.map(result => this._convertToRecipe(result));
	}

	static async getDetailedRecipeById(recipeId) {
		let recipe = await this.getRecipeById(recipeId);
		if (recipe) {
			recipe.ingredients = await RecipeQueries.getRecipeIngredientsByRecipeId(recipeId);
			recipe.steps = await RecipeQueries.getRecipeStepsByRecipeId(recipeId);
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

	static async updateRecipe(recipe) {
		this._checkRecipeProperties(recipe);
		this._convertRecipePropertiesToString(recipe);
		await RecipeQueries.updateRecipe(recipe);
		return this.getDetailedRecipeById(recipe.id);
	}
}

module.exports = RecipeServices;