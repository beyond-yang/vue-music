import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import 'common/stylus/index.styl'


import VConsole from 'vconsole'
// init vConsole
/* eslint-disable no-unused-vars */
var vConsole = new VConsole();
console.log('test')

fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('common/images/default.png')
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')