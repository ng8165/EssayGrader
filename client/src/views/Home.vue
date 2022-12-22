<script lang="ts">
import SubmitView from "./Submit.vue";
import FindView from "./Find.vue";

export default {
    components: {
        SubmitView, FindView
    }
}
</script>

<template>
    <SubmitView />

    <hr class="border-neutral-500 my-6" />

    <FindView />
</template>