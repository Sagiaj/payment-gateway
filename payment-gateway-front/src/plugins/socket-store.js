"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// websocketStorePlugin.js
var createWebSocketPlugin = function (socket) {
    return function (store) {
        store.$socket = socket;
        // socket.on('message', payload => store.dispatch('receiveMessage', payload))
    };
};
exports.default = createWebSocketPlugin;
//# sourceMappingURL=socket-store.js.map