<template>
	<LoadingSpinner :error="loadError" :loading="loading"/>
	<div v-if="recipe && !loading && !loadError" class="recipe">
		<div class="recipe-name">{{ recipe.name }}</div>
		<div class="recipe-row">
			<div class="recipe-image-container">
				<img :src="imageSrc" alt="Recipe Image" class="recipe-image"/>
			</div>
			<div class="recipe-description">{{ recipe.description }}</div>
		</div>
		<div class="recipe-row">
			<div class="recipe-preparation-time">Preparation <br> {{ recipe.preparation_time }} minutes</div>
			<div class="recipe-cooking-time">Cuisson <br>{{ recipe.cooking_time }} minutes</div>
			<div class="recipe-servings">Portion(s) <br>{{ recipe.servings }}</div>
		</div>
		<div class="recipe-row">
			<div class="recipe-ingredients">
				<div class="recipe-ingredients-title">Ingrédients</div>
				<ul>
					<li v-for="ingredient in recipe.ingredients" :key="ingredient.name">
						{{ formatQuantity(ingredient.quantity) }} {{ ingredient.unit }} {{ ingredient.name }}
					</li>
				</ul>
			</div>
			<div class="recipe-steps">
				<div class="recipe-steps-title">Étapes</div>
				<ol>
					<li v-for="step in recipe.steps" :key="step.index">{{ step.description }}</li>
				</ol>
			</div>
		</div>
	</div>
</template>

<script>
import {fetchRecipe} from '../../services/recipeService.js';
import {addApiPrefixToPath} from '../../api_utils';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

export default {
	components: {LoadingSpinner: LoadingSpinner},
	props: {
		id: String,
		image: String
	},
	data() {
		return {
			recipe: null,
			imageSrc: '',
			loading: true,
			loadError: false,
		};
	},
	methods: {

		refreshRecipe(id) {
			this.loading = true;
			this.recipe = null;

			fetchRecipe(id).then(recipe => {
				this.recipe = recipe;
				this.imageSrc = addApiPrefixToPath(recipe.image);
				this.loading = false;
			}).catch(err => {
				console.error(err);
				this.recipe = null;
				this.loadError = true;
				this.loading = true;
			});
		},
		formatQuantity(quantity) {
			if (quantity === null) {
				return '';
			}
			const num = Number(quantity);
			if (Number.isInteger(num)) {
				return num;
			}
			return num.toString().replace(/(\.\d*[1-9])0+$|\.0*$/, '$1');
		}
	},
	mounted() {
		this.refreshRecipe(this.id);
	}
}
</script>

<style scoped>


.recipe-name {
	text-align: center;
	font-size: 2em;
	margin-bottom: 20px;
	font-weight: bold;
}

.recipe-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
	border: 1px solid black;
	padding: 20px;
}

.recipe-image-container {
	flex: 0 0 60%;
	padding-top: 30%;
	position: relative;
}

.recipe-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.recipe-description {
	flex: 1;
	margin-left: 20px;
}

.recipe-ingredients, .recipe-steps {
	flex: 1;
	border: 1px solid black;
	padding: 20px;
}

.recipe-ingredients-title, .recipe-steps-title {
	font-weight: bold;
	margin-bottom: 5px;
}
</style>