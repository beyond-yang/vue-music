import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions.js'
import * as getters from './getters.js'
import state from './state.js'
import mutations from './mutations.js'
import createLogger from 'vuex/dist/logger.js'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV = 'production'

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  // strict: debug
  plugins: true ? [createLogger()] : []
})


// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

// export default new Vuex.Store({
//   state: {
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   }
// })
