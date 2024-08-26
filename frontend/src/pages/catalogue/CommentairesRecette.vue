<template>
	<div class="recipe-comments">
		<h3>Commentaires</h3>
		<div v-for="comment in comments" :key="comment.id" class="comment">
			<p><strong>{{ comment.fullname }}</strong> - {{ formatDate(comment.publicationDate) }}</p>
			<p>{{ comment.text }}</p>
		</div>
	</div>
	<div v-if="session.user" class="recipe-add-comment">
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
import { postComment, fetchComments } from '../../services/commentService.js';
import session from '../../session.js';

export default {
	props: {
		recipeId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			showCommentForm: false,
			newCommentText: '',
			comments: [],
			session: session
		};
	},
	methods: {
		formatDate(dateString) {
			const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
			return new Date(dateString).toLocaleDateString(undefined, options).replace(' at ', ' ');
		},
		async submitComment() {
			try {
				if (!this.session.user) {
					throw new Error('User not authenticated');
				}
				await postComment(this.newCommentText, this.session.user.userId, this.recipeId);
				this.newCommentText = '';
				this.showCommentForm = false;
				this.refreshComments();
			} catch (error) {
				console.error(error);
			}
		},
		async refreshComments() {
			try {
				this.comments = await fetchComments(this.recipeId);
			} catch (error) {
				console.error(error);
			}
		}
	},
	mounted() {
		this.refreshComments();
	}
}
</script>

<style scoped>
.recipe-comments,
.recipe-add-comment {
	flex: 1;
	padding: 20px;
	height: 300px;
	overflow: auto;
	background-color: #183D3D;
	color: #fff;
}

.recipe-comments h3,
.recipe-add-comment {
	padding-bottom: 20px;
	font-size: 1.5em;
}

.comment {
	padding: 5px;
}

.comment p {
	margin-left: 20px;
}

.comment :first-child {
	margin-left: 0px;
}

.recipe-add-comment textarea {
	width: 100%;
	height: 150px;
}
</style>