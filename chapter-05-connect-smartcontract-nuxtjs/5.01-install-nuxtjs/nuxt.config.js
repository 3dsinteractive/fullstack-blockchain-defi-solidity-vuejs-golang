export default {
  server: {
    host: process.env.APP_HOST || '0.0.0.0',
    port: process.env.APP_PORT || 8000
  },
  env: {
    NETWORK: process.env.APP_NETWORK || 'bsctest',
    FACTORY_ADDR: process.env.APP_FACTORY_ADDR || '',
    PLATFORM_ADDR: process.env.APP_PLATFORM_ADDR || '',
    MERCHANT_REGISTRY_ADDR: process.env.APP_MERCHANT_REGISTRY_ADDR || '',
  },
  head: {
    title:
      'Fullstack blockchain developer workshop',
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