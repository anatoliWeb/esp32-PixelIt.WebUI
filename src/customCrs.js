// src/customCrs.js
console.log('[customCrs.js] починаємо завантаження')
debugger
// 1) Імпортуємо «default» з proj4
import proj4 from 'proj4'

// 2) Імпортуємо Leaflet
import L from 'leaflet'

// 3) Статично під’єднуємо proj4leaflet (синхронно!)
import 'proj4leaflet'

// 4) Реєструємо наш UTM-33 CRS
proj4.defs(
    'EPSG:32633',
    '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
)

// 5) Створюємо і експортуємо CRS
const customCrs = new L.Proj.CRS(
    'EPSG:32633',
    proj4.defs('EPSG:32633'),
    {
        origin:      [0, 0],
        resolutions: [8192,4096,2048,1024,512,256,128,64,32,16,8,4,2,1]
    }
)


console.log('[customCrs] loaded →', customCrs)
export default customCrs
