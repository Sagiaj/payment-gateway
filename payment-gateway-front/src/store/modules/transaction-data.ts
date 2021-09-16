import { ActionTree, GetterTree, MutationTree } from "vuex";
import * as types from "../mutation-types";

type TransactionDataState = {
  amount: number;
  currency: string;
  id?: string;
};

const state: TransactionDataState = {
  amount: 100,
  currency: "USD",
  id: undefined
};

export type TransactionData = TransactionDataState & { id: string };

const mutations: MutationTree<TransactionDataState> = {
  [types.SET_TRANSACTION_AMOUNT](state, amount) {
    state.amount = amount;
  },
  [types.SET_TRANSACTION_CURRENCY](state, currency) {
    state.currency = currency;
  },
  [types.SET_TRANSACTION_ID](state, id) {
    state.id = id;
  }
};

const actions: ActionTree<TransactionDataState, any> = {
  setTransactionAmount({ commit, dispatch}, amount: number) {
    try {
      commit(types.SET_TRANSACTION_AMOUNT, amount);
      return amount;
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  },
  setTransactionCurrency({ commit, dispatch}, currency: number) {
    try {
      commit(types.SET_TRANSACTION_CURRENCY, currency);
      return currency;
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  },
  setTransactionId({ commit, dispatch}, id: string) {
    try {
      commit(types.SET_TRANSACTION_ID, id);
      return id;
    } catch (err) {
      console.log("Failed. error=", err);
      dispatch("propagateError", err, { root: true });
    }
  }
};

const getters: GetterTree<TransactionDataState, any> = {
  transactionAmount(state) {
    return state.amount;
  },
  transactionCurrency(state) {
    return state.currency;
  },
  transactionId(state) {
    return state.id;
  }
};


export default {
  mutations,
  actions,
  getters,
  state
}
