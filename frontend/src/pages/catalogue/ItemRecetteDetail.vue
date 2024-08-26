<template>
	<LoadingSpinner :error="loadError" :loading="loading" />
	<div v-if="recipe && !loading && !loadError" class="recipe">
		<button v-if="session.user && session.user.isAdmin" type="button" class="button-admin"
			@click="$router.push({ path: `/admin/ajout-edition-item-recette/${recipe.id}` })">Éditer
		</button>
		<div class="recipe-row">
			<div class="recipe-image-container">
				<img :src="imageSrc" alt="Recipe Image" class="recipe-image" />
			</div>
			<div class="container-description">
				<div class="recipe-name">{{ recipe.name }}</div>
				<div class="recipe-description" v-html="formattedDescription"></div>
				<div class="recipe-Appreciations">
					<AppreciationsRecette :recipeId="recipe.id" />
				</div>
				<div class="container-preparation">
					<div v-if="recipe.preparation_time" class="recipe-preparation-time">Preparation <br> {{
						recipe.preparation_time
					}} minutes
					</div>
					<div v-if="recipe.cooking_time" class="recipe-cooking-time">Cuisson <br>{{ recipe.cooking_time }}
						minutes
					</div>
					<div v-if="recipe.servings" class="recipe-servings">Portion(s) <br>{{ recipe.servings }}</div>
				</div>
			</div>
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
			<CommentairesRecette :recipeId="recipe.id" />
		</div>
	</div>
</template>

<script>
import { fetchRecipe } from '../../services/recipeService.js';
import { addApiPrefixToPath } from '../../api_utils';
import AppreciationsRecette from "./AppreciationsRecette.vue";
import CommentairesRecette from './CommentairesRecette.vue';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import session from '../../session';

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
			} catch {
				this.loadError = true;
			} finally {
				this.loading = false;
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
	computed: {
		formattedDescription() {
			return this.recipe.description.replace(/\n/g, '<br>');
		}
	},
	mounted() {
		this.refreshRecipe(this.id);
	}
};
</script>

<style scoped>
.recipe-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
	padding: 0px;
}

.container-description {
	display: grid;
	place-items: center;
	padding: 5em 7em 0;
	gap: 10px;
	width: 100%;
}

.recipe-name {
	font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	font-size: 4em;
	font-weight: bold;
}

.recipe-description {
	font-size: 1.2em;
}

.container-preparation {
	display: flex;
	justify-content: space-between;
	width: 100%;
	font-size: 1em;
	font-weight: bold;
	background-color: #183D3D;
	color: #fff;
	padding: 20px;
	align-self: end;
}

.recipe-Appreciations {
	font-size: 1.5em;
	justify-self: end;
}

.recipe-ingredients,
.recipe-steps {
	flex: 1;
	padding: 4em;
}

.recipe-ingredients ul li,
.recipe-steps ol li {
	margin: 20px;
	padding-left: 20px;
	font-size: 1.2em;
}

.recipe-ingredients-title,
.recipe-steps-title {
	font-weight: bold;
	margin-bottom: 5px;
	font-size: 2em;
	padding: 10px;
}

.button-admin {
	background-color: #4E9F3D;
	padding: 20px;
	cursor: pointer;
	margin: 10px;
	border: none;
	border-radius: 10px;
	font-weight: bold;
	font-size: 1.2em;
}
</style>