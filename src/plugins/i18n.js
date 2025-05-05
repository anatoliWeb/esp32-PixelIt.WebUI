// src/plugins/i18n.js
import { createI18n } from 'vue-i18n'
import { watch } from 'vue'

import en from '@/locales/en.json'
import uk from '@/locales/uk.json'
import de from '@/locales/de.json'

export function setupI18n(app) {
    // 1) дефолтна мова з env або 'uk'
    const defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE || 'uk'
    // 2) спроба взяти з localStorage, інакше – дефолт
    const savedLocale = localStorage.getItem('locale') || defaultLocale

    // 3) створюємо i18n
    const i18n = createI18n({
        legacy: false,              // Composition API
        locale: savedLocale,        // поточна мова
        fallbackLocale: 'en',       // якщо переклад відсутній
        messages: { en, uk, de },   // ваші JSON-файли
    })

    // 4) реєструємо плагін
    app.use(i18n)

    // 5) слідкуємо за зміною і зберігаємо її
    watch(
        () => i18n.global.locale.value,
        (newLocale) => {
            localStorage.setItem('locale', newLocale)
        }
    )

    return i18n
}
