<template>
	<div class="recipe-comments">
		<h3>Commentaires</h3>
		<div v-for="comment in comments" :key="comment.id" class="comment">
			<p><strong>{{ comment.fullname }}</strong> - {{ formatDate(comment.publicationDate) }}</p>
			<p>{{ comment.text }}</p>
		</div>
	</div>
	<div class="recipe-add-comment">
		<h3>Ajouter un commentaire</h3>
		<button @click="showCommentForm = !showCommentForm">
			{{ showCommentForm ? 'Annuler' : 'Ajouter un commentaire' }}
		</button>
		<form v-if="showCommentForm" @submit.prevent="submitComment">
			<textarea v-model="newCommentText" required></textarea>
			<button type="submit">Ajouter</button>
		</form>
	</div>
</template>

<script>
import { postComment } from '../../services/commentService.js';
import session from '../../session.js';

export default {
	props: {
		recipe: Object,
		comments: Array
	},
	emits: ['comment-added'],
	data() {
		return {
			showCommentForm: false,
			newCommentText: '',
			session: session
		};
	},
	methods: {
		formatDate(dateString) {
			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			return new Date(dateString).toLocaleDateString(undefined, options);
		},
		async submitComment() {
			try {
				if (!this.session.user) {
					throw new Error('User not authenticated');
				}
				await postComment(this.newCommentText, this.session.user.userId, this.recipe.id);
				this.newCommentText = '';
				this.showCommentForm = false;
				this.$emit('comment-added'); // Emit event to notify parent component
			} catch (error) {
				console.error(error);
			}
		}
	}
}
</script>

<style scoped>
.recipe-comments, .recipe-add-comment {
	flex: 1;
	border: 1px solid black;
	padding: 20px;
	height: 300px;
	overflow: auto;
}

.recipe-add-comment textarea {
	width: 100%;
	height: 150px;
}
</style>