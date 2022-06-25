const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  //publicPath: '/public/manager/',
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
