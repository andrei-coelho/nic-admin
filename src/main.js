import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import request from './plugins/request'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(request, {
    production:false,
    url_production: 'http://',
    url_development: 'http://localhost:8800/',
    session_name: 'nic_user_admin_sess',
    session: 'session-augusto'
  })
  .mount('#app')