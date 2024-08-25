import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';
import App from './App.vue';
import CatalogueRecettes from './pages/catalogue/CatalogueRecettes.vue';
import ItemRecetteDetail from './pages/catalogue/ItemRecetteDetail.vue';
import FormulaireLogin from './pages/FormulaireLogin.vue';
import Register from './pages/FormulaireSignup.vue';
import AjoutEditionItemRecette from './pages/AjoutEditionItemRecette.vue';

const app = createApp(App);

// Déclaration de Vue Router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '', component: CatalogueRecettes },
		{ path: '/recipes/:id', component: ItemRecetteDetail, props: true },
		{ path: '/login', component: FormulaireLogin },
		{ path: '/register', component: Register },
		{ path: '/admin/ajout-edition-item-recette/:id?', component: AjoutEditionItemRecette, props: true },
	]
});

// Ajout de Vue Router à l'application
app.use(router);
app.mount("#app");

