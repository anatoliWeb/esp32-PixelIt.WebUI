import { createStore } from 'vuex'

// Імпорти модулів
import socket from './modules/socket'
import telemetry from './modules/telemetry'
import config from './modules/config'
import matrix from './modules/matrix'
import testarea from './modules/testarea'

const store = createStore({
    modules: {
        socket,
        telemetry,
        config,
        matrix,
        testarea
    }
})

export default store
