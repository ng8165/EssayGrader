<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const name = ref("");
        const essay = ref("");
        const router = useRouter();

        async function sendGrade() {
            const res = await fetch("http://localhost:2020/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.value, essay: essay.value })
            });

            const { id } = await res.json();

            if (res.ok) router.push(`/feedback/${id}`);
        }

        return { name, essay, sendGrade };
    }
}
</script>

<template>
    <h2 class="mb-4">Submit Essay</h2>

    <form @submit.prevent="sendGrade">
        <div class="mb-3">
            <label for="name" class="me-1">Name:</label>
            <input name="name" id="name" required v-model="name" />
        </div>

        <label for="essay">Essay:</label>
        <textarea name="essay" id="essay" class="d-block w-100 mt-2 mb-3" rows="10" required v-model="essay"></textarea>

        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>