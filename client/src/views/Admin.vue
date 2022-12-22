<script lang="ts">
import { ref } from "vue";

export default {
    setup() {
        const isLoading = ref(true);
        const grades = ref();

        async function fetchData() {
            const res = await fetch("http://localhost:2020/admin");
            const data: [] = await res.json();
            grades.value = data.map(({_id: id, name, score}) => ({id, name, score}))
            isLoading.value = false;
        }

        async function deleteGrade(id: string) {
            const res = await fetch(`http://localhost:2020/grade/${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        }

        fetchData();

        return { isLoading, grades, deleteGrade, fetchData };
    }
}
</script>

<template>
    <h2>Admin</h2>

    <p>Hello, Mr. Adams.</p>

    <h4>View Grades:</h4>

    <div v-if="isLoading">Loading...</div>

    <ul v-else-if="grades.length === 0" class="list-group">
        <li class="list-group-item ps-2"><div class="text-muted">No Grades Were Found</div></li>
    </ul>

    <ul v-else class="list-group">
        <li v-for="grade in grades" class="list-group-item p-0 d-flex align-items-center">
            <div class="flex-grow-1 ms-2">{{ grade.name }}: {{ grade.score }}%</div>

            <!--
            <router-link class="btn btn-dark" :to="`/feedback/${grade.id}`">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                </svg>
            </router-link>
            -->

            <button class="btn btn-danger" type="submit" @click="() => deleteGrade(grade.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                </svg>
            </button>
        </li>
    </ul>
</template>

<style scoped>
.btn {
    border-radius: 0;
}

.list-group-item:first-child > .btn-danger {
    border-top-right-radius: 0.375rem;
}

.list-group-item:last-child > .btn-danger {
    border-bottom-right-radius: 0.375rem;
}
</style>