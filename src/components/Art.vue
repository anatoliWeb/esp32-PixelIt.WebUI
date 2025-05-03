<template>
    <div
            id="art"
            :style="{ width: width, height: height }"
    >
        <Pixel
                v-for="p in pixelCount"
                :key="p"
                :coloring="colors"
                :id="p"
                :func="func"
                :pixelDimensions="pixelDimensions"
        />
    </div>
</template>

<script setup>
    import { computed } from 'vue'
    import Pixel from './Pixel.vue'

    // Приймаємо властивості
    const props = defineProps({
        colors: {
            type: String,
            required: true
        },
        pixelCount: {
            type: [String, Number],
            required: true
        },
        func: {
            type: Function,
            required: true
        }
    })

    // Перетворюємо pixelCount у число
    const count = computed(() => Number(props.pixelCount))

    // Обчислюємо розміри та розмір “клітинки”
    const pixelCount = count
    const width = computed(() =>
        count.value === 64 ? '323px' : '803px'
    )
    const height = computed(() =>
        count.value === 64 ? '323px' : '202px'
    )
    const pixelDimensions = computed(() =>
        count.value === 64 ? '40' : '25'
    )
</script>

<style scoped>
    #art {
        border: 1px solid rgb(90, 90, 90);
    }
</style>
