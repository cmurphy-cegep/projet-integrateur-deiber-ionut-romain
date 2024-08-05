<template>
    <header>
        <div class="container">
            <div class="title">
                <h1>Les Recettes de Rodrigo</h1>
            </div>
        </div>
        <div class="nav">
            <span><Router-link to="/">Accueil</Router-link></span>
        </div>
        <div class="connexion">
            <div v-if="session.user">
                <div>Bienvenue, {{ session.user.userFullName }}</div>
                <div v-if="session.user.isAdmin" class="admin">ADMINISTRATEUR</div>
                <div><a href="" @click.prevent="session.disconnect()">Déconnexion</a></div>
            </div>
            <div v-else><router-link to="/login">Se connecter</router-link></div>
        </div>

    </header>
</template>

<script>
import session from '../session';

export default {
    data: function () {
        return {
            session: session
        };
    }
}
</script>