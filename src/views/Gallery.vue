<template>
    <v-container class="gallery">
        <v-row>
            <v-col cols="12">
                <v-text-field
                        v-model="message"
                        v-if="!isLoading"
                        prepend-inner-icon="mdi-magnify"
                        single-line
                        outlined
                        filled
                        hide-details
                        auto-grow
                        label="Search for name or ID"
                        type="text"
                />
            </v-col>

            <v-col v-if="isLoading" cols="12" class="text-center">
                <fold :loading="isLoading" />
                Loading...
            </v-col>

            <v-col v-for="bmp in filteredBMPs" :key="bmp.id" cols="6" lg="2">
                <v-card class="pa-2" elevation="4">
                    <div class="text-center">{{ bmp.name }}</div>
                    <hr />
                    <p />
                    <BmpCanvas :bmp="bmp" />
                    <p />
                    <div class="text-center">
                        <BmpDialog :bmp="bmp" />
                        <v-btn
                                icon
                                @click="sendBitmap(bmp.rgB565Array, bmp.sizeX)"
                                :disabled="!isConnected"
                                class="float-right"
                                title="Show on PixelIt"
                        >
                            <v-icon>mdi-arrow-right-circle-outline</v-icon>
                        </v-btn>
                    </div>
                    <div class="text-center">
                        <v-text-field
                                prepend-inner-icon="mdi-identifier"
                                rounded
                                dense
                                hide-details
                                readonly
                                :value="bmp.id"
                                append-outer-icon="mdi-content-copy"
                                @click:append-outer="copyText(bmp.id)"
                        />
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useStore } from 'vuex'
    import BmpCanvas from '@/components/BmpCanvas.vue'
    import BmpDialog from '@/components/BmpDialog.vue'
    import Fold from '@/components/Fold.vue'
    import { getCurrentInstance } from 'vue'

    const store = useStore()
    const { appContext } = getCurrentInstance()
    const $socket = appContext.config.globalProperties.$socket

    const message = ref('')

    const isLoading = computed(() => store.state.bmps.list.length === 0)
    const filteredBMPs = computed(() => {
        const msg = message.value.toLowerCase()
        return (store.state.bmps.list || []).filter(
            x => x.name.toLowerCase().includes(msg) || String(x.id) === message.value
        )
    })
    const isConnected = computed(() => store.state.socket.isConnected)

    // Fetch BMPs on mount
    onMounted(async () => {
        try {
            const data = await fetch('https://pixelit.bastelbunker.de/api/GetBMPAll')
                .then(res => res.json())
            store.commit('bmps/setBMPs', data)
        } catch (error) {
            console.error('getBMPsFromAPI error', error)
            store.commit('bmps/setBMPs', [])
        }
    })

    function copyText(value) {
        navigator.clipboard.writeText(value)
    }

    function sendBitmap(rgB565Array, sizeX) {
        let arr = rgB565Array
        if (arr.endsWith(',')) arr = arr.slice(0, -1)
        if (sizeX === 8) {
            $socket.sendObj({
                setScreen: {
                    bitmapAnimation: {
                        data: JSON.parse(`[${arr}]`),
                        animationDelay: 200
                    }
                }
            })
        } else {
            $socket.sendObj({
                setScreen: {
                    bitmap: {
                        data: JSON.parse(arr),
                        position: { x: 0, y: 0 },
                        size: { width: sizeX, height: 8 }
                    }
                }
            })
        }
    }
</script>

<style scoped>
    canvas {
        padding-left: 0;
        padding-right: 0;
        margin: 0 auto;
        display: block;
        border: 1px solid grey;
    }
</style>
