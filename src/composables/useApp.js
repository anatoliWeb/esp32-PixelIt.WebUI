// src/composables/useApp.js
import { ref, computed } from 'vue'
import { useStore }      from 'vuex'

export function useApp() {
    const drawer = ref(true)
    const store  = useStore()

    const toggleDrawer = () => (drawer.value = !drawer.value)
    const changeTheme  = ()  => store.commit('config/toggleTheme')

    return {
        drawer,
        toggleDrawer,
        changeTheme,
        // socket module
        isConnected: computed(() => store.state.socket.isConnected),
        socketUrl: computed(() => store.state.socket.url),

        // config module
        isDemoMode: computed(() => store.state.config.isDemoMode),
        darkMode: computed(() => store.state.config.darkMode),
        displayHostname: computed(() => store.state.config.displayHostname),
        navLinks: computed(() => store.state.config.navLinks),
        version: computed(() => store.state.config.version),
        gitVersion: computed(() => store.state.config.gitVersion),
        gitDownloadUrl: computed(() => store.state.config.gitDownloadUrl),
        newVersionAvailable: computed(
            () => store.state.config.newVersionAvailable
        ),

        // matrix module
        logData: computed(() => store.state.matrix.logData),
        sensorData: computed(() => store.state.matrix.sensorData),
        buttonData: computed(() => store.state.matrix.buttonData),

        // telemetry module
        telemetryData: computed(() => store.state.telemetry.telemetryData)
    }
}
