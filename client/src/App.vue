<script setup lang="ts">
    import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <nav class="bg-blue-500 w-full py-4">
        <router-link to="/" class="ml-4 text-white text-xl">Essay Grader</router-link>
    </nav>

    <main class="p-4 grow">
        <RouterView />
    </main>

    <footer class="text-center text-neutral-500 py-4">
        Made with
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="align-text-top" viewBox="0 0 16 16">
            <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
        </svg>
        by Nelson Gou.
    </footer>
</template>
    