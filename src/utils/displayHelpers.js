/**
 * Додає записи в logData масив у state
 * @param {{ timeStamp: string, function: string, message: string }} obj
 * @param {object} state
 */
export function addToLogData(obj, state) {
    state.logData.unshift(
        `[${obj.timeStamp}] ${obj.function}: ${obj.message}`
    )
    if (state.logData.length > 100) {
        state.logData = state.logData.slice(0, 100)
    }
}

/**
 * Обробляє дані сенсорів і додає/оновлює їх у state.sensorData
 */
export function addToSensorData(obj, state) {
    for (const key in obj) {
        if (key === 'hostname') continue
        const name = getDisplayName(key)
        const value = getDisplayValue(key, obj[key])
        const existing = state.sensorData.find(x => x.name === name)
        if (existing) {
            existing.value = value
        } else {
            state.sensorData.push({ name, value })
        }
    }
}

/**
 * Обробляє дані кнопок і додає/оновлює їх у state.buttonData
 */
export function addToButtonData(obj, state) {
    for (const key in obj) {
        if (key === 'hostname') continue
        const name = getDisplayName(key)
        const value = getDisplayValue(key, obj[key])
        const existing = state.buttonData.find(x => x.name === name)
        if (existing) {
            existing.value = value
        } else {
            state.buttonData.push({ name, value })
        }
    }
}

/**
 * Зберігає конфігурацію у state.configData
 */
export function addToConfigData(obj, state) {
    state.configData = obj
    // оновлюємо тестову область, наприклад яскравість
    state.testarea.brightness = obj.matrixBrightness
}

/**
 * Обробляє системну інформацію та додає/оновлює state.sysInfoData
 */
export function addToSysInfoData(obj, state) {
    for (const key in obj) {
        const name = getDisplayName(key)
        const value = getDisplayValue(key, obj[key])
        const existing = state.sysInfoData.find(x => x.name === name)
        if (existing) {
            existing.value = value
        } else {
            state.sysInfoData.push({ name, value })
        }
        // спеціальні поля
        if (key === 'pixelitVersion') state.version = obj[key]
        if (key === 'matrixsize') state.matrixSize = obj[key]
        if (key === 'hostname') {
            if (state.displayHostname !== obj[key]) {
                state.displayHostname = obj[key]
                document.title = `PixelIt WebUI [${obj[key]}]`
            }
        }
    }
}

/**
 * Зберігає telemetry data у state.telemetryData
 */
export function addToTelemetryData(obj, state) {
    state.telemetryData = JSON.stringify(obj, null, 4)
}

/**
 * Розбиває рядок liveview на частини і зберігає у state.liveviewData
 */
export function addToLiveviewData(str, state) {
    const regex = new RegExp(`.{1,${6}}`, 'g')
    state.liveviewData = str.match(regex)
}

/**
 * Отримує дружню назву для ключа
 */
export function getDisplayName(key) {
    const names = {
        lux: 'Luminance',
        temperature: 'Temperature',
        humidity: 'Humidity',
        gas: 'Gas',
        pressure: 'Pressure',
        pixelitVersion: 'PixelIt Version',
        hostname: 'Hostname',
        deviceID: 'Device-ID',
        note: 'Note',
        sketchSize: 'Sketch size',
        freeSketchSpace: 'Free Sketch Space',
        wifiRSSI: 'Wifi RSSI',
        wifiQuality: 'Wifi quality',
        wifiSSID: 'Wifi SSID',
        wifiBSSID: 'Wifi BSSID',
        ipAddress: 'IP-Address',
        freeHeap: 'Free heap',
        chipID: 'ChipID',
        cpuFreqMHz: 'CPU freq.',
        sleepMode: 'Sleep mode',
        currentMatrixBrightness: 'Current Brightness',
        leftButton: 'Left button',
        middleButton: 'Middle button',
        rightButton: 'Right button',
        uptime: 'Uptime',
        resetReason: 'Reset reason',
        matrixsize: 'Matrix size',
        battery: 'Battery',
        buildSection: 'Build Section'
    }
    return names[key] || key
}

/**
 * Форматує значення для виводу
 */
export function getDisplayValue(key, value) {
    switch (key) {
        case 'lux':
            return typeof value === 'number' ? `${value.toFixed(3)} lux` : value
        case 'note':
            return value.trim() ? value : '---'
        case 'sketchSize':
        case 'freeSketchSpace':
        case 'freeHeap':
            return humanFileSize(value, true)
        case 'wifiRSSI':
            return `${value} dBm`
        case 'wifiQuality':
            return `${value} %`
        case 'cpuFreqMHz':
            return `${value} MHz`
        case 'sleepMode':
            return value ? 'On' : 'Off'
        case 'temperature':
            return typeof value === 'number' ? `${Math.round(value * 10) / 10} °C` : value
        case 'humidity':
            return typeof value === 'number' ? `${Math.round(value)} %` : value
        case 'pressure':
            return typeof value === 'number' ? `${Math.round(value)} hPa` : value
        case 'gas':
            return typeof value === 'number' ? `${Math.round(value)} kOhm` : value
        case 'uptime':
            return formatUptime(value)
        case 'matrixsize':
            return `${value.cols} x ${value.rows} (cols x rows)`
        case 'battery':
            return typeof value === 'number' ? `${value} %` : value
        default:
            return value
    }
}

/**
 * Форматує uptime у d h m s
 */
export function formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24))
    seconds -= days * 3600 * 24
    const hrs = Math.floor(seconds / 3600)
    seconds -= hrs * 3600
    const mnts = Math.floor(seconds / 60)
    seconds -= mnts * 60
    return `${days}d ${hrs}h ${mnts}m ${seconds}s`
}

/**
 * Конвертує байти у людський розмір
 */
export function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024

    if (Math.abs(bytes) < thresh) {
        return `${bytes} B`
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    let u = -1
    const r = 10 ** dp

    do {
        bytes /= thresh
        ++u
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

    return `${bytes.toFixed(dp)} ${units[u]}`
}
