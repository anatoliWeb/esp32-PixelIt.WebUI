import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export function useStatistics() {
    const store = useStore()
    const route = useRoute()
    const loading = ref(false)
    const error = ref(null)

    const fetchStatistics = async () => {
        loading.value = true
        error.value = null
        try {
            const uuid = route.query.uuid || JSON.parse(store.state.telemetry.telemetryData)?.uuid
            if (!uuid) throw new Error('UUID not available')
            const res = await fetch(`${store.state.config.configData.apiServerBaseURL}/statistics?uuid=${uuid}`)
            const data = await res.json()
            store.commit('telemetry/SET_STATISTICS', data)
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    return { loading, error, fetchStatistics }
}
