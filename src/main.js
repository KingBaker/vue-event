import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/element-ui'
import '@/utils/console'
import { localtime } from '@/utils/time'

import '@/assets/global.less'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor /* { default global options } */)

Vue.prototype.$localtime = localtime
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
