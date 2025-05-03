<template>
    <!-- Діалогове вікно підтвердження -->
    <v-dialog v-model="dialog" persistent max-width="450">

        <!-- Активатор діалогу: кнопка з іконкою -->
        <template #activator="{ props: activatorProps }">
            <v-btn
                    v-bind="activatorProps"
                    :color="color"
                    :disabled="!condition"
            >
                <v-icon start>{{ icon }}</v-icon>
                {{ text }}
            </v-btn>
        </template>

        <!-- Тіло діалогу -->
        <v-card>
            <!-- Заголовок діалогу -->
            <v-card-title class="text-h5">
                {{ title }}
            </v-card-title>

            <!-- Текст діалогу (кожен рядок окремо) -->
            <v-card-text>
                <div
                        v-for="(line, index) in cardText"
                        :key="index"
                >
                    {{ line }}
                </div>
            </v-card-text>

            <!-- Кнопки підтвердження/відміни -->
            <v-card-actions>
                <v-spacer />
                <v-btn
                        color="green"
                        variant="text"
                        @click="handleDisagree"
                >
                    {{ disagreeText }}
                </v-btn>
                <v-btn
                        color="red"
                        variant="text"
                        @click="handleAgree"
                >
                    {{ agreeText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    // Імпортуємо реактивність
    import { ref } from 'vue'

    // Приймаємо властивості, що передаються ззовні
    const props = defineProps({
        condition: { type: Boolean, required: true }, // умова активності кнопки
        text: String, // текст кнопки
        cardText: { type: Array, default: () => [] }, // текст діалогу
        agreeText: String, // текст для кнопки підтвердження
        disagreeText: String, // текст для кнопки відміни
        title: String, // заголовок діалогу
        color: String, // колір кнопки
        onclickAgree: Function, // функція підтвердження
        onclickDisagree: Function, // функція скасування
        icon: String // іконка кнопки
    })

    // Локальна змінна для керування відкриттям діалогу
    const dialog = ref(false)

    // Обробка натискання кнопки "скасувати"
    function handleDisagree() {
        if (props.onclickDisagree) props.onclickDisagree()
        dialog.value = false
    }

    // Обробка натискання кнопки "підтвердити"
    function handleAgree() {
        if (props.onclickAgree) props.onclickAgree()
        dialog.value = false
    }
</script>

<style scoped>
    /* Додайте стилі за потреби */
</style>
