const convertToRecipe = jsonRecipe => {
    return {
        id: jsonRecipe.id,
        name: jsonRecipe.name,
        description: jsonRecipe.description,
        preparation_time: jsonRecipe.preparation_time,
        cooking_time: jsonRecipe.cooking_time,
        servings: jsonRecipe.servings,
        ingredients: jsonRecipe.ingredients,
        steps: jsonRecipe.steps
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

export async function fetchRecipeImage(recipeId) {
    const response = await fetch(`/api/recipes/${recipeId}/image`);
    if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } else {
        throw new Error(`Recette ${recipeId} introuvable`);
    }
};