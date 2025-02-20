import api from '../common/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiVersion = '/api/v1'

  api.setBaseUrl(`${config.public.apiBaseUrl}${apiVersion}`)

  const token = useCookie('token').value

  if (token) {
    api.setToken(token)
  }
})
