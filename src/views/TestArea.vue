<template>
    <v-container class="home">
        <v-row>
            <!-- Liveview -->
            <v-col cols="12" lg="4">
                <v-card class="pa-2" elevation="4">
                    <v-card-title><h2>{{$t("testArea.liveview")}}</h2></v-card-title>
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
                    <v-card-title><h2>{{$t("testArea.jsonString")}}</h2></v-card-title>
                    <hr />
                    <br />
                    <PrismEditor
                            class="editor mt-2 rounded"
                            v-model="json"
                            :highlight="highlighter"
                            line-numbers
                            :tabSize="2"
                    />
                    <br />
                    <div class="text-center">
                        <ButtonCondition
                                color="info"
                                :condition="sockedIsConnected"
                                :text="$t('testArea.sendJson')"
                                icon="mdi-cloud-upload"
                                :onclick="sendJson"
                        />
                    </div>
                </v-card>
            </v-col>

            <!-- Text / Brightness -->
            <v-col cols="12" lg="4">
                <v-card class="pa-2" elevation="4">
                    <v-card-title><h2>{{$t("testArea.textBrightness")}}</h2></v-card-title>
                    <hr />
                    <br />
                    <span class="text-h2 font-weight-light">{{ brightness }}</span>
                    <span class="subheading font-weight-light mr-1">{{$t("testArea.brightness")}}</span>
                    <v-slider
                            v-model="brightness"
                            max="255"
                            min="0"
                            step="1"
                            @change="sendBrightness"
                    />
                    <v-text-field
                            :label="$t('testArea.textToSend')"
                            v-model="text"
                    />
                    <div class="text-center">
                        <ButtonCondition
                                color="info"
                                :condition="sockedIsConnected"
                                :text="$t('testArea.sendText')"
                                icon="mdi-cloud-upload"
                                :onclick="sendText"
                        />
                    </div>
                </v-card>
            </v-col>

            <!-- Bitmap Array -->
            <v-col cols="12" lg="4">
                <v-card class="pa-2" elevation="4">
                    <v-card-title><h2>{{$t("testArea.bitmapArray")}}</h2></v-card-title>
                    <hr />
                    <br />
                    <PrismEditor
                            class="editor"
                            v-model="image"
                            :highlight="highlighter"
                            :tabSize="2"
                    />
                    <br />
                    <div class="text-center">
                        <ButtonCondition
                                color="info"
                                :condition="sockedIsConnected"
                                :text="$t('testArea.sendBitmap')"
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
        get:  () => String(store.state.testarea.json || ''),
        set: v  => store.commit('testarea/SET_JSON', v)
    })
    const text = computed({
        get:  () => store.state.testarea.text || '',
        set: v  => store.commit('testarea/SET_TEXT', v)
    })
    const image = computed({
        get:  () => String(store.state.testarea.image || ''),
        set: v  => store.commit('testarea/SET_IMAGE', v)
    })
    const brightness = computed({
        get:  () => store.state.testarea.brightness || 1,
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

<style>
    .editor {
        position: relative;
        background: #1e1e1e;
        color: #ccc;
        font-family: 'Fira Code', monospace;
        font-size: 14px;
        line-height: 1.4rem;
        padding: 5px;
        min-height: 200px;
        border-radius: 5px;
    }

    .prism-editor__line-numbers {
        position: absolute;
        top: 15px;
        left: 0;
        width: 2rem;
        padding-right: 0.4rem;
        text-align: right;
        color: #888;
        user-select: none;
        line-height: 1.4rem !important;
    }
    .prism-editor__editor{
        word-break: break-word;
        white-space: pre-wrap;
    }

    .prism-editor__container {
        margin-left: 1.0rem;
        padding: 0.6rem 0.8rem;
        line-height: 1.4rem !important;
        white-space: pre-wrap !important;
        word-break: break-word;
    }

    .prism-editor__container textarea.prism-editor__textarea {
        color: transparent !important; /* приховує текст, якщо не хочеш редагування */
        caret-color: white;
        top: 14px;
        left: 34px;
        height: -webkit-fill-available;
        width: -webkit-fill-available;
        background: transparent;
        z-index: 2;
        position: absolute;
        font-size: 14px;
        font-family: inherit;
        margin: 0;
        line-height: 1.4rem !important;
        padding: 0px 22px 0px 0px;
    }

    .prism-editor__container textarea.prism-editor__textarea:focus {
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
    }
</style>
