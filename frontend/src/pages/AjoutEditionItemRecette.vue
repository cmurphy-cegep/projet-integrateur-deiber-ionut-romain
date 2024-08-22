<template>
    <div class="recipe" v-if="session.user && session.user.isAdmin">
        <form @submit.prevent="submitRecipe">
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
                    <input class="recipe-portions" id="recipe-portions" type="number" step="1"
                        v-model="recipePortions" />
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
            <div class="zone-add-edit">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Quantité</th>
                            <th>Unité</th>
                            <th>Ingrédient</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ingredient, index) in recipeIngredients" :key="index">
                            <td>{{ ingredient.index }}</td>
                            <td><input type="number" step="0.01" v-model.number="ingredient.quantity"
                                    placeholder="Quantité" /></td>
                            <td><input type="text" v-model="ingredient.unit" placeholder="Unité" /></td>
                            <td><input type="text" v-model="ingredient.name" placeholder="Ingrédient" required /></td>
                            <td>
                                <button type="button" @click="moveItemUp(recipeIngredients, index)"
                                    :disabled="index === 0">&uarr;</button>
                                <button type="button" @click="moveItemDown(recipeIngredients, index)"
                                    :disabled="index === recipeIngredients.length - 1">&darr;</button>
                                <button type="button" @click="removeItem(recipeIngredients, index)">Supprimer</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="button"
                    @click="addItem(recipeIngredients, { index: null, quantity: null, unit: '', name: '' })">Ajouter un
                    ingrédient</button>
            </div>
            <div class="zone-add-edit">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Étape</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(step, index) in recipeSteps" :key="index">
                            <td>{{ step.index }}</td>
                            <td><input type="text" v-model="step.description" placeholder="Décrivez l'étape" required />
                            </td>
                            <td>
                                <button type="button" @click="moveItemUp(recipeSteps, index)"
                                    :disabled="index === 0">&uarr;</button>
                                <button type="button" @click="moveItemDown(recipeSteps, index)"
                                    :disabled="index === recipeSteps.length - 1">&darr;</button>
                                <button type="button" @click="removeItem(recipeSteps, index)">Supprimer</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="button" @click="addItem(recipeSteps, { index: null, description: '' })">Ajouter une
                    étape</button>
            </div>
            <button type="submit">Soumettre</button>
        </form>
    </div>
    <div v-else>Vous n'avez pas les permissions pour voir cette page</div>
</template>

<script>
import session from '../session';
import { createRecipe, fetchRecipe } from '../services/recipeService.js';

export default {
    props: ['id'],
    data() {
        return {
            session: session,
            recipeId: this.id,
            recipeName: '',
            recipeTempsPreparation: 0,
            recipeTempsCuisson: 0,
            recipePortions: 0,
            recipeDesc: '',
            recipeIngredients: [],
            recipeSteps: [],
        };
    },
    methods: {
        async loadRecipe(id) {
            try {
                const recipe = await fetchRecipe(id);
                this.recipeName = recipe.name;
                this.recipeTempsPreparation = recipe.preparation_time;
                this.recipeTempsCuisson = recipe.cooking_time;
                this.recipePortions = recipe.servings;
                this.recipeDesc = recipe.description;
                this.recipeIngredients = recipe.ingredients;
                this.recipeSteps = recipe.steps;
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        },

        /* prueba */
        addItem(array, newItem) {
            newItem.index = array.length + 1;
            array.push(newItem);
            this.updateIndices(array);
        },

        removeItem(array, index) {
            array.splice(index, 1);
            this.updateIndices(array);
        },
        moveItemUp(array, index) {
            if (index > 0) {
                const temp = array[index];
                array.splice(index, 1);
                array.splice(index - 1, 0, temp);
                this.updateIndices(array);
            }
        },
        moveItemDown(array, index) {
            if (index < array.length - 1) {
                const temp = array[index];
                array.splice(index, 1);
                array.splice(index + 1, 0, temp);
                this.updateIndices(array);
            }
        },
        updateIndices(array) {
            array.forEach((item, i) => {
                item.index = i + 1;
            });
        },
        async submitRecipe() {
            const recipe = {
                id: this.recipeId,
                name: this.recipeName,
                preparation_time: this.recipeTempsPreparation,
                cooking_time: this.recipeTempsCuisson,
                servings: this.recipePortions,
                description: this.recipeDesc,
                ingredients: this.recipeIngredients,
                steps: this.recipeSteps,
            };

            try {
                await createRecipe(recipe);
                console.log(recipe);
                this.$router.push('/recipes/' + this.recipeId);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }
    },
    watch: {
        recipeId(newId) {
            if (newId) {
                this.loadRecipe(newId);
            }
        }
    },
    mounted() {
        if (this.recipeId) {
            this.loadRecipe();
        }
    }
}
</script>