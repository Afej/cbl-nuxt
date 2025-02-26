import type { User, Wallet } from '~/common/types'
import api from '../common/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiVersion = '/api/v1'
  const authStore = useAuthStore()

  api.setBaseUrl(`${config.public.apiBaseUrl}${apiVersion}`)

  const token = useCookie('token').value
  const user = useCookie<User | null>('user').value
  const userWallet = useCookie<Wallet | null>('wallet').value

  if (token) {
    api.setToken(token)
    authStore.token = token

    if (user) {
      authStore.user = user
    }

    if (userWallet) {
      authStore.userWallet = userWallet
    }
  }
})
