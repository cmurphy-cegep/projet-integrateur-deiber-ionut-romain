
const convertToRecipe = jsonRecipe => {
    return {
        id: jsonRecipe.id,
		name: jsonRecipe.name,
		description: jsonRecipe.description,
		preparation_time: jsonRecipe.preparation_time,
		cooking_time: jsonRecipe.cooking_time,
		servings: jsonRecipe.servings,
        image: jsonRecipe.image
    };
};

export async function fetchRecipes() {
    const response = await fetch('/api/recipes');

    if (response.ok) {
        const respJson = await response.json();
        return respJson.map(p => convertToRecipe(p));
    } else {
        throw new Error("Impossible de récupérer la liste des produits");
    }
}