// src/store/modules/bmps.js
const state = () => ({
    list: []
})

const mutations = {
    setBMPs(state, bmps) {
        state.list = bmps
    }
}

const getters = {
    allBMPs: state => state.list
}

export default {
    namespaced: true,
    state,
    mutations,
    getters
}
