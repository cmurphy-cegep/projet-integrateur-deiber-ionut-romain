<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
<!--  <EnteteNavigation />-->
  <router-view></router-view>
  <!--  <PiedPage />-->
</template>

<style>
* {
  box-sizing: border-box;
}

html {
  font-family: sans-serif;
}
</style>
