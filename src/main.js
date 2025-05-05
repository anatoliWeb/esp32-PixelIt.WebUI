import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import { createVuetify } from 'vuetify'
// import 'vuetify/styles'
import '/node_modules/@mdi/font/css/materialdesignicons.css'
import VueCookies from 'vue-cookies'
import { VueNativeSock } from 'vue-native-websocket-vue3'
import 'leaflet/dist/leaflet.css'
import VueApexCharts from 'vue3-apexcharts'
import { createI18n } from 'vue-i18n'

// Плагіни
import vuetify from '@/plugins/vuetify'
import { i18n } from '@/plugins/i18n'

// Створення додатку
const app = createApp(App)

// Глобальні змінні
const pixelitHost = import.meta.env.VUE_APP_PIXELIT_HOST || location.host
const pixelitSocketHost = import.meta.env.VUE_APP_PIXELIT_SOCKET_HOST || location.host
const apiServerBaseURL = import.meta.env.VUE_APP_API_SERVER || 'https://pixelit.bastelbunker.de/api'

app.config.globalProperties.$pixelitHost = pixelitHost
app.config.globalProperties.$pixelitSocketHost = pixelitSocketHost
app.config.globalProperties.$apiServerBaseURL = apiServerBaseURL
app.config.globalProperties.$client = 'PixelIt-Webui'

// Використання плагінів
app.use(router)
app.use(store)
// app.use(createVuetify())
app.use(VueCookies, { expire: '10y' })
app.component('apexchart', VueApexCharts)
app.use(vuetify)
app.use(i18n)

// Підключення WebSocket або DEMO режим
if (location.host.includes('.github.io') || import.meta.env.VUE_APP_DEMO_MODE === 'true') {
    const demoJSON = await import('../public/demoData/demo.json')
    // store.commit('SOCKET_ONMESSAGE', demoJSON.default)
    store.commit('socket/SOCKET_ONMESSAGE', demoJSON.default)
    // Демо-режим:
    app.config.globalProperties.$demoMode = true
} else {
    app.use(VueNativeSock, `ws://${pixelitHost}:81`, {
        store: store,
        reconnection: true,
        format: 'json',
    })
    app.config.globalProperties.$demoMode = false
}

window.__appStore = store

// Монтування додатку
app.mount('#app')
