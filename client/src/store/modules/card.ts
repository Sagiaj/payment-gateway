import { ActionTree } from "vuex";
import * as types from "../mutation-types";

const state = {
  card_details: {},
  redirect_url: ""
};

const mutations = {
  [types.GET_CARD_REDIRECT](state: any, param: any) {

  }
};

const actions: ActionTree<any, any> = {
  async performPayment({ commit, dispatch, rootState }, card_details) {
    try {
      rootState
      console.log("carddetails", card_details)
    } catch (err) {
      dispatch("propagateError", err);
    }
  }
};

const getters = {

};

export default {
  mutations,
  actions,
  getters,
  state
}
