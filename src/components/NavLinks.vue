<!-- src/components/NavLinks.vue -->
<template>
    <v-list>
        <template v-for="item in props.items" :key="item.title">
            <v-divider v-if="item.separator" />
            <v-list-item
                    v-else
                    :style="{ width: '330px' }"
                    :to="item.page"
                    :href="item.url"
                    :target="item.target"
                    :disabled="item.separator"
                    class="nav-link"
            >
                <template #prepend>
                    <v-icon>{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ t(item.titleKey) }}</v-list-item-title>
            </v-list-item>
        </template>
    </v-list>
</template>

<script setup>
    import { computed } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    const props = defineProps({
        items: { type: Array, required: true }
    })

</script>

<style scoped>
    .nav-link {
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
        padding: 26px 16px !important;
        transition: background-color 0.2s ease-in-out;
    }

    .nav-link:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .nav-icon {
        font-size: 22px;
        min-width: 24px;
    }

    .nav-title {
        flex-grow: 1;
    }

    @media (min-width: 600px) {
        .nav-link {
            width: 240px;
        }
    }

    @media (min-width: 960px) {
        .nav-link {
            width: 280px;
        }
    }
</style>
