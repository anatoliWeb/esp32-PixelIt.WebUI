<template>
    <v-text-field
            v-model="color"
            $label="$t('colorPickerTextField.label')"
            readonly
            :hint="$t('colorPickerTextField.hint')"
            class="align-center"
            full-width
    >
        <template #prepend>
            <v-menu
                    v-model="menu"
                    open-on-click
                    :close-on-content-click="false"
                    offset-y
            >
                <!-- тут беремо props, а не on -->
                <template #activator="{ props }">
                    <div
                            v-bind="props"
                            :style="swatchStyle"
                            class="elevation-1"
                    ></div>
                </template>
                <v-card>
                    <v-card-text class="pa-0">
                        <v-color-picker
                                v-model="color"
                                hide-canvas-switch
                                hide-inputs
                        />
                    </v-card-text>
                </v-card>
            </v-menu>
        </template>
    </v-text-field>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'

    const menu = ref(false)
    const store = useStore()

    // Getter/setter для кольору годинника
    const color = computed({
        get: () => store.state.config.configData.clockColor,
        set: val =>
            store.commit('config/SET_CONFIG_DATA', {
                ...store.state.config.configData,
                clockColor: val
            })
    })

    const swatchStyle = computed(() => ({
        backgroundColor: color.value,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: menu.value ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out'
    }))
</script>

<style scoped>
    /* Підлаштування відступів, якщо потрібно */
</style>
