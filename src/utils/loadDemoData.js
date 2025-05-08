// import demo from '@/assets/demo.json'
import store from '@/store'

const demo = await import('../../public/demoData/demo.json')

export function loadDemoData() {
    store.commit('socket/SOCKET_ONMESSAGE', demo.default)
    // Matrix-related дані
    store.commit('matrix/SET_SYSINFO_DATA', demo.sysinfo)
    store.commit('matrix/SET_SENSOR_DATA', demo.sensor)
    store.commit('matrix/SET_BUTTON_DATA', demo.buttons)
    store.commit('matrix/SET_LOG_DATA', [demo.log.message])
    store.commit('matrix/SET_LIVEVIEW_DATA', demo.liveview)
    store.commit('matrix/SET_MATRIX_SIZE', demo.sysinfo.matrixsize)

    // Конфігурація
    store.commit('config/SET_CONFIG_DATA', demo.config)
    store.commit('config/SET_VERSION', demo.config.version)
    store.commit('config/SET_IS_DEMO_MODE', true)

    // Телеметрія
    store.commit('telemetry/SET_USERMAP_DATA', demo.statistics.userMapData)
    store.commit('telemetry/SET_STATS', demo.statistics)
}
