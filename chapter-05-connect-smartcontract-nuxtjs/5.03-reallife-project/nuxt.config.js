export default {
  server: {
    host: process.env.APP_HOST || '0.0.0.0',
    port: process.env.APP_PORT || 8000
  },
  env: {
    NETWORK: process.env.APP_NETWORK || 'bsctest',
    TOKENA_ADDR: process.env.APP_TOKENA_ADDR || '0x5A675d349F0440561F9Cb9A9210FDc4607Ce859A',
    TOKENB_ADDR: process.env.APP_TOKENB_ADDR || '0xe9598aD912dF0D2B363de3188fa4610449Cb07d6',
    THEPOOL_ADDR: process.env.APP_THEPOOL_ADDR || '0xF3D67ae549837A7749a98aCDe40486769472425F',
  },
  head: {
    title:
      'Super Swap',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    '~assets/styles/reset.scss', 
    '~assets/styles/main.scss'
  ],
  plugins: [
    { src: '~/plugins/base-components', ssr: true },
  ],

  components: true,

  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // 'cookie-universal-nuxt'
    'vue-sweetalert2/nuxt'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.devtool = 'source-map'
      }
    }
  }
}