import apiProvider from "../../providers/api-provider";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import * as types from "../mutation-types";
import { convertToGlobalPayCardFields, GlobalpayProvider as provider, IInitiateAuthenticationResponseDataJSON } from "../../providers/gateway-providers";
import { ProviderActions, ProviderPaymentStatuses, ProviderTexts } from "@/models/provider-actions";
import { ChallengeWindowSize, TransactionStatus, TransactionStatusReason } from "globalpayments-3ds";
import TransactionMessage from "@/models/provider-transaction-message";
import ThreeDSHtmlUtilities from "@/utilities/threeds-html-utilities";

const extractHostname = (url: string) => {
  let hostname;
  let firstPart = '';
  if (url.indexOf("//") > -1) {
      let parts = url.split('/');
      hostname = parts[2];
      firstPart = `${parts[0]}${parts[1]}//`;
  }
  else {
      hostname = url.split('/')[0];
  }

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return `${firstPart}${hostname}`;
}

export type ThreeDSState = {
  currentAction: string;
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
  authenticationData: IInitiateAuthenticationResponseDataJSON,
  finishedTransaction: boolean;
}

const state: ThreeDSState = {
  currentAction: ProviderActions.Submit,
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
  providerName: "globalpay",
  authenticationData: <IInitiateAuthenticationResponseDataJSON>{},
  finishedTransaction: false
};

const mutations: MutationTree<ThreeDSState> = {
  [types.SET_CARD_DATA_MODEL](state, data_model) {
    state.cardData = data_model;
  },
  [types.SET_PROVIDER_CONFIGURATION](state, providerConfig) {
    state.config = providerConfig;
  },
  [types.SET_CURRENT_ACTION](state, action) {
    state.currentAction = action;
  },
  [types.SET_AUTHENTICATION_RESPONSE](state, authenticationData) {
    state.authenticationData = authenticationData;
  },
  [types.SET_FINISHED_TRANSACTION](state, finishedTransaction) {
    state.finishedTransaction = finishedTransaction;
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
  async setCurrentAction({ commit, dispatch }, currentAction: ProviderActions) {
    try {
      await commit(types.SET_CURRENT_ACTION, currentAction);
      return currentAction;
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  },
  async startThreeDSProcess({ commit, dispatch, state, rootGetters, rootState } ) {
    const method_name = `ThreeDS/startThreeDSProcess`;
    try {
      const backend_origin = extractHostname(state.config.webhooks.wh_3ds_method_complete_endpoint);
      await dispatch("setLoadingState", true, { root: true });
      await dispatch("setCurrentAction", ProviderActions.Submit, { root: true });
      const cardFields = convertToGlobalPayCardFields(rootGetters.cardData);
      const transactionData = rootState.transactionData;

      let windowDialogEvent = async () => {
        // Create form + post to acs
        console.log(`${method_name} - submitting threeDSMethodData to ACS's iframe through hidden form [with methodUrl]`);
        await dispatch("setCurrentAction", ProviderActions.NotifyACS, { root: true });
      };

      console.log(`${method_name} - calling GlobalpayProvider/checkVersion`);
      const versionCheckData = await provider.checkVersion(cardFields, windowDialogEvent, backend_origin);

      // init authentication
      console.log(`${method_name} - calling GlobalpayProvider/initAuthentication`);
      await dispatch("setCurrentAction", ProviderActions.InitiateAuthentication, { root: true });
      const authenticationData = await provider.initAuthentication(versionCheckData, cardFields, transactionData);
      await commit(types.SET_AUTHENTICATION_RESPONSE, authenticationData);
      await commit(types.SET_TRANSACTION_ID, authenticationData.transaction_id);
      const challengeMandated = authenticationData && authenticationData.challenge_mandated && authenticationData.challenge_request_url;
      const transactionFinalized = authenticationData && authenticationData.status && provider.paymentTransactionStatusIsTerminal(authenticationData.status);
      // handle challenge if exists
      if (authenticationData && authenticationData.challenge_mandated && authenticationData.challenge_request_url) {
        console.log(`${method_name} - Challenge detected. submitting encoded_creq to ACS's iframe through hidden form [with challenge_request_url]`);
        await dispatch("setCurrentAction", ProviderActions.MandateChallenge, { root: true });
        
        console.log("posting to authentication iframe")
        await dispatch("setIframeDialog", true, { root: true });
        await ThreeDSHtmlUtilities.postToIframe(
          authenticationData.challenge_request_url,
          [{ type: "embedded", name: "creq", value: `${authenticationData.encoded_creq}` }],
          { displayMode: "embedded", windowSize: ChallengeWindowSize.FullScreen, origin: backend_origin, zIndex: 999999999, target: "#iframe-dialog", timeout: 30000 }
        );
      } else if (transactionFinalized) {
        await dispatch("setCurrentAction", ProviderPaymentStatuses.PaymentSuccessful, { root: true });
        const transactionMessage = new TransactionMessage(authenticationData.status, <any>authenticationData.status);
        console.log(`${method_name} - ThreeDS transaction status '${authenticationData.status}' is final. Finishing process with reason '${authenticationData.status}'`);
        await dispatch("setPopupMessage", transactionMessage, { root: true });
      } else {
        console.log(`${method_name} - Unknown status '${authenticationData.status}'. Finishing process with reason '${authenticationData.status}'`);
        await dispatch("setPopupMessage", new TransactionMessage(), { root: true });
      }

      // show success / fail page

      if (!challengeMandated) {
        await dispatch("setLoadingState", false, { root: true });
        await dispatch("setFinishedTransaction", true, { root: false });
      }
      await dispatch("setIframeDialog", false, { root: false });
    } catch (err) {
      await dispatch("setIframeDialog", false, { root: false });
      await dispatch("setLoadingState", false, { root: true });
      await dispatch("setPopupMessage", new TransactionMessage(TransactionStatus.AuthenticationFailed, err.toString()), { root: true });
      console.log("Failed. error=", err);
      // dispatch("propagateError", err, { root: true });
    }
  },
  async acsChallengeCompleted({ commit, dispatch, state, rootGetters, rootState } ) {
    const method_name = `ThreeDS/acsChallengeCompleted`;
    try {
      const threeDSServerTransID = state.authenticationData.server_trans_id;
      console.log(`${method_name} - calling GlobalpayProvider/obtain3DSAuthenticationData with threeDSServerTransID=`, threeDSServerTransID);
      const authenticationData = await provider.obtain3DSAuthenticationData(threeDSServerTransID);
      const authorizationData = await provider.authorize3DSPayment(authenticationData, convertToGlobalPayCardFields(state.cardData), rootState.transactionData);
      console.log(`${method_name} - ThreeDS ACS challenge complete status '${authenticationData.status}'. Finishing process with reason '${authenticationData.status}'`);
      await dispatch("setPopupMessage", new TransactionMessage(authenticationData.status, TransactionStatusReason.MediumConfidence), { root: true });
      await dispatch("setLoadingState", false, { root: true });
      dispatch("setFinishedTransaction", true, { root: false });
      return authorizationData;
    } catch (err) {
      console.log(`${method_name} - failed to complete ACS challenge. error=`, err);
      await dispatch("setIframeDialog", false, { root: false });
      await dispatch("setLoadingState", false, { root: true });
    }
  },
  setFinishedTransaction({ commit, dispatch, state }, finishedTransaction: boolean) {
    try {
      commit(types.SET_FINISHED_TRANSACTION, finishedTransaction);
      return finishedTransaction;
    } catch (err) {
      console.log("ThreeDS/setFinishedTransaction - failed to finish transaction. error=", err);
      dispatch("setIframeDialog", false, { root: false });
      dispatch("setLoadingState", false, { root: true });
    }
  }
};

const getters: GetterTree<ThreeDSState, any> = {
  currentAction(state) {
    return state.currentAction;
  },
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
  },
  authenticationData(state) {
    return state.authenticationData;
  },
  finishedTransaction(state) {
    return state.finishedTransaction;
  }
};


export default {
  mutations,
  actions,
  getters,
  state
}
