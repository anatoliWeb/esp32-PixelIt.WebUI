<template>
    <v-container class="Update">
        <v-row>
            <v-col cols="12" lg="8">
                <!-- Firmware & Filesystem -->
                <v-row>
                    <v-col cols="12" lg="6">
                        <v-card class="pa-2" elevation="4">
                            <v-card-title><h2>{{ $t('update.firmware') }}</h2></v-card-title>
                            <hr />
                            <br />
                            <div class="text-center">
                                <v-file-input
                                        v-model="firmwareFile"
                                        prepend-icon="mdi-file-powerpoint-outline"
                                        show-size
                                        filled
                                        accept=".bin"
                                        :label="$t('update.selectFirmware')"
                                        dense
                                />
                                <ButtonCondition
                                        color="success"
                                        :condition="sockedIsConnected && inputFWCheck"
                                        :text="$t('update.updateFirmware')"
                                        icon="mdi-file-upload"
                                        :onclick="uploadFirmware"
                                />
                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="12" lg="6">
                        <v-card class="pa-2" elevation="4">
                            <v-card-title><h2>{{ $t('update.filesystem') }}</h2></v-card-title>
                            <hr />
                            <br />
                            <div class="text-center">
                                <v-file-input
                                        v-model="filesystemFile"
                                        prepend-icon="mdi-file-powerpoint-outline"
                                        show-size
                                        filled
                                        accept=".bin"
                                        :label="$t('update.selectFilesystem')"
                                        dense
                                />
                                <ButtonCondition
                                        color="success"
                                        :condition="sockedIsConnected && inputFSCheck"
                                        :text="$t('update.updateFilesystem')"
                                        icon="mdi-file-upload"
                                        :onclick="uploadFilesystem"
                                />
                            </div>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Config backup & restore -->
                <v-row>
                    <v-col cols="12">
                        <v-card class="pa-0" elevation="4">
                            <v-card-text class="text-md-center">
                                <h2>{{ $t('update.configBackupRestore') }}</h2>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-card class="pa-2" elevation="4">
                            <v-card-title><h2>{{ $t('update.configTitle') }}</h2></v-card-title>
                            <hr />
                            <br />
                            <div class="text-center">
                                <v-file-input
                                        v-model="configFile"
                                        prepend-icon="mdi-file-table-outline"
                                        show-size
                                        filled
                                        accept=".json"
                                        :label="$t('update.selectConfig')"
                                        dense
                                />
                                <ButtonCondition
                                        color="warning"
                                        :condition="sockedIsConnected && inputConfigCheck"
                                        :text="$t('update.restore')"
                                        icon="mdi-file-upload"
                                        :onclick="uploadConfigWithWarnings"
                                />
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <ButtonCondition
                                        color="success"
                                        :condition="sockedIsConnected"
                                        :text="$t('update.backup')"
                                        icon="mdi-file-download"
                                        :onclick="downloadConfig"
                                />
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>

            <!-- Download Stats -->
            <v-col cols="12" lg="4">
                <v-card class="pa-2" elevation="4">
                    <v-card-title><h2>{{ $t('update.downloadStats') }}</h2></v-card-title>
                    <hr />
                    <DownloadStats :items="gitReleases" />
                </v-card>
            </v-col>
        </v-row>

        <!-- Restore Warnings Dialog -->
        <v-dialog v-model="popupIsActive" max-width="500">
            <v-card>
                <v-card-title class="headline orange--text">
                    {{ $t('update.warningTitle') }}
                </v-card-title>
                <v-card-text>
                    <div v-for="warning in restoreWarnings" :key="warning">
                        {{ warning }}
                    </div>
                    <br />
                    {{ $t('update.warningMessage') }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="orange" text @click="uploadConfigWithWarnings">
                        {{ $t('update.ignoreAndRestore') }}
                    </v-btn>
                    <v-btn color="green" text @click="popupIsActive = false">
                        {{ $t('update.cancel') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
    import { ref, computed, getCurrentInstance } from 'vue'
    import { useStore } from 'vuex'
    import DownloadStats from '@/components/DownloadStats.vue'
    import ButtonCondition from '@/components/ButtonCondition.vue'

    const store = useStore()
    const { appContext } = getCurrentInstance()
    const $socket = appContext.config.globalProperties.$socket
    const $pixelitHost = appContext.config.globalProperties.$pixelitHost

    // Reactive state
    const firmwareFile = ref(null)
    const filesystemFile = ref(null)
    const configFile = ref(null)
    let popupIsActive = ref(false)
    const ignoreRestoreWarnings = ref(false)
    const restoreWarnings = ref([])

    // Computed
    const sockedIsConnected = computed(() => store.state.socket.isConnected)
    const gitReleases = computed(() => store.state.gitReleases)
    const inputFWCheck = computed(() => !!firmwareFile.value)
    const inputFSCheck = computed(() => !!filesystemFile.value)
    const inputConfigCheck = computed(() => !!configFile.value)

    // Methods
    async function uploadFirmware() {
        if (!firmwareFile.value) return
        const formData = new FormData()
        formData.append('firmware', firmwareFile.value)
        firmwareFile.value = null
        $socket.close()
        if (!$pixelitHost) {
            alert('No PixelIt Host defined!')
        } else {
            await fetch(`http://${$pixelitHost}/update`, { method: 'POST', body: formData })
        }
    }

    async function uploadFilesystem() {
        if (!filesystemFile.value) return
        const formData = new FormData()
        formData.append('filesystem', filesystemFile.value)
        filesystemFile.value = null
        $socket.close()
        if (!$pixelitHost) {
            alert('No PixelIt Host defined!')
        } else {
            await fetch(`http://${$pixelitHost}/update`, { method: 'POST', body: formData })
        }
    }

    function uploadConfigWithWarnings() {
        popupIsActive.value = false
        ignoreRestoreWarnings.value = true
        uploadConfig()
    }

    function uploadConfig() {
        const reader = new FileReader()
        reader.onload = e => {
            const cfg = JSON.parse(e.target.result)
            delete cfg.version
            delete cfg.isESP8266
            $socket.sendObj({ setConfig: cfg })
            setTimeout(() => $socket.close(), 3000)
        }

        // Determine warnings
        const version = store.state.version
        const buildSection = JSON.parse(store.state.telemetryData).buildSection
        const [_, fileVersion = '', ...buildParts] =
            (configFile.value.name || '')
                .replace(/\(\d+\)/g, '()')
                .replace(/[\s()]+/g, '')
                .replace('.json', '')
                .split('_')
        const fileBuildSection = buildParts.join('_')

        if (!ignoreRestoreWarnings.value) {
            restoreWarnings.value = []
            if (!fileVersion) {
                restoreWarnings.value.push("It could not be determined with which firmware version this backup was created.")
            } else if (version != fileVersion) {
                restoreWarnings.value.push("Backup firmware version does not match the version of this PixelIt!")
                restoreWarnings.value.push(`Backup: ${fileVersion} <--> PixelIt: ${version}`)
            }
            if (!fileBuildSection) {
                restoreWarnings.value.push("It could not be determined with which hardware version this backup was created.")
            } else if (buildSection != fileBuildSection) {
                restoreWarnings.value.push("Backup hardware version does not match the version of this PixelIt!")
                restoreWarnings.value.push(`Backup: ${fileBuildSection} <--> PixelIt: ${buildSection}`)
            }
            if (restoreWarnings.value.length) {
                restoreWarnings.value.push('---')
                popupIsActive.value = true
                return
            }
        }
        ignoreRestoreWarnings.value = false
        reader.readAsText(configFile.value)
    }

    async function downloadConfig() {
        try {
            const jsonData = JSON.stringify(store.state.configData)
            const blob = new Blob([jsonData], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            const version = store.state.version
            const buildSection = JSON.parse(store.state.telemetryData).buildSection
            link.href = url
            link.download = `pixlitConfig_${version}_${buildSection}.json`
            link.click()
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('downloadConfig error', error)
        }
    }
</script>
