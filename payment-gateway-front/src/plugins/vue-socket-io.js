"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_socket_io_1 = __importDefault(require("vue-socket.io"));
exports.default = (function (store) { return new vue_socket_io_1.default({
    debug: true,
    connection: 'http://localhost:3333',
    vuex: {
        store: store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}); });
//# sourceMappingURL=vue-socket-io.js.map