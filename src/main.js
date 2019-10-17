import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
//import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './bootstrap.css'

import { CoolSelectPlugin } from 'vue-cool-select'
 
// paste the line below only if you need "bootstrap" theme
import '../node_modules/vue-cool-select/dist/themes/bootstrap.css'
Vue.use(CoolSelectPlugin)
Vue.use(BootstrapVue)

new Vue({
  el: '#app',
  render: h => h(App)
})