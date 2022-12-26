<script lang="ts">
import { RouterLink } from "vue-router";
import Button from "../components/Button.vue";

export default {
    components: {
        Button
    }
}
</script>

<template>
    <div class="text-center">
        <h1 class="text-6xl font-bold my-4">404</h1>
        <p class="text-lg mb-4">We couldn't find this page.</p>
        <router-link to="/">
            <Button color="blue">Go Home</Button>
        </router-link>
    </div>
</template>