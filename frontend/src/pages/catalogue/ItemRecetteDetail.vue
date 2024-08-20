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
			<div v-if="recipe.preparation_time" class="recipe-preparation-time">Preparation <br> {{ recipe.preparation_time }} minutes</div>
			<div v-if="recipe.cooking_time" class="recipe-cooking-time">Cuisson <br>{{ recipe.cooking_time }} minutes</div>
			<div v-if="recipe.servings" class="recipe-servings">Portion(s) <br>{{ recipe.servings }}</div>
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
		<div class="recipe-row">
			<AppreciationsRecette :recipeId="recipe.id" />
		</div>
		<div class="recipe-row">
			<CommentairesRecette v-if="recipe" :recipe="recipe" :comments="recipe.comments" @comment-added="refreshComments" />
		</div>
	</div>
</template>

<script>
import { fetchRecipe } from '../../services/recipeService.js';
import { fetchComments } from '../../services/commentService.js';
import { addApiPrefixToPath } from '../../api_utils';
import session from '../../session';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import AppreciationsRecette from "./AppreciationsRecette.vue";
import CommentairesRecette from './CommentairesRecette.vue';

export default {
	components: { AppreciationsRecette, CommentairesRecette, LoadingSpinner },
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
			session: session
		};
	},
	methods: {
		async refreshRecipe(id) {
			this.loading = true;
			this.recipe = null;

			try {
				this.recipe = await fetchRecipe(id);
				this.imageSrc = addApiPrefixToPath(this.recipe.image);
				if (this.session.user && this.session.user.id) {
					await this.fetchUserRating();
				}
			} catch {
				this.loadError = true;
			} finally {
				this.loading = false;
			}
		},
		async refreshComments() {
			try {
				this.recipe.comments = await fetchComments(this.recipe.id);
			} catch (error) {
				console.error(error);
			}
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
		},
	},
	mounted() {
		this.refreshRecipe(this.id);
	}
};
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