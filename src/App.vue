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
                    class="padded"
                    :title="`Connected to ${socketUrl}`"
            >
                mdi-lan-connect
            </v-icon>
            <v-icon
                    v-if="isDemoMode"
                    color="green"
                    class="padded"
                    title="Connected to demo data source"
            >
                mdi-lan-connect
            </v-icon>
            <v-icon
                    v-if="!isConnected && !isDemoMode"
                    color="red"
                    class="padded"
                    :title="`Disconnected from ${socketUrl}`"
            >
                mdi-lan-disconnect
            </v-icon>
            <v-btn icon @click="changeTheme" title="Change theme">
                <v-icon>{{ darkMode ? 'mdi-brightness-4' : 'mdi-brightness-4' }}</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
    import { computed, defineComponent, ref } from 'vue'
    import { useStore } from 'vuex'
    import NavLinks from './components/NavLinks.vue'

    export default defineComponent({
        name: 'App',
        components: { NavLinks },
        setup() {
            const drawer = ref(true)
            const store = useStore()

            const toggleDrawer = () => {
                drawer.value = !drawer.value
            }

            const changeTheme = () => {
                store.commit('config/toggleTheme')
            }

            return {
                drawer,
                toggleDrawer,
                changeTheme,
                // socket module
                isConnected: computed(() => store.state.socket.isConnected),
                socketUrl: computed(() => store.state.socket.url),

                // config module
                isDemoMode: computed(() => store.state.config.isDemoMode),
                darkMode: computed(() => store.state.config.darkMode),
                displayHostname: computed(() => store.state.config.displayHostname),
                navLinks: computed(() => store.state.config.navLinks),
                version: computed(() => store.state.config.version),
                gitVersion: computed(() => store.state.config.gitVersion),
                gitDownloadUrl: computed(() => store.state.config.gitDownloadUrl),
                newVersionAvailable: computed(
                    () => store.state.config.newVersionAvailable
                ),

                // matrix module
                logData: computed(() => store.state.matrix.logData),
                sensorData: computed(() => store.state.matrix.sensorData),
                buttonData: computed(() => store.state.matrix.buttonData),

                // telemetry module
                telemetryData: computed(() => store.state.telemetry.telemetryData)
            }
        }
    })
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
