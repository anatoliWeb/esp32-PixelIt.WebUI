import { ref } from 'vue'
import { useStore } from 'vuex'

export function useTelemetry() {
    const store = useStore()
    const sending = ref(false)

    const sendTelemetry = async () => {
        sending.value = true
        try {
            if (store.state.config.configData.sendTelemetry === false) return
            const payload = JSON.parse(store.state.telemetry.telemetryData)
            await fetch(`${store.state.config.configData.apiServerBaseURL}/telemetry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Client': store.state.config.configData.client },
                body: JSON.stringify(payload)
            })
        } catch (e) {
            console.error(e)
        } finally {
            sending.value = false
        }
    }

    return { sending, sendTelemetry }
}
