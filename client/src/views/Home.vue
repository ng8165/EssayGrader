<script lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const submitName = ref("");
        const submitEssay = ref("");
        const findName = ref("");
        const router = useRouter();

        async function sendGrade() {
            const res = await fetch("http://localhost:2020/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: submitName.value, essay: submitEssay.value })
            });

            const data = await res.json();

            if (res.ok) router.push(`/feedback/${data.id}`);
            else alert(data.message);
        }

        async function findID() {
            const res = await fetch(`http://localhost:2020/grade/name/${findName.value}`);
            const data = await res.json();

            if (res.ok) router.push(`/feedback/${data.id}`);
            else alert(data.message);
        }

        return { submitName, submitEssay, findName, sendGrade, findID };
    }
}
</script>

<template>
    <h2 class="mb-6">Submit Essay</h2>

    <form @submit.prevent="sendGrade">
        <div class="mb-4">
            <label for="name" class="mr-1">Name:</label>
            <input name="name" id="name" required v-model="submitName" />
        </div>

        <label for="essay">Essay:</label>
        <textarea name="essay" id="essay" class="block w-full mt-1 mb-4" rows="10" required v-model="submitEssay"></textarea>

        <button type="submit" class="block bg-blue-500 text-white">Submit</button>
    </form>

    <hr class="border-neutral-500 my-6" />

    <h2 class="mb-6">Find Essay</h2>

    <form @submit.prevent="findID">
        <div class="mb-4">
            <label for="name" class="mr-1">Name:</label>
            <input name="name" id="name" required v-model="findName" />
        </div>

        <button type="submit" class="block bg-blue-500 text-white">Find</button>
    </form>
</template>