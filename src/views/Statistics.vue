<template>
    <v-container class="statistics">
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
                        <apexchart
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
                        <apexchart
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
                        <apexchart
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
                        <apexchart
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
                        <apexchart
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
                        <UserMap :coords="userMapData" :mapZoom="3" height="600px" />
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup>
    import { computed } from 'vue'
    import { useStore } from 'vuex'
    import ApexChart from 'vue3-apexcharts'
    // import UserMap from '@/components/UserMap.vue'

    const store = useStore()

    const statsError = computed(() => store.state.statistics.error)
    const sendStatistics = computed(
        () => store.state.config.configData.sendTelemetry
    )
    const userMapData = computed(
        () => store.state.userMapData.coords || []
    )

    // Bar chart series
    const buildStats = computed(() => {
        const s = store.state.statistics.buildStats
        return s
            ? [{ name: 'Count', data: s.map(({ build: x, count }) => ({ x, y: count })) }]
            : []
    })
    const versionStats = computed(() => {
        const s = store.state.statistics.versionStats
        return s
            ? [{ name: 'Count', data: s.map(({ version: x, count }) => ({ x, y: count })) }]
            : []
    })
    const sensorStats = computed(() => {
        const s = store.state.statistics.sensorStats
        return s
            ? [{ name: 'Count', data: s.map(({ sensor: x, count }) => ({ x, y: count })) }]
            : []
    })
    const matrixStats = computed(() => {
        const s = store.state.statistics.matrixStats
        return s
            ? [{ name: 'Count', data: s.map(({ matrix: x, count }) => ({ x, y: count })) }]
            : []
    })

    // Donut series and options
    const countryStats = computed(() => {
        const s = store.state.statistics.countryStats
        return s ? s.map(({ count }) => count) : []
    })
    const countryChartOptions = computed(() => {
        const s = store.state.statistics.countryStats
        return {
            labels: s ? s.map(({ country }) => country) : [],
            theme: {
                mode: store.state.config.darkMode ? 'dark' : 'light',
                palette: 'palette10'
            },
            chart: { background: 'transparent', dropShadow: { enabled: false } },
            plotOptions: {
                pie: {
                    expandOnClick: true,
                    donut: { size: '0%', labels: { show: false } }
                }
            }
        }
    })

    // General bar chart options
    const chartOptions = computed(() => ({
        plotOptions: { bar: { horizontal: false, distributed: true } },
        dataLabels: { enabled: true },
        legend: { show: false },
        theme: {
            mode: store.state.config.darkMode ? 'dark' : 'light',
            palette: 'palette10'
        },
        chart: { background: 'transparent', dropShadow: { enabled: false } }
    }))
</script>

<style scoped>
    ul {
        margin-top: 10px;
    }
    li {
        margin-left: 20px;
    }
</style>
