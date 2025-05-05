<template>
    <canvas
            ref="canvas"
            :height="props.height || 150"
            :width="props.width || (props.bmp.sizeX === 8 ? 150 : 230)"
    />
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

    // Props
    const props = defineProps({
        bmp: {
            type: Object,
            required: true
        },
        height: String,
        width: String
    })

    const canvas = ref(null)
    let loopInterval = null

    // Розбір рядка RG565 масиву
    function parseBmpArray(raw) {
        // 1) Обрізаємо пробіли й зайві кінцеві коми
        let s = (raw || '').trim()
            .replace(/]\s*\[/g, '],[')   // якщо було '][', стає '],['
            .replace(/,\s*$/, '')        // прибираємо кінцеву кому

        try {
            // 2) Якщо вже масив масивів [[...],[...],...]
            if (s.startsWith('[[') && s.endsWith(']]')) {
                return JSON.parse(s)
            }
            // 3) Якщо маємо кілька масивів у рядку, розділених комами
            if (s.includes('],[')) {
                // обгортаємо в зовнішній масив: '[a],[b]' → '[[a],[b]]'
                return JSON.parse('[' + s + ']')
            }
            // 4) Якщо один простий масив чисел "[...]" → обгортаємо у "[[...]]"
            if (s.startsWith('[') && s.endsWith(']')) {
                const inner = s.slice(1, -1)
                return JSON.parse('[[' + inner + ']]')
            }
            console.warn('BmpCanvas: невідомий формат rgB565Array:', s)
            return []
        } catch (e) {
            console.error('BmpCanvas.parseBmpArray: помилка парсингу:', s, e)
            return []
        }
    }

    // Малюємо один кадр
    function drawFrame(data) {
        const ctx = canvas.value.getContext('2d')
        const cw = canvas.value.width
        const size = cw / props.bmp.sizeX
        ctx.clearRect(0, 0, cw, canvas.value.height)

        const widthCount = props.bmp.sizeX
        const heightCount = props.bmp.sizeX === 8 ? props.bmp.sizeY : props.bmp.sizeY + 6
        let idx = 0
        const startY = props.bmp.sizeX === 8 ? 0 : 6

        for (let y = startY; y < heightCount; y++) {
            for (let x = 0; x < widthCount; x++) {
                const val = data[idx++] || 0
                const [r, g, b] = RGB565IntToRGB(val)
                ctx.fillStyle = RGBToHEX(r, g, b)
                ctx.fillRect(x * size, y * size, size, size)
            }
        }
    }

    // Запуск циклу малювання
    function startDrawing() {
        const frames = parseBmpArray(props.bmp.rgB565Array)

        if (!frames.length) return

        // Очистити попередній інтервал
        if (loopInterval) clearInterval(loopInterval)

        if (frames.length > 1) {
            let idx = 0
            loopInterval = setInterval(() => {
                drawFrame(frames[idx])
                idx = (idx + 1) % frames.length
            }, 250)
        }
        drawFrame(frames[0])
    }

    onMounted(() => startDrawing())

    onBeforeUnmount(() => {
        if (loopInterval) clearInterval(loopInterval)
    })

    watch(
        () => props.bmp.rgB565Array,
        () => {
            if (loopInterval) clearInterval(loopInterval)
            startDrawing()
        }
    )

    // Вспомогальні функції
    function RGB565IntToRGB(color) {
        const r = (((color >> 11) & 0x1f) * 527 + 23) >> 6
        const g = (((color >> 5) & 0x3f) * 259 + 33) >> 6
        const b = ((color & 0x1f) * 527 + 23) >> 6
        return [r, g, b]
    }

    function RGBToHEX(r, g, b) {
        const rgb = (b | (g << 8) | (r << 16)) >>> 0
        return `#${(0x1000000 + rgb).toString(16).slice(1)}`
    }
</script>

<style scoped>
    #canvas {
        border: 1px solid #5a5a5a;
    }
</style>
