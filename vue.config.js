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
  },
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/frontend/'
  //   : '/'
}