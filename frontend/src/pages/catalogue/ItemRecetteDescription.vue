<template>
	<div class="recipe">
		<img v-bind:src="imageSrc" />
		<div class="recipe-info">
			<div class="recipe-name">
				<Router-link :to="recipeDetailUrl">{{ name }}</Router-link>
			</div>
			<div class="recipe-description">{{ description }}</div>
		</div>
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
	position: relative;
	max-width: 450px;
	border-radius: 8px;
	overflow: hidden;
	background: #1E5128;
}

.recipe img {
	width: 100%;
	height: auto;
	display: block;
}

.recipe-info {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	box-sizing: border-box;
	background-color: rgba(25, 26, 25, 0.97);
	min-height: 200px;
	padding: 20px;
}

.recipe-name {
	font-size: 1.2em;
	margin: 0;
	text-align: center;
	padding: 10px;
}

.recipe-name a {
	text-decoration: none;
	font-weight: bold;
	color: #D8E9A8;
}

.recipe-name a:hover {
	color: #fff;
}

.recipe-description {
	font-size: 1em;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 4;
	line-clamp: 4;
	overflow: hidden;
	text-overflow: ellipsis;
	height: calc(1.2em * 4);
	line-height: 1.2em;
	text-align: justify;
	margin: 10px;
	color: #fff;
}
</style>