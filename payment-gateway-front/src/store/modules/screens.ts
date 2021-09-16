import { ActionTree, GetterTree, MutationTree } from "vuex";
import * as types from "../mutation-types";

export type ThreeDSState = {
  appIsLoading: boolean;
  iframeDialog: boolean;
}

const state: ThreeDSState = {
  appIsLoading: false,
  iframeDialog: false
};

const mutations: MutationTree<ThreeDSState> = {
  [types.SET_APP_LOADING_STATE](state, appIsLoading) {
    state.appIsLoading = appIsLoading;
  },
  [types.SET_IFRAME_DIALOG](state, iframeDialog) {
    state.iframeDialog = iframeDialog;
  }
};

const actions: ActionTree<ThreeDSState, any> = {
  toggleLoading({ commit, dispatch, state }) {
    try {
      const currentState = state.appIsLoading;
      commit(types.SET_APP_LOADING_STATE, !currentState);
      return currentState;
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  },
  setLoadingState({ commit, dispatch}, appIsLoading: boolean) {
    try {
      commit(types.SET_APP_LOADING_STATE, appIsLoading);
      return appIsLoading;
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  },
  setIframeDialog({ commit, dispatch}, iframeDialog: boolean) {
    try {
      commit(types.SET_IFRAME_DIALOG, iframeDialog);
      return iframeDialog;
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  },
  toggleIframeDialog({ commit, dispatch, state }) {
    try {
      const currentState = state.iframeDialog;
      commit(types.SET_IFRAME_DIALOG, !currentState);
      return currentState;
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  },
};

const getters: GetterTree<ThreeDSState, any> = {
  appIsLoading(state) {
    return state.appIsLoading;
  },
  iframeDialog(state) {
    return state.iframeDialog;
  }
};


export default {
  mutations,
  actions,
  getters,
  state
}
