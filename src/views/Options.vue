<template>
    <v-container class="options">
        <v-row>
            <v-col cols="12" lg="4" class="text-center">
                <ButtonCondition
                        color="success"
                        :condition="isValid && sockedIsConnected"
                        text="Save config"
                        :onclick="save"
                        icon="mdi-content-save"
                />
            </v-col>
            <v-col cols="12" lg="4" class="text-center">
                <ButtonConfirm
                        color="orange"
                        :condition="sockedIsConnected"
                        text="Wifi Reset"
                        :onclickAgree="wifiReset"
                        disagreeText="Cancel"
                        agreeText="Wifi Reset"
                        title="Wifi Reset!"
                        :cardText="[
            'You are about to delete your WIFI settings, the rest of your settings are not affected!',
            'Are you sure you want to continue?'
          ]"
                        icon="mdi-wifi-cancel"
                />
            </v-col>
            <v-col cols="12" lg="4" class="text-center">
                <ButtonConfirm
                        color="red"
                        :condition="sockedIsConnected"
                        text="Factory Reset"
                        :onclickAgree="factoryReset"
                        disagreeText="Cancel"
                        agreeText="Factory Reset"
                        title="Factory Reset!"
                        :cardText="[
            'You are about to delete all your settings, it will also affect the wifi setting!',
            'Are you sure you want to continue?'
          ]"
                        icon="mdi-harddisk-remove"
                />
            </v-col>
        </v-row>

        <v-form v-model="isValid">
            <v-row>
                <!-- Defaults Column -->
                <v-col cols="12" lg="4">
                    <v-card class="pa-1" elevation="4">
                        <v-card-title><h2>Defaults</h2></v-card-title>
                        <v-divider />
                        <v-text-field
                                v-model="config.matrixBrightness"
                                type="number"
                                label="Matrix start brightness"
                                hint="0 to 255"
                                :rules="[rules.required, rules.min0, rules.max255]"
                                dense
                        />
                        <v-text-field
                                v-model="config.scrollTextDefaultDelay"
                                type="number"
                                label="Scrolltext delay"
                                hint="larger number is slower"
                                suffix="ms"
                                :rules="[rules.required, rules.min0]"
                                dense
                        />
                        <v-text-field
                                v-model="config.hostname"
                                label="Hostname"
                                dense
                        />
                        <v-text-field
                                v-model="config.note"
                                label="Note"
                                dense
                        />
                        <v-switch
                                v-model="config.bootScreenAktiv"
                                label="Bootscreen active"
                                dense
                        />
                        <v-switch
                                v-if="showBatteryBtn"
                                v-model="config.bootBatteryScreen"
                                label="Show battery on boot"
                                dense
                        />
                        <v-switch
                                v-model="config.bootSound"
                                label="Play sound on boot"
                                dense
                        />
                        <v-switch
                                v-model="config.checkUpdateScreen"
                                label="Notify on firmware available"
                                dense
                        />
                    </v-card>

                    <!-- Matrix Card -->
                    <v-card class="pa-2 mt-4" elevation="4">
                        <v-card-title><h2>Matrix</h2></v-card-title>
                        <v-divider />
                        <v-select
                                :items="matrixTypes"
                                v-model="config.matrixType"
                                label="Matrix type"
                                item-title="text"
                                item-value="value"
                                dense
                        />
                        <v-select
                                :items="matrixCorrection"
                                v-model="config.matrixTempCorrection"
                                label="Matrix correction"
                                item-title="text"
                                item-value="value"
                                dense
                        />
                    </v-card>

                    <!-- Auto Brightness -->
                    <v-card class="pa-2 mt-4" elevation="4">
                        <v-card-title><h2>Auto brightness</h2></v-card-title>
                        <v-switch
                                v-model="config.matrixBrightnessAutomatic"
                                label="Auto brightness"
                                dense
                        />
                        <v-row>
                            <v-col cols="6">
                                <v-text-field
                                        v-model="config.mbaDimMin"
                                        type="number"
                                        label="Min bright"
                                        :disabled="!config.matrixBrightnessAutomatic"
                                        :rules="config.matrixBrightnessAutomatic ? [rules.required, rules.min0, rules.max255] : []"
                                        dense
                                />
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                        v-model="config.mbaDimMax"
                                        type="number"
                                        label="Max bright"
                                        :disabled="!config.matrixBrightnessAutomatic"
                                        :rules="config.matrixBrightnessAutomatic ? [rules.required, rules.min0, rules.max255] : []"
                                        dense
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <v-text-field
                                        v-model="config.mbaLuxMin"
                                        type="number"
                                        label="From lux"
                                        :disabled="!config.matrixBrightnessAutomatic"
                                        :rules="config.matrixBrightnessAutomatic ? [rules.required, rules.min0] : []"
                                        dense
                                />
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                        v-model="config.mbaLuxMax"
                                        type="number"
                                        label="To lux"
                                        :disabled="!config.matrixBrightnessAutomatic"
                                        :rules="config.matrixBrightnessAutomatic ? [rules.required, rules.min0] : []"
                                        dense
                                />
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>

                <!-- Clock Column -->
                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>Clock</h2></v-card-title>
                        <v-divider />
                        <v-text-field
                                v-model="config.ntpServer"
                                label="NTP Server"
                                :rules="[rules.required]"
                                dense
                        />
                        <v-text-field
                                v-model="config.clockTimeZone"
                                type="number"
                                label="UTC offset"
                                :rules="[rules.required, rules.minMinus12, rules.max14]"
                                dense
                        />
                        <ColorPickerTextfield />
                        <v-switch
                                v-model="config.clock24Hours"
                                label="24h format"
                                dense
                        />
                        <v-switch
                                v-model="config.clockWithSeconds"
                                label="Show seconds"
                                :disabled="!config.clock24Hours"
                                dense
                        />
                        <v-switch
                                v-model="config.clockDayLightSaving"
                                label="DST active"
                                dense
                        />
                    </v-card>

                    <!-- MQTT -->
                    <v-card class="pa-2 mt-4" elevation="4">
                        <v-card-title><h2>MQTT</h2></v-card-title>
                        <v-switch
                                v-model="config.mqttAktiv"
                                label="MQTT active"
                                dense
                        />
                        <v-text-field
                                v-model="config.mqttServer"
                                label="Server"
                                :rules="config.mqttAktiv ? [rules.required] : []"
                                dense
                        />
                        <v-text-field
                                v-model="config.mqttPort"
                                type="number"
                                label="Port"
                                :rules="config.mqttAktiv ? [rules.required, rules.portRange] : []"
                                dense
                        />
                        <v-text-field
                                v-model="config.mqttMasterTopic"
                                label="Master topic"
                                :rules="config.mqttAktiv ? [rules.required] : []"
                                dense
                        />
                        <v-switch
                                v-model="config.mqttUseDeviceTopic"
                                :label="deviceTopicLabel"
                                :disabled="!config.mqttAktив"
                                dense
                        />
                    </v-card>
                </v-col>

                <!-- Telemetry Column -->
                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>Telemetry</h2></v-card-title>
                        <v-switch
                                v-model="config.sendTelemetry"
                                label="Send data"
                                dense
                        />
                        <PrismEditor
                                class="mt-2"
                                v-model="telemetryData"
                                :highlight="highlighter"
                                readonly
                        />
                        <ButtonCondition
                                class="mt-2"
                                color="primary"
                                :condition="sockedIsConnected && sendTelemetryEnabled"
                                text="Send now"
                                icon="mdi-cloud-upload"
                                :onclick="sendTelemetry"
                        />
                    </v-card>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script setup>
    import { ref, computed, watch, getCurrentInstance, onMounted } from 'vue'
    import { useStore } from 'vuex'
    import ColorPickerTextfield from '@/components/ColorPickerTextfield.vue'
    import ButtonCondition from '@/components/ButtonCondition.vue'
    import ButtonConfirm from '@/components/ButtonConfirm.vue'
    import { PrismEditor } from 'vue-prism-editor'
    import { highlight, languages } from 'prismjs/components/prism-core'
    import 'prismjs/components/prism-clike'
    import 'prismjs/components/prism-json'
    import 'prismjs/themes/prism-tomorrow.css'

    const store = useStore()
    const { appContext } = getCurrentInstance()
    const $socket = appContext.config.globalProperties.$socket

    const isValid = ref(true)
    const rules = computed(() => store.state.config.rules)
    const config = computed(() => store.state.config.configData)
    const sendTelemetryEnabled = computed(() => config.value.sendTelemetry)
    const sockedIsConnected = computed(() => store.state.socket.isConnected)
    const matrixTypes = computed(() => store.state.config.matrixTypes)
    const matrixCorrection = computed(() => store.state.config.matrixCorrection)
    const telemetryData = computed({ get: () => store.state.telemetry.telemetryData, set: () => {} })
    const showBatteryBtn = computed(() => store.state.config.configData.showBatteryBtn)

    const deviceTopicLabel = computed(() => {
        const hostname = config.value.hostname?.trim() || store.state.config.displayHostname
        const master = config.value.mqttMasterTopic?.trim() || ''
        const base = master.replace(/\/\?$/, '/')
        return `Use additional device topic (${base}${hostname}/)`
    })

    function save() { $socket.sendObj({ setConfig: config.value }); setTimeout(() => $socket.close(), 3000) }
    function wifiReset() { $socket.sendObj({ wifiReset: true }) }
    function factoryReset() { $socket.sendObj({ factoryReset: true }) }
    function sendTelemetry() { $socket.sendObj({ sendTelemetry: true }) }
    function highlighter(code) { return highlight(code, languages.json) }

    watch(() => config.value.clock24Hours, newVal => { if (!newVal) config.value.clockWithSeconds = false })

    onMounted(() => {
        const convertToValue = (field) => {
            if (typeof config.value[field] === 'object' && config.value[field] !== null && 'value' in config.value[field]) {
                config.value[field] = config.value[field].value
            }
        }
        [
            'temperatureUnit', 'SCLPin', 'SDAPin', 'onewirePin', 'ldrDevice',
            'btn0Pin', 'btn0PressedLevel', 'btn1Pin', 'btn1PressedLevel',
            'btn2Pin', 'btn2PressedLevel', 'btn0Action', 'btn1Action', 'btn2Action'
        ].forEach(convertToValue)
    })
</script>

<style scoped>
    ul { margin-top: 10px; }
    li { margin-left: 20px; }
</style>
