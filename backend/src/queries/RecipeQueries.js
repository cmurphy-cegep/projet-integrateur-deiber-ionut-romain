const pool = require('../queries/dbPool');

class RecipeQueries {
	static async _deleteRecipeIngredients(recipeId, client) {
		await client.query(
			`DELETE
             FROM ingredient
             WHERE recipe_id = $1`,
			[recipeId]
		);
	}

	static async _deleteRecipeSteps(recipeId, client) {
		await client.query(
			`DELETE
             FROM step
             WHERE recipe_id = $1`,
			[recipeId]
		);
	}

	static async _editRecipeDescription(recipe, client) {
		await client.query(
			`UPDATE recipe
             SET name             = $1,
                 description      = $2,
                 preparation_time = $3,
                 cooking_time     = $4,
                 servings         = $5
             WHERE recipe_id = $6`,
			[recipe.name, recipe.description, recipe.preparation_time, recipe.cooking_time, recipe.servings, recipe.id]
		);
	}

	static async _insertRecipeDescription(recipe, client) {
		await client.query(
			`INSERT INTO recipe (recipe_id, name, description, preparation_time, cooking_time, servings)
             VALUES ($1, $2, $3, $4, $5, $6)`,
			[recipe.id, recipe.name, recipe.description, recipe.preparation_time, recipe.cooking_time, recipe.servings]
		);
	}

	static async _insertRecipeIngredients(recipe, client) {
		for (const ingredient of recipe.ingredients) {
			await client.query(
				`INSERT INTO ingredient (index, name, quantity, unit, recipe_id)
                 VALUES ($1, $2, $3, $4, $5)`,
				[ingredient.index, ingredient.name, ingredient.quantity, ingredient.unit, recipe.id]
			);
		}
	}

	static async _insertRecipeSteps(recipe, client) {
		for (const step of recipe.steps) {
			await client.query(
				`INSERT INTO step (index, description, recipe_id)
                 VALUES ($1, $2, $3)`,
				[step.index, step.description, recipe.id]
			);
		}
	}

	static async createRecipe(recipe) {
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			await this._insertRecipeDescription(recipe, client);
			await this._insertRecipeIngredients(recipe, client);
			await this._insertRecipeSteps(recipe, client);

			await client.query('COMMIT');
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		} finally {
			client.release();
		}
	}

	static async deleteRecipe(recipeId) {
		const result = await pool.query(
			`DELETE
             FROM recipe
             WHERE recipe_id = $1`,
			[recipeId]
		);

		return result.rowCount > 0;
	}

	static async getAllRecipes() {
		const result = await pool.query(
			`SELECT recipe_id, name, description, preparation_time, cooking_time, servings
             FROM recipe
             ORDER BY recipe_id`
		);
		return result.rows;
	}

	static async getRecipeById(recipeId) {
		const result = await pool.query(
			`SELECT recipe_id, name, description, preparation_time, cooking_time, servings
             FROM recipe
             WHERE recipe_id = $1`,
			[recipeId]
		);
		return result.rows[0];
	}

	static async getRecipeComment(commentId) {
		const result = await pool.query(
			`SELECT c.text, TO_CHAR(c.publication_date, 'YYYY-MM-DD HH24:MI:SS') AS publication_date, u.full_name
             FROM comment c
                      JOIN user_account u ON u.user_account_id = c.user_account_id
             WHERE c.comment_id = $1`,
			[commentId]
		);
		return result.rows[0];
	}

	static async getRecipeComments(recipeId) {
		const result = await pool.query(
			`SELECT c.text, TO_CHAR(publication_date, 'YYYY-MM-DD HH24:MI:SS') AS publication_date, u.full_name
             FROM comment c
                      JOIN user_account u ON u.user_account_id = c.user_account_id
             WHERE recipe_id = $1
             ORDER BY publication_date DESC`,
			[recipeId]
		);
		return result.rows;
	}

	static async getRecipeImageContent(recipeId) {
		const result = await pool.query(
			`SELECT image_content, image_content_type
             FROM recipe
             WHERE recipe_id = $1`,
			[recipeId]
		);
		return result.rows[0];
	}

	static async getRecipeIngredients(recipeId) {
		const result = await pool.query(
			`SELECT index, name, quantity, unit
             FROM ingredient
             WHERE recipe_id = $1
             ORDER BY index`,
			[recipeId]
		);
		return result.rows;
	}

	static async getRecipeRatings(recipeId) {
		const result = await pool.query(
			`SELECT rating
             FROM rating
             WHERE recipe_id = $1`,
			[recipeId]
		);
		return result.rows;
	}

	static async getRecipeSteps(recipeId) {
		const result = await pool.query(
			`SELECT index, description
             FROM step
             WHERE recipe_id = $1
             ORDER BY index`,
			[recipeId]
		);
		return result.rows;
	}

	static async getUserRatingForRecipe(recipeId, userId) {
		const result = await pool.query(
			`SELECT rating
             FROM rating
             WHERE recipe_id = $1
               AND user_account_id = $2`,
			[recipeId, userId]
		);
		return result.rows[0];
	}

	static async insertRecipeComment(comment) {
		const result = await pool.query(
			`INSERT INTO comment (text, publication_date, user_account_id, recipe_id)
             VALUES ($1, $2, $3, $4)
             RETURNING comment_id`,
			[comment.text, comment.publicationDate, comment.userId, comment.recipeId]
		);

		return result.rows[0].comment_id;
	}

	static async insertRecipeRating(recipeId, userId, rating) {
		const result = await pool.query(
			`INSERT INTO rating (user_account_id, recipe_id, rating)
             VALUES ($1, $2, $3)
             RETURNING rating`,
			[userId, recipeId, rating]
		);

		return result.rows[0].rating;
	}

	static async updateRecipe(recipe) {
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			await this._editRecipeDescription(recipe, client);

			await this._deleteRecipeIngredients(recipe.id, client);
			await this._insertRecipeIngredients(recipe, client);

			await this._deleteRecipeSteps(recipe.id, client);
			await this._insertRecipeSteps(recipe, client);

			await client.query('COMMIT');
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		} finally {
			client.release();
		}
	}

	static async updateRecipeImage(recipeId, imageBuffer, imageContentType) {
		const result = await pool.query(
			`UPDATE recipe
             SET image_content      = $2,
                 image_content_type = $3
             WHERE recipe_id = $1`,
			[recipeId, imageBuffer, imageContentType]
		);

		return result.rowCount > 0;
	}

	static async updateRecipeRating(recipeId, userId, rating) {
		const result = await pool.query(
			`UPDATE rating
             SET rating = $3
             WHERE recipe_id = $1
               AND user_account_id = $2`,
			[recipeId, userId, rating]
		);

		return result.rowCount > 0;
	}
}

module.exports = RecipeQueries;