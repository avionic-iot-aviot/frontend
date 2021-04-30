export default {
  wss: {
    host: process.env.VUE_APP_WSS_SERVICE_HOST,
    port: process.env.VUE_APP_WSS_SERVICE_PORT
  },
  janus: {
    host: process.env.VUE_APP_JANUS_SERVICE_HOST,
    port: process.env.VUE_APP_JANUS_SERVICE_PORT
  },
  dbapp: {
    host: process.env.VUE_APP_DBAPP_SERVICE_HOST,
    port: process.env.VUE_APP_DBAPP_SERVICE_PORT
  }
}
