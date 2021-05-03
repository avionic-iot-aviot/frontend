
<template>
  <iframe frameBorder="0" :src="'./aviot-web/index.html?copter_id='+$route.params.copter_id+
    '&janus_url='+janus_url+
    '&wss_url='+wss_url">
  </iframe>
</template>

<script>
export default {
  name: 'VideoRoom',
  data() {
    return {
      janus_url: localStorage.janus_url,
      wss_url: localStorage.wss_url
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