export default {
  // This lets you specify the host and port for your Nuxt server instance.
  server: {
    host: process.env.APP_HOST || '0.0.0.0',
    port: process.env.APP_PORT || 8000
  },
  // This option lets you define environment variables that are required at build time
  env: {
    NETWORK: process.env.APP_NETWORK || 'bsctest',
    FACTORY_ADDR: process.env.APP_FACTORY_ADDR || '',
    PLATFORM_ADDR: process.env.APP_PLATFORM_ADDR || '',
    MERCHANT_REGISTRY_ADDR: process.env.APP_MERCHANT_REGISTRY_ADDR || '',
  },
  // This option lets you define all default meta tags for your application.
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
  // This option lets you define the CSS files, modules, and libraries you want to include globally (on every page).
  css: [
    '~assets/styles/reset.scss', 
    '~assets/styles/main.scss'
  ],
  // This option lets you define JavaScript plugins that should be run before instantiating the root Vue.js application.
  plugins: [
    { src: '~/plugins/base-components', ssr: true },
  ],
  // Some modules are only imported during development and build time. 
  // Using buildModules helps to make production startup faster and also significantly decrease the size of your node_modules for production deployments.
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],
  // With this option you can add Nuxt modules to your project.
  modules: [
    // 'cookie-universal-nuxt'
    'vue-sweetalert2/nuxt'
  ],
  // This option lets you configure various settings for the build step, 
  // including loaders, filenames, the webpack config and transpilation.
  build: {
    extend(config, { isClient }) {
      // Extend only webpack config for client-bundle
      if (isClient) {
        config.devtool = 'source-map'
      }
    }
  }
}