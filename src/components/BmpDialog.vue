<template>
    <v-dialog v-model="dialog" width="500">
        <template #activator="{ on, attrs }">
            <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    class="float-left"
                    title="More information"
            >
                <v-icon>mdi-information-outline</v-icon>
            </v-btn>
        </template>

        <v-card>
            <v-card-title>
                <div class="text-center">
                    {{ props.bmp.name }}
                </div>
            </v-card-title>
            <v-divider />

            <v-card-text>
                <BmpCanvas
                        class="float-right"
                        :bmp="props.bmp"
                        height="80"
                        :width="props.bmp.sizeX === 8 ? '80' : '160'"
                />
                <p />
                Icon-ID: {{ props.bmp.id }}<br />
                Added by: {{ props.bmp.username }}<br />
                Added on: {{ props.bmp.dateTime.split('T')[0] }}<br />
                Animated: {{ props.bmp.animated ? 'Yes' : 'No' }}<br />
                <br />
                <v-textarea
                        filled
                        outlined
                        v-model="props.bmp.rgB565Array"
                        readonly
                        rows="8"
                />
            </v-card-text>

            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" text @click="dialog = false">
                    close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref } from 'vue'
    import BmpCanvas from './BmpCanvas.vue'

    const props = defineProps({
        bmp: { type: Object, required: true }
    })

    const dialog = ref(false)
</script>

<style scoped>
    /* додай свої стилі, якщо потрібно */
</style>
