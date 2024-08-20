<template>
	<div class="recipe-rating">
		<div v-if="averageRating !== null">
			<div>Moyenne des appréciations: <span v-html="generateStars(averageRating)"></span> ({{ totalRatings }} appréciations)</div>
		</div>
		<div v-if="session.user">
			<button @click="showRatingForm = !showRatingForm">{{ showRatingForm ? 'Annuler' : userRating ? 'Modifiez votre appréciation' : 'Ajouter votre appréciation' }}</button>
			<form v-if="showRatingForm" @submit.prevent="submitRating">
				<label for="rating">Votre note:</label>
				<div class="star-rating">
     <span
		 v-for="star in [1, 2, 3, 4, 5]"
		 :key="star"
		 :class="{ star: true, filled: star <= newRating }"
		 @click="setRating(star)"
	 >
      ★
     </span>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	</div>
</template>

<script>
import session from '../../session';

export default {
	props: {
		newRating: {
			type: Number,
			required: true
		},
		userRating: {
			type: Number,
			required: false
		},
		value: {
			type: Number,
			default: 0
		},
		averageRating: {
			type: Number,
			required: true
		},
		totalRatings: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			showRatingForm: false,
			session: session
		};
	},
	methods: {
		setRating(star) {
			this.$emit('input', star);
		},
		async submitRating() {
			this.$emit('submit-rating');
		},
		generateStars(rating) {
			const fullStars = Math.floor(rating);
			const halfStar = rating % 1 >= 0.5 ? 1 : 0;
			const emptyStars = 5 - fullStars - halfStar;
			return '★'.repeat(fullStars) + (halfStar ? '✭' : '') + '☆'.repeat(emptyStars);
		}
	}
};
</script>

<style scoped>
.recipe-rating {
	margin-top: 20px;
}

.star {
	font-size: 2em;
	cursor: pointer;
	color: #d3d3d3;
}

.star.filled {
	color: #ffc107;
}
</style>