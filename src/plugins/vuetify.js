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
    colors: {
        background: '#ffffff',         // Фон сторінки
        surface: '#f5f5f5',            // Поверхні: картки, меню тощо
        primary: '#1976D2',            // Основний колір (кнопки, акценти)
        secondary: '#424242',          // Вторинний колір (менш важливі елементи)
        accent: '#82B1FF',             // Акцентний колір
        error: '#FF5252',              // Колір помилки
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
    },
    variables: {
        'font-size-root': '18px',      // 🔠 Глобальний базовий розмір шрифту для всієї теми
        // Змінює масштаб усіх текстів у компонентах Vuetify
    }
}

const darkTheme = {
    colors: {
        background: '#121212',
        primary: '#90CAF9',
        secondary: '#EEEEEE',
        accent: '#FFAB40',
        error: '#FF5252',
        info: '#29B6F6',
        success: '#66BB6A',
        warning: '#FFA726',
    },
    variables: {
        'font-size-root': '16px' // більший базовий шрифт
    }
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
        defaultTheme: 'dark',
        themes: {
            light: lightTheme,
            dark: darkTheme,
        },
    },

    // 5) Глобальні налаштування дефолтів для компонентів
    defaults: {
        VListItemTitle: {
            style: 'font-size: 1.1rem;'  // Збільшений розмір шрифту
        },
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
        VSwitch: {
            color: 'primary'
        },
        VCheckbox: {
            color: 'primary'
        }
    },
})
