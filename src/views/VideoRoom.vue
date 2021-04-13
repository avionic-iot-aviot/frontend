<template>
  <iframe frameBorder="0" :src="'../aviot-web/index.html?copter_id='+$route.params.copter_id" >
  </iframe>
</template>

<style scoped>
iframe {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>