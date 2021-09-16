import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { mapActions, mapGetters } from 'vuex'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  methods: {
    ...mapActions(["getProviderConfiguration", "getClientToken"])
  },
  computed: {
    ...mapGetters(["clientToken", "providerConfig"])
  },
  async beforeMount() {
    // await this.getClientToken();
    await this.getProviderConfiguration();
  },
  render: h => h(App)
}).$mount("#app");
