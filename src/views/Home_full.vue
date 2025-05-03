<template>
    <v-container class="home">
        <v-row>
            <!-- System Info -->
            <v-col cols="12" lg="3">
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>System</h2>
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
                            Update to version {{ gitVersion }} available!
                        </a>
                        <v-icon size="16px" class="updateMessage">
                            mdi-open-in-new
                        </v-icon>
                    </div>
                    <ListInfo :items="systemItems" />
                </v-card>
            </v-col>
            <!-- Liveview & Sensors & Buttons -->
            <v-col cols="12" lg="3">
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>Liveview</h2>
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
                        <h2>Sensors</h2>
                    </v-card-title>
                    <hr />
                    <br />
                    <ListInfo :items="sensorItems" />
                </v-card>
                <br />
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>Buttons</h2>
                    </v-card-title>
                    <hr />
                    <br />
                    <ListInfo :items="buttonItems" />
                </v-card>
            </v-col>
            <!-- Logs and Usermap -->
            <v-col cols="12" lg="6">
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>Logs</h2>
                    </v-card-title>
                    <hr />
                    <br />
                    <Log :log="logText" />
                </v-card>
                <br />
                <v-card class="pa-2" elevation="4">
                    <v-card-title>
                        <h2>Usermap</h2>
                    </v-card-title>
                    <hr />
                    <v-card-text class="text-md-center" v-if="!sendStatistics">
                        <h2>
                            Activate the telemetry data to see the usermap.
                        </h2>
                        <br />
                        <h4>
                            To activate the telemetry data, go to
                            <a href="/#/options"
                            ><b>Options</b> and activate <b>"Send Telemetry data"</b></a
                            >
                        </h4>
                        <small>
                            After activation, it can take up to one minute for the data to
                            become visible.
                        </small>
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
    const logText = computed(() => store.state.matrix.logData.join('\n'))

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
</script>

<style scoped>
    .updateMessage {
        color: rgb(255, 102, 0);
        font-weight: bold;
    }
</style>
