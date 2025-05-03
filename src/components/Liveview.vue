<template>
    <div class="Liveview">
        <canvas
                ref="canvas"
                :width="canvasSize.width"
                :height="canvasSize.height"
        />
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, watch } from 'vue'

    // Props
    const props = defineProps({
        data: { type: Array, required: true },
        options: { type: Object, default: () => ({}) }
    })

    // Default canvas options
    const defaultOptions = {
        rectWidth: 12,
        rectHeight: 12,
        padding: 1,
        cols: 8,
        rows: 8
    }

    // Merge default and passed options
    const mergedOptions = computed(() => ({
        ...defaultOptions,
        ...props.options
    }))

    // Compute canvas dimensions
    const canvasSize = computed(() => ({
        width:
            mergedOptions.value.cols *
            (mergedOptions.value.rectWidth + mergedOptions.value.padding) -
            1,
        height:
            mergedOptions.value.rows *
            (mergedOptions.value.rectHeight + mergedOptions.value.padding) -
            1
    }))

    // Refs
    const canvas = ref(null)
    let ctx = null

    // Draw the canvas based on data and options
    function drawCanvas() {
        if (!canvas.value) return
        ctx = canvas.value.getContext('2d')
        const opts = mergedOptions.value
        // Background
        ctx.fillStyle = '#222'
        ctx.fillRect(0, 0, canvasSize.value.width, canvasSize.value.height)

        // Draw each cell
        for (let row = 0; row < opts.rows; row++) {
            for (let col = 0; col < opts.cols; col++) {
                const index = row * opts.cols + col
                const color =
                    props.data.length === 0 ? '#000' : `#${props.data[index]}`
                const x = col * (opts.rectWidth + opts.padding)
                const y = row * (opts.rectHeight + opts.padding)
                ctx.fillStyle = color
                ctx.fillRect(x, y, opts.rectWidth, opts.rectHeight)
            }
        }
    }

    // Lifecycle hooks
    onMounted(() => drawCanvas())

    watch(
        () => props.data,
        () => drawCanvas()
    )

    watch(
        () => props.options,
        () => drawCanvas()
    )
</script>

<style scoped>
    [canvas] {
        border: 2px solid gray;
        padding: 1px;
        border-radius: 5px;
        max-width: 100%;
    }
</style>
