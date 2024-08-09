<template>
	<div class="container">
		<h2>Les Recettes</h2>
		<div id="recipe-list">
			<LoadingSpinner :error="loadError" :loading="loading"/>
			<ItemRecetteDescription v-for="recipe in recipes" v-if="!loading" :id="recipe.id" :key="recipe.id"
									:description="recipe.description" :image="recipe.image" :name="recipe.name"/>
		</div>
	</div>
</template>

<script>
import ItemRecetteDescription from './ItemRecetteDescription.vue';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import {fetchRecipes} from '../../services/recipeService.js';

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
	border: 1px solid black;
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
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 20px;
}
</style>