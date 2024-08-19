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
        <div class="zone-add-edit">
            <table>
                <thead>
                    <tr>
                        <th>Quantité</th>
                        <th>Unité</th>
                        <th>Ingrédient</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(ingredient, index) in recipeIngredients" :key="index">
                        <td><input type="number" step="0.01" v-model.number="ingredient.quantity"
                                placeholder="Quantité" /></td>
                        <td><input type="text" v-model="ingredient.unit" placeholder="Unité" /></td>
                        <td><input type="text" v-model="ingredient.name" placeholder="Ingrédient" required /></td>
                        <td>
                            <button @click="moveIngredientUp(index)" :disabled="index === 0">↑</button>
                            <button @click="moveIngredientDown(index)"
                                :disabled="index === recipeIngredients.length - 1">↓</button>
                            <button @click="removeIngredient(index)">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button @click="addIngredient">Ajouter un ingrédient</button>
        </div>
        <div class="zone-add-edit">
            <table>
                <thead>
                    <tr>
                        <th>Étape</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(step, index) in recipeSteps" :key="index">
                        <td><input type="text" v-model="step.description" placeholder="Décrivez l'étape" required />
                        </td>
                        <td>
                            <button @click="moveStepUp(index)" :disabled="index === 0">↑</button>
                            <button @click="moveStepDown(index)" :disabled="index === recipeSteps.length - 1">↓</button>
                            <button @click="removeStep(index)">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button @click="addStep">Ajouter une étape</button>
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
            recipeDesc: '',
            recipeIngredients: [
                {
                    quantity: null,
                    unit: '',
                    name: ''
                },
            ],
            recipeSteps: [
                { description: '' },
            ],
        };
    },
    methods: {
        addIngredient() {
            this.recipeIngredients.push({ quantity: null, unit: '', name: '' });
        },
        removeIngredient(index) {
            this.recipeIngredients.splice(index, 1);
        },
        moveIngredientUp(index) {
            if (index > 0) {
                const temp = this.recipeIngredients[index];
                this.recipeIngredients.splice(index, 1);
                this.recipeIngredients.splice(index - 1, 0, temp);
            }
        },
        moveIngredientDown(index) {
            if (index < this.recipeIngredients.length - 1) {
                const temp = this.recipeIngredients[index];
                this.recipeIngredients.splice(index, 1);
                this.recipeIngredients.splice(index + 1, 0, temp);
            }
        },
        addStep() {
            this.recipeSteps.push({ description: '' });
        },
        removeStep(index) {
            this.recipeSteps.splice(index, 1);
        },
        moveStepUp(index) {
            if (index > 0) {
                const temp = this.recipeSteps[index];
                this.recipeSteps.splice(index, 1);
                this.recipeSteps.splice(index - 1, 0, temp);
            }
        },
        moveStepDown(index) {
            if (index < this.recipeSteps.length - 1) {
                const temp = this.recipeSteps[index];
                this.recipeSteps.splice(index, 1);
                this.recipeSteps.splice(index + 1, 0, temp);
            }
        },
    },
}
</script>