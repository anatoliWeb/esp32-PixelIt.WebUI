<template>
    <v-container class="options">
        <v-row>
            <v-col cols="12" lg="4" class="text-center">
                <ButtonCondition
                        color="success"
                        :condition="isValid && sockedIsConnected"
                        :text="$t('options.buttons.saveConfig')"
                        :onclick="save"
                        icon="mdi-content-save"
                />
            </v-col>
            <v-col cols="12" lg="4" class="text-center">
                <ButtonConfirm
                        color="orange"
                        :condition="sockedIsConnected"
                        :text="$t('options.buttons.wifiReset')"
                        :onclickAgree="wifiReset"
                        :disagreeText="$t('options.buttons.cancel')"
                        :agreeText="$t('options.buttons.wifiReset')"
                        :title="$t('options.buttons.wifiReset')"
                        :cardText="[
                            $t('options.dialogs.wifiResetLine1'),
                            $t('options.dialogs.wifiResetLine2')
                        ]"
                        icon="mdi-wifi-cancel"
                />
            </v-col>
            <v-col cols="12" lg="4" class="text-center">
                <ButtonConfirm
                        color="red"
                        :condition="sockedIsConnected"
                        :text="$t('options.buttons.factoryReset')"
                        :onclickAgree="factoryReset"
                        :disagreeText="$t('options.buttons.cancel')"
                        :agreeText="$t('options.buttons.factoryReset')"
                        :title="$t('options.buttons.factoryReset')"
                        :cardText="[
                            $t('options.dialogs.factoryResetLine1'),
                            $t('options.dialogs.factoryResetLine2')
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
                        <v-card-title><h2>{{$t("options.defaults.title")}}</h2></v-card-title>
                        <v-divider />
                        <div class="mb-4 mt-4">
                            <!-- Підпис над слайдером -->
                            <div class="mb-1 subtitle-1">
                                {{ $t('options.defaults.matrixBrightness') }}
                            </div>
                            <!-- Контейнер для слайдера + числа -->
                            <div class="d-flex align-center">
                                <v-slider
                                        v-model="config.matrixBrightness"
                                        :min="0"
                                        :max="255"
                                        :step="1"
                                        thumb-label
                                        hide-details
                                        class="flex-grow-1"
                                        dense
                                />
                                <!-- тут відображаємо число поруч -->
                                <span class="mx-2 subtitle-1">{{ config.matrixBrightness }}</span>
                            </div>
                        </div>
                        <v-text-field
                                v-model="config.scrollTextDefaultDelay"
                                type="number"
                                :label="$t('options.defaults.scrollDelay')"
                                :hint="$t('options.defaults.largerNumberIsSlower')"
                                suffix="ms"
                                :rules="[rules.required, rules.min0]"
                                dense
                        />
                        <v-text-field
                                v-model="config.hostname"
                                :label="$t('options.defaults.hostname')"
                                dense
                        />
                        <v-text-field
                                v-model="config.note"
                                :label="$t('options.defaults.note')"
                                dense
                        />
                        <v-switch
                                v-model="config.bootScreenAktiv"
                                :label="$t('options.defaults.bootScreen')"
                                color="primary"
                                dense
                        />
                        <v-switch
                                v-if="showBatteryBtn"
                                v-model="config.bootBatteryScreen"
                                :label="$t('options.defaults.batteryOnBoot')"
                                color="primary"
                                dense
                        />
                        <v-switch
                                v-model="config.bootSound"
                                :label="$t('options.defaults.bootSound')"
                                color="primary"
                                dense
                        />
                        <v-switch
                                v-model="config.checkUpdateScreen"
                                :label="$t('options.defaults.notifyFirmware')"
                                color="primary"
                                dense
                        />
                    </v-card>

                    <!-- Matrix Card -->
                    <v-card class="pa-2 mt-4" elevation="4">
                        <v-card-title><h2>{{$t("options.matrix.title")}}</h2></v-card-title>
                        <v-divider />
                        <v-select
                                :items="matrixTypes"
                                v-model="config.matrixType"
                                :label="$t('options.matrix.type')"
                                :item-title="item => $t(item.textKey)"
                                item-title="text"
                                item-value="value"
                                dense
                        />
                        <v-select
                                :items="matrixCorrection"
                                v-model="config.matrixTempCorrection"
                                :label="$t('options.matrix.correction')"
                                :item-title="item => $t(item.textKey)"
                                item-title="text"
                                item-value="value"
                                dense
                        />
                    </v-card>

                    <!-- Auto Brightness -->
                    <v-card class="pa-2 mt-4" elevation="4">
                        <v-card-title><h2>{{$t("options.autoBrightness.title")}}</h2></v-card-title>
                        <v-switch
                                v-model="config.matrixBrightnessAutomatic"
                                :label="$t('options.autoBrightness.label')"
                                color="primary"
                                dense
                        />
                        <v-row>
                            <v-col cols="6">
                                <v-text-field
                                        v-model="config.mbaDimMin"
                                        type="number"
                                        :label="$t('options.autoBrightness.minBright')"
                                        :disabled="!config.matrixBrightnessAutomatic"
                                        :rules="config.matrixBrightnessAutomatic ? [rules.required, rules.min0, rules.max255] : []"
                                        dense
                                />
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                        v-model="config.mbaDimMax"
                                        type="number"
                                        :label="$t('options.autoBrightness.maxBright')"
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
                                        :label="$t('options.autoBrightness.fromLux')"
                                        :disabled="!config.matrixBrightnessAutomatic"
                                        :rules="config.matrixBrightnessAutomatic ? [rules.required, rules.min0] : []"
                                        dense
                                />
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                        v-model="config.mbaLuxMax"
                                        type="number"
                                        :label="$t('options.autoBrightness.toLux')"
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
                        <v-card-title><h2>{{$t("options.clock.title")}}</h2></v-card-title>
                        <v-divider />
                        <v-text-field
                                v-model="config.ntpServer"
                                :label="$t('options.clock.ntpServer')"
                                :rules="[rules.required]"
                                dense
                        />
                        <v-text-field
                                v-model="config.clockTimeZone"
                                type="number"
                                :label="$t('options.clock.utcOffset')"
                                :rules="[rules.required, rules.minMinus12, rules.max14]"
                                dense
                        />
                        <ColorPickerTextfield />

                        <v-switch
                                v-model="config.clockDayLightSaving"
                                :label="$t('options.clock.dst')"
                                color="primary"
                                hide-details
                        />

                        <v-switch
                                v-model="config.clock24Hours"
                                :label="$t('options.clock.format24')"
                                color="primary"
                                dense
                                hide-details
                        />

                        <v-switch
                                v-model="config.clockLargeFont"
                                :label="$t('options.clock.largeFont')"
                                :disabled="config.clockFatFont"
                                color="primary"
                                hide-details
                        />

                        <v-switch
                                v-model="config.clockFatFont"
                                :label="$t('options.clock.fatFont')"
                                :disabled="config.clockLargeFont"
                                color="primary"
                                hide-details
                        />

                        <v-switch
                                v-model="config.clockWithSeconds"
                                :label="$t('options.clock.showSeconds')"
                                :disabled="!config.clock24Hours || config.clockFatFont || config.clockLargeFont"
                                color="primary"
                                hide-details
                        />

                        <v-switch
                                v-model="config.clockDrawWeekDays"
                                :label="$t('options.clock.weekdays')"
                                :disabled="config.clockFatFont || config.clockLargeFont"
                                color="primary"
                                hide-details
                        />

                        <v-switch
                                v-model="config.clockSwitchAktiv"
                                :label="$t('options.clock.switchActive')"
                                color="primary"
                                hide-details
                        />

                        <v-switch
                                v-model="config.clockBlinkAnimated"
                                :label="$t('options.clock.blinkSeparator')"
                                color="primary"
                                hide-details
                        />

                        <v-switch
                                v-model="config.clockDayOfWeekFirstMonday"
                                :label="$t('options.clock.startMonday')"
                                color="primary"
                                hide-details
                        />

                        <v-switch
                                v-model="config.clockDateDayMonth"
                                :label="$t('options.clock.dateFormat')"
                                color="primary"
                                hide-details
                        />

                        <v-switch
                                v-model="config.clockDayLightSaving"
                                :label="$t('options.clock.dst')"
                                color="primary"
                                dense

                        />

                        <v-text-field
                                v-model="config.clockSwitchSec"
                                type="number"
                                :label="$t('options.clock.switchTime')"
                                suffix="seconds"
                                :disabled="!config.clockSwitchAktiv"
                                :rules="config.clockSwitchAktiv ? [rules.required, rules.min0] : []"
                                hide-details
                                class="mb-3"
                        />

                        <v-switch
                                v-model="config.clockAutoFallbackActive"
                                :label="$t('options.clock.autoFallback')"
                                color="primary"

                        />

                        <v-select
                                :items="autoFallbackAnimation"
                                v-model="config.clockAutoFallbackAnimation"
                                :label="$t('options.clock.fallbackAnimation')"
                                :disabled="!config.clockAutoFallbackActive"
                                :item-title="item => $t(item.textKey)"
                                item-title="text"
                                item-value="value"
                                hide-details
                                class="mb-3"
                        />

                        <v-text-field
                                v-model="config.clockAutoFallbackTime"
                                type="number"
                                :label="$t('options.clock.fallbackTime')"
                                suffix="seconds"
                                :disabled="!config.clockAutoFallbackActive"
                                :rules="config.clockAutoFallbackActive ? [rules.required, rules.min0] : []"
                                hide-details
                        />

                    </v-card>


                </v-col>

                <!-- Telemetry Column -->
                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title>
                            <h2>{{ $t("options.sound.title") }}</h2>
                        </v-card-title>
                        <v-divider />

                        <v-text-field
                                v-model="config.initialVolume"
                                type="number"
                                :label="$t('options.sound.initialVolume')"
                                hint="1 - 30"
                                :rules="[rules.required, rules.volumeRange]"
                                dense
                        />

                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.dfpRXpin"
                                type="number"
                                item-title="text"
                                item-value="value"
                                :label="$t('options.sound.rxPin')"
                                dense
                        />

                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.dfpTXpin"
                                type="number"
                                item-title="text"
                                item-value="value"
                                :label="$t('options.sound.txPin')"
                                dense
                        />
                    </v-card>

                    <!-- MQTT -->
                    <v-card class="pa-2 mt-4" elevation="4">
                        <v-card-title><h2>{{$t("options.mqtt.title")}}</h2></v-card-title>
                        <v-switch
                                v-model="config.mqttAktiv"
                                :label="$t('options.mqtt.active')"
                                color="primary"
                                dense
                        />
                        <v-text-field
                                v-model="config.mqttServer"
                                :label="$t('options.mqtt.server')"
                                :rules="config.mqttAktiv ? [rules.required] : []"
                                dense
                        />
                        <v-text-field
                                v-model="config.mqttPort"
                                type="number"
                                :label="$t('options.mqtt.port')"
                                :rules="config.mqttAktiv ? [rules.required, rules.portRange] : []"
                                dense
                        />

                        <v-text-field
                                v-model="config.mqttUser"
                                :label="$t('options.mqtt.user')"
                                :hint="$t('options.mqtt.userHint')"
                                :disabled="!config.mqttAktiv"
                                hide-details
                                class="mb-3"
                        />

                        <v-text-field
                                v-model="config.mqttPassword"
                                :label="$t('options.mqtt.password')"
                                :hint="$t('options.mqtt.passwordHint')"
                                :disabled="!config.mqttAktiv"
                                hide-details
                                class="mb-3"
                        />

                        <v-text-field
                                v-model="config.mqttMasterTopic"
                                :label="$t('options.mqtt.masterTopic')"
                                :rules="config.mqttAktiv ? [rules.required] : []"
                                dense
                        />

                        <v-switch
                                v-model="config.mqttUseDeviceTopic"
                                :label="deviceTopicLabel"
                                :disabled="!config.mqttAktив"
                                color="primary"
                                dense
                        />

                        <v-switch
                                v-model="config.mqttHAdiscoverable"
                                :label="$t('options.mqtt.discoverable')"
                                :disabled="!config.mqttAktiv"
                                color="primary"
                                class="d-block"
                                hide-details
                        />
                    </v-card>

                    <v-card class="pa-2 mt-4" elevation="4">
                        <v-card-title><h2>{{$t("options.telemetry.title")}}</h2></v-card-title>
                        <v-switch
                                v-model="config.sendTelemetry"
                                :label="$t('options.telemetry.sendData')"
                                color="primary"
                                dense
                        />

                        <v-card-text class="text-body-2">
                            <h3 class="text-subtitle-1 font-weight-medium mb-2">{{ $t('options.telemetry.whyTitle') }}</h3>
                            <p>{{ $t('options.telemetry.whyDesc1') }}</p>
                            <p>{{ $t('options.telemetry.whyDesc2') }}</p>
                            <ul>
                                <li>{{ $t('options.telemetry.data.uuid') }}</li>
                                <li>{{ $t('options.telemetry.data.version') }}</li>
                                <li>{{ $t('options.telemetry.data.build') }}</li>
                                <li>{{ $t('options.telemetry.data.matrix') }}</li>
                                <li>{{ $t('options.telemetry.data.sensors') }}</li>
                                <li>{{ $t('options.telemetry.data.country') }}</li>
                            </ul>
                            <p class="mt-3">{{ $t('options.telemetry.thatWasIt') }}</p>
                        </v-card-text>

                        <v-card-subtitle class="font-weight-medium">{{ $t('options.telemetry.preview') }}</v-card-subtitle>

                        <PrismEditor
                                class="mt-2 rounded"
                                v-model="telemetryData"
                                :highlight="highlighter"
                                readonly
                                :tabSize="2"
                        />

                        <ButtonCondition
                                class="mt-2"
                                color="primary"
                                :condition="sockedIsConnected && sendTelemetryEnabled"
                                :text="$t('options.telemetry.sendNow')"
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
    const autoFallbackAnimation = computed(() => store.state.config.autoFallbackAnimation)
    const isESP8266 = computed(() => store.state.config.isESP8266)
    const pinsESP32 = computed(() => store.state.config.pinsESP32 || [])
    const pinsESP8266 = computed(() => store.state.config.pinsESP8266 || [])

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

</style>

<style>
    ul { margin-top: 10px; }
    li { margin-left: 20px; }
    .prism-editor__container textarea.prism-editor__textarea {
        display: none !important;
    }
</style>
