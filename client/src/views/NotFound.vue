<script lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
    <div class="text-center">
        <h1 class="text-6xl font-bold my-4">404</h1>
        <p class="text-lg">We couldn't find this page.</p>
        <router-link to="/">
            <button type="submit" class="bg-blue-500 text-white mt-4">Go Home</button>
        </router-link>
    </div>
</template>