<template>
    <v-container class="statistics">
        <v-alert v-if="$demoMode" type="info">
            Ви зараз в демо-режимі — справжнє обладнання не підключено.
        </v-alert>

        <div v-if="statsError || !sendStatistics">
            <v-row>
                <v-col cols="12">
                    <v-card class="pa-2" elevation="4">
                        <v-card-text class="text-md-center">
                            <h2>
                                Activate the telemetry data to see the statistics.
                            </h2>
                            <br />
                            <h4>
                                To activate the telemetry data, go to
                                <a href="/#/options"><b>Options</b> and activate <b>"Send Telemetry data"</b></a>
                            </h4>
                            <small>
                                After activation, it can take up to one minute for the data to become visible.
                            </small>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <div v-else>
            <v-row>
                <v-col cols="12">
                    <v-card class="pa-2" elevation="4">
                        <v-card-text class="text-md-center">
                            These statistics are created with the telemetry data of the
                            PixelIts that have reported in the last 30 days.
                            <br />
                            <b>Thanks to everyone who shares this data with us!</b>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" lg="4">
                    <v-card class="pa-1" elevation="4">
                        <v-card-title><h2>Boards</h2></v-card-title>
                        <hr />
                        <apex-chart
                                height="600px"
                                width="100%"
                                type="bar"
                                :options="chartOptions"
                                :series="buildStats"
                        />
                    </v-card>
                </v-col>

                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>Versions</h2></v-card-title>
                        <hr />
                        <apex-chart
                                height="600px"
                                width="100%"
                                type="bar"
                                :options="chartOptions"
                                :series="versionStats"
                        />
                    </v-card>
                </v-col>

                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>Sensors</h2></v-card-title>
                        <hr />
                        <apex-chart
                                height="600px"
                                width="100%"
                                type="bar"
                                :options="chartOptions"
                                :series="sensorStats"
                        />
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" lg="8">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>Countries</h2></v-card-title>
                        <hr />
                        <apex-chart
                                height="600px"
                                type="donut"
                                :options="countryChartOptions"
                                :series="countryStats"
                        />
                    </v-card>
                </v-col>

                <v-col cols="12" lg="4">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>Matrix Types</h2></v-card-title>
                        <hr />
                        <apex-chart
                                height="600px"
                                width="100%"
                                type="bar"
                                :options="chartOptions"
                                :series="matrixStats"
                        />
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-card class="pa-2" elevation="4">
                        <v-card-title><h2>Usermap</h2></v-card-title>
                        <hr />
                        <user-map :coords="userMapData" :mapZoom="3" height="600px" />
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup>
    import { getCurrentInstance, ref, computed, onMounted } from 'vue'
    import { useStore } from 'vuex'
    import ApexChart from 'vue3-apexcharts'
    import UserMap from '@/components/UserMap.vue'

    const store = useStore()
    const { appContext } = getCurrentInstance()
    const demoMode = appContext.config.globalProperties.$demoMode
    // console.log(appContext.config.globalProperties.$demoMode)
    // const demoMode = false

    const statsError = computed(() => store.state.statistics.error)

    // Якщо в DEMO-режимі — завжди true, інакше — з конфігурації
    const sendStatistics = demoMode
        // у випадку demo — звичайний ref, що завжди true
        ? ref(true)
        // в робочому режимі — computed, читаємо з store
        : computed(() => store.state.config.configData.sendTelemetry)

    console.log("statsError", statsError);
    console.log("sendStatistics", sendStatistics);

    const userMapData = computed(() => {
        if (demoMode) {
            return [[51.5, -0.09], [40.7, -74.0], [48.85, 2.35]]
        }
        return store.state.userMapData?.coords || []
    })

    console.log("userMapData", userMapData);

    // Bar chart series
    const buildStats = computed(() => {
        if (demoMode) {
            return [{ name: 'Count', data: [ { x: 'Demo A', y: 10 }, { x: 'Demo B', y: 15 } ] }]
        }
        const s = store.state.statistics.buildStats || []
        const data = s.map(({ build: x, count }) => ({ x, y: count }))
        return [{ name: 'Count', data }]
    })

    const versionStats = computed(() => {
        if (demoMode) {
            return [{ name: 'Count', data: [ { x: 'v1.0', y: 5 }, { x: 'v2.0', y: 20 } ] }]
        }
        const s = store.state.statistics.versionStats || []
        const data = s.map(({ version: x, count }) => ({ x, y: count }))
        return [{ name: 'Count', data }]
    })

    const sensorStats = computed(() => {
        if (demoMode) {
            return [{ name: 'Count', data: [ { x: 'Temp', y: 8 }, { x: 'Hum', y: 12 } ] }]
        }
        const s = store.state.statistics.sensorStats || []
        const data = s.map(({ sensor: x, count }) => ({ x, y: count }))
        return [{ name: 'Count', data }]
    })

    const matrixStats = computed(() => {
        if (demoMode) {
            return [{ name: 'Count', data: [ { x: '8x8', y: 7 }, { x: '8x32', y: 9 } ] }]
        }
        const s = store.state.statistics.matrixStats || []
        const data = s.map(({ matrix: x, count }) => ({ x, y: count }))
        return [{ name: 'Count', data }]
    })

    // Donut series and options
    const countryStats = computed(() => {
        if (demoMode) {
            return [30, 20, 50]
        }
        const s = store.state.statistics.countryStats
        return s ? s.map(({ count }) => count) : []
    })
    const countryChartOptions = computed(() => ({
        labels: demoMode
            ? ['DE', 'US', 'FR']
            : store.state.statistics.countryStats?.map(({ country }) => country) || [],
        theme: {
            mode: store.state.config.darkMode ? 'dark' : 'light',
            palette: 'palette10'
        },
        chart: { background: 'transparent', dropShadow: { enabled: false } },
        plotOptions: {
            pie: { expandOnClick: true, donut: { size: '0%', labels: { show: false } } }
        }
    }))

    // General bar chart options
    const chartOptions = computed(() => ({
        plotOptions: { bar: { horizontal: false, distributed: true } },
        dataLabels: { enabled: true },
        legend: { show: false },
        theme: { mode: store.state.config.darkMode ? 'dark' : 'light', palette: 'palette10' },
        chart: { background: 'transparent', dropShadow: { enabled: false } }
    }))

    // If wanting to populate stats from a demo JSON on mount:
    // onMounted(async () => {
    //     if (demoMode) {
    //         // Example: auto-load demoData/stats.json
    //         const demo = await import('../public/demoData/stats.json')
    //         const s = demo.default
    //         store.commit('statistics/SET_BUILD_STATS', s.buildStats)
    //         store.commit('statistics/SET_VERSION_STATS', s.versionStats)
    //         store.commit('statistics/SET_SENSOR_STATS', s.sensorStats)
    //         store.commit('statistics/SET_MATRIX_STATS', s.matrixStats)
    //         store.commit('statistics/SET_COUNTRY_STATS', s.countryStats)
    //         store.commit('userMapData/SET_COORDS', s.userMapData)
    //     }
    // })
</script>

<style scoped>
    ul {
        margin-top: 10px;
    }
    li {
        margin-left: 20px;
    }
</style>
