<template>
	<div class="recipe-rating">
		<div>
			<div v-if="averageRating !== null">
				{{ averageRating.toFixed(1) }} <span v-html="generateStars(averageRating)"></span> ({{ totalRatings }} appréciations)
			</div>
			<div v-else>
				Pas encore de notes
			</div>
		</div>
		<div v-if="session.user">
			<span v-if="userRating">Votre appréciation: {{ userRating }} <span v-html="generateStars(userRating)"></span></span>
			<button @click="showRatingForm = !showRatingForm">{{ showRatingForm ? 'Annuler' : userRating ? 'Modifiez votre appréciation' : 'Ajouter votre appréciation' }}</button>
			<form v-if="showRatingForm" @submit.prevent="submitRating">
				<label for="rating">Votre note:</label>
				<div class="star-rating">
					<input type="number" id="rating" :value="newRating" min="1" max="5" required @input="updateRating($event.target.value)">
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	</div>
</template>

<script>
import session from '../../session';
import { fetchRatings, postRating, getUserRatingForRecipe } from '../../services/ratingService.js';

export default {
	props: {
		recipeId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			showRatingForm: false,
			session: session,
			averageRating: 0,
			totalRatings: 0,
			newRating: 1,
			userRating: null
		};
	},
	methods: {
		async refreshRatings() {
			try {
				const ratings = await fetchRatings(this.recipeId);
				this.averageRating = ratings.ratingAverage || 0;
				this.totalRatings = ratings.ratingCount || 0;
			} catch (error) {
				console.error(error);
			}
		},
		async fetchUserRating() {
			try {
				const response = await getUserRatingForRecipe(this.recipeId);
				this.userRating = response;
				if (this.userRating) {
					this.newRating = this.userRating;
				}
			} catch (error) {
				console.error(error);
			}
		},
		updateRating(value) {
			this.newRating = Number(value);
		},
		async submitRating() {
			try {
				await postRating(this.newRating, this.session.user.id, this.recipeId);
				await this.refreshRatings();
				this.showRatingForm = false;
				await this.fetchUserRating();
			} catch (error) {
				console.error(error);
			}
		},
		generateStars(rating) {
			const fullStars = Math.floor(rating);
			const halfStar = rating % 1 >= 0.5 ? 1 : 0;
			const emptyStars = 5 - fullStars - halfStar;
			return '★'.repeat(fullStars) + (halfStar ? '✭' : '') + '☆'.repeat(emptyStars);
		}
	},
	mounted() {
		this.refreshRatings();
		if (this.session.username) {
			this.fetchUserRating();
		}
	}
};
</script>

<style scoped>
.recipe-rating {
	margin-top: 20px;
}
</style>