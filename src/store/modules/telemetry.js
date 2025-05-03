const state = () => ({
    telemetryData: '',
    userMapData: { coords: [] },
    statistics: {}
})

const mutations = {
    SET_TELEMETRY_DATA(state, data) {
        state.telemetryData = JSON.stringify(data, null, 4)
    },
    SET_USER_MAP_DATA(state, data) {
        state.userMapData = data
    },
    SET_STATISTICS(state, data) {
        state.statistics = data
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
