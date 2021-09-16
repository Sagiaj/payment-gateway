"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = __importDefault(require("vue"));
var vuex_1 = __importDefault(require("vuex"));
var card_1 = __importDefault(require("./modules/card"));
var auth_1 = __importDefault(require("./modules/auth"));
var threeds_1 = __importDefault(require("./modules/threeds"));
var screens_1 = __importDefault(require("./modules/screens"));
var popup_message_1 = __importDefault(require("./modules/popup-message"));
vue_1.default.use(vuex_1.default);
exports.default = new vuex_1.default.Store({
    modules: {
        card: card_1.default,
        auth: auth_1.default,
        threeDs: threeds_1.default,
        screens: screens_1.default,
        popupMessage: popup_message_1.default
    }
});
//# sourceMappingURL=index.js.map