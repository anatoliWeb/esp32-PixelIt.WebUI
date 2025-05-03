<template>
    <!-- Кнопка з кольором, іконкою та текстом -->
    <v-btn
            :color="props.color"
            elevation="4"
            @click="handleClick"
            :disabled="!props.condition"
    >
    <v-icon left>{{ props.icon }}</v-icon>
    {{ props.text }}
    </v-btn>
</template>

<script setup>
    // Приймаємо пропси з типами та дефолтними значеннями
    const props = defineProps({
        // Умова, яка керує активністю кнопки. Значення за замовчуванням: false
        condition: { type: Boolean, default: false },

        // Текст, який буде показано на кнопці
        text: { type: String, required: true },

        // Колір кнопки (наприклад, 'primary', 'success')
        color: { type: String, default: 'primary' },

        // Обробник натискання (не обовʼязковий)
        onclick: { type: Function },

        // Назва іконки з mdi (наприклад, 'mdi-check')
        icon: { type: String, default: 'mdi-check' }
    })

    // Викликається при натисканні на кнопку
    function handleClick() {
        // Якщо функція передана — викликаємо
        props.onclick && props.onclick()
    }
</script>
