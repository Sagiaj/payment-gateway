import Vue from "vue";
import Vuex from "vuex";
import card from "./modules/card";
import auth from "./modules/auth";
import threeDs from "./modules/threeds";
import screens from "./modules/screens";
import transactionData from "./modules/transaction-data";
import popupMessage from "./modules/popup-message";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    card,
    auth,
    threeDs,
    screens,
    transactionData,
    popupMessage
  }
});
