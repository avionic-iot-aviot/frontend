
<template>
  <iframe frameBorder="0" :src="'../aviot-web/index.html?copter_id='+$route.params.copter_id+
    '&janus_host='+config.janus.host+
    '&janus_port='+config.janus.port+
    '&wss_host='+config.wss.host+
    '&wss_port='+config.wss.port" >
  </iframe>
</template>

<script>
import config from '../../config'

export default {
  name: 'VideoRoom',
  data() {
    return {
      config
    };
  }
}
</script>

<style scoped>
iframe {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>