<template>
	<div class="recipe">
		<img v-bind:src="imageSrc" />
		<div class="recipe-name">
			<Router-link :to="recipeDetailUrl">{{ name }}</Router-link>
		</div>
		<div class="recipe-description">{{ description }}</div>
	</div>
</template>

<script>
import { addApiPrefixToPath } from '../../api_utils';

export default {
	props: {
		id: String,
		name: String,
		description: String,
		image: String
	},
	computed: {
		recipeDetailUrl() {
			return "/recipes/" + this.id;
		},
		imageSrc() {
			return addApiPrefixToPath(this.image);
		}
	}
}
</script>

<style scoped>
.recipe {
	border: 1px solid black;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 0fr));
	width: auto;
	grid-template-rows: auto;
	grid-template-areas:
		"recipe_img recipe_name recipe_name recipe_name"
		"recipe_img recipe_description recipe_description recipe_description"
		"recipe_img recipe_description recipe_description recipe_description";
	padding: 20px;
}

.recipe img {
	grid-area: recipe_img;
	width: 120px;
	height: 150px;
}

.recipe-name {
	grid-area: recipe_name;
	font-weight: bold;
	font-size: 1.2em;
}

.recipe-description {
	grid-area: recipe_description;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	line-clamp: 4;
	overflow: hidden;
	text-overflow: ellipsis;
	height: calc(1.2em * 4);
	line-height: 1.2em;
	text-align: justify;
}
</style>