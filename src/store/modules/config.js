const state = () => ({
    // старі configData
    configData: {},
    // навігація
    navLinks: [
        { title: 'Dashboard', icon: 'mdi-memory', page: '/' },
        { title: 'Options', icon: 'mdi-tune-vertical', page: '/options' },
        { title: 'Sensors & Buttons', icon: 'mdi-gesture-tap-button', page: '/sensorsbuttons' },
        { title: 'Test Area', icon: 'mdi-cube-outline', page: '/testarea' },
        { title: 'Statistics', icon: 'mdi-chart-bar', page: '/statistics' },
        { title: 'Update & Backup', icon: 'mdi-tray-arrow-up', page: '/update' },
        { separator: true },
        { title: 'Pixel Gallery', icon: 'mdi-image-outline', page: '/gallery' },
        { title: 'Pixel Creator', icon: 'mdi-pencil-box-outline', page: '/creator' },
        { title: 'Forum', icon: 'mdi-forum-outline', url: 'https://github.com/pixelit-project/PixelIt/discussions', target: '_blank' },
        { title: 'Blog', icon: 'mdi-post-outline', url: 'https://www.bastelbunker.de/pixel-it/', target: '_blank' },
        { title: 'Documentation', icon: 'mdi-book-open-page-variant-outline', url: 'https://pixelit-project.github.io/', target: '_blank' },
        { title: 'GitHub', icon: 'mdi-github', url: 'https://github.com/pixelit-project/PixelIt', target: '_blank' }
    ],
    rules: {
        required: value => (!!value && String(value).trim().length > 0) || value == '0' || 'Required.',
        notStartsWithSpace: value => !value.startsWith(' ') || 'Must not start with a space.',
        max20Chars: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid e-mail.';
        },
        min0: value => value >= 0 || 'Must be ≥ 0',
        max255: value => value <= 255 || 'Must be ≤ 255',
        minMinus12: value => value >= -12 || 'Must be ≥ -12',
        max14: value => value <= 14 || 'Must be ≤ 14',
        portRange: value => (value > 0 && value <= 65535) || '1–65535',
        volumeRange: value => (value > 0 && value <= 30) || '1–30',
        noDecimals: value => value % 1 === 0 || 'No decimals allowed'
    },
    matrixTypes: [
        { text: 'Type 1 - Column major', value: 1 },
        { text: 'Type 2 - Row major', value: 2 },
        { text: 'Type 3 - Tiled 4×8 CJMCU (Column major)', value: 3 },
        { text: 'Type 5 - Tiled 4×8 CJMCU (Row major)', value: 5 },
        { text: 'Type 4 - MicroMatrix ᵇʸ ᶠᵒᵒʳˢᶜʰᵗᵇᴀʀ', value: 4 }
    ],
    matrixCorrection: [
        { text: 'Default', value: 'default' },
        { text: 'Typical SMD 5050', value: 'typicalsmd5050' },
        { text: 'Typical 8mm Pixel', value: 'typical8mmpixel' },
        { text: 'Tungsten 40W', value: 'tungsten40w' },
        { text: 'Tungsten 100W', value: 'tungsten100w' },
        { text: 'Halogen', value: 'halogen' },
        { text: 'Carbon Arc', value: 'carbonarc' },
        { text: 'High Noon Sun', value: 'highnoonsun' },
        { text: 'Direct Sunlight', value: 'directsunlight' },
        { text: 'Overcast Sky', value: 'overcastsky' },
        { text: 'Clear Blue Sky', value: 'clearbluesky' },
        { text: 'Warm Fluorescent', value: 'warmfluorescent' },
        { text: 'Standard Fluorescent', value: 'standardfluorescent' },
        { text: 'Cool White Fluorescent', value: 'coolwhitefluorescent' },
        { text: 'Full Spectrum Fluorescent', value: 'fullspectrumfluorescent' },
        { text: 'Grow Light Fluorescent', value: 'growlightfluorescent' },
        { text: 'Black Light Fluorescent', value: 'blacklightfluorescent' },
        { text: 'Mercury Vapor', value: 'mercuryvapor' },
        { text: 'Sodium Vapor', value: 'sodiumvapor' },
        { text: 'Metal Halide', value: 'metalhalide' },
        { text: 'High Pressure Sodium', value: 'highpressuresodium' }
    ],
    autoFallbackAnimation: [
        { text: 'None', value: 0 },
        { text: 'Fade', value: 1 },
        { text: 'Colored Bar Wipe', value: 2 },
        { text: 'ZigZag Wipe', value: 3 },
        { text: 'Random Wipe', value: 4 }
    ],
    temperatureUnits: [
        { text: 'Celsius °C', value: 0 },
        { text: 'Fahrenheit °F', value: 1 }
    ],
    ldrDevices: [
        { text: 'GL5516', value: 'GL5516' }, { text: 'GL5528', value: 'GL5528' },
        { text: 'GL5537_1', value: 'GL5537_1' }, { text: 'GL5537_2', value: 'GL5537_2' },
        { text: 'GL5539', value: 'GL5539' }, { text: 'GL5549', value: 'GL5549' }
    ],
    /**
     * Зірочкою відмічено D0, D3, D4 та D8 — підключення до них може завадити нормальному старту модуля.
     * D9/D10 — апаратний UART (RX0/TX0).
     * A0 — єдиний аналоговий вхід (ADC0).
     */
    pinsESP8266: [
        { text: '*Pin D0 (GPIO16)', value: 'Pin_D0' },
        { text: 'Pin D1 (GPIO5)',   value: 'Pin_D1' },
        { text: 'Pin D2 (GPIO4)',   value: 'Pin_D2' },
        { text: '*Pin D3 (GPIO0)',  value: 'Pin_D3' },
        { text: '*Pin D4 (GPIO2)',  value: 'Pin_D4' },
        { text: 'Pin D5 (GPIO14)',  value: 'Pin_D5' },
        { text: 'Pin D6 (GPIO12)',  value: 'Pin_D6' },
        { text: 'Pin D7 (GPIO13)',  value: 'Pin_D7' },
        { text: '*Pin D8 (GPIO15)', value: 'Pin_D8' },
        { text: 'Pin D9 / RX0 (GPIO3)',  value: 'Pin_D9' },
        { text: 'Pin D10 / TX0 (GPIO1)', value: 'Pin_D10' },
        { text: 'Analog A0 (ADC0)',      value: 'Pin_A0' }
    ],
    /**
     * Зірочкою відмічені ключові strapping pins (GPIO0, GPIO2, GPIO4, GPIO5, GPIO12), підключення до яких на старті може порушити нормальний режим завантаження.
     * GPIO6–GPIO11 зарезервовані для внутрішнього SPI-флеш, їх не слід використовувати.
     * GPIO34–GPIO39 — тільки для входу (input).
     */
    pinsESP32: [
        { text: '*GPIO0 (BOOT0)',     value: 'GPIO0' },
        { text: 'GPIO1 (TX0)',        value: 'GPIO1' },
        { text: 'GPIO2*',             value: 'GPIO2' },
        { text: 'GPIO3 (RX0)',        value: 'GPIO3' },
        { text: '*GPIO4',             value: 'GPIO4' },
        { text: '*GPIO5',             value: 'GPIO5' },
        // GPIO6–GPIO11 зарезервовані для флеш-пам’яті, не використовуються
        { text: '*GPIO12 (MTDI)',     value: 'GPIO12' },
        { text: 'GPIO13 (MTCK)',      value: 'GPIO13' },
        { text: 'GPIO14 (MTMS)',      value: 'GPIO14' },
        { text: 'GPIO15 (MTDO)',      value: 'GPIO15' },
        { text: 'GPIO16',             value: 'GPIO16' },
        { text: 'GPIO17',             value: 'GPIO17' },
        { text: 'GPIO18',             value: 'GPIO18' },
        { text: 'GPIO19',             value: 'GPIO19' },
        { text: 'GPIO21',             value: 'GPIO21' },
        { text: 'GPIO22',             value: 'GPIO22' },
        { text: 'GPIO23',             value: 'GPIO23' },
        { text: 'GPIO25',             value: 'GPIO25' },
        { text: 'GPIO26',             value: 'GPIO26' },
        { text: 'GPIO27',             value: 'GPIO27' },
        { text: 'GPIO32 (ADC1_CH4)',  value: 'GPIO32' },
        { text: 'GPIO33 (ADC1_CH5)',  value: 'GPIO33' },
        { text: 'GPIO34 (ADC1_CH6)',  value: 'GPIO34' },
        { text: 'GPIO35 (ADC1_CH7)',  value: 'GPIO35' },
        { text: 'GPIO36 (ADC1_CH0)',  value: 'GPIO36' },
        { text: 'GPIO39 (ADC1_CH3)',  value: 'GPIO39' }
    ],
    btnLowHigh: [
        { text: 'Active low', value: 0 }, { text: 'Active high', value: 1 }
    ],
    btnActions: [
        { text: 'None (only send to MQTT and API)', value: 0 },
        { text: 'Go to Clock', value: 1 }, { text: 'Toggle Sleep Mode', value: 2 },
        { text: 'MP3: Toggle Play/Pause', value: 3 },
        { text: 'MP3: Previous track', value: 4 }, { text: 'MP3: Next track', value: 5 }
    ],
    gitVersion: '',
    version: '',
    gitDownloadUrl: '',
    gitReleases: [],
    newVersionAvailable: false,
    displayHostname: '',
    darkMode: true
})

const mutations = {
    SET_CONFIG_DATA(state, config) {
        state.configData = config
    },
    SET_GIT_VERSION(state, version) {
        state.gitVersion = version
    },
    SET_VERSION(state, version) {
        state.version = version
    },
    SET_GIT_DOWNLOAD_URL(state, url) {
        state.gitDownloadUrl = url
    },
    SET_GIT_RELEASES(state, releases) {
        state.gitReleases = releases
    },
    SET_NEW_VERSION_AVAILABLE(state, status) {
        state.newVersionAvailable = status
    },
    SET_DISPLAY_HOSTNAME(state, hostname) {
        state.displayHostname = hostname
    },
    toggleTheme(state) {
        state.darkMode = !state.darkMode
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
