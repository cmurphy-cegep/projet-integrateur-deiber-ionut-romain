import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';
import App from './App.vue';
import CatalogueRecettes from './pages/catalogue/CatalogueRecettes.vue';
import ItemRecetteDetail from './pages/catalogue/ItemRecetteDetail.vue';
import FormulaireLogin from './pages/FormulaireLogin.vue';
import Register from './pages/Register.vue';

const app = createApp(App);

// Déclaration de Vue Router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '', component: CatalogueRecettes },
		{ path: '/recipes/:id', component: ItemRecetteDetail, props: true },
		{ path: '/login', component: FormulaireLogin },
		{path: '/register', component: Register}
	]
});

// Ajout de Vue Router à l'application
app.use(router);
app.mount("#app");

