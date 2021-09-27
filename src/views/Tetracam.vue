
<template>
  <iframe frameBorder="0" :src="tetracam_url">
  </iframe>
</template>

<script>
export default {
  name: 'Tetracam',
  data() {
    return {
      tetracam_url: this.$tetracam_url,
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