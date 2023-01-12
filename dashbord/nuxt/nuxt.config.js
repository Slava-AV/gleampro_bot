const production = Boolean(process.env.PRODUCTION)
const SentryWebpackPlugin = require("@sentry/webpack-plugin");


export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)

  head: {
    title: 'GleamPro Admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {rel: "stylesheet", type: 'text/css', href: "https://use.fontawesome.com/releases/v5.6.1/css/all.css"}
    ],
    script: [
     //{src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js', type: 'text/javascript'},
      
    ]
  },
  ssr: false,
  target: 'static',
  telemetry: false,

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/css/main.scss'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/export-excel.js',
    '@/plugins/paginate.js',
    '@/plugins/chart.js',
    { src: '~/plugins/infiniteloading', ssr: false },
    { src: 'plugins/globalErrorHandler.js', mode: 'client' }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/date-fns',
    '@nuxtjs/moment',
  ],
  dateFns: {
    format: "dd-MM-yyyy"
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'nuxt-buefy',
    '@nuxtjs/sentry',
   
    
  ],


  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'https://xxxxxxxxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev',
    withCredentials: true,
  },
  // proxy: {
  //   '/': 'https://api.GleamPronetwork.app'
  // },
  sentry: {
    dsn: 'xxxxxxxxxxxxxxxxx', // Enter your project's DSN here
    // Additional Module Options go here
    // https://sentry.nuxtjs.org/sentry/options
    config: {
      debug: false,
      // Add native Sentry config here
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/admin_login', method: 'post', propertyName: 'accessToken' },
          logout: false,
          user: false,
         // logout: { url: '/api/auth/logout', method: 'post' },
          //user: { url: '', method: 'get', propertyName: 'user' },
        },
      //  tokenRequired: fasle,
        tokenType: '',
        autoFetchUser: true
        // globalToken: true,
        // autoFetchUser: true
      }
    }
  },
  loading: {
    color: '#fece16',
    height: '2px'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
      extend(config, ctx) {
        // config.resolve.alias['vue'] = 'vue/dist/vue.common',
        
        if (ctx.isDev) config.devtool = 'source-map'
      },
      // analyze: {
      //   analyzerMode: 'static'
      // },

      filenames: {
        app: '[name].js',
        chunk: '[name].js',
        css: '[name].css',
        manifest: 'manifest.json',
      },
      productionSourceMap: true,
      sourceMapFilename: '[name].map',
      
      devtools: true,
      // publicPath: `./_nuxt/`,
      plugins: [
        
      ],
      
    
  },
  
}
