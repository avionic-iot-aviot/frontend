<template>
  <v-snackbar
    :color="context"
    :top="true"
    :right="x === 'right'"
    :left="x === 'left'"
    :multi-line="mode === 'multi-line'"
    :vertical="mode === 'vertical'"
    v-model="snackbar"
    :timeout="-1"
  >
    <div class="snack-text">{{ text }}</div>
    <v-btn class="close-button" dark @click.native="closeMessage()"
      >Close</v-btn
    >
  </v-snackbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
        snackbar: false,
        context: "",
        mode: "",
        text: "",
        x: "",
        y: "bottom",
        duration: 5000,
        timeout: null
    };
  },
  computed: {
    ...mapGetters("snackbar", [
      "instance",
    ])
  },
  watch: {
    instance(val) {
      this.snackbar=true;
      this.context=val.context;
      this.mode=val.mode;
      this.text=val.text;

      if (this.timeout)
        clearTimeout(this.timeout);
      this.timeout=setTimeout(function(){
        this.snackbar=false;
      }.bind(this), this.duration);
    }
  },
  methods: {
    closeMessage() {
      this.snackbar=false;
    }
  },
};
</script>

<style scoped>
.snack-text {
  display: inline-block;
  line-height: 36px;
  padding-right: 16px;
}
.close-button {
  float: right;
}
</style>
