import { ref } from 'vue'
import { useStore } from 'vuex'

export function useGitRelease() {
    const store = useStore()
    const loading = ref(false)
    const error = ref(null)

    const fetchGitReleaseData = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await fetch(`${store.state.config.configData.apiServerBaseURL}/releases`)
            const data = await res.json()
            store.commit('config/SET_GIT_RELEASES', data)
            store.commit('config/SET_GIT_VERSION', data[0].version)
            store.commit('config/SET_GIT_DOWNLOAD_URL', data[0].downloadURL)
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    return { loading, error, fetchGitReleaseData }
}
