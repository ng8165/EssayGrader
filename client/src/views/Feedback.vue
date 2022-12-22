<script lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

export default {
    setup() {
        const route = useRoute();
        const { id } = route.params;
        const isLoading = ref(true);
        const feedback = ref([0]);
        const essay = ref("");

        async function fetchData() {
            const res = await fetch(`http://localhost:2020/grade/${id}`);
            const { feedback: essayFeedback, essay: essayHTML } = await res.json();
            feedback.value = essayFeedback;
            essay.value = essayHTML;
            isLoading.value = false;
        }

        fetchData();

        // 0: nasty no nos, 1: spelling errors, 2: same starting word, 3: ending with preposition, 4: word count, 5: score
        return { isLoading, feedback, essay };
    }
}
</script>

<template>
    <h2>Feedback</h2>

    <div v-if="isLoading">Loading...</div>
    <div v-else>
        <ul>
            <li>{{ feedback[0] }} Nasty No-Nos (-1% each)</li>
            <li>{{ feedback[1] }} Spelling Errors (-1% each)</li>
            <li>{{ feedback[2] }} Sentence Pairs Start With The Same Word (-3% each)</li>
            <li>{{ feedback[3] }} Sentences End With A Preposition (-5% each)</li>
            <li>{{ feedback[4] }} words: {{ feedback[4] < 500 || feedback[4] > 1000 ? `Too ${ feedback[4] < 500 ? "Short" : "Long"} (-50%)` : "Good"}}</li>
            <li><strong>Final Score: {{ feedback[5] }}% {{ feedback[5] < -200 ? "was rounded to -200%" : "" }}</strong></li>
        </ul>

        <p>Hover over highlighted words below to receive more detailed feedback.</p>
        <div v-html="essay"></div>
    </div>
</template>

<style scoped>
.essay {
    white-space: break-spaces;
    padding: 1em;
    border-left: 5px solid lightgray;
}

.highlight {
    background-color: yellow;
    cursor: pointer;
}
</style>