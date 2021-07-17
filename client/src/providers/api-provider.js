"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
// import * as CryptoJS from "crypto";
// var timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
// const pgw_request_timestamp = timestamp;
// var signature_salt = CryptoJS.lib.WordArray.random(12);
// const pgw_signature_salt = signature_salt;
// var body = '';
// if (request.data) {
//     body = JSON.stringify(JSON.parse(request.data));
//     body = body == "{}" ? "" : body;
// }
// var secret = pm.environment.get('pgw_secret_key');
// var to_sign = request.method.toLowerCase() + request.url.replace('{{base_url}}','') + signature_salt + timestamp + pm.environment.get('pgw_access_key') + secret + body;
// var pgw_signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret));
// pgw_signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(pgw_signature));
var BaseAPI = /** @class */ (function () {
    function BaseAPI() {
    }
    BaseAPI.prototype.addCommonHeaders = function (headers) {
        BaseAPI._axios.interceptors.request.use(function (config) {
            for (var header in headers) {
                config.headers[header] = headers[header];
            }
            return config;
        });
    };
    return BaseAPI;
}());
exports.BaseAPI = BaseAPI;
var ApiProvider = /** @class */ (function (_super) {
    __extends(ApiProvider, _super);
    function ApiProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ApiProvider.prototype, "axios", {
        get: function () {
            if (!BaseAPI._axios) {
                var instance = axios_1.default.create({ /*baseURL: `${document.location.origin}`*/ baseURL: "http://localhost:3333", headers: {
                        access_token: ""
                    } });
                BaseAPI._axios = instance;
            }
            return BaseAPI._axios;
        },
        enumerable: true,
        configurable: true
    });
    ApiProvider.prototype.getClientToken = function (provider_name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.get("/merchants/" + provider_name + "/client-token")];
                    case 1: return [2 /*return*/, (_a.sent()).data];
                }
            });
        });
    };
    ApiProvider.prototype.getProviderConfiguration = function (provider_name) {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.axios.get("/merchants/" + provider_name + "/configuration")];
                    case 1: return [4 /*yield*/, (_a.sent()).data];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        err_1 = _a.sent();
                        console.log("Failed getting provider configuration. Error=", err_1);
                        return [2 /*return*/, Promise.reject(err_1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ApiProvider.prototype.performProviderAction = function (provider_name, action_name, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.axios.post("/merchants/" + provider_name + "/actions/" + action_name, payload)];
                    case 1: return [4 /*yield*/, (_a.sent()).data];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        err_2 = _a.sent();
                        console.log("Failed performing provider action. Error=", err_2);
                        return [2 /*return*/, Promise.reject(err_2)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ApiProvider;
}(BaseAPI));
exports.ApiProvider = ApiProvider;
var apiProvider = new ApiProvider();
exports.default = apiProvider;
//# sourceMappingURL=api-provider.js.map