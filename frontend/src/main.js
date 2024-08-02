import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';
import App from './App.vue';
import CatalogueRecettes from './pages/catalogue/CatalogueRecettes.vue';

const app = createApp(App);

// Déclaration de Vue Router
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '', component: CatalogueRecettes },
        /*{ path: '/recettes/:id', component: ItemCatalogueDetail, props: true },
        { path: '/checkout', component: PageCheckout },
        { path: '/admin/new-product', component: NewItemCatalogue },
        { path: '/login', component: FormulaireLogin }*/
    ]
});

// Ajout de Vue Router à l'application
app.use(router);

app.mount("#app");

