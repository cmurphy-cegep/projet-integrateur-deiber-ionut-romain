<template>
    <div class="recipe" v-if="session.user && session.user.isAdmin">
        <h2 v-if="edition"> Édition </h2>
        <h2 v-else> Nouvelle recette </h2>
        <form @submit.prevent="submitRecipe">
            <div v-if="!edition" class="form-control" :class="{ invalide: !idValide }">
                <div>
                    <label for="recipe-id">Identifiant unique de la recette: </label>
                </div>
                <div>
                    <input class="recipe-id" id="recipe-id" name="recipe-id" v-model="recipeId" type="text"
                        v-model.lazy.trim="recipeId" @blur="validateId(recipeId)" required />
                </div>
                <span v-if="!idValide">
                    L'identifiant ne peut pas être vide et il doit contenir uniquement des caractères alphanumériques et
                    des underscores ( _ ).
                </span>
            </div>
            <div class="form-control" :class="{ invalide: !nameValide }">
                <div>
                    <label for="recipe-name">Nom de la recette: </label>
                </div>
                <div>
                    <input class="recipe-name" type="text" id="recipe-name" name="recipe-name" v-model="recipeName"
                        @blur="validateName" required />
                </div>
                <span v-if="!nameValide">
                    Le nom est requis.
                </span>
            </div>
            <div>
                <div>
                    <label for="recipe-temps-preparation">Temps de préparation en minutes: </label>
                </div>
                <div>
                    <input class="recipe-temps-preparation" id="recipe-temps-preparation"
                        name="recipe-temps-preparation" type="number" step="1" v-model="recipeTempsPreparation" />
                </div>
            </div>
            <div>
                <div>
                    <label for="recipe-temps-cuisson">Temps de cuisson en minutes: </label>
                </div>
                <div>
                    <input class="recipe-temps-cuisson" id="recipe-temps-cuisson" name="recipe-temps-cuisson"
                        type="number" step="1" v-model="recipeTempsCuisson" />
                </div>
            </div>
            <div>
                <div>
                    <label for="recipe-portions">Nombre de portions: </label>
                </div>
                <div>
                    <input class="recipe-portions" id="recipe-portions" name="recipe-portions" type="number" step="1"
                        v-model="recipePortions" />
                </div>
            </div>
            <div class="form-control" :class="{ invalide: !descValide }">
                <div>
                    <label for="recipe-desc">Description: </label>
                </div>
                <div>
                    <textarea class="recipe-desc" id="recipe-desc" v-model="recipeDesc" @blur="validateDesc"
                        required></textarea>
                </div>
                <span v-if="!descValide">
                    Une description est requise.
                </span>
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
                            <td><input :id="'ingredient-quantity-' + index" :name="'ingredient-quantity-' + index"
                                    type="number" step="0.01" v-model.number="ingredient.quantity"
                                    placeholder="Quantité" /></td>
                            <td><input :id="'ingredient-unit-' + index" :name="'ingredient-unit-' + index" type="text"
                                    v-model="ingredient.unit" placeholder="Unité" /></td>
                            <div class="form-control" :class="{ invalide: ingredientErrors[index]?.name }">
                                <td>
                                    <input :id="'ingredient-name-' + index" :name="'ingredient-name-' + index"
                                        type="text" v-model="ingredient.name" placeholder="Nom de l'ingrédient "
                                        @blur="validateIngredient(index)" required />
                                </td>
                            </div>
                            <td>
                                <button type="button" @click="moveItemUp(recipeIngredients, index)"
                                    :disabled="index === 0">&uarr;</button>
                                <button type="button" @click="moveItemDown(recipeIngredients, index)"
                                    :disabled="index === recipeIngredients.length - 1">&darr;</button>
                                <button type="button" @click="removeItem(recipeIngredients, index)">Supprimer</button>
                            </td>
                            <span v-if="ingredientErrors[index]?.name" class="error-message">
                                {{ ingredientErrors[index].name }}
                            </span>
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
                            <div class="form-control" :class="{ invalide: stepsErrors[index]?.description }">
                                <td><input :id="'steps-description-' + index" :name="'steps-description-' + index"
                                        type="text" v-model="step.description" placeholder="Décrivez l'étape"
                                        @blur="validateSteps(index)" required />
                                </td>
                            </div>
                            <td>
                                <button type="button" @click="moveItemUp(recipeSteps, index)"
                                    :disabled="index === 0">&uarr;</button>
                                <button type="button" @click="moveItemDown(recipeSteps, index)"
                                    :disabled="index === recipeSteps.length - 1">&darr;</button>
                                <button type="button" @click="removeItem(recipeSteps, index)">Supprimer</button>
                            </td>
                            <span v-if="stepsErrors[index]?.description" class="error-message">
                                {{ stepsErrors[index].description }}
                            </span>
                        </tr>
                    </tbody>
                </table>
                <button type="button" @click="addItem(recipeSteps, { index: null, description: '' })">Ajouter une
                    étape</button>
            </div>
            <button type="submit">Soumettre</button>
        </form>
        <div class="-#" v-if="edition">
            <form @submit.prevent="submitImage">
                <div>
                    <div>
                        <label for="recipe-image">Téléverser nouvelle image: </label>
                    </div>
                    <div>
                        <input type="file" id="recipe-image" accept="image/png, image/jpeg, image/gif" />
                    </div>
                    &nbsp;
                    <div>
                        <button type="submit">Soumettre la image</button>
                    </div>
                </div>
            </form>
            <button type="button" @click="deleteRecipe" v-if="edition">Supprimer la recette</button>
        </div>
    </div>
    <div v-else>Vous n'avez pas les permissions pour voir cette page</div>
</template>

<script>
import session from '../session';
import { createRecipe, fetchRecipe, updateRecipe, updateRecipeImage, deleteRecipe } from '../services/recipeService.js';

export default {
    props: ['id'],
    data() {
        return {
            session: session,
            recipeId: this.id || "",
            idValide: true,
            recipeName: '',
            nameValide: true,
            recipeTempsPreparation: 0,
            recipeTempsCuisson: 0,
            recipePortions: 0,
            recipeDesc: '',
            descValide: true,
            recipeIngredients: [
                {
                    index: 1,
                    quantity: null,
                    unit: '',
                    name: ''
                }
            ],
            ingredientErrors: [],
            recipeSteps: [
                {
                    index: 1,
                    description: ''
                }
            ],
            stepsErrors: [],
            edition: false
        };
    },
    methods: {
        async loadRecipe() {
            try {
                if (this.edition) {
                    const recipe = await fetchRecipe(this.recipeId);
                    this.recipeName = recipe.name;
                    this.recipeTempsPreparation = recipe.preparation_time;
                    this.recipeTempsCuisson = recipe.cooking_time;
                    this.recipePortions = recipe.servings;
                    this.recipeDesc = recipe.description;
                    this.recipeIngredients = recipe.ingredients;
                    this.recipeSteps = recipe.steps;
                }
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        },
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
                if (this.edition) {

                    await updateRecipe(recipe);
                } else {
                    await createRecipe(recipe);
                }
                console.log(recipe);
                this.$router.push('/recipes/' + this.recipeId);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        },
        async submitImage() {
            const formData = new FormData();
            const fileField = document.querySelector("input[id='recipe-image']");
            formData.append('recipe-image', fileField.files[0]);

            try {
                await updateRecipeImage(this.recipeId, formData);
                this.edition = false;
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        },
        async deleteRecipe() {
            try {
                await deleteRecipe(this.recipeId);
                alert("Recette supprimée avec succès.");
                this.$router.push('/');
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        },
        validateId(newId) {
            const regexId = /^[a-zA-Z0-9_]+$/;
            if (!newId || !regexId.test(newId)) {
                this.idValide = false;
            } else {
                this.idValide = true;
            }
        },
        validateName() {
            if (this.recipeName === '') {
                this.nameValide = false;
            } else {
                this.nameValide = true;
            }
        },
        validateDesc() {
            if (this.recipeDesc === '') {
                this.descValide = false;
            } else {
                this.descValide = true;
            }
        },
        validateIngredient(index) {
            if (!this.ingredientErrors[index]) {
                this.ingredientErrors[index] = {};
            }
            if (this.recipeIngredients[index].name.trim() === '') {
                this.ingredientErrors[index].name = 'Le nom de l\'ingrédient ne peut pas être vide.';
            } else {
                this.ingredientErrors[index].name = '';
            }
        },
        validateSteps(index) {
            if (!this.stepsErrors[index]) {
                this.stepsErrors[index] = {};
            }
            if (this.recipeSteps[index].description.trim() === '') {
                this.stepsErrors[index].description = 'La description d\'une étape ne peut pas être vide';
            } else {
                this.stepsErrors[index].description = '';
            }
        }
    },
    watch: {
        id(newId) {
            if (newId) {
                this.recipeId = newId;
                this.edition = true;
                this.loadRecipe();
            } else {
                this.edition = false;
            }
        },
        recipeId(newId) {
            this.validateId(newId);
        }
    },
    mounted() {
        if (this.recipeId) {
            this.edition = true;
            this.loadRecipe();
        }
    }
}
</script>

<style scoped>
.form-control.invalide input,
.form-control.invalide textarea {
    border-color: red;
}

.form-control.invalide span,
.error-message {
    color: red;
}

form * {
    margin: 0.25rem;
}
</style>