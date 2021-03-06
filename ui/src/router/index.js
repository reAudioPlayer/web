import {
    createRouter,
    createWebHistory
} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue')
    }, {
        path: '/preferences',
        name: 'preferences',
        component: () => import('../views/Preferences.vue')
    }, {
        path: '/collection/playlists',
        name: 'playlists',
        component: () => import('../views/collection/Playlists.vue')
    }, {
        path: '/collection/releases',
        name: 'releases',
        component: () => import('../views/collection/Releases.vue')
    }, {
        path: '/collection/tracks',
        component: () => import("../views/collection/Tracks.vue"),
        meta: {
            title: "Your Library - reAudioPlayer One"
        }
    }, {
        path: '/playlist/:id',
        component: () => import("@/views/Playlist.vue"),
        meta: {
            title: "Playlist - reAudioPlayer One"
        }
    }, {
        path: '/about/privacy',
        component: () => import("@/views/Privacy.vue"),
        meta: {
            title: "Privacy - reAudioPlayer One"
        }
    }]
})

export default router