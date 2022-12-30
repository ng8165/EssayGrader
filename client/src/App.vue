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
        Made with <img src="/code.svg" width="16" height="16" alt="code" class="inline-block" /> by Nelson Gou.
    </footer>
</template>
    