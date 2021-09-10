
<template>
  <div id="template-container">
      <iframe id="aviot-web" frameBorder="0" :src="'./aviot-web/index.html?copter_id='+$route.query.copter_id+
        '&fccs_id='+$route.query.fccs_id+
        '&janus_url='+janus_url+
        '&wss_url='+wss_url+
        '&maps_api_key='+maps_api_key">
      </iframe>
      <iframe id="controller" frameBorder="1" :src="'./controller/index.html?controller_url='+controller_url">
      </iframe>
  </div>
</template>

<script>
export default {
  name: 'Drone',
  data() {
    return {
      janus_url: this.$janus_url,
      wss_url: this.$wss_url,
      maps_api_key: process.env.VUE_APP_MAPS_API_KEY,
      controller_url: this.$controller_url
    };
  }
}
</script>

<style scoped>
iframe {
  position: relative;
  width: 100%;
}
#template-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

#aviot-web {
  height: 75%;
}

#controller {
  height: 24%;
}
</style>