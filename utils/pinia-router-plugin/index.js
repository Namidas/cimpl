// src/boot/router-plugin.js
import { markRaw } from 'vue'

export default ({ app, router, store }) => {
    store.use(({ store }) => {
        store.router = markRaw(router)
    })
}