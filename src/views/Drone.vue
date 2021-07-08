
<template>
  <iframe frameBorder="0" :src="'./aviot-web/index.html?copter_id='+$route.query.copter_id+
    '&fccs_id='+$route.query.fccs_id+
    '&janus_url='+janus_url+
    '&wss_url='+wss_url+
    '&maps_api_key='+maps_api_key">
  </iframe>
</template>

<script>
export default {
  name: 'Drone',
  data() {
    return {
      janus_url: this.$janus_url,
      wss_url: this.$wss_url,
      maps_api_key: process.env.VUE_APP_MAPS_API_KEY
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