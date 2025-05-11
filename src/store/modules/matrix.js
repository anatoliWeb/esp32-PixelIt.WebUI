const state = () => ({
    brightness: 0,
    liveviewData: [],
    logData: [],
    sensorData: [],
    buttonData: [],
    sysInfoData: [],
    bmpsFromAPI: [],
    pixelCreatorPixel: {}
})

const mutations = {
    SET_BRIGHTNESS(state, value) {
        state.brightness = value
    },
    ADD_LIVEVIEW_DATA(state, data) {
        state.liveviewData = data
    },
    ADD_LOG_ENTRY(state, log) {
        state.logData.unshift(log)
        if (state.logData.length > 100) {
            state.logData = state.logData.slice(0, 100)
        }
    },
    ADD_SENSOR_DATA(state, sensor) {
        state.sensorData.push(sensor)
    },
    ADD_BUTTON_DATA(state, button) {
        state.buttonData.push(button)
    },
    ADD_SYSINFO_DATA(state, info) {
        state.sysInfoData.push(info)
    },
    SET_SYSINFO_DATA(state, data) {
        state.sysInfoData = data
    },
    SET_SENSOR_DATA(state, data) {
        state.sensorData = data
    },
    SET_BUTTON_DATA(state, data) {
        state.buttonData = data
    },
    SET_LOG_DATA(state, data) {
        state.logData = data
    },
    SET_LIVEVIEW_DATA(state, data) {
        state.liveviewData = data
    },
    SET_MATRIX_SIZE(state, data) {
        state.matrixSize = data
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
