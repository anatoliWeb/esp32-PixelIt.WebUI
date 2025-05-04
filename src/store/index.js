import { createStore } from 'vuex'

// Імпорти модулів
import socket from './modules/socket'
import telemetry from './modules/telemetry'
import config from './modules/config'
import matrix from './modules/matrix'
import testarea from './modules/testarea'
import statistics from './modules/statistics'

const store = createStore({
    modules: {
        socket,
        telemetry,
        config,
        matrix,
        testarea,
        statistics
    }
})

export default store
