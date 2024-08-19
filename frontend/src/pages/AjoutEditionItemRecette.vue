<template>
    <div class="recipe" v-if="session.user && session.user.isAdmin">
        <div><!--champ conditionnels -->
            <div>
                <label for="recipe-id">Identifiant unique de la recette: </label>
            </div>
            <div>
                <input class="recipe-id" id="recipe-id" v-model="recipeId" required />
            </div>
        </div>
        <div>
            <div>
                <label for="recipe-name">Nom de la recette: </label>
            </div>
            <div>
                <input class="recipe-name" type="text" id="recipe-name" v-model="recipeName" required />
            </div>
        </div>
        <div>
            <div>
                <label for="recipe-temps-preparation">Temps de préparation en minutes: </label>
            </div>
            <div>
                <input class="recipe-temps-preparation" id="recipe-temps-preparation" type="number" step="1"
                    v-model="recipeTempsPreparation" />
            </div>
        </div>
        <div>
            <div>
                <label for="recipe-temps-cuisson">Temps de cuisson en minutes: </label>
            </div>
            <div>
                <input class="recipe-temps-cuisson" id="recipe-temps-cuisson" type="number" step="1"
                    v-model="recipeTempsCuisson" />
            </div>
        </div>
        <div>
            <div>
                <label for="recipe-portions">Nombre de portions: </label>
            </div>
            <div>
                <input class="recipe-portions" id="recipe-portions" type="number" step="1" v-model="recipePortions" />
            </div>
        </div>
        <div>
            <div>
                <label for="recipe-desc">Description: </label>
            </div>
            <div>
                <textarea class="recipe-desc" id="recipe-desc" v-model="recipeDesc"></textarea>
            </div>
        </div>
    </div>
    <div v-else>Vous n'avez pas les permissions pour voir cette page</div>
</template>

<script>
import session from '../session';

export default {
    data() {
        return {
            session: session,
            recipeId: '',
            recipeName: '',
            recipeTempsPreparation: 0,
            recipeTempsCuisson: 0,
            recipePortions: 0,
            recipeDesc: ''
        };
    }
}
</script>