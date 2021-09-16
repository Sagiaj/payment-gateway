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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var GlobalPayThreeDS = __importStar(require("globalpayments-3ds"));
var globalpayments_3ds_1 = require("globalpayments-3ds");
var api_provider_1 = __importDefault(require("./api-provider"));
var axios_1 = __importDefault(require("axios"));
var GlobalpayProvider = /** @class */ (function () {
    function GlobalpayProvider() {
    }
    GlobalpayProvider.checkVersion = function (cardFields) {
        return __awaiter(this, void 0, void 0, function () {
            var checkVersionRequestData, versionCheckData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Calling GlobalPayThreeDS/checkVersion");
                        checkVersionRequestData = { card: { number: cardFields.number } };
                        return [4 /*yield*/, api_provider_1.default.performProviderAction("globalpay", "Check3DSVersion", checkVersionRequestData)];
                    case 1:
                        versionCheckData = _a.sent();
                        console.log("Finished GlobalPayThreeDS/checkVersion. result=", versionCheckData);
                        return [2 /*return*/, versionCheckData];
                    case 2:
                        err_1 = _a.sent();
                        console.log("Failed check version call. Error=", err_1);
                        return [2 /*return*/, Promise.reject(err_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GlobalpayProvider.initAuthentication = function (versionCheckData, cardFields) {
        return __awaiter(this, void 0, void 0, function () {
            var browserData, initAuthRequestData, authenticatedData, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        browserData = GlobalPayThreeDS.getBrowserData();
                        initAuthRequestData = {
                            methodUrlComplete: globalpayments_3ds_1.MethodUrlCompletion.Yes,
                            challengeWindow: {
                                windowSize: globalpayments_3ds_1.ChallengeWindowSize.Windowed250x400,
                                displayMode: "lightbox"
                            },
                            serverTransactionId: versionCheckData.serverTransactionId,
                            card: cardFields,
                            browserData: browserData,
                            authenticationSource: globalpayments_3ds_1.AuthenticationSource.Browser,
                            authenticationRequestType: globalpayments_3ds_1.AuthenticationRequestType.PaymentTransaction,
                            messageCategory: globalpayments_3ds_1.MessageCategory.Payment,
                            challengeRequestIndicator: globalpayments_3ds_1.ChallengeRequestIndicator.NoPreference
                        };
                        return [4 /*yield*/, api_provider_1.default.performProviderAction("globalpay", "Initiate3DSAuthentication", initAuthRequestData)
                                .catch(function (err) {
                                console.log("Failed initiateAuthentication. Error=", err.reasons);
                                return Promise.reject(err);
                            })];
                    case 1:
                        authenticatedData = _a.sent();
                        console.log("Initiate authentication response=", authenticatedData);
                        return [2 /*return*/, authenticatedData];
                    case 2:
                        err_2 = _a.sent();
                        console.log("Failed check version call. Error=", err_2);
                        return [2 /*return*/, Promise.reject(err_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GlobalpayProvider.startThreeDSProcess = function (cardFields) {
        return __awaiter(this, void 0, void 0, function () {
            var browserData, versionCheckData, checkVersionRequestData, err_3, initAuthUrl, initAuthRequestData, authenticatedData, form, creqData, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        browserData = GlobalPayThreeDS.getBrowserData();
                        versionCheckData = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // CREATE HIDDEN FORM WITH JSON OBJECT
                        console.log("Calling GlobalPayThreeDS/checkVersion");
                        checkVersionRequestData = { card: { number: cardFields.number } };
                        return [4 /*yield*/, api_provider_1.default.performProviderAction("globalpay", "Check3DSVersion", checkVersionRequestData)];
                    case 2:
                        versionCheckData = _a.sent();
                        console.log("Finished GlobalPayThreeDS/checkVersion. result=", versionCheckData);
                        console.log("calling ACS");
                        GlobalpayProvider.createAndSubmitHiddenForm("POST", "" + versionCheckData.methodUrl, "hidden_iframe", [{ type: "hidden", name: "threeDSMethodData", value: "" + versionCheckData.methodData }]);
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        console.log("Errored in posting to ACS. Error=", err_3["reasons"]);
                        versionCheckData = JSON.parse("null");
                        return [3 /*break*/, 4];
                    case 4:
                        if (!versionCheckData)
                            return [2 /*return*/];
                        initAuthUrl = "http://localhost:3333/merchants/globalpay/actions/Initiate3DSAuthentication";
                        initAuthRequestData = {
                            methodUrlComplete: globalpayments_3ds_1.MethodUrlCompletion.Yes,
                            challengeWindow: {
                                windowSize: globalpayments_3ds_1.ChallengeWindowSize.FullScreen,
                                displayMode: "lightbox"
                            },
                            serverTransactionId: versionCheckData.serverTransactionId,
                            card: cardFields,
                            browserData: browserData,
                            authenticationSource: globalpayments_3ds_1.AuthenticationSource.Browser,
                            authenticationRequestType: globalpayments_3ds_1.AuthenticationRequestType.PaymentTransaction,
                            messageCategory: globalpayments_3ds_1.MessageCategory.Payment,
                            challengeRequestIndicator: globalpayments_3ds_1.ChallengeRequestIndicator.NoPreference
                        };
                        return [4 /*yield*/, axios_1.default.post(initAuthUrl, initAuthRequestData).catch(function (err) {
                                console.log("Failed initiateAuthentication. Error=", err.reasons);
                                return Promise.reject(err);
                            })];
                    case 5:
                        authenticatedData = (_a.sent()).data;
                        console.log("Initiate authentication response=", authenticatedData);
                        if (authenticatedData.challenge_mandated) {
                            console.log("Calling Challenge flow");
                            form = document.createElement("form");
                            form.setAttribute("method", "POST");
                            form.setAttribute("action", "" + authenticatedData.challenge_request_url);
                            form.setAttribute("target", "iframe");
                            creqData = document.createElement("input");
                            creqData.setAttribute("type", "hidden");
                            creqData.setAttribute("name", "creq");
                            //add creq object obtained from the server
                            creqData.setAttribute("value", "" + authenticatedData.encoded_creq);
                            form.appendChild(creqData);
                            /* optional parameter to include Session Data
                            var sessionData = document.createElement("input");
                            sessionData.setAttribute("type", "hidden");
                            sessionData.setAttribute("name", "threeDSSessionData");
                            creqDatasetAttribute("value", sessionDataObject);
                            form.appendChild(sessionData);
                            */
                            document.body.appendChild(form);
                            console.log("Submitting hidden form");
                            form.submit();
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        err_4 = _a.sent();
                        console.log("Failed 3D Secure process. Error=", err_4);
                        return [2 /*return*/, Promise.reject(err_4)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    GlobalpayProvider.createAndSubmitHiddenForm = function (method, action, target, inputAttributes) {
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", action);
        form.setAttribute("target", target);
        for (var _i = 0, inputAttributes_1 = inputAttributes; _i < inputAttributes_1.length; _i++) {
            var attribute = inputAttributes_1[_i];
            var threeDSMethodDataInput = document.createElement("input");
            threeDSMethodDataInput.setAttribute("type", attribute.type);
            threeDSMethodDataInput.setAttribute("name", attribute.name);
            threeDSMethodDataInput.setAttribute("value", attribute.value);
            form.appendChild(threeDSMethodDataInput);
        }
        document.body.appendChild(form);
        form.submit();
    };
    GlobalpayProvider.paymentTransactionStatusIsTerminal = function (status) {
        return status !== globalpayments_3ds_1.TransactionStatus.ChallengeRequired;
    };
    return GlobalpayProvider;
}());
exports.GlobalpayProvider = GlobalpayProvider;
function convertToGlobalPayCardFields(cardDetails) {
    var globalPayCardObject = {
        request_timestamp: new Date().toISOString(),
        cardHolderName: cardDetails.cardName,
        cvn: cardDetails.cardCvv,
        customerReference: "SANDBOX_REFERENCE",
        expMonth: cardDetails.cardMonth,
        expYear: cardDetails.cardYear,
        number: cardDetails.cardNumberNotMask ? cardDetails.cardNumberNotMask.trim().replace(/\s+/g, "") : "",
        reference: "INTERNAL_SANDBOX_REFERENCE"
    };
    return globalPayCardObject;
}
exports.convertToGlobalPayCardFields = convertToGlobalPayCardFields;
//# sourceMappingURL=gateway-providers.js.map