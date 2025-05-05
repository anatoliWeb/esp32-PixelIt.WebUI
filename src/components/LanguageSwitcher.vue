<!-- src/components/LanguageSwitcher.vue -->
<template v-if="enableSwitcher">
    <v-menu
            v-model="menu"
            offset-y
            max-width="200"
    >
        <!-- Activator: кнопка з поточною мовою -->
        <template #activator="{ props }">
            <v-btn
                    v-bind="props"
                    icon
                    class="language-btn"
                    :title="currentLabel"
            >
                <!-- Прапор -->
                <template v-if="isFlagMode">
                    <img
                            :src="getFlagUrl(currentLocale)"
                            class="flag-img"
                            :alt="currentLabel"
                    />
                </template>
                <!-- Код мови (UK, EN, DE) -->
                <template v-else-if="isCodeMode">
                    <span class="code-text">{{ currentLocale.toUpperCase() }}</span>
                </template>
                <!-- Повний текст -->
                <template v-else>
                    <span>{{ currentLabel }}</span>
                </template>
            </v-btn>
        </template>

        <!-- Список мов -->
        <v-list dense>
            <v-list-item
                    v-for="item in locales"
                    :key="item.value"
                    @click="select(item.value)"
                    clickable
            >
                <div class="d-flex align-center">
                    <template v-if="isFlagMode">
                        <img
                                :src="getFlagUrl(item.value)"
                                class="flag-img me-2"
                                :alt="item.label"
                        />
                    </template>
                    <template v-else-if="isCodeMode">
                        <span class="code-text me-2">{{ item.value.toUpperCase() }}</span>
                    </template>
                    <span>{{ item.label }}</span>
                </div>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useI18n } from 'vue-i18n'

    // стан меню
    const menu = ref(false)

    // i18n
    const { locale, availableLocales } = useI18n()

    // налаштування з .env
    const enableSwitcher = import.meta.env.VITE_ENABLE_LANG_SWITCHER === 'true'
    const defaultLocale  = import.meta.env.VITE_DEFAULT_LOCALE || locale.value
    const displayMode    = import.meta.env.VITE_LANG_DISPLAY_MODE || 'flags' // 'flags' | 'code' | 'text'

    const isFlagMode = displayMode === 'flags'
    const isCodeMode = displayMode === 'code'
    // якщо ні flags ні code — показуємо текст

    // при монтуванні встановимо мову за замовчуванням, якщо поточна не з доступних
    onMounted(() => {
        const raw = Array.isArray(availableLocales)
            ? availableLocales
            : Array.isArray(availableLocales.value)
                ? availableLocales.value
                : []
        if (!raw.includes(locale.value) && raw.includes(defaultLocale)) {
            locale.value = defaultLocale
        }
    })

    // масив кодів мов
    const rawLocales = computed(() => Array.isArray(availableLocales)
        ? availableLocales
        : Array.isArray(availableLocales.value)
            ? availableLocales.value
            : []
    )

    // будуємо список { value, label, flagFile }
    const locales = computed(() =>
        rawLocales.value.map(code => {
            let label, file
            switch (code) {
                case 'uk':
                    label = 'Українська';   file = 'uk.svg'; break
                case 'en':
                    label = 'English';      file = 'en.svg'; break
                case 'de':
                    label = 'Deutsch';      file = 'de.svg'; break

                // додавайте інші мови за потреби
                default:
                    label = code.toUpperCase()
                    file  = `${code}.svg`
            }
            return { value: code, label, flagFile: file }
        })
    )

    // поточна мова
    const currentLocale = computed(() => locale.value)

    // підпис поточної
    const currentLabel = computed(() => {
        const found = locales.value.find(i => i.value === locale.value)
        return found ? found.label : locale.value
    })

    // зміна мови з меню
    function select(val) {
        locale.value = val
        menu.value   = false
    }

    // URL до SVG прапора (із public/flags)
    function getFlagUrl(code) {
        return `/flags/${code}.svg`
    }
</script>

<style scoped>
    .language-btn {
        min-width: 0;
        padding: 0;
    }
    .flag-img {
        width: 1.4rem;
        height: auto;
        vertical-align: middle;
        display: inline-block;
    }
    .code-text {
        font-weight: bold;
    }
    .me-2 {
        margin-right: 0.5rem;
    }
    /* обмежуємо ширину меню */
    .v-menu__content {
        max-width: 200px;
    }
</style>
