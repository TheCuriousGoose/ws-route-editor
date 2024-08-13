import './assets/sass/app.scss'
import 'bootstrap'

import { persistPlugin } from './stores/persistPlugin'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();

pinia.use(persistPlugin);

app.use(router)
app.use(pinia)

app.mount('#app')
