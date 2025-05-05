<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" app>
            <v-img class="mt-3" max-height="100" src="./assets/logo.png" contain></v-img>
            <NavLinks :items="navLinks" />
        </v-navigation-drawer>

        <v-app-bar app>

            <v-app-bar-nav-icon @click="toggleDrawer" />

            <v-toolbar-title><b>PixelIt</b> - The Matrix Display</v-toolbar-title>

            <v-spacer />

            <v-toolbar-title
                    v-if="!isConnected && !isDemoMode"
                    class="text-center message"
            >
                Reconnecting...
            </v-toolbar-title>

            <div
                    v-if="displayHostname"
                    class="hostname padded"
                    :title="`Hostname: ${displayHostname}`"
            >
                {{ displayHostname }}
            </div>

            <v-icon
                    v-if="isConnected"
                    color="green"
                    class="mx-3 padded"
                    :title="`Connected to ${socketUrl}`"
            >
                mdi-lan-connect
            </v-icon>

            <v-icon
                    v-if="isDemoMode"
                    color="green"
                    class="mx-3 padded"
                    title="Connected to demo data source"
            >
                mdi-lan-connect
            </v-icon>

            <v-icon
                    v-if="!isConnected && !isDemoMode"
                    color="red"
                    class="mx-3 padded"
                    :title="`Disconnected from ${socketUrl}`"
            >
                mdi-lan-disconnect
            </v-icon>

            <LanguageSwitcher class="mx-3" />

            <v-btn icon @click="changeTheme" title="Change theme" class="">
                <v-icon>{{ darkMode ? 'mdi-brightness-4' : 'mdi-brightness-4' }}</v-icon>
            </v-btn>

        </v-app-bar>

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
    import NavLinks from './components/NavLinks.vue'
    import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
    import { useApp }       from '@/composables/useApp'

    const {
        drawer,
        toggleDrawer,
        changeTheme,

        // socket module
        isConnected,
        socketUrl,

        // config module
        isDemoMode,
        darkMode,
        displayHostname,
        navLinks,
        version,
        gitVersion,
        gitDownloadUrl,
        newVersionAvailable,

        // matrix module
        logData,
        sensorData,
        buttonData,

        // telemetry module
        telemetryData
    } = useApp()
</script>

<style>
    /* Сторонні стилі scrollbar */
    ::-webkit-scrollbar {
        width: 20px;
    }

    ::-webkit-scrollbar-track {
        background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #8c8c8c;
        border-radius: 20px;
        border: 6px solid transparent;
        background-clip: content-box;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #a8a8a8;
    }
</style>

<style scoped>
    .container {
        max-width: 100vw;
        padding: 10px;
    }

    .message {
        color: orange;
        font-size: 20px;
    }

    .hostname {
        font-size: 14px;
        text-transform: uppercase;
        padding-right: 15px;
    }

    @media screen and (max-width: 600px) {
        .hostname {
            display: none;
        }
    }
</style>
