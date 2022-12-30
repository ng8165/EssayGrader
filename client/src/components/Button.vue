<script setup lang="ts">
const props = defineProps(["color", "type", "padding"]);
</script>

<template>
    <button :class="color + ' ' + padding" :type="type">
        <slot>Submit</slot>
    </button>
</template>

<style scoped>
button {
    @apply px-4 py-2 rounded;
}

.slim {
    @apply px-3 py-3;
}

.blue {
    @apply bg-blue-500 text-white;
}

.red {
    @apply bg-red-500 text-white;
}

.dark {
    @apply bg-neutral-700 text-white;
}
</style>