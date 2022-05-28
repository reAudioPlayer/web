import { createApp } from 'vue'
import App from './App.vue'
import { ObserveVisibility } from 'vue-observe-visibility';
import router from './router'

const app = createApp(App)

app.directive("observe-visibility", {
    beforeMount: (el, binding, vnode) => {
        vnode.context = binding.instance
        ObserveVisibility.bind(el, binding, vnode)
    },
    updated: ObserveVisibility.update,
    unmounted: ObserveVisibility.unbind,
})

app.use(router)

app.mount('#app')
