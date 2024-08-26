<template>
	<header>
		<div class="container">
			<img :src="logoUrl" alt="Logo">
			<div class="title">
				<h1>Les Recettes de Rodrigo</h1>
			</div>
			<div class="navigation">
				<div class="nav_router">
					<span><Router-link to="/">Accueil</Router-link></span>
					<span v-if="session.user && session.user.isAdmin"> |
						<router-link to="/admin/ajout-edition-item-recette">Nouvelle recette</router-link>
					</span>
				</div>
				<div v-if="session.user && session.user.isAdmin" class="admin">ADMINISTRATEUR</div>
			</div>
			<div class=" connexion">
				<div v-if="session.user">
					<div>Bienvenue, {{ session.user.fullname }}</div>
					<div><a href="" @click.prevent="session.disconnect()">Déconnexion</a></div>
				</div>
				<div v-else>
					<router-link to="/login" class="button_connecter">Se connecter</router-link>
				</div>
			</div>
		</div>

	</header>
</template>

<script>
import session from '../session';

export default {
	data: function () {
		return {
			session: session,
			logoUrl: '../../public/logo.png'
		};
	}
}
</script>

<style scoped>
.container {
	display: grid;
	grid-template-columns: repeat(8, 1fr);
	width: auto;
	grid-template-rows: auto;
	grid-template-areas:
		"container_img . . . . . . ."
		"container_img  container_title container_title container_title container_connexion container_connexion container_connexion container_connexion"
		"container_img  . . . container_connexion container_connexion container_connexion container_connexion"
		". . . . . . . ."
		". . . . . . . ."
		"container_nav container_nav container_nav container_nav container_nav container_nav container_nav container_nav";
	gap: 5px;
	background-color: #040D12;
	padding-top: 10px;
	color: #fff;
}

.container img {
	grid-area: container_img;
	height: 80px;
	width: 80px;
	margin-left: auto;
	border-radius: 50%;
}

.title {
	grid-area: container_title;
	margin-left: 10px;
	font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.navigation {
	grid-area: container_nav;
	background-color: #183D3D;
}

.nav_router {
	padding: 10px 0 10px 50px;
}

.connexion {
	grid-area: container_connexion;
	text-align: end;
	padding: 20px;
}

.connexion div {
	display: inline;
	margin-right: 30px;
}

.navigation span a,
.connexion div a {
	color: #fff;
	text-decoration: none;
}

.button_connecter {
	background-color: #4E9F3D;
	padding: 1em;
	border-radius: 10px;
	color: #1E5128;
}

.admin {
	background-color: #950101;
	color: white;
	text-align: end;
	padding: 5px 30px;
}
</style>