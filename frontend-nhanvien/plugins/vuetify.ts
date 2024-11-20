// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'
import ToastPlugin from 'vue-toast-notification';
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'


export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
  })
  app.vueApp.use(vuetify)
  app.vueApp.use(ToastPlugin)
})
