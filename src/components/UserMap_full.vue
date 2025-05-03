<template>
    <l-map
            :crs="customCrs"
            ref="mapRef"
            :zoom="zoom"
            :center="center"
            :style="mapStyle"
    >
        <l-tile-layer :url="url" :attribution="attribution" />
    </l-map>
</template>

<script setup>
    console.log('UserMap script setup')
    import customCrs from '@/customCrs.js'
    console.log('UserMap отримав customCrs:', customCrs)
    // debugger  // викличе паузу в DevTools, щоб ви могли перевірити змінну
    import { LMap, LTileLayer, LMarker  } from 'vue3-leaflet'

    import { ref, computed, onMounted } from 'vue'
    import L from 'leaflet'
    import 'leaflet/dist/leaflet.css'
    import 'leaflet.markercluster'
    import 'leaflet.markercluster/dist/MarkerCluster.css'
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

    // Fix default icon paths
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    })

    const props = defineProps({
        coords: { type: Array, required: true },
        height: { type: String, required: true },
        mapZoom: { type: Number, default: 2 }
    })

    const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const attribution = '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    const zoom = props.mapZoom
    const center = [51.505, -0.159]
    const mapStyle = computed(() => ({ height: props.height }))

    const mapRef = ref(null)

    onMounted(() => {
        const map = mapRef.value.mapObject  // доступ до обʼєкта карти Leaflet

        // 🧪 DEBUG: перевіряємо CRS
        console.log('[UserMap] map instance:', map)
        console.log('[UserMap] map CRS:', map.options.crs)
        debugger // ← тут зупиниться виконання в DevTools, щоб перевірити вміст вручну

        const markers = L.markerClusterGroup({ maxClusterRadius: 33 })
        props.coords.forEach(latlng => {
            const marker = L.marker(latlng)
            markers.addLayer(marker)
        })
        map.addLayer(markers)
    })
</script>

<style scoped>
    /* Additional styling if needed */
</style>
