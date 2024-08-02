<template>
    <div id="recipe-list">
        <h2>Les Recettes</h2>
        <LoadingSpinner :loading="loading" :error="loadError" />
        <ItemRecetteDescription v-if="!loading" v-for="recipe in recipes" :key="recipe.id"
            :name="recipe.name" :description="recipe.description" :id="recipe.id" :image="recipe.image" />
    </div>
</template>

<script>
import ItemRecetteDescription from './ItemRecetteDescription.vue';
import LoadingSpinner from '../../components/LoadingSpinner.vue'; 
import { fetchRecipes } from '../../RecipeService';

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