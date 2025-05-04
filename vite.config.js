// Тоді сервер буде запускатися наприклад на http://localhost:3000/ і одразу відкривати сторінку в браузері.
// https://vitejs.dev/config/
import { defineConfig } from 'vite'
import vue      from '@vitejs/plugin-vue'
import vuetify  from 'vite-plugin-vuetify'
import path     from 'path'

export default defineConfig({
    logLevel: 'debug',   // <-- показуватиме навіть debug-повідомлення

    // ставимо public як «корінь»
    // root: path.resolve(__dirname, 'public'),
    root: '.',            // проектний корінь
    // усі завершені ассети (включно з js/css) будуть відправлятися з кореня дев-сервера
    // base: process.env.NODE_ENV === 'production'
    //     ? 'https://pixelit-project.github.io/PixelIt/webui/'
    //     : '/',
    base: '/',
    // якщо у вас є ще папка public/assets, вкажіть її так,
    // щоб ці файли теж копіювалися
    publicDir: path.resolve(__dirname, 'public'),

    // скажімо, ти хочеш, щоб також піднімалися всі змінні, що починаються з "PIXELIT_"
    envPrefix: ['VITE_', 'VUE_APP_', 'PIXELIT_'],

    build: {
        // виводимо фінальні файли в dist/ поруч з коренем проєкту
        outDir: path.resolve(__dirname, 'dist'),
        rollupOptions: {
            // щоб збірка знала, де лежить ваш index.html
            input: path.resolve(__dirname, 'public/index.html')
        },
        // щоб Rollup під час production-зборки також перепаковував ці модулі
        include: [
            /node_modules/,
            /object-assign/,
            /concaveman/,
            /rbush/,
            /earcut/,
            /geojson-rbush/,
            /geojson-equality/,
            /deep-equal/,
            /density-clustering/,
            /skmeans/,
        ]
    },
    resolve: {
        alias: {
            // «@» тепер вказує на папку src
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [
        vue(),
        vuetify({ autoImport: true }),
    ],
    server: {
        port: 8080,
        open: true,
    },
    optimizeDeps: {
        // include: ['vuetify']
        include: [
            'object-assign',
            'concaveman',
            'rbush',
            'earcut',
            'geojson-rbush',
            'geojson-equality',
            'deep-equal',
            'density-clustering',
            'skmeans',
            'vuetify',
            'vuetify/lib',                            // щоб взяти основні модулі
            '@vuetify/components',
            '@vuetify/directives',
        ]
    },
    ssr: {
        noExternal: [
            'object-assign',
            'concaveman',
            'rbush',
            'earcut',
            'geojson-rbush',
            'geojson-equality',
            'deep-equal',
            'density-clustering',
            'skmeans',
            'vuetify',
            'vuetify/lib',
            '@vuetify/components',
            '@vuetify/directives',
        ]
    }
})
