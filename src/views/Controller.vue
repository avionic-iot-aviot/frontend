
<template>
  <iframe frameBorder="0" :src="'./controller/index.html?controller_url='+controller_url">
  </iframe>
</template>

<script>
export default {
  name: 'Controller',
  data() {
    return {
      controller_url: this.$controller_url,
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