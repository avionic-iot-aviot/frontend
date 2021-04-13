<template>
  <div>
    <button
      v-for="lang in languages"
      :key="lang.title"
      :class="{ active: lang.language == $i18n.locale, langbtn: true }"
      @click="changeLocale(lang.language)"
    >
      <flag :iso="lang.flag" v-bind:squared="false" />
    </button>
  </div>
</template>

<script>
export default {
  name: "LocaleSwitch",
  data() {
    return {
      currentLocale: "",
      languages: [
        { flag: "it", language: "it", title: "Italiano" },
        { flag: "us", language: "en", title: "English" }
      ]
    };
  },
  computed: {},
  methods: {
    changeLocale: function(language) {
      localStorage.locale = language;
      //this.$i18n.locale = localStorage.locale;
      this.$router.go(0);
    }
  }
};
</script>

<style scoped lang="sass">
.active
  background-color: var(--v-secondary-base)
  //border-radius: 0.35em
.langbtn
  margin-right: 8px
  padding: 4px
</style>
