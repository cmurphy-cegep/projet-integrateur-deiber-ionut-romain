<template>
    <div class="recipe">
        <img v-bind:src="imageSrc" />
        <div class="recipe-info">
            <div class="recipe-name">
                <Router-link :to="recipeDetailUrl">{{ name }}</Router-link>
            </div>
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