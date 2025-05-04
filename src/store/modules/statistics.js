// src/store/modules/statistics.js
export default {
    namespaced: true,
    state: () => ({
        error: null,
        // інші поля статистики...
    }),
    mutations: {
        SET_ERROR(state, payload) {
            state.error = payload
        },
        // інші mutation...
    },
    actions: {
        fetchStats({ commit }) {
            // приклад запиту
            fetch('/api/stats')
                .then(res => res.json())
                .then(json => { /* обробити */ })
                .catch(err => commit('SET_ERROR', err.message))
        }
    }
}
