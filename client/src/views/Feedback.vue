<script lang="ts">
import router from "@/router";
import { ref } from "vue";
import { useRoute } from "vue-router";

export default {
    setup() {
        const route = useRoute();
        const { id } = route.params;
        const isLoading = ref(true);
        const feedback = ref([0]);
        const essay = ref("");

        async function fetchData() {
            const res = await fetch(`http://localhost:2020/grade/id/${id}`);
            const { feedback: essayFeedback, essay: essayHTML } = await res.json();

            if (res.ok) {
                feedback.value = essayFeedback;
                essay.value = essayHTML;
                isLoading.value = false;
            } else {
                router.replace("/404");
            }
        }

        fetchData();

        // 0: nasty no nos, 1: spelling errors, 2: same starting word, 3: ending with preposition, 4: word count, 5: score
        return { isLoading, feedback, essay };
    }
}
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
            <span v-for="token in essay" :data-tooltip="token[1]" :class="token[1].length > 0 ? 'problem' : ''">{{ token[0] }}</span>
        </div>
    </div>
</template>

<style scoped>
.problem {
    @apply bg-[#FFFF00] relative cursor-pointer;
}

.problem:hover::before {
    content: attr(data-tooltip);
    @apply rounded p-1 bg-gray-800 text-white text-sm text-center w-min
           absolute left-1/2 -translate-x-1/2 -translate-y-full;
}
</style>