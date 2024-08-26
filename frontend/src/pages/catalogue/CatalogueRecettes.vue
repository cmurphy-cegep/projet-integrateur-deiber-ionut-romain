<template>
	<div class="container">
		<h2>Les Recettes</h2>
		<LoadingSpinner :error="loadError" :loading="loading" />
		<div v-if="!loading" id="recipe-list">
			<ItemRecetteDescription v-for="recipe in recipes" :id="recipe.id" :key="recipe.id"
				:description="recipe.description" :image="recipe.image" :name="recipe.name" />
		</div>
	</div>
</template>

<script>
import ItemRecetteDescription from './ItemRecetteDescription.vue';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import { fetchRecipes } from '../../services/recipeService.js';

export default {
	components: {
		ItemRecetteDescription: ItemRecetteDescription,
		LoadingSpinner: LoadingSpinner
	},
	data() {
		return {
			recipes: [],
			loading: true,
			loadError: false
		}
	},
	mounted() {
		fetchRecipes().then(recipes => {
			this.recipes = recipes;
			this.loading = false;
			this.loadError = false;
		}).catch(err => {
			console.error(err);
			this.loading = false;
			this.loadError = true;
		});
	}
}
</script>

<style scoped>
.container {
	padding: 20px;
}

.container h2 {
	text-align: center;
}

#recipe-list {
	display: grid;
	width: 90%;
	margin: 0 auto;
	padding: 20px;
	grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
	grid-gap: 20px;
}
</style>