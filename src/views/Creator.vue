<template>
    <v-container class="gallery">
        <v-row>
            <v-col cols="12">
                <v-bottom-navigation :value="pixelMode" color="primary">
                    <v-btn @click="changePixelModeTo8x8">
                        <span>8x8 Pixel</span>
                        <v-icon>mdi-grid</v-icon>
                    </v-btn>
                    <v-btn @click="changePixelModeTo8x32">
                        <span>8x32 Pixel</span>
                        <v-icon>mdi-grid</v-icon>
                    </v-btn>
                </v-bottom-navigation>
            </v-col>
        </v-row>

        <v-row v-if="pixelMode === 0">
            <v-col cols="12" lg="4" offset-lg="2">
                <v-card class="pa-3" elevation="4">
                    <Art
                            :colors="colors"
                            pixelCount="64"
                            :func="onclick"
                    />
                    <p />
                    <v-textarea
                            filled outlined
                            v-model="array8x8String"
                            rows="5"
                            hide-details
                    />
                    <v-switch
                            v-model="livedraw"
                            label="Live draw"
                            hide-details dense
                    />
                    <div class="text-center">
                        <ButtonSave
                                color="green"
                                text="Save"
                                icon="mdi-content-save"
                                :data="array8x8String"
                                :pixelMode="pixelMode"
                                :condition="true"
                        />
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" lg="4">
                <v-card class="pa-3" elevation="4">
                    <v-color-picker
                            v-model="colors"
                            mode="hexa"
                            dot-size="20"
                            show-swatches
                            swatches-max-height="280"
                    />
                </v-card>
            </v-col>
        </v-row>

        <v-row v-if="pixelMode === 1">
            <v-col cols="12" lg="8">
                <v-card class="pa-3" elevation="4">
                    <Art
                            :colors="colors"
                            pixelCount="256"
                            :func="onclick"
                    />
                    <p />
                    <v-textarea
                            filled outlined
                            v-model="array8x32String"
                            rows="9"
                            hide-details
                    />
                    <v-switch
                            v-model="livedraw"
                            label="Live draw"
                            :disabled="!sockedIsConnected"
                            hide-details dense
                    />
                    <div v-if="isAnimated" class="text-center">
                        <v-card-text>
                            <h3 class="red--text">
                                No animated 8x32 bitmaps are supported!
                            </h3>
                        </v-card-text>
                    </div>
                    <div class="text-center">
                        <ButtonSave
                                color="green"
                                text="Save"
                                icon="mdi-content-save"
                                :data="array8x32String"
                                :pixelMode="pixelMode"
                                :condition="!isAnimated"
                        />
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" lg="4">
                <v-card class="pa-3" elevation="4">
                    <v-color-picker
                            v-model="colors"
                            mode="hexa"
                            dot-size="20"
                            show-swatches
                            swatches-max-height="270"
                    />
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { ref, reactive, computed, getCurrentInstance } from 'vue'
    import { useStore } from 'vuex'
    import Art from '@/components/Art.vue'
    import ButtonSave from '@/components/ButtonBMPSave.vue'

    const store = useStore()
    const { appContext } = getCurrentInstance()
    const $socket = appContext.config.globalProperties.$socket

    // Reactive state
    const colors = ref('#F44336')
    const pixelMode = ref(0)
    const active8x8Background = reactive({})
    const active8x32Background = reactive({})
    const array8x8String = ref('')
    const array8x32String = ref('')
    const livedraw = ref(false)

    // Computed
    const cleaned8x32String = computed(() =>
        array8x32String.value.replaceAll('\n', '').replaceAll(' ', '')
    )
    const isAnimated = computed(() => cleaned8x32String.value.includes('],[ '))
    const sockedIsConnected = computed(() => store.state.socket.isConnected)

    // Methods
    function changePixelModeTo8x8() {
        pixelMode.value = 0
    }
    function changePixelModeTo8x32() {
        pixelMode.value = 1
    }
    function onclick(id, color) {
        // Initialize backgrounds if empty
        if (Object.keys(active8x32Background).length < 256) {
            for (let i = 1; i < 256; i++) active8x32Background[i] = '000'
        }
        if (Object.keys(active8x8Background).length < 64) {
            for (let i = 1; i < 64; i++) active8x8Background[i] = '000'
        }
        const hex = color.replace('#', '')
        if (pixelMode.value === 0) {
            active8x8Background[id] = hex
            array8x8String.value = '[' +
                Object.values(active8x8Background)
                    .map(h => rgb888ToRgb565(hexToRgb(h)))
                    .join(',') +
                ']'
        } else {
            active8x32Background[id] = hex
            array8x32String.value = '[' +
                Object.values(active8x32Background)
                    .map(h => rgb888ToRgb565(hexToRgb(h)))
                    .join(',') +
                ']'
        }
        if (livedraw.value) {
            let screen
            if (pixelMode.value === 0) {
                screen = { bitmapAnimation: { data: JSON.parse(`[${array8x8String.value}]`), animationDelay: 200 } }
            } else {
                screen = { bitmap: { data: JSON.parse(array8x32String.value), position: { x: 0, y: 0 }, size: { width: 32, height: 8 } } }
            }
            $socket.sendObj({ setScreen: screen })
        }
    }

    // Helper functions
    function rgb888ToRgb565({ r, g, b }) {
        return ((r & 0xf8) << 8) + ((g & 0xfc) << 3) + (b >> 3)
    }
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }
</script>

<style scoped>
    #art,
    .v-color-picker {
        padding-left: 0;
        padding-right: 0;
        margin: 0 auto;
        display: block;
    }
</style>
