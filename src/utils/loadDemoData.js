// import demo from '@/assets/demo.json'
import store from '@/store'

// Динамічно імпортуємо JSON-файл із демо-даними з публічної папки
const demo = await import('../../public/demoData/demo.json')

function convertLiveviewStringToArray(liveviewStr) {
    if (typeof liveviewStr !== 'string') return []
    return liveviewStr.match(/.{6}/g) || []
}

/**
 * Завантаження демо-даних у Store Vuex, що емулює роботу пристрою PixelIt
 */
export function loadDemoData() {

    // 🔌 Емуляція події WebSocket (наприклад, як ніби реальні дані надійшли від пристрою)
    store.commit('socket/SOCKET_ONMESSAGE', demo.default)

    // 🔧 Системна інформація матриці (версія прошивки, IP, памʼять тощо)
    store.commit('matrix/SET_SYSINFO_DATA', demo.sysinfo)

    // 🌡️ Дані з сенсорів (температура, вологість, тиск тощо)
    store.commit('matrix/SET_SENSOR_DATA', demo.sensor)

    // 🔘 Стани кнопок (натиснута чи ні)
    store.commit('matrix/SET_BUTTON_DATA', demo.buttons)

    // 📜 Журнали логів (наприклад: 'HandleScreen: Welcome to the demo view...')
    store.commit('matrix/SET_LOG_DATA', demo.log) // передаємо масив повідомлень

    // 🟪 Піксельне представлення (LiveView) для візуалізації на дисплеї
    store.commit('matrix/SET_LIVEVIEW_DATA', convertLiveviewStringToArray(demo.liveview))

    // 🧱 Розмір матриці (наприклад 8×32)
    store.commit('matrix/SET_MATRIX_SIZE', demo.sysinfo.matrixsize)

    // ⚙️ Загальна конфігурація пристрою (hostname, звук, NTP, MQTT тощо)
    store.commit('config/SET_CONFIG_DATA', demo.config)

    // 🔢 Поточна версія прошивки в демо
    store.commit('config/SET_VERSION', demo.config.version)

    // 🧪 Позначаємо, що ми в режимі демо
    store.commit('config/SET_IS_DEMO_MODE', true)

    // 🌍 Телеметрія: карта користувачів
    store.commit('telemetry/SET_USERMAP_DATA', demo.statistics.userMapData)

    // 📊 Статистика (версії, сенсори, матриці, країни)
    store.commit('telemetry/SET_STATS', demo.statistics)

    // 📊 Статистика (версії, сенсори, матриці, країни)
    store.commit('telemetry/SET_TELEMETRY_DATA', demo.telemetry)

}
