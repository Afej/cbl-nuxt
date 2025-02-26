// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt'],
  ui: {
    global: true,
    icons: ['heroicons'],
  },
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