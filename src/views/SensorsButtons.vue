<template>
    <v-container class="options">
        <v-row>
            <v-col cols="12" lg="12" class="text-center">
                <ButtonCondition
                        color="success"
                        :condition="isValid && sockedIsConnected"
                        :text="$t('sensorsbuttons.buttons.saveConfig')"
                        :onclick="save"
                        icon="mdi-content-save"
                />
            </v-col>
        </v-row>

        <v-form v-model="isValid">
            <v-row>
                <!-- Sensor units and offsets -->
                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>{{$t('sensorsbuttons.sensors.title')}}</h2></v-card-title>
                        <hr />
                        <br />
                        <v-select
                                :items="temperatureUnits"
                                v-model="config.temperatureUnit"
                                :item-title="item => $t(item.textKey)"
                                :label="$t('sensorsbuttons.sensors.temperatureUnit')"
                                item-title="text"
                                item-value="value"
                        />
                        <v-text-field
                                v-model="config.temperatureOffset"
                                type="number"
                                :label="$t('sensorsbuttons.sensors.temperatureOffset')"
                                :rules="[rules.required]"
                        />
                        <v-text-field
                                v-model="config.humidityOffset"
                                type="number"
                                :label="$t('sensorsbuttons.sensors.humidityOffset')"
                                :rules="[rules.required]"
                        />
                        <v-text-field
                                v-model="config.pressureOffset"
                                type="number"
                                :label="$t('sensorsbuttons.sensors.pressureOffset')"
                                :rules="[rules.required]"
                        />
                        <v-text-field
                                v-model="config.gasOffset"
                                type="number"
                                :label="$t('sensorsbuttons.sensors.gasOffset')"
                                :rules="[rules.required]"
                        />
                        <v-text-field
                                v-model="config.luxOffset"
                                type="number"
                                :label="$t('sensorsbuttons.sensors.luxOffset')"
                                :rules="[rules.required]"
                        />
                        <v-text-field
                                v-model="config.ldrSmoothing"
                                type="number"
                                :label="$t('sensorsbuttons.sensors.ldrHistory')"
                                :hint="$t('sensorsbuttons.sensors.ldrHint')"
                                :rules="[rules.required, rules.min0]"
                        />
                    </v-card>
                </v-col>

                <!-- Sensor hardware -->
                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>{{$t('sensorsbuttons.hardware.title')}}</h2></v-card-title>
                        <hr />
                        <br />
                        <h3>{{$t('sensorsbuttons.hardware.i2c')}}</h3>
                        <v-card-text>{{$t('sensorsbuttons.hardware.i2cDesc')}}</v-card-text>
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.SCLPin"
                                :label="$t('sensorsbuttons.hardware.scl')"
                                :hint="$t('sensorsbuttons.hardware.i2cHint')"
                                item-title="text"
                                item-value="value"
                        />
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.SDAPin"
                                :label="$t('sensorsbuttons.hardware.sda')"
                                :hint="$t('sensorsbuttons.hardware.i2cHint')"
                                item-title="text"
                                item-value="value"
                        />
                        <br />
                        <h3>{{$t('sensorsbuttons.hardware.onewire')}}</h3>
                        <v-card-text>{{$t('sensorsbuttons.hardware.onewireDesc')}}</v-card-text>
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.onewirePin"
                                :label="$t('sensorsbuttons.hardware.onewirePin')"
                                :hint="$t('sensorsbuttons.hardware.onewireHint')"
                                item-title="text"
                                item-value="value"
                        />
                        <h3>{{$t('sensorsbuttons.hardware.ldr')}}</h3>
                        <v-card-text>{{$t('sensorsbuttons.hardware.ldrDesc')}}
                        </v-card-text>
                        <v-select
                                :items="ldrDevices"
                                v-model="config.ldrDevice"
                                :label="$t('sensorsbuttons.hardware.ldrType')"
                                :hint="$t('sensorsbuttons.hardware.ldrHint')"
                                item-title="text"
                                item-value="value"
                        />
                        <v-text-field
                                v-model="config.ldrPulldown"
                                type="number"
                                :label="$t('sensorsbuttons.hardware.ldrResistor')"
                                suffix="Ohm"
                                :hint="$t('sensorsbuttons.hardware.ldrHint')"
                                :rules="[rules.required]"
                        />
                    </v-card>
                </v-col>

                <!-- Button hardware and actions -->
                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>{{$t('sensorsbuttons.buttons.title')}}</h2></v-card-title>
                        <hr />
                        <br />
                        <v-switch
                                v-model="config.btn0Enabled"
                                :label="$t('sensorsbuttons.buttons.left.enabled')"
                                dense hide-details
                        />
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.btn0Pin"
                                :label="$t('sensorsbuttons.buttons.left.pin')"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn0Enabled"
                        />
                        <v-select
                                :items="btnLowHigh"
                                v-model="config.btn0PressedLevel"
                                :item-title="item => $t(item.textKey)"
                                :label="$t('sensorsbuttons.buttons.left.signal')"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn0Enabled"
                        />
                        <br />
                        <v-switch
                                v-model="config.btn1Enabled"
                                :label="$t('sensorsbuttons.buttons.middle.enabled')"
                                dense hide-details
                        />
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.btn1Pin"
                                :label="$t('sensorsbuttons.buttons.middle.pin')"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn1Enabled"
                        />
                        <v-select
                                :items="btnLowHigh"
                                v-model="config.btn1PressedLevel"
                                :item-title="item => $t(item.textKey)"
                                :label="$t('sensorsbuttons.buttons.middle.signal')"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn1Enabled"
                        />
                        <br />
                        <v-switch
                                v-model="config.btn2Enabled"
                                :label="$t('sensorsbuttons.buttons.right.enabled')"
                                dense hide-details
                        />
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.btn2Pin"
                                :label="$t('sensorsbuttons.buttons.right.pin')"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn2Enabled"
                        />
                        <v-select
                                :items="btnLowHigh"
                                v-model="config.btn2PressedLevel"
                                :item-title="item => $t(item.textKey)"
                                :label="$t('sensorsbuttons.buttons.right.signal')"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn2Enabled"
                        />
                    </v-card>

                    <br />
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>{{$t('sensorsbuttons.buttons.actionsTitle')}}</h2></v-card-title>
                        <hr />
                        <br />
                        <v-select
                                :items="btnActions"
                                v-model="config.btn0Action"
                                :item-title="item => $t(item.textKey)"
                                :label="$t('sensorsbuttons.buttons.left.action')"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn0Enabled"
                        />
                        <v-select
                                :items="btnActions"
                                v-model="config.btn1Action"
                                :item-title="item => $t(item.textKey)"
                                :label="$t('sensorsbuttons.buttons.middle.action')"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn1Enabled"
                        />
                        <v-select
                                :items="btnActions"
                                v-model="config.btn2Action"
                                :item-title="item => $t(item.textKey)"
                                :label="$t('sensorsbuttons.buttons.right.action')"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn2Enabled"
                        />
                    </v-card>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script setup>
    import { ref, computed, getCurrentInstance,onMounted } from 'vue'
    import { useStore } from 'vuex'
    import ButtonCondition from '@/components/ButtonCondition.vue'

    const store = useStore()
    const { appContext } = getCurrentInstance()
    const $socket = appContext.config.globalProperties.$socket

    const isValid = ref(true)

    // Computed state
    const rules = computed(() => store.state.config.rules)
    const config = computed(() => store.state.config.configData)
    const sockedIsConnected = computed(() => store.state.socket.isConnected)
    const temperatureUnits = computed(() => store.state.config.temperatureUnits)
    const ldrDevices = computed(() => store.state.config.ldrDevices)
    const isESP8266 = computed(() => store.state.config.isESP8266)
    const btnLowHigh = computed(() => store.state.config.btnLowHigh)
    const btnActions = computed(() => store.state.config.btnActions)
    const pinsESP32 = computed(() => store.state.config.pinsESP32)
    const pinsESP8266 = computed(() => store.state.config.pinsESP8266)

    console.log("config", config);
    console.log("isESP8266", isESP8266);

    console.log('temperatureUnits', temperatureUnits.value);
    console.log('config.temperatureUnit', config.value.temperatureUnit);

    // Methods
    function save() {
        $socket.sendObj({ setConfig: config.value })
        setTimeout(() => $socket.close(), 3000)
    }

    // 🛠 Приводимо обʼєкти в конфігурації до value при завантаженні
    onMounted(() => {
        const convertToValue = (field) => {
            if (typeof config.value[field] === 'object' && config.value[field] !== null && 'value' in config.value[field]) {
                config.value[field] = config.value[field].value
            }
            console.log("field", field);
            console.log("config.value", config.value[field]);
        }

        console.log("config", config);

        convertToValue('temperatureUnit')
        convertToValue('SCLPin')
        convertToValue('SDAPin')
        convertToValue('onewirePin')
        convertToValue('ldrDevice')
        convertToValue('btn0Pin')
        convertToValue('btn0PressedLevel')
        convertToValue('btn1Pin')
        convertToValue('btn1PressedLevel')
        convertToValue('btn2Pin')
        convertToValue('btn2PressedLevel')
        convertToValue('btn0Action')
        convertToValue('btn1Action')
        convertToValue('btn2Action')
    })


</script>

<style scoped>
    /* Додайте стилі за потреби */
</style>
