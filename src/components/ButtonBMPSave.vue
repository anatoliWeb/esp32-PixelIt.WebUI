<template>
    <v-dialog v-model="dialog" persistent max-width="450">
        <template #activator="{ on, attrs }">
            <v-btn
                    :color="props.color"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    :disabled="!props.condition"
            >
                <v-icon left>{{ props.icon }}</v-icon>
                {{ props.text }}
            </v-btn>
        </template>

        <v-card>
            <v-form v-model="isValid">
                <v-card-title class="text-h5">
                    Save Bitmap?
                </v-card-title>

                <v-card-text>
                    <v-text-field
                            ref="field"
                            v-model="bitmapName"
                            label="Bitmap Name"
                            :rules="[rules.required, rules.notStartsWithSpace]"
                    />

                    <v-text-field
                            v-model="userName"
                            @change="changeUserName"
                            label="Your Username"
                            :rules="[rules.notStartsWithSpace]"
                    />
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn
                            color="green darken-1"
                            text
                            @click="agreeWrapper"
                            :disabled="!isValid || (getSizeX === 32 && isAnimated)"
                    >
                        Save into Database
                    </v-btn>

                    <v-btn color="red darken-1" text @click="disagreeWrapper">
                        Abort
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref, computed, getCurrentInstance } from 'vue'
    import { useStore } from 'vuex'

    // Props definition
    const props = defineProps({
        color: String,
        icon: String,
        text: String,
        data: String,
        pixelMode: Number,
        condition: { type: Boolean, required: true }
    })

    // Refs
    const dialog = ref(false)
    const isValid = ref(false)
    const bitmapName = ref('')

    // Access globalProperties
    const { appContext } = getCurrentInstance()
    const $cookies = appContext.config.globalProperties.$cookies
    const $apiServerBaseURL = appContext.config.globalProperties.$apiServerBaseURL
    const $client = appContext.config.globalProperties.$client

    // Initialize username from cookie
    const userName = ref($cookies.get('userNameForUpload') || '')

    // Vuex store for rules
    const store = useStore()
    const rules = computed(() => store.state.config.rules)

    // Computed utilities
    const cleanedData = computed(() => props.data.replaceAll('\n', '').replaceAll(' ', ''))
    const isAnimated = computed(() => cleanedData.value.includes('],['))
    const getSizeX = computed(() => (props.pixelMode === 0 ? 8 : 32))

    // Methods
    function disagreeWrapper() {
        dialog.value = false
    }

    async function agreeWrapper() {
        try {
            await fetch(`${$apiServerBaseURL}/SaveBitmap`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Client: $client
                },
                body: JSON.stringify({
                    rgb565array: cleanedData.value,
                    userName: userName.value || 'Not specified',
                    name: bitmapName.value,
                    sizeX: getSizeX.value,
                    sizeY: 8,
                    animated: isAnimated.value
                })
            })
        } catch (e) {
            console.error(e)
        } finally {
            dialog.value = false
        }
    }

    function changeUserName() {
        $cookies.set('userNameForUpload', userName.value)
    }
</script>
