import session from '../session';

const convertToRecipe = jsonRecipe => {
    return {
        id: jsonRecipe.id,
        name: jsonRecipe.name,
        description: jsonRecipe.description,
        preparation_time: jsonRecipe.preparation_time,
        cooking_time: jsonRecipe.cooking_time,
        servings: jsonRecipe.servings,
        ingredients: jsonRecipe.ingredients,
        steps: jsonRecipe.steps,
        image: jsonRecipe.image,
        comments: jsonRecipe.comments,
        ratings: jsonRecipe.ratings
    };
};

export async function fetchRecipe(recipeId) {
    const response = await fetch(`/api/recipes/${recipeId}`);

    if (response.ok) {
        return convertToRecipe(await response.json());
    } else {
        throw new Error(`Recette ${recipeId} introuvable`);
    }
};
export async function fetchRecipes() {
    const response = await fetch('/api/recipes');

    if (response.ok) {
        const respJson = await response.json();
        return respJson.map(p => convertToRecipe(p));
    } else {
        throw new Error("Impossible de récupérer la liste des recettes");
    }
};

export async function createRecipe(recipe) {
    console.log(JSON.stringify(recipe));
    const response = await fetch(`/api/recipes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
        },
        body: JSON.stringify(recipe)
    });


    if (response.ok) {
        return convertToRecipe(await response.json());
    } else {
        throw new Error(`Impossible d'ajouter le produit ${recipe.id}: ${response.status}`);
    }
}