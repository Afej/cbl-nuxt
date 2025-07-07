import api from '~/common/api'
import {
  Role,
  type ChangePasswordDTO,
  type LoginDTO,
  type UpdateProfileDTO,
  type User,
  type Wallet,
  type RegisterDTO,
} from '~/common/types'

import { authApi } from '~/common/api/auth'
import { walletApi } from '~/common/api/wallet'

interface AuthStoreState {
  user: User | null
  token: string | null
  userWallet: Wallet | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => ({
    user: null,
    token: null,
    userWallet: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async initializeWallet() {
      try {
        const { data: wallet } = await walletApi.getWallet()
        this.userWallet = wallet

        const cookieOptions = {
          maxAge: 60 * 60 * 24 * 1, // 1 day
        }

        useCookie<Wallet | null>('wallet', cookieOptions).value =
          this.userWallet
      } catch (error) {
        console.error('Failed to fetch wallet:', error)
        throw error
      }
    },
    async login(payload: LoginDTO) {
      try {
        const {
          data: { token, user },
        } = await authApi.login(payload)

        this.token = token
        this.user = user

        api.setToken(token)

        const cookieOptions = {
          maxAge: 60 * 60 * 24 * 1, // 1 day
        }

        useCookie('token', cookieOptions).value = token
        useCookie<User | null>('user', cookieOptions).value = user

        // get user wallet
        if (this.user.role === Role.USER) {
          await this.initializeWallet()
        }

        return user
      } catch (error) {
        throw error
      }
    },
    async fetchUser() {
      try {
        const { data } = await authApi.getAuthUser()
        this.user = data
      } catch (error) {
        throw error
      }
    },
    async updateProfile(payload: UpdateProfileDTO) {
      try {
        await authApi.updateProfile(payload)
      } catch (error) {
        throw error
      }
    },
    async updatePassword(payload: ChangePasswordDTO) {
      try {
        await authApi.changePassword(payload)
      } catch (error) {
        throw error
      }
    },
    async register(payload: RegisterDTO) {
      try {
        const {
          data: { token, user },
        } = await authApi.register(payload)

        this.token = token
        this.user = user

        api.setToken(token)

        const cookieOptions = {
          maxAge: 60 * 60 * 24 * 1, // 1 day
        }

        useCookie('token', cookieOptions).value = token
        useCookie<User | null>('user', cookieOptions).value = user

        // get user wallet
        if (this.user.role === Role.USER) {
          await this.initializeWallet()
        }

        return user
      } catch (error) {
        throw error
      }
    },
    logout() {
      this.$reset()

      useCookie('token').value = null
      useCookie<User | null>('user').value = null
      useCookie<Wallet | null>('wallet').value = null

      navigateTo('/login')
    },
  },
})
