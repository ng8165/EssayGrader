<script setup lang="ts">
import { ref } from "vue";
import Button from "../components/Button.vue";

const domain = import.meta.env.PROD ? "https://essay-grader.onrender.com" : "http://localhost:2020";
const isLoading = ref(true);
const grades = ref();

async function fetchData() {
    const res = await fetch(`${domain}/grades`);
    grades.value = await res.json();
    isLoading.value = false;
}

async function deleteGrade(id: string) {
    const res = await fetch(`${domain}/grade/id/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
    else alert((await res.json()).message);
}

fetchData();
</script>

<template>
    <h2>Admin</h2>

    <p class="my-4">Hello, Mr. Adams.</p>

    <h4 class="text-xl font-bold mb-2">View Grades:</h4>

    <div v-if="isLoading">Loading...</div>

    <ul v-else-if="grades.length === 0" class="list">
        <li class="p-2"><div class="text-neutral-500">No Grades Were Found</div></li>
    </ul>

    <ul v-else class="list">
        <li v-for="grade in grades" class="list p-0 flex items-center">
            <div class="grow ml-2">{{ grade.name }}: {{ grade.score }}%</div>

            
            <router-link :to="`/feedback/${grade._id}`">
                <Button color="dark" padding="slim">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                    </svg>
                </Button>
            </router-link>

            <Button color="red" padding="slim" @click="() => deleteGrade(grade._id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                </svg>
            </Button>
        </li>
    </ul>
</template>

<style scoped>
.list {
    @apply list-none;
}

.list > li {
    @apply border border-b-0 border-neutral-500;
}

.list > li:first-child {
    @apply rounded-t;
}

.list > li:last-child {
    @apply border-b rounded-b;
}

.list > li button {
    @apply rounded-none;
}

.list > li:first-child button.bg-red-500 {
    @apply rounded-tr;
}

.list > li:last-child button.bg-red-500 {
    @apply rounded-br;
}
</style>