"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var types = __importStar(require("../mutation-types"));
var state = {
    appIsLoading: false
};
var mutations = (_a = {},
    _a[types.SET_APP_LOADING_STATE] = function (state, appIsLoading) {
        state.appIsLoading = appIsLoading;
    },
    _a);
var actions = {
    toggleLoading: function (_a) {
        var commit = _a.commit, dispatch = _a.dispatch, state = _a.state;
        try {
            var currentState = state.appIsLoading;
            commit(types.SET_APP_LOADING_STATE, !currentState);
            return currentState;
        }
        catch (err) {
            console.log("Failed. error=", err);
            dispatch("propagateError", err, { root: true });
        }
    },
    setLoadingState: function (_a, appIsLoading) {
        var commit = _a.commit, dispatch = _a.dispatch;
        try {
            commit(types.SET_APP_LOADING_STATE, appIsLoading);
            return appIsLoading;
        }
        catch (err) {
            console.log("Failed. error=", err);
            dispatch("propagateError", err, { root: true });
        }
    }
};
var getters = {
    appIsLoading: function (state) {
        return state.appIsLoading;
    }
};
exports.default = {
    mutations: mutations,
    actions: actions,
    getters: getters,
    state: state
};
//# sourceMappingURL=screens.js.map