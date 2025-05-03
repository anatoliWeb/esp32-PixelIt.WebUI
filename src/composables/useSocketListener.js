import { onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'

export function useSocketListener(socket) {
    const store = useStore()

    const onMessage = event => {
        const message = JSON.parse(event.data)
        store.commit('socket/SOCKET_ONMESSAGE', message)
    }

    socket.addEventListener('message', onMessage)
    onBeforeUnmount(() => socket.removeEventListener('message', onMessage))
}
