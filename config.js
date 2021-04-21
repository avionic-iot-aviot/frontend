export default {
  wss: {
    host: process.env.WSS_SERVICE_HOST,
    port: process.env.WSS_SERVICE_PORT
  },
  janus: {
    host: process.env.JANUS_SERVICE_HOST,
    port: process.env.JANUS_SERVICE_PORT
  },
  dbapp: {
    host: process.env.DBAPP_SERVICE_HOST,
    port: process.env.DBAPP_SERVICE_PORT
  }
}
