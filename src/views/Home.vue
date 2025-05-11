<template>
    <v-container class="home">
        <v-row>
            <!-- System Info -->
            <v-col cols="12" lg="3">
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>{{ $t('home.system') }}</h2>
                    </v-card-title>
                    <hr />
                    <br />
                    <div
                            class="text-center updateMessage"
                            v-if="newVersionAvailable && !isDemoMode"
                    >
                        <a
                                class="updateMessage"
                                :href="gitUpdateURL"
                                target="_blank"
                        >
                            {{ $t('home.updateAvailable', { version: gitVersion }) }}
                        </a>
                        <v-icon size="16px" class="updateMessage">
                            mdi-open-in-new
                        </v-icon>
                    </div>
                    <ListInfo :items="convertToList(systemItems)" />
                </v-card>
            </v-col>
            <!-- Liveview & Sensors & Buttons -->
            <v-col cols="12" lg="3">
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>{{ $t('home.liveview') }}</h2>
                    </v-card-title>
                    <hr />
                    <br />
                    <Liveview
                            class="text-center"
                            :data="liveview"
                            :options="liveviewCanvasSettings"
                    />
                </v-card>
                <br />
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>{{ $t('home.sensors') }}</h2>
                    </v-card-title>
                    <hr />
                    <br />
                    <ListInfo :items="convertToList(sensorItems)" />
                </v-card>
                <br />
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>{{ $t('home.buttons') }}</h2>
                    </v-card-title>
                    <hr />
                    <br />
                    <ListInfo :items="convertToList(buttonItems)" />
                </v-card>
            </v-col>
            <!-- Logs and Usermap -->
            <v-col cols="12" lg="6">
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>{{ $t('home.logs') }}</h2>
                    </v-card-title>
                    <hr />
                    <br />
                    <Log :log="logText" />
                </v-card>
                <br />
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>{{ $t('home.usermap') }}</h2>
                    </v-card-title>
                    <hr />
                    <v-card-text class="text-md-center" v-if="!sendStatistics">
                        <h2>{{ $t('home.activateTelemetry') }}</h2>
                        <br />
                        <h4>
                            {{ $t('home.goToOptions') }}
                            <a href="/#/options"
                            ><b>{{ $t('home.options') }}</b> {{ $t('home.andActivate') }} <b>"{{ $t('home.sendTelemetry') }}"</b></a
                            >
                        </h4>
                        <small>{{ $t('home.afterActivation') }}</small>
                    </v-card-text>
                    <div v-else>
                        <UserMap :coords="userMapData" height="500px" />
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { computed } from 'vue'
    import { useStore } from 'vuex'
    import Log from '@/components/Log.vue'
    import ListInfo from '@/components/ListInfo.vue'
    import UserMap from '@/components/UserMap.vue'
    import Liveview from '@/components/Liveview.vue'

    const store = useStore()

    // Computed state mappings
    const systemItems = computed(() => store.state.matrix.sysInfoData)
    const sensorItems = computed(() => store.state.matrix.sensorData)
    const buttonItems = computed(() => store.state.matrix.buttonData)
    const logText = computed(() => {
        const logs = store.state.matrix.logData
        console.log("logs", logs)
        return Array.isArray(logs)
            ? logs.map(entry =>
                `[${entry.timeStamp}] ${entry.function}: ${entry.message}`
            ).join('\n')
            : logs
    })

    // console.log("systemItems", systemItems)
    // console.log("sensorItems", sensorItems)
    // console.log("buttonItems", buttonItems)
    console.log("logText", logText)

    const newVersionAvailable = computed(
        () => store.state.config.newVersionAvailable
    )

    const gitVersion = computed(() => store.state.config.gitVersion)
    const gitUpdateURL = computed(
        () => store.state.config.gitDownloadUrl
    )

    const isDemoMode = computed(() => store.state.config.isDemoMode)
    const sendStatistics = computed(
        () => store.state.config.configData.sendTelemetry
    )

    const userMapData = computed(
        () => store.state.telemetry.userMapData?.coords || []
    )

    const liveview = computed(() => store.state.matrix.liveviewData)
    const liveviewCanvasSettings = computed(
        () => store.state.matrix.matrixSize
    )

    function convertToList(obj) {
        return Object.entries(obj).map(([key, value]) => ({
            name: key.replace(/([a-z])([A-Z])/g, '$1 $2'), // Пробіли між camelCase
            value: value
        }))
    }

    console.log("newVersionAvailable", newVersionAvailable)
    console.log("gitVersion", gitVersion)
    console.log("gitUpdateURL", gitUpdateURL)
    console.log("isDemoMode", isDemoMode)
    console.log("sendStatistics", sendStatistics)
    console.log("userMapData", userMapData)
    console.log("liveview", liveview)
    console.log("liveviewCanvasSettings", liveviewCanvasSettings)

</script>

<style scoped>
    .updateMessage {
        color: rgb(255, 102, 0);
        font-weight: bold;
    }
</style>
