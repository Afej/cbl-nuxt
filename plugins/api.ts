import api from '../common/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  api.setBaseUrl(config.public.apiBaseUrl)

  const token = useCookie('token').value
  if (token) {
    api.setToken(token)
  }
})
