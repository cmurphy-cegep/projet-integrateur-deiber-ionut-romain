const pool = require('./DBPool');

const getAllRecipes = async () => {
	const result = await pool.query(
		`SELECT recipe_id, name, description, preparation_time, cooking_time, servings
         FROM recipe
         ORDER BY recipe_id`
	);

	return result.rows.map(row => {
		const recipe = {
			id: row.recipe_id,
			name: row.name,
			description: row.description,
			preparation_time: row.preparation_time,
			cooking_time: row.cooking_time,
			servings: row.servings
		};

		return recipe;
	});
};
exports.getAllRecipes = getAllRecipes;


/**
 * Fonction permettant d'obtenir le contenu binaire de la colonne image_content et son type
 * (colonne image_content_type). Utilisé par un endpoint qui offre le téléchargement d'une image
 * de produit stockée dans la table product de la BD.
 *
 * @param {string} recipeId
 * @returns Promesse pour un objet avec deux propriétés :
 *          imageContent : un Buffer avec le contenu binaire de l'image
 *          imageContentType : une chaîne de caractères avec le Content-Type de l'image (p.ex. "image/jpeg")
 */
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