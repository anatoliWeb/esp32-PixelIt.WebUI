import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import VueCookies from 'vue-cookies'
import { VueNativeSock } from 'vue-native-websocket-vue3'
import 'leaflet/dist/leaflet.css'
import VueApexCharts from 'vue3-apexcharts'

// Створення додатку
const app = createApp(App)

// Глобальні змінні
const pixelitHost = import.meta.env.VITE_PIXELIT_HOST || location.host
const apiServerBaseURL = import.meta.env.VITE_API_SERVER || 'https://pixelit.bastelbunker.de/api'

app.config.globalProperties.$pixelitHost = pixelitHost
app.config.globalProperties.$apiServerBaseURL = apiServerBaseURL
app.config.globalProperties.$client = 'PixelIt-Webui'

// Використання плагінів
app.use(router)
app.use(store)
app.use(createVuetify())
app.use(VueCookies, { expire: '10y' })
app.component('apexchart', VueApexCharts)

// Підключення WebSocket або DEMO режим
if (location.host.includes('.github.io') || import.meta.env.VITE_DEMO_MODE === 'true') {
    const demoJSON = await import('../public/demoData/demo.json')
    store.commit('SOCKET_ONMESSAGE', demoJSON.default)
    app.config.globalProperties.$demoMode = true
} else {
    app.use(VueNativeSock, `ws://${pixelitHost}:81`, {
        store: store,
        reconnection: true,
        format: 'json',
    })
    app.config.globalProperties.$demoMode = false
}

// Монтування додатку
app.mount('#app')
