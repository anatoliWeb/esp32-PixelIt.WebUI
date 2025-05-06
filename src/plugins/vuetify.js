// src/plugins/vuetify.js
// 0) сначала «привяжем» @mdi/js, чтобы iconset мог его найти:
// import '@mdi/js'

// import '@mdi/font/css/materialdesignicons.css'  // якщо потрібно
import '/node_modules/@mdi/font/css/materialdesignicons.css'
import { VSlider } from 'vuetify/components'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

// 1) імпортуємо всі готові компоненти та директиви
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 2) іконки Material Design
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

// 3) локаль (наприклад, українська)
import { uk, en, de } from 'vuetify/locale'

// 4) створюємо кастомні палітри для тем
const lightTheme = {
    dark: false,
    colors: {
        primary: '#1976D2',      // синій
        secondary: '#424242',    // сірий
        accent: '#82B1FF',       // блакитний акцент
        error: '#FF5252',        // червоний
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
    },
}

const darkTheme = {
    dark: true,
    colors: {
        primary: '#90CAF9',
        secondary: '#EEEEEE',
        accent: '#FFAB40',
        error: '#FF5252',
        info: '#29B6F6',
        success: '#66BB6A',
        warning: '#FFA726',
    },
}

// дефолтна мова з env або 'uk'
const defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE || 'uk'
// спроба взяти з localStorage, інакше – дефолт
const savedLocale = localStorage.getItem('locale') || defaultLocale

export default createVuetify({

    components,
    directives,
    VSlider,
    icons: {
        defaultSet: 'mdi',   // використовуємо набір mdi
        aliases,
        // sets: { mdi },
    },

    locale: {
        locale: savedLocale,        // поточна мова
        fallback: 'en',             // якщо переклад відсутній
        messages: { uk, en, de },
    },

    theme: {
        defaultTheme: 'light',
        themes: {
            light: lightTheme,
            dark: darkTheme,
        },
    },

    // 5) Глобальні налаштування дефолтів для компонентів
    defaults: {
        VBtn: {
            elevation: 2,
            rounded: true,
        },
        VTextField: {
            variant: 'outlined',
            density: 'comfortable',
        },
        VSelect: {
            variant: 'outlined',
            density: 'comfortable',
        },
        VCard: {
            elevation: 4,
        },
    },
})
