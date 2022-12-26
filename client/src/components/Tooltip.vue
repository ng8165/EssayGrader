<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createPopper } from "@popperjs/core";

const props = defineProps(["title", "placement", "class", "highlight"]);

const trigger = ref();
const tooltip = ref();

onMounted(() => {
    const popper = createPopper(trigger.value, tooltip.value, {
        placement: props.placement,
        modifiers: [
            {
                name: "offset",
                options: {
                    offset: [0, 8],
                }
            }
        ]
    });

    function show() {
        tooltip.value.setAttribute("data-show", "");

        popper.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: "eventListeners", enabled: false }
            ]
        }));

        popper.update();
    }

    function hide() {
        tooltip.value.removeAttribute("data-show");

        popper.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: "eventListeners", enabled: false }
            ]
        }));
    }

    ["mouseenter", "focus"].forEach((event) => trigger.value.addEventListener(event, show));
    ["mouseleave", "blur"].forEach((event) => trigger.value.addEventListener(event, hide));
});
</script>

<template>
    <span ref="trigger" :highlight="highlight">
        <slot></slot>
    </span>

    <div ref="tooltip" class="tooltip" role="tooltip">
        {{ title }}
        <div class="arrow" data-popper-arrow></div>
    </div>
</template>

<style scoped>
span[highlight]:has(+ .tooltip) {
    @apply bg-[#FFFF00] cursor-pointer;
}

.tooltip {
    @apply hidden bg-gray-800 text-white px-2 py-1 rounded;
}

.tooltip[data-show] {
    @apply block;
}

.arrow, .arrow::before {
    @apply absolute w-2 h-2 bg-inherit;
}

.arrow {
    @apply invisible;
}

.arrow::before {
    content: "";
    @apply visible rotate-45;
}

.tooltip[data-popper-placement^="top"] > .arrow {
    @apply -bottom-1;
}

.tooltip[data-popper-placement^="bottom"] > .arrow {
    @apply -top-1;
}

.tooltip[data-popper-placement^="left"] > .arrow {
    @apply -right-1;
}

.tooltip[data-popper-placement^="right"] > .arrow {
    @apply -left-1;
}
</style>