<template>
	<header>
		<div class="container">
			<img :src="logoUrl" alt="Logo">
			<div class="title">
				<h1>Les Recettes de Rodrigo</h1>
			</div>

			<div class="nav">
				<span><Router-link to="/">Accueil</Router-link></span>
				<span v-if="session.user && session.user.isAdmin"> |
					<router-link to="/admin/new-recipe">Nouvelle recette</router-link>
				</span>
			</div>
			<div class="connexion">
				<div v-if="session.user">
					<div>Bienvenue, {{ session.user.fullname }}</div>
					<div v-if="session.user.isAdmin" class="admin">ADMINISTRATEUR</div>
					<div><a href="" @click.prevent="session.disconnect()">Déconnexion</a></div>
				</div>
				<div v-else>
					<router-link to="/login">Se connecter</router-link>
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
	border: 1px solid black;
	display: grid;
	grid-template-columns: repeat(8, 1fr);
	width: auto;
	grid-template-rows: auto;
	grid-template-areas:
		"container_img  . . . . . . ."
		"container_img  container_title container_title container_title container_title container_title container_title container_title"
		"container_img  . . . . . . ."
		"container_nav container_nav container_nav container_nav container_nav container_connexion container_connexion container_connexion";
	padding: 10px;
	gap: 5px;
}

.container img {
	grid-area: container_img;
	height: 120px;
	width: 120px;
	margin: 0 auto;
	border-radius: 50%;
}

.title {
	grid-area: container_title;
}

.nav {
	grid-area: container_nav;
	text-align: center;
}

.connexion {
	grid-area: container_connexion;
	text-align: end;
}

.admin {
	background-color: darkred;
	color: white;
	text-align: center;
}
</style>