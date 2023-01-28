<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "../components/Button.vue";

const submitName = ref("");
const submitEssay = ref("");
const findName = ref("");
const router = useRouter();

async function sendGrade() {
    const res = await fetch(`${import.meta.env.VITE_SERVER}/essay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: submitName.value, essay: submitEssay.value })
    });

    const data = await res.json();

    if (res.ok) router.push(`/feedback/${data.id}`);
    else alert(data.message);
}

async function findID() {
    const res = await fetch(`${import.meta.env.VITE_SERVER}/essay/name/${findName.value}`);
    const data = await res.json();

    if (res.ok) router.push(`/feedback/${data.id}`);
    else alert(data.message);
}
</script>

<template>
    <div class="alert"><strong>DISCLAIMER</strong>: the free server instance may require ~30 seconds to wake up before this page will respond. Once <a href="https://essay-grader.onrender.com/grades" target="_blank">this page</a> loads, you may use the site. Please see <a href="https://github.com/ng8165/EssayGrader" target="_blank">the repository</a> for more details.</div>

    <h2 class="mb-6">Submit Essay</h2>

    <form @submit.prevent="sendGrade">
        <div class="mb-4">
            <label for="name" class="mr-1">Name:</label>
            <input name="name" id="name" required v-model="submitName" />
        </div>

        <label for="essay">Essay:</label>
        <textarea name="essay" id="essay" class="block w-full mt-1 mb-4" rows="10" required v-model="submitEssay"></textarea>

        <Button type="submit" color="blue"></Button>
    </form>

    <hr class="border-neutral-500 my-6" />

    <h2 class="mb-6">Find Essay</h2>

    <form @submit.prevent="findID">
        <div class="mb-4">
            <label for="name" class="mr-1">Name:</label>
            <input name="name" id="name" required v-model="findName" />
        </div>

        <Button type="submit" color="blue">Find</Button>
    </form>
</template>

<style scoped>
a {
    @apply text-blue-700 underline;
}

a:hover {
    @apply brightness-125;
}

.alert {
    @apply bg-red-300 p-4 rounded mb-4;
}
</style>