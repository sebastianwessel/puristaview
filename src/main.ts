import './assets/main.css'
import './assets/navigation.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { logger } from './logger'
import router from './router'

const app = createApp(App)

app.config.errorHandler = (err) => {
  logger.error({ err })
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
