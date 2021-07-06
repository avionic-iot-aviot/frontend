
<template>
  <iframe frameBorder="0" :src="'./controller/index.html'">
  </iframe>
</template>

<script>
export default {
  name: 'Controller',
  data() {
    return {
      
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