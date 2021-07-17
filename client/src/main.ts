import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  methods: {
    ...mapActions(["getProviderConfiguration", "getClientToken"])
  },
  computed: {
    ...mapGetters(["clientToken", "providerConfig"])
  },
  async beforeMount() {
    await this.getClientToken();
    await this.getProviderConfiguration();
  },
  render: h => h(App)
}).$mount("#app");
