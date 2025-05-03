<template>
    <div v-if="loading" class="fold">
        <v-progress-circular
                indeterminate
                :size="size"
                :width="width"
                :color="color"
        />
    </div>
</template>

<script setup>
    const props = defineProps({
        loading: {
            type: Boolean,
            default: false
        },
        size: {
            type: [Number, String],
            default: 48
        },
        width: {
            type: [Number, String],
            default: 4
        },
        color: {
            type: String,
            default: 'primary'
        }
    })
</script>

<style scoped>
    .fold {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px;
    }
</style>
