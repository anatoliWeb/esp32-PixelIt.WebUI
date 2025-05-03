// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home            from '@/views/Home.vue'
import Options         from '@/views/Options.vue'
import SensorsButtons  from '@/views/SensorsButtons.vue'
import TestArea        from '@/views/TestArea.vue'
import Statistics      from '@/views/Statistics.vue'
import Update          from '@/views/Update.vue'
import Gallery         from '@/views/Gallery.vue'
import Creator         from '@/views/Creator.vue'

const routes = [
    { path: '/',               name: 'Home',            component: Home },
    { path: '/options',        name: 'Options',         component: Options },
    { path: '/sensorsbuttons', name: 'Sensors & Buttons', component: SensorsButtons },
    { path: '/testarea',       name: 'TestArea',        component: TestArea },
    { path: '/statistics',     name: 'Statistics',      component: Statistics },
    { path: '/update',         name: 'Update',          component: Update },
    { path: '/gallery',        name: 'Gallery',         component: Gallery },
    { path: '/creator',        name: 'Creator',         component: Creator },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),  // підхоплює base із Vite
    routes,
})

export default router
