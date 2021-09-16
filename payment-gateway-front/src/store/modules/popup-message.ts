import TransactionMessage from "@/models/provider-transaction-message";
import { ActionTree } from "vuex";
import * as types from "../mutation-types";

type PopupMessageState = {
  popup_message: string | null,
  popup_message_type: string | null
};

const state: PopupMessageState = {
  popup_message: null,
  popup_message_type: null
};

const mutations = {
  [types.SET_POPUP_MESSAGE](state: PopupMessageState, message: any) {
    state.popup_message = message;
  },
  [types.SET_POPUP_MESSAGE_TYPE](state: PopupMessageState, popup_message_type: any) {
    state.popup_message_type = popup_message_type;
  },
};

const actions: ActionTree<any, any> = {
  async setPopupMessage({ commit, dispatch }, popupMessage: TransactionMessage) {
    try {
      console.log("Vuex/setPopupMessage", popupMessage);
      await commit(types.SET_POPUP_MESSAGE, popupMessage.message_text);
      await commit(types.SET_POPUP_MESSAGE_TYPE, popupMessage.message_type);
      await dispatch("setPopupMessageType", popupMessage.message_type);
      return popupMessage;
    } catch (err) {
      dispatch("propagateError", err, { root: true });
    }
  },
  async setPopupMessageType({ commit, dispatch }, messageType: any) {
    try {
      console.log("Vuex/setPopupMessageType", messageType);
      await commit(types.SET_POPUP_MESSAGE_TYPE, messageType);
    } catch (err) {
      dispatch("propagateError", err);
    }
  }
};

const getters = {
  popupMessage(state: PopupMessageState) {
    return state.popup_message;
  },
  messageType(state: PopupMessageState) {
    return state.popup_message_type;
  }
};


export default {
  mutations,
  actions,
  getters,
  state
}
