import {
  UserRole,
  type ChangePasswordDTO,
  type LoginDTO,
  type UpdateProfileDTO,
  type User,
  type Wallet,
} from '~/common/types'

interface AuthStoreState {
  user: User | null
  token: string | null
  userWallet: Wallet | null
}

const { authApi, walletApi } = useApi()

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
    async login(payload: LoginDTO) {
      try {
        const { data } = await authApi.login(payload)

        this.token = data.token
        this.user = data.user

        const cookieOptions = {
          maxAge: 60 * 60 * 24 * 1, // 1 day
        }

        useCookie('token', cookieOptions).value = this.token
        useCookie<User | null>('user', cookieOptions).value = this.user

        // get user wallet
        if (this.user.role === UserRole.User) {
          const { data: wallet } = await walletApi.getWallet()
          this.userWallet = wallet

          useCookie<Wallet | null>('wallet', cookieOptions).value =
            this.userWallet
        }

        return data.user
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
    logout() {
      this.$reset()

      useCookie('token').value = null
      useCookie<User | null>('user').value = null
      useCookie<Wallet | null>('wallet').value = null

      navigateTo('/login')
    },
  },
})
