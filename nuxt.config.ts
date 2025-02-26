// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt'],

  app: {
    head: {
      title: 'CBL',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A simple banking application built by Joshua Afekuro',
        },
        { name: 'keywords', content: 'nuxt, vue, ui, pinia, vueuse' },
        { property: 'og:title', content: 'CBL Nuxt Application' },
        {
          property: 'og:description',
          content: 'A simple banking application built by Joshua Afekuro',
        },
        { property: 'og:type', content: 'website' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  ui: { global: true, icons: ['heroicons'] },
  colorMode: {
    preference: 'dark',
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
    },
  },
  devtools: { enabled: true },
})
