<template>
    <v-dialog v-model="dialog" persistent width="500">
        <!-- ACTIVATOR SLOT -->
        <template #activator="{ props }">
            <v-btn
                    icon
                    v-bind="props"
                    class="float-left"
                    :title="$t('bmpDialog.moreInfo')"
            >
                <v-icon>mdi-information-outline</v-icon>
            </v-btn>
        </template>

        <!-- DIALOG CONTENT -->
        <v-card>
            <v-card-title class="justify-center">
                {{ bmp.name }}
            </v-card-title>
            <v-divider />

            <v-card-text>
                <div class="d-flex">
                    <!-- Preview Canvas -->
                    <BmpCanvas
                            :bmp="bmp"
                            height="80"
                            :width="bmp.sizeX === 8 ? 80 : 160"
                            class="me-4"
                    />

                    <!-- Metadata -->
                    <div>
                        <div><strong>{{$t("bmpDialog.iconId")}}:</strong> {{ bmp.id }}</div>
                        <div><strong>{{$t("bmpDialog.addedBy")}}:</strong> {{ bmp.username }}</div>
                        <div><strong>{{$t("bmpDialog.addedOn")}}:</strong> {{ bmp.dateTime.split('T')[0] }}</div>
                        <div><strong>{{$t("bmpDialog.animated")}}:</strong> {{ bmp.animated ? $t("bmpDialog.yes") : $t("bmpDialog.no")}}</div>
                    </div>
                </div>

                <v-textarea
                        class="mt-4"
                        filled
                        outlined
                        v-model="bmp.rgB565Array"
                        readonly
                        rows="8"
                />
            </v-card-text>

            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" text @click="dialog = false">
                    $t('bmpDialog.close')
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { ref } from 'vue'
    import BmpCanvas from './BmpCanvas.vue'

    // Прямо вичитуємо prop bmp
    const { bmp } = defineProps({
        bmp: { type: Object, required: true }
    })

    const dialog = ref(false)
</script>

<style scoped>
    .float-left {
        float: left;
    }
    .me-4 {
        margin-right: 16px;
    }
</style>
