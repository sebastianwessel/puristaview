import './assets/main.css'
import './assets/navigation.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@vue-flow/minimap/dist/style.css'
import '@vue-flow/controls/dist/style.css'
import 'splitpanes/dist/splitpanes.css'

import * as Sentry from '@sentry/vue'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { logger } from './logger'
import router from './router'

const app = createApp(App)

/*
app.config.errorHandler = (err) => {
  logger.error({ err })
}


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
*/

Sentry.init({
  app,
  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', /^https:\/\/voyage\.purista\.dev\/api/],
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
    new Sentry.Replay(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

app.use(createPinia())
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
