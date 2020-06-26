import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import {repositories} from './services/api'
import VueFilterDateFormat from 'vue-filter-date-format';

Vue.prototype.$api = repositories;
Vue.config.productionTip = false;
Vue.use(VueFilterDateFormat);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
