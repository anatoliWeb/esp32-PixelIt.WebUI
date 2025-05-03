<template>
    <v-list>
        <template v-for="item in props.items" :key="item.title">
            <v-divider v-if="item.separator" />
            <v-list-item
                    v-else
                    :to="item.page"
                    :href="item.url"
                    :target="item.target"
                    :disabled="item.separator"
            >
                <template #prepend>
                    <v-icon>{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </template>
    </v-list>
</template>

<script setup>

    const props = defineProps({
        items: { type: Array, required: true }
    })
</script>

<style scoped>
    /* Додайте стилі за потреби */
</style>
