<script setup>
</script>

<template>
	<EnteteNavigation />
	<router-view></router-view>
	<PiedPage />
</template>

<script>
import EnteteNavigation from './components/EnteteNavigation.vue';
import PiedPage from './components/PiedPage.vue';

export default {
	components: {
        EnteteNavigation,
		PiedPage
    }
}
</script>

<style>
* {
	box-sizing: border-box;
}

html {
	font-family: sans-serif;
}
</style>
