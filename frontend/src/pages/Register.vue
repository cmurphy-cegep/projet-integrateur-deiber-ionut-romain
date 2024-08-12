<template>
	<div class="boxed">
		<form @submit.prevent="register">
			<div>
				<label for="username">Identifiant utilisateur:</label>
				<input id="username" v-model="credentials.username" type="text" required>
			</div>
			<div>
				<label for="password">Mot de passe:</label>
				<input id="password" v-model="credentials.password" type="password" required>
			</div>
			<span>
				<label for="confirmPassword">Confirmer le mot de passe:</label>
				<input id="confirmPassword" v-model="credentials.confirmPassword" type="password" required>
				<span v-if="passwordMismatch" class="error-message">Les mots de passe ne correspondent pas.</span>
			</span>
			<div>
				<label for="fullName">Nom complet:</label>
				<input id="fullName" v-model="credentials.fullName" type="text" required>
			</div>
			<button type="submit" :disabled="!isFormValid" class="register-button">Créer le compte</button>
			<div v-if="errorMessage && !passwordMismatch" class="error-message">{{ errorMessage }}</div>
		</form>
	</div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';


export default {
	setup() {
		const credentials = ref({ username: '', password: '', confirmPassword: '', fullName: '' });
		const errorMessage = ref('');
		const passwordMismatch = ref(false);
		const router = useRouter();

		const isFormValid = computed(() => {
			return credentials.value.username && credentials.value.password && credentials.value.confirmPassword && credentials.value.fullName;
		});

		const register = async () => {
			passwordMismatch.value = credentials.value.password !== credentials.value.confirmPassword;
			if (passwordMismatch.value) {
				errorMessage.value = 'Les mots de passe ne correspondent pas.';
				return;
			}
			if (!isFormValid.value) {
				return;
			}
			try {
				console.log('Registering user:', credentials.value);
				const response = await fetch('/api/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						username: credentials.value.username,
						password: credentials.value.password,
						fullname: credentials.value.fullName
					})
				});

				if (!response.ok) {
					const errorData = await response.json();
					const errorMessage = errorData.message || 'Une erreur est survenue lors de la création du compte.';
					throw new Error(errorMessage);
				}

				const responseData = await response.json();
				console.log('Registration successful:', responseData);
				router.push('/login');
			} catch (error) {
				console.error('Registration failed:', error);
				errorMessage.value = error.message;
			}
		};

		return {
			credentials,
			register,
			isFormValid,
			errorMessage,
			passwordMismatch
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

.register-button {
	background-color: green;
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 5px;
	cursor: pointer;
}

.register-button:disabled {
	background-color: grey;
	cursor: not-allowed;
}

.error-message {
	color: red;
	margin-top: 10px;
}
</style>