import { type LoginDTO, type User } from '~/common/types'

interface AuthStoreState {
  user: User | null
  token: string | null
  loading: boolean
}

const { authApi } = useApi()

export const useAuthStore = defineStore('auth', {
  state: (): AuthStoreState => ({
    user: null,
    token: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(payload: LoginDTO) {
      this.loading = true
      try {
        const { data } = await authApi.login(payload)

        this.token = data.token
        this.user = data.user

        const cookieOptions = {
          maxAge: 60 * 60 * 24 * 1, // 1 day
          secure: true,
          httpOnly: true,
        }

        useCookie('token', cookieOptions).value = this.token
        useCookie<User | null>('user', cookieOptions).value = this.user

        return data.user
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed')
      } finally {
        this.loading = false
      }
    },
    async fetchUser() {
      try {
        const { data } = await authApi.getAuthUser()
        this.user = data
      } catch (error) {
        this.logout()
      }
    },
    logout() {
      this.token = null
      this.user = null

      const cookieOptions = {
        maxAge: 0,
      }

      useCookie('token', cookieOptions).value = null
      useCookie<User | null>('user', cookieOptions).value = null

      navigateTo('/login')
    },
  },
})
