import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import VueKonva from 'vue-konva'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueKonva)

app.mount('#app')
