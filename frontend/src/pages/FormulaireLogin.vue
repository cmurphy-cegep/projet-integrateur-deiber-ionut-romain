<template>
	<div class="boxed">
		<form @submit.prevent="login">
			<div>
				<label for="username">Identifiant utilisateur:</label>
				<input id="username" v-model="credentials.username" type="text" required @keyup.enter="login">
			</div>
			<div>
				<label for="password">Mot de passe:</label>
				<input id="password" v-model="credentials.password" type="password" required @keyup.enter="login">
			</div>
			<button type="submit" :disabled="!isFormValid" class="connection-button">Connexion</button>
			<div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
			<div>
				<router-link to="/register">Créer un compte</router-link>
			</div>
		</form>
	</div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import session, { AuthError } from '../session.js';

export default {
	setup() {
		const credentials = ref({ username: '', password: '' });
		const errorMessage = ref('');
		const router = useRouter();

		const isFormValid = computed(() => {
			return credentials.value.username && credentials.value.password;
		});

		const login = async () => {
			if (!isFormValid.value) return;
			try {
				await session.login(credentials.value.username, credentials.value.password);
				router.push('/');
			} catch (error) {
				console.error('Login failed:', error);
				if (error instanceof AuthError) {
					errorMessage.value = error.message;
				} else {
					errorMessage.value = 'Une erreur est survenue lors de la connexion.';
				}
			}
		};

		return {
			credentials,
			login,
			isFormValid,
			errorMessage
		};
	}
};
</script>

<style scoped>
form * {
	margin: 0.3rem;
}

.boxed {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
	margin: 1rem auto;
	border-radius: 10px;
	padding: 1rem;
	text-align: left;
	width: 90%;
	max-width: 80rem;
}

.connection-button {
	background-color: red;
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 5px;
	cursor: pointer;
}

.connection-button:disabled {
	background-color: grey;
	cursor: not-allowed;
}

.error-message {
	color: red;
	margin-top: 10px;
}
</style>