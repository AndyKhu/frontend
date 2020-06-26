import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: {
      status: false,
      text: 'test',
      type: 'primary',
      timeout: 1000
    }
  },
  mutations: {
    message (state,value) {
      state.message = value
    }
  },
  actions: {
  },
  modules: {
  }
})
