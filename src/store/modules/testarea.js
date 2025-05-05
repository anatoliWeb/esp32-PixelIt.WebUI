// src/store/modules/testarea.js
export default {
    namespaced: true,
    state: () => ({
        brightness: 0,
        json: JSON.stringify(
            {
                text: {
                    textString: 'PixelIt 😀',
                    scrollText: 'auto',
                    bigFont: false,
                    centerText: false,
                    scrollTextDelay: 40,
                    hexColor: '#FFFFFF',
                    position: { x: 0, y: 1 }
                }
            },
            null,
            4
        ),
        text: '€ ← ↑ → ↓ ★ 📁 📄 ♥ ↧ 🚗 😀',
        // image: '[33808,0,…]' // вставте сюди ваш дефолтний масив
        image: [] // вставте сюди ваш дефолтний масив
    }),
    mutations: {
        SET_JSON(state, payload) {
            state.json = payload
        },
        SET_TEXT(state, payload) {
            state.text = payload
        },
        SET_IMAGE(state, payload) {
            state.image = payload
        },
        SET_BRIGHTNESS(state, payload) {
            state.brightness = payload
        }
    }
}
