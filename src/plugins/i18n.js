import { createI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import uk from '@/locales/uk.json'
import de from '@/locales/de.json'


const messages = {
    en: { welcome: 'Welcome', /* … інші ключі … */ },
    uk: { welcome: 'Ласкаво просимо', /* … */ },
    de: { welcome: 'Willkommen', /* … */ },
    fr: { welcome: 'Bienvenue', /* … */ },
}

export const i18n = createI18n({
    legacy: false, // якщо ви використовуєте Composition API
    locale: 'uk', // початкова мова
    fallbackLocale: 'en', // підмінна, якщо переклад не знайдено
    messages: { en, uk, de }, // об’єкт із вашими перекладами
})
