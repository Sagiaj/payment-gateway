import Vue from "vue";
import Vuex from "vuex";
import card from "./modules/card";
import auth from "./modules/auth";
import threeDs from "./modules/threeds";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    card,
    auth,
    threeDs
  }
});
