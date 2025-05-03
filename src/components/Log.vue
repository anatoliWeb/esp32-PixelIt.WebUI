<template>
    <div class="Log" log-field>
        <v-textarea
                filled
                outlined
                v-model="props.log"
                readonly
                class="log"
                log-text
                rows="20"
        />
    </div>
</template>

<script setup>

    const props = defineProps({
        log: { type: String, required: true }
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
