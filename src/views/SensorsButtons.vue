<template>
    <v-container class="options">
        <v-row>
            <v-col cols="12" lg="12" class="text-center">
                <ButtonCondition
                        color="success"
                        :condition="isValid && sockedIsConnected"
                        text="Save config"
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
                        <v-card-title><h2>Sensor units and offsets</h2></v-card-title>
                        <hr />
                        <br />
                        <v-select
                                :items="temperatureUnits"
                                v-model="config.temperatureUnit"
                                label="Temperature unit"
                                item-title="text"
                                item-value="value"
                        />
                        <v-text-field
                                v-model="config.temperatureOffset"
                                type="number"
                                label="Temperature sensor offset"
                                :rules="[rules.required]"
                        />
                        <v-text-field
                                v-model="config.humidityOffset"
                                type="number"
                                label="Humidity sensor offset"
                                :rules="[rules.required]"
                        />
                        <v-text-field
                                v-model="config.pressureOffset"
                                type="number"
                                label="Pressure sensor offset"
                                :rules="[rules.required]"
                        />
                        <v-text-field
                                v-model="config.gasOffset"
                                type="number"
                                label="Gas sensor offset"
                                :rules="[rules.required]"
                        />
                        <v-text-field
                                v-model="config.luxOffset"
                                type="number"
                                label="Lux sensor offset"
                                :rules="[rules.required]"
                        />
                        <v-text-field
                                v-model="config.ldrSmoothing"
                                type="number"
                                label="Number of historic LDR readings"
                                hint="Enter any value when using BH1750"
                                :rules="[rules.required, rules.min0]"
                        />
                    </v-card>
                </v-col>

                <!-- Sensor hardware -->
                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>Sensor hardware</h2></v-card-title>
                        <hr />
                        <br />
                        <h3>I²C sensors</h3>
                        <v-card-text>
                            If you use BH1750, BME280 or BME680 sensors, they need two pins to communicate.
                        </v-card-text>
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.SCLPin"
                                label="SCL pin"
                                hint="Pick any value when using no I²C sensors"
                                item-title="text"
                                item-value="value"
                        />
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.SDAPin"
                                label="SDA pin"
                                hint="Pick any value when using no I²C sensors"
                                item-title="text"
                                item-value="value"
                        />
                        <br />
                        <h3>OneWire sensors</h3>
                        <v-card-text>
                            If you use OneWire sensors like DHT22, they need one pin to communicate.
                        </v-card-text>
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.onewirePin"
                                label="DHT sensor pin"
                                hint="Pick any value when using no OneWire sensors"
                                item-title="text"
                                item-value="value"
                        />
                        <h3>LDR</h3>
                        <v-card-text>
                            If you use no BH1750 but an LDR, select its type and pulldown resistor.
                        </v-card-text>
                        <v-select
                                :items="ldrDevices"
                                v-model="config.ldrDevice"
                                label="Lux sensor type"
                                hint="Pick any value when using BH1750 or no lux sensor"
                                item-title="text"
                                item-value="value"
                        />
                        <v-text-field
                                v-model="config.ldrPulldown"
                                type="number"
                                label="Value of pulldown resistor"
                                suffix="Ohm"
                                hint="Enter any value when using BH1750 or no lux sensor"
                                :rules="[rules.required]"
                        />
                    </v-card>
                </v-col>

                <!-- Button hardware and actions -->
                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>Button hardware</h2></v-card-title>
                        <hr />
                        <br />
                        <v-switch
                                v-model="config.btn0Enabled"
                                label="Left button enabled"
                                dense hide-details
                        />
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.btn0Pin"
                                label="Pin for left button"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn0Enabled"
                        />
                        <v-select
                                :items="btnLowHigh"
                                v-model="config.btn0PressedLevel"
                                label="Left button signal type"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn0Enabled"
                        />
                        <br />
                        <v-switch
                                v-model="config.btn1Enabled"
                                label="Middle button enabled"
                                dense hide-details
                        />
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.btn1Pin"
                                label="Pin for middle button"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn1Enabled"
                        />
                        <v-select
                                :items="btnLowHigh"
                                v-model="config.btn1PressedLevel"
                                label="Middle button signal type"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn1Enabled"
                        />
                        <br />
                        <v-switch
                                v-model="config.btn2Enabled"
                                label="Right button enabled"
                                dense hide-details
                        />
                        <v-select
                                :items="isESP8266 ? pinsESP8266 : pinsESP32"
                                v-model="config.btn2Pin"
                                label="Pin for right button"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn2Enabled"
                        />
                        <v-select
                                :items="btnLowHigh"
                                v-model="config.btn2PressedLevel"
                                label="Right button signal type"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn2Enabled"
                        />
                    </v-card>

                    <br />
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>Button actions</h2></v-card-title>
                        <hr />
                        <br />
                        <v-select
                                :items="btnActions"
                                v-model="config.btn0Action"
                                label="Left button action"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn0Enabled"
                        />
                        <v-select
                                :items="btnActions"
                                v-model="config.btn1Action"
                                label="Middle button action"
                                item-title="text"
                                item-value="value"
                                :disabled="!config.btn1Enabled"
                        />
                        <v-select
                                :items="btnActions"
                                v-model="config.btn2Action"
                                label="Right button action"
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
