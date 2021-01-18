module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/styles/main.sass"`
      }
    }
  }
}