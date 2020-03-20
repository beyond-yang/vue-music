import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
fastclick.attach(document.body)

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  loading: require('common/images/default.png')
})

// import Router from 'vue-router'
// const routerPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error=> error)
// }

import 'common/stylus/index.styl'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
