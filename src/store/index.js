import { createStore } from 'vuex'

// Імпорти модулів
import socket from './modules/socket'
import telemetry from './modules/telemetry'
import config from './modules/config'
import matrix from './modules/matrix'
import testarea from './modules/testarea'
import statistics from './modules/statistics'
import bmps from './modules/bmps'

const store = createStore({
    state: {
        bmpsFromAPI: []    // ← сюди
    },
    mutations: {
        setBMPs(state, bmps) {   // ← і ця мутація
            state.bmpsFromAPI = bmps
        }
    },
    modules: {
        socket,
        telemetry,
        config,
        matrix,
        testarea,
        statistics,
        bmps
    }
})

export default store
