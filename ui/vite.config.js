import {
    fileURLToPath,
    URL
} from 'url'

import {
    defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), svgLoader()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src',
                import.meta.url))
        }
    },
    server: {
        proxy: {
            "/user": "http://localhost:3002",
            "/spotify": "http://localhost:3002",
            "/logout": "http://localhost:3002",
            "/login": "http://localhost:3002",
        }
    }
})