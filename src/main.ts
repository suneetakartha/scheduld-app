import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'
import { useAuth } from '@/modules/shared/stores/useAuth'
import '@/styles/styles.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const auth = useAuth()
auth.restoreFromStorage()
auth.bindStorageSync() 

app.mount('#app')