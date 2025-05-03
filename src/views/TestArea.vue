<template>
    <v-container class="home">
        <v-row>
            <!-- Liveview -->
            <v-col cols="12" lg="4">
                <v-card class="pa-2" elevation="4">
                    <v-card-title><h2>Liveview</h2></v-card-title>
                    <hr />
                    <br />
                    <Liveview
                            class="text-center"
                            :data="liveview"
                            :options="liveviewCanvasSettings"
                    />
                </v-card>
                <br />

                <!-- JSON String -->
                <v-card class="pa-2" elevation="4">
                    <v-card-title><h2>JSON String</h2></v-card-title>
                    <hr />
                    <br />
                    <PrismEditor
                            class="editor"
                            v-model="json"
                            :highlight="highlighter"
                            line-numbers
                    />
                    <br />
                    <div class="text-center">
                        <ButtonCondition
                                color="info"
                                :condition="sockedIsConnected"
                                text="Send JSON"
                                icon="mdi-cloud-upload"
                                :onclick="sendJson"
                        />
                    </div>
                </v-card>
            </v-col>

            <!-- Text / Brightness -->
            <v-col cols="12" lg="4">
                <v-card class="pa-2" elevation="4">
                    <v-card-title><h2>Text / Brightness</h2></v-card-title>
                    <hr />
                    <br />
                    <span class="text-h2 font-weight-light">{{ brightness }}</span>
                    <span class="subheading font-weight-light mr-1">Brightness</span>
                    <v-slider
                            v-model="brightness"
                            max="255"
                            min="0"
                            @end="sendBrightness"
                    />
                    <v-text-field
                            label="Text to send"
                            v-model="text"
                    />
                    <div class="text-center">
                        <ButtonCondition
                                color="info"
                                :condition="sockedIsConnected"
                                text="Send Text"
                                icon="mdi-cloud-upload"
                                :onclick="sendText"
                        />
                    </div>
                </v-card>
            </v-col>

            <!-- Bitmap Array -->
            <v-col cols="12" lg="4">
                <v-card class="pa-2" elevation="4">
                    <v-card-title><h2>Bitmap Array</h2></v-card-title>
                    <hr />
                    <br />
                    <PrismEditor
                            class="editor"
                            v-model="image"
                            :highlight="highlighter"
                    />
                    <br />
                    <div class="text-center">
                        <ButtonCondition
                                color="info"
                                :condition="sockedIsConnected"
                                text="Send Bitmap"
                                icon="mdi-cloud-upload"
                                :onclick="sendBitmap"
                        />
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { computed } from 'vue'
    import { useStore } from 'vuex'
    import { PrismEditor } from 'vue-prism-editor'
    import { highlight, languages } from 'prismjs/components/prism-core'
    import 'prismjs/components/prism-clike'
    import 'prismjs/components/prism-json'
    import 'prismjs/themes/prism-tomorrow.css'
    import ButtonCondition from '@/components/ButtonCondition.vue'
    import Liveview from '@/components/Liveview.vue'
    import { getCurrentInstance } from 'vue'

    const store = useStore()
    const { appContext } = getCurrentInstance()
    const $socket = appContext.config.globalProperties.$socket

    // Двосторонній binding до Vuex-модуля testarea
    const json = computed({
        get:  () => store.state.testarea.json,
        set: v  => store.commit('testarea/SET_JSON', v)
    })
    const text = computed({
        get:  () => store.state.testarea.text,
        set: v  => store.commit('testarea/SET_TEXT', v)
    })
    const image = computed({
        get:  () => store.state.testarea.image,
        set: v  => store.commit('testarea/SET_IMAGE', v)
    })
    const brightness = computed({
        get:  () => store.state.testarea.brightness,
        set: v  => store.commit('testarea/SET_BRIGHTNESS', v)
    })

    const sockedIsConnected      = computed(() => store.state.socket.isConnected)
    const liveview               = computed(() => store.state.matrix.liveviewData)
    const liveviewCanvasSettings = computed(() => store.state.matrix.matrixSize)

    function highlighter(code) {
        return highlight(code, languages.json)
    }

    function sendJson() {
        $socket.sendObj({
            forcedDuration: 5000,
            setScreen: JSON.parse(json.value)
        })
    }

    function sendText() {
        $socket.sendObj({
            forcedDuration: 5000,
            setScreen: {
                text: {
                    textString: text.value,
                    scrollText: 'auto',
                    hexColor: '#FFFFFF',
                    position: { x: 0, y: 1 }
                }
            }
        })
    }

    function sendBitmap() {
        $socket.sendObj({
            forcedDuration: 5000,
            setScreen: {
                bitmapAnimation: {
                    data: JSON.parse(`[${
                        image.value.endsWith(',') ? image.value.slice(0, -1) : image.value
                    }]`),
                    animationDelay: 200
                }
            }
        })
    }

    function sendBrightness() {
        $socket.sendObj({
            setScreen: { brightness: brightness.value }
        })
    }
</script>

<style scoped>
    .editor {
        background: #2d2d2d;
        color: #ccc;
        font-family: 'Fira Code', monospace;
        font-size: 14px;
        line-height: 1.5;
        padding: 5px;
        min-height: 200px;
        border-radius: 5px;
    }
</style>
