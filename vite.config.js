// Тоді сервер буде запускатися наприклад на http://localhost:3000/ і одразу відкривати сторінку в браузері.
// https://vitejs.dev/config/
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    base: process.env.NODE_ENV === 'production'
        ? 'https://pixelit-project.github.io/PixelIt/webui/'
        : '/',
    plugins: [vue()],
    server: {
        port: 3000,
        open: true,
    },
    optimizeDeps: {
        include: ['vuetify']
    },
    ssr: {
        noExternal: ['vuetify']
    }
})
