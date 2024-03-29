"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var api_provider_1 = __importDefault(require("../../providers/api-provider"));
var types = __importStar(require("../mutation-types"));
var gateway_providers_1 = require("../../providers/gateway-providers");
var provider_actions_1 = require("@/models/provider-actions");
var globalpayments_3ds_1 = require("globalpayments-3ds");
var provider_transaction_message_1 = __importDefault(require("@/models/provider-transaction-message"));
var state = {
    currentAction: provider_actions_1.ProviderActions.Submit,
    acsChallengeData: null,
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
var mutations = (_a = {},
    _a[types.SET_CARD_DATA_MODEL] = function (state, data_model) {
        state.cardData = data_model;
    },
    _a[types.SET_PROVIDER_CONFIGURATION] = function (state, providerConfig) {
        state.config = providerConfig;
    },
    _a[types.SET_CURRENT_ACTION] = function (state, action) {
        state.currentAction = action;
    },
    _a[types.SET_ACS_CHALLENGE_DATA] = function (state, acsChallengeData) {
        state.acsChallengeData = acsChallengeData;
    },
    _a);
var actions = {
    getProviderConfiguration: function (_a) {
        var commit = _a.commit, dispatch = _a.dispatch, state = _a.state;
        return __awaiter(this, void 0, void 0, function () {
            var providerConfig, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, api_provider_1.default.getProviderConfiguration(state.providerName)];
                    case 1:
                        providerConfig = _b.sent();
                        return [4 /*yield*/, commit(types.SET_PROVIDER_CONFIGURATION, providerConfig)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, providerConfig];
                    case 3:
                        err_1 = _b.sent();
                        console.log("Failed. error=", err_1);
                        dispatch("propagateError", err_1, { root: true });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    initializeCardDataBinding: function (_a, cardDataModel) {
        var commit = _a.commit, dispatch = _a.dispatch;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                try {
                    commit(types.SET_CARD_DATA_MODEL, cardDataModel);
                }
                catch (err) {
                    console.log("Failed. error=", err);
                    dispatch("propagateError", err, { root: true });
                }
                return [2 /*return*/];
            });
        });
    },
    setCurrentAction: function (_a, currentAction) {
        var commit = _a.commit, dispatch = _a.dispatch;
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, commit(types.SET_CURRENT_ACTION, currentAction)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, currentAction];
                    case 2:
                        err_2 = _b.sent();
                        console.log("Failed. error=", err_2);
                        dispatch("propagateError", err_2, { root: true });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    setACSChallengeData: function (_a, acsChallengeData) {
        var commit = _a.commit, dispatch = _a.dispatch;
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, commit(types.SET_ACS_CHALLENGE_DATA, acsChallengeData)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, acsChallengeData];
                    case 2:
                        err_3 = _b.sent();
                        console.log("Failed. error=", err_3);
                        dispatch("propagateError", err_3, { root: true });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    startThreeDSProcess: function (_a) {
        var commit = _a.commit, dispatch = _a.dispatch, state = _a.state, rootGetters = _a.rootGetters;
        return __awaiter(this, void 0, void 0, function () {
            var cardFields, versionCheckData, authenticatedData, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 16, , 19]);
                        return [4 /*yield*/, dispatch("setLoadingState", true, { root: true })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dispatch("setCurrentAction", provider_actions_1.ProviderActions.Submit, { root: true })];
                    case 2:
                        _b.sent();
                        cardFields = gateway_providers_1.convertToGlobalPayCardFields(rootGetters.cardData);
                        return [4 /*yield*/, gateway_providers_1.GlobalpayProvider.checkVersion(cardFields)];
                    case 3:
                        versionCheckData = _b.sent();
                        // Create form + post to acs
                        return [4 /*yield*/, dispatch("setCurrentAction", provider_actions_1.ProviderActions.NotifyACS, { root: true })];
                    case 4:
                        // Create form + post to acs
                        _b.sent();
                        gateway_providers_1.GlobalpayProvider.createAndSubmitHiddenForm("POST", "" + versionCheckData.methodUrl, "hidden_iframe", [{ type: "hidden", name: "threeDSMethodData", value: "" + versionCheckData.methodData }]);
                        // init authentication
                        return [4 /*yield*/, dispatch("setCurrentAction", provider_actions_1.ProviderActions.InitiateAuthentication, { root: true })];
                    case 5:
                        // init authentication
                        _b.sent();
                        return [4 /*yield*/, gateway_providers_1.GlobalpayProvider.initAuthentication(versionCheckData, cardFields)];
                    case 6:
                        authenticatedData = _b.sent();
                        if (!authenticatedData.challenge_mandated) return [3 /*break*/, 10];
                        return [4 /*yield*/, dispatch("setCurrentAction", provider_actions_1.ProviderActions.MandateChallenge, { root: true })];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, dispatch("setACSChallengeData", { identifier: authenticatedData.acs_trans_id }, { root: true })];
                    case 8:
                        _b.sent();
                        console.log("Calling Challenge flow");
                        console.log("Submitting hidden form");
                        gateway_providers_1.GlobalpayProvider.createAndSubmitHiddenForm("POST", "" + authenticatedData.challenge_request_url, "iframe", [{ type: "hidden", name: "creq", value: "" + authenticatedData.encoded_creq }]);
                        /* optional parameter to include Session Data
                        var sessionData = document.createElement("input");
                        sessionData.setAttribute("type", "hidden");
                        sessionData.setAttribute("name", "threeDSSessionData");
                        creqDatasetAttribute("value", sessionDataObject);
                        form.appendChild(sessionData);
                        */
                        console.log("dispatching challenge");
                        return [4 /*yield*/, dispatch("setPopupMessage", new provider_transaction_message_1.default(authenticatedData.status, authenticatedData.status_reason), { root: true })];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 10:
                        if (!(authenticatedData.status && gateway_providers_1.GlobalpayProvider.paymentTransactionStatusIsTerminal(authenticatedData.status))) return [3 /*break*/, 13];
                        console.log("dispatching normal reason");
                        return [4 /*yield*/, dispatch("setLoadingState", false, { root: true })];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, dispatch("setPopupMessage", new provider_transaction_message_1.default(authenticatedData.status, authenticatedData.status_reason), { root: true })];
                    case 12:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 13:
                        console.log("dispatching default message");
                        return [4 /*yield*/, dispatch("setPopupMessage", new provider_transaction_message_1.default(), { root: true })];
                    case 14:
                        _b.sent();
                        _b.label = 15;
                    case 15: return [3 /*break*/, 19];
                    case 16:
                        err_4 = _b.sent();
                        return [4 /*yield*/, dispatch("setLoadingState", false, { root: true })];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, dispatch("setPopupMessage", new provider_transaction_message_1.default(globalpayments_3ds_1.TransactionStatus.AuthenticationFailed, err_4.toString()), { root: true })];
                    case 18:
                        _b.sent();
                        console.log("Failed. error=", err_4);
                        return [3 /*break*/, 19];
                    case 19: return [2 /*return*/];
                }
            });
        });
    },
    SOCKET_notifyACSChallengeCompleted: function (_a, data) {
        var commit = _a.commit, dispatch = _a.dispatch, state = _a.state, rootGetters = _a.rootGetters;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                console.log("received it in SOCKET_notifyACSChallengeCompleted. data=", data);
                return [2 /*return*/];
            });
        });
    },
    SOCKET_registerSocketIdentifier: function (_a, data) {
        var commit = _a.commit, dispatch = _a.dispatch, state = _a.state, rootGetters = _a.rootGetters;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("received it in SOCKET_registerSocketIdentifier. data=", data);
                        return [4 /*yield*/, dispatch("setCurrentAction", provider_actions_1.ProviderPaymentStatuses.PaymentSuccessful)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, dispatch("setLoadingState", false, { root: true })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, dispatch("setPopupMessage", new provider_transaction_message_1.default(data.status, data.status_reason), { root: true })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
var getters = {
    currentAction: function (state) {
        return state.currentAction;
    },
    acsChallengeData: function (state) {
        return state.acsChallengeData;
    },
    providerName: function (state) {
        return state.providerName;
    },
    providerConfig: function (state) {
        return state.config;
    },
    cardData: function (state) {
        return state.cardData;
    },
    cardNumber: function (state) {
        return state.cardData.cardNumber;
    },
    cardMonth: function (state) {
        return state.cardData.cardMonth;
    },
    cardYear: function (state) {
        return state.cardData.cardYear;
    },
    cardCvv: function (state) {
        return state.cardData.cardCvv;
    },
    cardName: function (state) {
        return state.cardData.cardName;
    }
};
exports.default = {
    mutations: mutations,
    actions: actions,
    getters: getters,
    state: state
};
//# sourceMappingURL=threeds.js.map