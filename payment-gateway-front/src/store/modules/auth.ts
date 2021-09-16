import apiProvider from "../../providers/api-provider";
import { ActionTree } from "vuex";
import * as types from "../mutation-types";

const state = {
  clientToken: {},
  provider_client: null
};

const mutations = {
  [types.SET_CLIENT_TOKEN](state: any, token: any) {
    state.clientToken = token;
  },
  [types.SET_PROVIDER_CLIENT](state: any, provider_client: any) {
    state.provider_client = provider_client;
  },
};

const actions: ActionTree<any, any> = {
  async getClientToken({ commit, dispatch, rootGetters }) {
    try {
      const { providerName } = rootGetters;
      const token = await apiProvider.getClientToken(providerName);
      await commit(types.SET_CLIENT_TOKEN, token);
      apiProvider.addCommonHeaders({ client_token: token });
      return token;
    } catch (err) {
      dispatch("propagateError", err, { root: true });
    }
  },
  async initializeProviderClient({ commit, dispatch }, providerClient: any) {
    try {
      await commit(types.SET_PROVIDER_CLIENT, providerClient);
    } catch (err) {
      dispatch("propagateError", err);
    }
  }
};

const getters = {
  clientToken(state: any) {
    return state.clientToken;
  },
  providerClient(state: any) {
    return state.provider_client;
  }
};


export default {
  mutations,
  actions,
  getters,
  state
}
