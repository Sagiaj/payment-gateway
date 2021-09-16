"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = __importDefault(require("vue"));
var vue_router_1 = __importDefault(require("vue-router"));
var CardView_vue_1 = __importDefault(require("../views/CardView.vue"));
vue_1.default.use(vue_router_1.default);
var routes = [
    {
        path: "/",
        name: "CardView",
        component: CardView_vue_1.default
    }
];
var router = new vue_router_1.default({
    routes: routes
});
exports.default = router;
//# sourceMappingURL=index.js.map