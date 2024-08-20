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
export async function fetchRatings(recipeId) {
    const response = await fetch(`/api/recipes/${recipeId}`);

    if (response.ok) {
        const recipe = convertToRecipe(await response.json());
        return recipe.ratings;
    } else {
        throw new Error(`Impossible de récupérer les appréciations pour la recette ${recipeId}`);
    }
}
export async function postRating(rating, userId, recipeId) {
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
    if (!username || !password) {
        throw new Error('Username or password not found');
    }
    const authHeader = 'Basic ' + btoa(username + ':' + password);

    const response = await fetch(`/api/recipes/${recipeId}/ratings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        },
        body: JSON.stringify({ rating, userId })
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized: Invalid credentials');
        }
        throw new Error(`Impossible de poster l'appréciation pour la recette ${recipeId}`);
    }
}
export async function getUserRatingForRecipe(recipeId) {
    const response = await fetch(`/api/recipes/${recipeId}/ratings/user-rating`, {
        headers: {
            'Authorization': 'Basic ' + btoa(sessionStorage.getItem('username') + ':' + sessionStorage.getItem('password'))
        }
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(`Impossible de récupérer la note de l'utilisateur pour la recette ${recipeId}`);
    }
}