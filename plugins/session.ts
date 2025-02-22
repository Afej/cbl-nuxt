import type { User } from '~/common/types'
import api from '../common/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiVersion = '/api/v1'
  const authStore = useAuthStore()

  api.setBaseUrl(`${config.public.apiBaseUrl}${apiVersion}`)

  const token = useCookie('token').value
  const user = useCookie<User | null>('user').value

  if (token && user) {
    api.setToken(token)
    authStore.token = token
    authStore.user = user
  }
})
