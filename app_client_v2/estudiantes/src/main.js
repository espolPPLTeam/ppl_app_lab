import Vue from 'vue'
import Vuetify from 'vuetify'
import moment from 'moment'
import VeeValidate from 'vee-validate'
import VueSocketio from 'vue-socket.io'
import Viewer from 'v-viewer'
import 'vuetify/dist/vuetify.min.css'
import 'vue-material-design-icons/styles.css'
import App from './App'
import router from '@/router'
import { store } from '@/store'

let url = process.env.NODE_ENV === 'production' ? '/tomando_leccion' : 'http://localhost:8000/tomando_leccion'

Vue.use(Vuetify)
Vue.use(VueSocketio, url, store)
Vue.use(VeeValidate)
Vue.use(Viewer)

Vue.config.productionTip = false

Vue.filter('fechaFormato', (value) => {
  if (value) {
    return `${moment(value).locale('es').format('dddd DD MMMM YYYY, HH:mm')}`
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  sockets: {
    connect () {
      store.commit('SET_SOCKET', this.$socket)
    },
    disconnect () {
    }
  },
  template: '<App/>'
})
