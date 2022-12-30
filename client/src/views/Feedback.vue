<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { useRoute } from "vue-router";
import Tooltip from "../components/Tooltip.vue";

const domain = import.meta.env.PROD ? "https://essay-grader.onrender.com" : "http://localhost:2020";
const route = useRoute();
const { id } = route.params;
const isLoading = ref(true);
const feedback = ref([0]);
const essay = ref([[""]]);

async function fetchData() {
    const res = await fetch(`${domain}/essay/id/${id}`);
    const { feedback: essayFeedback, essay: essayChunks } = await res.json();

    if (res.ok) {
        feedback.value = essayFeedback; // 0: nasty no nos, 1: spelling errors, 2: same starting word, 3: ending with preposition, 4: word count, 5: score
        essay.value = essayChunks;
        isLoading.value = false;
    } else {
        router.replace("/404");
    }
}

fetchData();
</script>

<template>
    <h2 class="mb-4">Feedback</h2>

    <div v-if="isLoading">Loading...</div>
    <div v-else>
        <ul class="ml-4">
            <li>{{ feedback[0] }} Nasty No-Nos (-1% each)</li>
            <li>{{ feedback[1] }} Spelling Errors (-1% each)</li>
            <li>{{ feedback[2] }} Sentence Pairs Start With The Same Word (-3% each)</li>
            <li>{{ feedback[3] }} Sentences End With A Preposition (-5% each)</li>
            <li>{{ feedback[4] }} words: {{ feedback[4] < 500 || feedback[4] > 1000 ? `Too ${ feedback[4] < 500 ? "Short" : "Long"} (-50%)` : "Good"}}</li>
            <li><strong>Final Score: {{ feedback[5] }}% {{ feedback[5] < -200 ? "was rounded to -200%" : "" }}</strong></li>
        </ul>

        <hr class="border-neutral-500 my-4" />

        <p>Hover over highlighted words below to receive more detailed feedback.</p>

        <div class="border-l-4 border-neutral-300 p-4 mt-4">
            <template v-for="[value, problems] in essay">
                <Tooltip v-if="problems.length > 0" placement="top" :title="problems" highlight>{{ value }}</Tooltip>
                <span v-else>{{ value }}</span>
            </template>
        </div>
    </div>
</template>

<style scoped>
span {
    @apply whitespace-pre-line;
}
</style>