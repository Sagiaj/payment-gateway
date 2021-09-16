
import VueSocketIO from "vue-socket.io";

export default (store: any) => new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3333',
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  }
})