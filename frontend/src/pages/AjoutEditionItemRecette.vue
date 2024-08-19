<template>
    <div class="product" v-if="session.user && session.user.isAdmin">
    </div>
    <div v-else>Vous n'avez pas les permissions pour voir cette page</div>
</template>

<script>
import session from '../session';

export default {
    data() {
        return {
            session: session
        };
    }
}
</script>