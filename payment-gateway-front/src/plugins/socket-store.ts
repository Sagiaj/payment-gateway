// websocketStorePlugin.js
const createWebSocketPlugin = (socket: any) => {
  return (store: { $socket: any; }) => {
    store.$socket = socket
    // socket.on('message', payload => store.dispatch('receiveMessage', payload))
  }
}
export default createWebSocketPlugin;