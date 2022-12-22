<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const name = ref("");
        const router = useRouter();

        async function findID() {
            const res = await fetch(`http://localhost:2020/grade/name/${name.value}`);
            const { id } = await res.json();
            if (res.ok) router.push(`/feedback/${id}`);
        }

        return { name, findID };
    }
}
</script>

<template>
    <h2 class="mb-6">Find Essay</h2>

    <form @submit.prevent="findID">
        <div class="mb-4">
            <label for="name" class="mr-1">Name:</label>
            <input name="name" id="name" required v-model="name" />
        </div>

        <button type="submit" class="block bg-blue-500 text-white">Submit</button>
    </form>
</template>