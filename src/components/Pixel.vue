<template>
    <div
            class="pixel"
            :id="props.id"
            :style="{ background: activeBackground, height: pixelSize, width: pixelSize }"
            @click="changeColor"
    />
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'

    // Props
    const props = defineProps({
        coloring: { type: String, required: true },
        id: { type: Number, required: true },
        func: { type: Function, required: true },
        pixelDimensions: { type: [String, Number], required: true }
    })

    // Reactive state for current background
    const activeBackground = ref('#000')

    // Computed pixel size string with 'px'
    const pixelSize = computed(() => `${props.pixelDimensions}px`)

    // Toggle color on click
    function changeColor() {
        activeBackground.value =
            activeBackground.value === props.coloring ? '#000' : props.coloring
        props.func(props.id, activeBackground.value)
    }

    // Initial call to func with default background
    onMounted(() => {
        props.func(props.id, activeBackground.value)
    })
</script>

<style scoped>
    .pixel {
        border: 1px solid rgb(90, 90, 90);
        float: left;
    }
</style>
