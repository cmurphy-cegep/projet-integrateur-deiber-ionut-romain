const pool = require('./dbPool');
const HttpError = require("../error/HttpError");

class RecipeQueries {
	static _getImagePathForRecipeId(recipeId) {
		return `/recipes/${recipeId}/image`;
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

	static async getAllRecipes() {
		const result = await pool.query(
			`SELECT recipe_id, name, description, preparation_time, cooking_time, servings
             FROM recipe
             ORDER BY recipe_id`
		);
		return result.rows.map(row => this._convertToRecipe(row));
	}

	static async getDetailedRecipeById(recipeId) {
		let recipe = await this.getRecipeById(recipeId);
		if (recipe) {
			recipe.ingredients = await this._getRecipeIngredientsByRecipeId(recipeId);
			recipe.steps = await this._getRecipeStepsRecipeById(recipeId);
			return recipe;
		}
		return undefined;
	}

	static async getRecipeById(recipeId) {
		const result = await pool.query(
			`SELECT recipe_id, name, description, preparation_time, cooking_time, servings
             FROM recipe
             WHERE recipe_id = $1`,
			[recipeId]
		);

		const row = result.rows[0];
		if (row) {
			return this._convertToRecipe(row);
		}
		return undefined;
	}

	static async _getRecipeIngredientsByRecipeId(recipeId) {
		const result = await pool.query(
			`SELECT index, name, quantity, unit
             FROM ingredient
             WHERE recipe_id = $1
             ORDER BY index`,
			[recipeId]
		);

		return result.rows.map(row => ({
			index: row.index,
			name: row.name,
			quantity: row.quantity,
			unit: row.unit
		}));
	}

	static async _getRecipeStepsRecipeById(recipeId) {
		const result = await pool.query(
			`SELECT index, description
             FROM step
             WHERE recipe_id = $1
             ORDER BY index`,
			[recipeId]
		);

		return result.rows.map(row => ({
			index: row.index,
			description: row.description
		}));
	}

	static async getRecipeImageContent(recipeId) {
		const result = await pool.query(
			`SELECT image_content, image_content_type
             FROM recipe
             WHERE recipe_id = $1`,
			[recipeId]
		);

		const row = result.rows[0];
		if (row) {
			return {
				imageContent: row.image_content,
				imageContentType: row.image_content_type
			};
		}
		return undefined;
	}

	static async createRecipe(recipe) {
		this._checkRecipeProperties(recipe);
		recipe = this._convertRecipePropertiesToString(recipe);

		
	}

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

		for (const ingredient in recipe.ingredients) {
			if (!ingredient.index || !Number.isInteger(ingredient.index)) {
				throw new HttpError(400, 'Le numéro de l\'ingrédient est requis');
			}
			if (!ingredient.name) {
				throw new HttpError(400, 'Le nom de l\'ingrédient est requis');
			}

			if (ingredient.quantity !== '' && !isNaN(ingredient.quantity)) {
				throw new HttpError(400, 'La quantité de l\'ingrédient doit être un nombre entier');
			}
		}

		if (!recipe.steps || recipe.steps.length === 0) {
			throw new HttpError(400, 'Les étapes sont requises');
		}

		for (const step in recipe.steps) {
			if (!step.index || !Number.isInteger(step.index)) {
				throw new HttpError(400, 'Le numéro de l\'étape est requis');
			}
			if (!step.description) {
				throw new HttpError(400, 'La description de l\'étape est requise');
			}
		}
	}

	static _convertRecipePropertiesToString(recipe) {
		return {
			id: "" + recipe.id,
			name: "" + recipe.name,
			description: "" + recipe.description,
			preparation_time: "" + recipe.preparation_time,
			cooking_time: "" + recipe.cooking_time,
			servings: "" + recipe.servings,
			ingredients: recipe.ingredients.map(ingredient => ({
				index: "" + ingredient.index,
				name: "" + ingredient.name,
				quantity: "" + ingredient.quantity,
				unit: "" + ingredient.unit
			})),
			steps: recipe.steps.map(step => ({
				index: "" + step.index,
				description: "" + step.description
			}))
		};
	}
}

module.exports = RecipeQueries;