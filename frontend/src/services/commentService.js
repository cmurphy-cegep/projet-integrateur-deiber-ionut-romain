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
        comments: jsonRecipe.comments
    };
};
export async function postComment(comment, userId, recipeId) {
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
    if (!username || !password) {
        throw new Error('Username or password not found');
    }
    const authHeader = 'Basic ' + btoa(username + ':' + password);

    const response = await fetch(`/api/recipes/${recipeId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader // Use Basic Authentication for authorization
        },
        body: JSON.stringify({ text: comment, userId: userId }) // Ensure the comment object is correctly structured
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized: Invalid credentials');
        }
        throw new Error(`Impossible de poster le commentaire pour la recette ${recipeId}`);
    }
};
export async function fetchComments(recipeId) {
    const response = await fetch(`/api/recipes/${recipeId}`);

    if (response.ok) {
        const recipe = convertToRecipe(await response.json());
        return recipe.comments;

    } else {
        throw new Error(`Impossible de récupérer les commentaires pour la recette ${recipeId}`);
    }
}