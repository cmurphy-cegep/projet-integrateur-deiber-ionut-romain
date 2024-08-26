<template>
	<div v-if="session.user && session.user.isAdmin" class="recipe">
		<h2 v-if="edition"> Édition </h2>
		<h2 v-else> Nouvelle recette </h2>
		<form @submit.prevent="submitRecipe">
			<fieldset>
				<legend>Informations</legend>
				<div v-if="!edition" :class="{ invalide: !idValide }" class="form-control">
					<div>
						<label for="recipe-id">Identifiant unique de la recette: </label>
					</div>
					<div>
						<input id="recipe-id" v-model="recipeId" v-model.lazy.trim="recipeId" class="recipe-id"
							name="recipe-id" required type="text" @blur="validateId(recipeId)" />
					</div>
					<span v-if="!idValide">
						L'identifiant ne peut pas être vide et il doit contenir uniquement des caractères
						alphanumériques et
						des underscores ( _ ).
					</span>
				</div>
				<div :class="{ invalide: !nameValide }" class="form-control">
					<div>
						<label for="recipe-name">Nom de la recette: </label>
					</div>
					<div>
						<input id="recipe-name" v-model="recipeName" class="recipe-name" name="recipe-name" required
							type="text" @blur="validateName" />
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
						<input id="recipe-temps-preparation" v-model="recipeTempsPreparation"
							class="recipe-temps-preparation" name="recipe-temps-preparation" step="1" type="number"
							min="0" />
					</div>
				</div>
				<div>
					<div>
						<label for="recipe-temps-cuisson">Temps de cuisson en minutes: </label>
					</div>
					<div>
						<input id="recipe-temps-cuisson" v-model="recipeTempsCuisson" class="recipe-temps-cuisson"
							name="recipe-temps-cuisson" step="1" type="number" min="0" />
					</div>
				</div>
				<div>
					<div>
						<label for="recipe-portions">Nombre de portions: </label>
					</div>
					<div>
						<input id="recipe-portions" v-model="recipePortions" class="recipe-portions"
							name="recipe-portions" step="1" type="number" min="0" />
					</div>
				</div>
				<div :class="{ invalide: !descValide }" class="form-control">
					<div>
						<label for="recipe-desc">Description: </label>
					</div>
					<div>
						<textarea id="recipe-desc" v-model="recipeDesc" class="recipe-desc" required
							@blur="validateDesc" style="min-width: 500px; min-height: 150px;"></textarea>
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
								<td><input :id="'ingredient-quantity-' + index" v-model.number="ingredient.quantity"
										:name="'ingredient-quantity-' + index" placeholder="Quantité" step="0.01"
										type="number" min="0" /></td>
								<td><input :id="'ingredient-unit-' + index" v-model="ingredient.unit"
										:name="'ingredient-unit-' + index" placeholder="Unité" type="text" /></td>
								<div :class="{ invalide: ingredientErrors[index]?.name }" class="form-control">
									<td>
										<input :id="'ingredient-name-' + index" v-model="ingredient.name"
											:name="'ingredient-name-' + index" placeholder="Nom de l'ingrédient "
											required type="text" @blur="validateIngredient(index)" />
									</td>
								</div>
								<td>
									<button :disabled="index === 0" type="button"
										@click="moveItemUp(recipeIngredients, index)">&uarr;
									</button>
									<button :disabled="index === recipeIngredients.length - 1" type="button"
										@click="moveItemDown(recipeIngredients, index)">&darr;
									</button>
									<button type="button"
										@click="removeItem(recipeIngredients, index)">Supprimer</button>
								</td>
								<span v-if="ingredientErrors[index]?.name" class="error-message">
									{{ ingredientErrors[index].name }}
								</span>
							</tr>
						</tbody>
					</table>
					<button type="button"
						@click="addItem(recipeIngredients, { index: null, quantity: null, unit: '', name: '' })">Ajouter
						un
						ingrédient
					</button>
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
								<div :class="{ invalide: stepsErrors[index]?.description }" class="form-control">
									<td><input :id="'steps-description-' + index" v-model="step.description"
											:name="'steps-description-' + index" placeholder="Décrivez l'étape" required
											type="text" @blur="validateSteps(index)" style="min-width: 300px;" />
									</td>
								</div>
								<td>
									<button :disabled="index === 0" type="button"
										@click="moveItemUp(recipeSteps, index)">&uarr;
									</button>
									<button :disabled="index === recipeSteps.length - 1" type="button"
										@click="moveItemDown(recipeSteps, index)">&darr;
									</button>
									<button type="button" @click="removeItem(recipeSteps, index)">Supprimer</button>
								</td>
								<span v-if="stepsErrors[index]?.description" class="error-message">
									{{ stepsErrors[index].description }}
								</span>
							</tr>
						</tbody>
					</table>
					<button type="button" @click="addItem(recipeSteps, { index: null, description: '' })">Ajouter une
						étape
					</button>
				</div>
				<button class="button-soummettre" type="submit">Soumettre la recette</button>
			</fieldset>
		</form>
		<div v-if="edition" class="-#">
			<form @submit.prevent="submitImage">
				<fieldset>
					<legend>Image</legend>
					<div>
						<div>
							<label for="recipe-image">Téléverser une image: </label>
						</div>
						<div>
							<input id="recipe-image" accept="image/png, image/jpeg, image/gif" type="file" />
						</div>
						&nbsp;
						<div>
							<button class="button-soummettre" type="submit">Soumettre l'image</button>
						</div>
					</div>
				</fieldset>
			</form>
			<button class="button-supprimer" v-if="edition" type="button" @click="deleteRecipe">Supprimer la
				recette</button>
		</div>
	</div>
	<div v-else>Vous n'avez pas les permissions pour voir cette page</div>
</template>

<script>
import session from '../session';
import { createRecipe, deleteRecipe, fetchRecipe, updateRecipe, updateRecipeImage } from '../services/recipeService.js';

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
		refreshForm() {
			this.recipeId = '';
			this.idValide = true;
			this.recipeName = '';
			this.nameValide = true;
			this.recipeTempsPreparation = 0;
			this.recipeTempsCuisson = 0;
			this.recipePortions = 0;
			this.recipeDesc = '';
			this.descValide = true;
			this.recipeIngredients = [
				{
					index: 1,
					quantity: null,
					unit: '',
					name: ''
				}
			];
			this.ingredientErrors = [];
			this.recipeSteps = [
				{
					index: 1,
					description: ''
				}
			];
			this.stepsErrors = [];
		},
		switchToNewRecipe() {
			this.edition = false;
			this.refreshForm();
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
				this.switchToNewRecipe();
			}
		},
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
.recipe {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
	margin: 1rem auto;
	border-radius: 10px;
	padding: 1rem;
	text-align: left;
	width: 90%;
	max-width: 80rem;
}

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

button {
	padding: 5px;
}

.button-soummettre {
	background-color: #183D3D;
	color: #fff;
	margin: 10px;
	cursor: pointer;
	border: 0;
	border-radius: 5px;
	padding: 10px;
}

.button-supprimer {
	background-color: #950101;
	color: #fff;
	margin: 10px;
	cursor: pointer;
	border: 0;
	border-radius: 5px;
	padding: 10px;
}
</style>