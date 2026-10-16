import '@fontsource/young-serif'
import '@fontsource-variable/atkinson-hyperlegible-next'
import './assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import { Emaille } from './theme'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Emaille,
  },
})

app.mount('#app')
