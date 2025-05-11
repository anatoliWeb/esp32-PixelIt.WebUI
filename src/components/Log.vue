<template>
    <div class="Log" log-field>
        <v-textarea
                filled
                outlined
                v-model="logText"
                readonly
                class="log"
                log-text
                rows="20"
        />
    </div>
</template>

<script setup>
    import { computed, watch } from 'vue'

    const props = defineProps({
        log: { type: [Array, String], required: true }
    })

    // DEBUG — показати, що приходить у props
    console.log('👉 props.log =', props.log)

    const logText = computed(() => {
        if (Array.isArray(props.log)) {
            console.log('ℹ️ Масив логів:', props.log)
            return props.log
                .map(entry => {
                    if (
                        typeof entry.timeStamp === 'string' &&
                        typeof entry.function === 'string' &&
                        typeof entry.message === 'string'
                    ) {
                        return `[${entry.timeStamp}] ${entry.function}: ${entry.message}`
                    } else {
                        console.warn('⚠️ Некоректний запис логу:', entry)
                        return JSON.stringify(entry)
                    }
                })
                .join('\n')
        }
        console.warn('⚠️ props.log — не масив, ось що є:', props.log)
        return typeof props.log === 'string' ? props.log : String(props.log)
    })
</script>

<style scoped>
    [log-text] {
        line-height: 1.4rem !important;
        font-size: 14px;
        color: black;
        resize: none;
    }
</style>
