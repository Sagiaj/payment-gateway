import apiProvider from "../../providers/api-provider";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import * as types from "../mutation-types";
import { GlobalpayProvider as provider } from "../../providers/gateway-providers";

export type ThreeDSState = {
  cardData: {
    cardNumber?: string;
    cardMonth?: string;
    cardYear?: string;
    cardCvv?: string;
    cardName?: string;
    cardNumberNotMask?: string;
  },
  config: {
    merchant_id: string;
    base_url: string;
    visa_3ds_reference_number: string;
    endpoints: {
      threeds_check_version: string;
      init_authentication: string;
    },
    webhooks: {
      wh_3ds_version_check_endpoint: string;
      wh_3ds_method_complete_endpoint: string;
      wh_acs_challenge_complete_endpoint: string;
    }
  };
  providerName: string;
}

const state: ThreeDSState = {
  cardData: {},
  config: {
    merchant_id: "",
    base_url: "",
    visa_3ds_reference_number: "",
    endpoints: {
      threeds_check_version: "",
      init_authentication: ""
    },
    webhooks: {
      wh_3ds_version_check_endpoint: "",
      wh_3ds_method_complete_endpoint: "",
      wh_acs_challenge_complete_endpoint: ""
    }
  },
  providerName: "globalpay"
};

const mutations: MutationTree<ThreeDSState> = {
  [types.SET_CARD_DATA_MODEL](state, data_model) {
    state.cardData = data_model;
  },
  [types.SET_PROVIDER_CONFIGURATION](state, providerConfig) {
    state.config = providerConfig;
  }
};

const actions: ActionTree<ThreeDSState, any> = {
  async getProviderConfiguration({ commit, dispatch, state }) {
    try {
      const providerConfig = await apiProvider.getProviderConfiguration(state.providerName)
      await commit(types.SET_PROVIDER_CONFIGURATION, providerConfig);
      return providerConfig;
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  },
  async initializeCardDataBinding({ commit, dispatch }, cardDataModel: any) {
    try {
      commit(types.SET_CARD_DATA_MODEL, cardDataModel);
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  },
  async startThreeDSProcess({ commit, dispatch, state, rootGetters } ) {
    try {
      console.log("Calling ThreeDSProvider/startThreeDSProcess");
      const provider3DSProcessStartResult = await provider.startThreeDSProcess(rootGetters.cardData);
      console.log("Final 3DS provider result=", provider3DSProcessStartResult)
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  }
};

const getters: GetterTree<ThreeDSState, any> = {
  providerName(state) {
    return state.providerName;
  },
  providerConfig(state) {
    return state.config;
  },
  cardData(state) {
    return state.cardData;
  },
  cardNumber(state) {
    return state.cardData.cardNumber;
  },
  cardMonth(state) {
    return state.cardData.cardMonth;
  },
  cardYear(state) {
    return state.cardData.cardYear;
  },
  cardCvv(state) {
    return state.cardData.cardCvv;
  },
  cardName(state) {
    return state.cardData.cardName;
  }
};


export default {
  mutations,
  actions,
  getters,
  state
}
