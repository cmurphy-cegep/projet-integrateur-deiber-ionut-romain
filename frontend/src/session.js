import {reactive} from "vue";

class AuthError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
	}
}

const session = reactive({
	user: null,
	username: null,
	password: null,

	initialize() {
		if (sessionStorage.username) {
			this.username = sessionStorage.username;
		}
		if (sessionStorage.password) {
			this.password = sessionStorage.password;
		}
		if (!this.user && this.username !== null) {
			this.fetchUser().catch(err => console.error("L'authentification initiale a échouée: ", err));
		}
	},
	async login(username, password) {
		this.setCredentials(username, password);
		try {
			return await this.fetchUser();
		} catch (err) {
			this.clearCredentials();
			throw err;
		}
	},
	setCredentials(username, password) {
		this.username = username;
		sessionStorage.username = username;
		this.password = password;
		sessionStorage.password = password;
	},
	clearCredentials() {
		this.username = null;
		sessionStorage.removeItem('username');
		this.password = null;
		sessionStorage.removeItem('password');
	},
	disconnect() {
		this.user = null;
		this.clearCredentials();
	},
	async fetchUser() {
		const response = await fetch("/api/login", {
			method: "GET",
			headers: {
				...this.getAuthHeaders()
			}
		});

		if (response.ok) {
			const user = await response.json();
			this.user = user;
			return user;
		} else {
			this.user = null;
			if (response.status === 401) {
				throw new AuthError(response.status, "Nom d'utilisateur ou mot de passe incorrect");
			} else {
				throw new AuthError(response.status, "Erreur lors de l'authentification: " + response.status);
			}
		}
	},
	getAuthHeaders() {
		if (this.username) {
			return {
				"Authorization": "Basic " + btoa(this.username + ":" + this.password),
				"X-Requested-With": "XMLHttpRequest"
			};
		} else {
			return {};
		}
	}
});

session.initialize();
export default session;
export const {login} = session;
export {AuthError};