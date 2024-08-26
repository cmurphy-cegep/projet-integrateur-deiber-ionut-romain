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
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

html {
	font-family: sans-serif;
}

h2 {
	font-size: 2rem;
	font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>
