import { createApp } from 'vue'
import App from './App.vue'
import { apiClient } from './services/apiClient'

// 全局配置API客户端
window.apiClient = apiClient

const app = createApp(App)
app.mount('#app')