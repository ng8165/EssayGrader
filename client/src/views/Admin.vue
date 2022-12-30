<script setup lang="ts">
import { ref } from "vue";
import Button from "../components/Button.vue";

const domain = import.meta.env.PROD ? "https://essay-grader.onrender.com" : "http://localhost:2020";
const isLoading = ref(true);
const grades = ref();

async function fetchData() {
    const res = await fetch(`${domain}/grades`);
    const data = await res.json();

    if (res.ok) {
        grades.value = data;
        isLoading.value = false;
    } else {
        alert(data.message);
    }
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
                    <img src="/eye.svg" width="16" height="16" alt="View Feedback" />
                </Button>
            </router-link>

            <Button color="red" padding="slim" @click="() => deleteGrade(grade._id)">
                <img src="/trash.svg" width="16" height="16" alt="Delete Essay" />
            </Button>
        </li>
    </ul>
</template>

<style scoped>
.list {
    @apply list-none overflow-hidden;
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
</style>