const pool = require('./dbPool');

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
		let recipe = await this._getRecipeById(recipeId);
		if (recipe) {
			recipe.ingredients = await this._getRecipeIngredientsByRecipeId(recipeId);
			recipe.steps = await this._getRecipeStepsRecipeById(recipeId);
			return recipe;
		}
		return undefined;
	}

	static async _getRecipeById(recipeId) {
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
}

module.exports = RecipeQueries;