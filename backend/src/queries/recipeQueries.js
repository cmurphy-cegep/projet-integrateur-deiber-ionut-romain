const pool = require('./dbPool');

/*modifié par Deiber*/
const getImagePathForRecipeId = productId => `/recipes/${productId}/image`;
exports.getImagePathForRecipeId = getImagePathForRecipeId;

const convertToRecipe = row => {
	return {
		id: row.recipe_id,
		name: row.name,
		description: row.description,
		preparation_time: row.preparation_time,
		cooking_time: row.cooking_time,
		servings: row.servings,
		/*modifié par Deiber*/
		image: getImagePathForRecipeId(row.recipe_id)
	};
};

const getAllRecipes = async () => {
	const result = await pool.query(
		`SELECT recipe_id, name, description, preparation_time, cooking_time, servings
         FROM recipe
         ORDER BY recipe_id`
	);

	return result.rows.map(row => {
		return convertToRecipe(row);
	});
};
exports.getAllRecipes = getAllRecipes;

const getDetailedRecipeById = async (recipeId) => {
	let recipe = await getRecipeById(recipeId);
	if (recipe) {
		recipe.ingredients = await getRecipeIngredientsByRecipeId(recipeId);
		recipe.steps = await getRecipeStepsRecipeById(recipeId);
		return recipe;
	}
	return undefined;
};
exports.getDetailedRecipeById = getDetailedRecipeById;

const getRecipeById = async (recipeId) => {
	const result = await pool.query(
		`SELECT recipe_id, name, description, preparation_time, cooking_time, servings
         FROM recipe
         WHERE recipe_id = $1`,
		[recipeId]
	);

	const row = result.rows[0];
	if (row) {
		return convertToRecipe(row);
	}
	return undefined;
};
exports.getRecipeById = getRecipeById;

const getRecipeIngredientsByRecipeId = async (recipeId) => {
	const result = await pool.query(
		`SELECT index, name, quantity, unit
         FROM ingredient
         WHERE recipe_id = $1
         ORDER BY index`,
		[recipeId]
	);

	return result.rows.map(row => {
		const ingredient = {
			index: row.index,
			name: row.name,
			quantity: row.quantity,
			unit: row.unit
		};
		return ingredient;
	});
};

const getRecipeStepsRecipeById = async (recipeId) => {
	const result = await pool.query(
		`SELECT index, description
         FROM step
         WHERE recipe_id = $1
         ORDER BY index`,
		[recipeId]
	);

	return result.rows.map(row => {
		const step = {
			index: row.index,
			description: row.description
		};
		return step;
	});
};

const getRecipeImageContent = async (recipeId) => {
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
};
exports.getRecipeImageContent = getRecipeImageContent;