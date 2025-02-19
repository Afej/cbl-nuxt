import type { LoginDTO, User } from '~/common/types'

interface AuthStoreState {
  user: User | null
  token: string | null
  loading: boolean
}

const { auth } = useApi()

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
        const { data } = await auth.login(payload)

        this.token = data.token
        this.user = data.user

        // return navigation path based on user role
        return this.user.role === 'admin' ? '/admin' : '/dashboard'
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed')
      } finally {
        this.loading = false
      }
    },
    async fetchUser() {
      try {
        const { data } = await auth.getAuthUser()
        this.user = data
      } catch (error) {
        this.logout()
      }
    },
    logout() {
      this.token = null
      this.user = null

      // TODO: clear cookies
      navigateTo('/login')
    },
  },
})
