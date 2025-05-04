// src/store/modules/socket.js

import { addToLogData, addToSensorData, addToButtonData, addToConfigData,
    addToSysInfoData, addToTelemetryData, addToLiveviewData }
    from '@/utils/displayHelpers.js'

const state = () => ({
    isConnected: false,
    reconnectError: false,
    url: '',
    message: ''
})

const mutations = {
    SOCKET_ONOPEN(state, event) {
        state.isConnected = true
        state.url = event.currentTarget.url
    },
    SOCKET_ONCLOSE(state) {
        state.isConnected = false
    },
    SOCKET_ONERROR(state) {
        state.reconnectError = true
    },
    SOCKET_ONMESSAGE(_, message) {
        const store = window.__appStore // глобальне посилання на store
        if (!store) return

        // Log
        if (message.log) {
            addToLogData(message.log, store.state.matrix)
        }
        // Sensor
        if (message.sensor) {
            addToSensorData(message.sensor, store.state.matrix)
        }
        // Buttons
        if (message.buttons) {
            addToButtonData(message.buttons, store.state.matrix)
        }
        // Config
        if (message.config) {
            addToConfigData(message.config, store.state.config)
        }
        // SystemInfo
        if (message.sysinfo) {
            addToSysInfoData(message.sysinfo, store.state.matrix)
        }
        // Telemetry
        if (message.telemetry) {
            addToTelemetryData(message.telemetry, store.state.telemetry)
        }
        // Liveview
        if (message.liveview) {
            addToLiveviewData(message.liveview, store.state.matrix)
        }
        // статистика
        if (message.statistics) {
            state.statistics = message.statistics;
            // якщо в статистиці є координати карти
            if (message.statistics.userMapData) {
                state.userMapData = message.statistics.userMapData;
            }
        }
    },
    SOCKET_RECONNECT_ERROR(state) {
        state.reconnectError = true
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
