import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'
import { useAuth } from '@/modules/shared/stores/useAuth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

useAuth().restoreFromStorage()

app.use(router)
app.mount('#app')
