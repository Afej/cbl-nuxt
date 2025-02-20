/**
 * API composable that provides organized access to all API modules
 *
 * Usage:
 * const {  auth } = useApi()
 * await auth.login({ email, password })
 *
 * Available modules:
 * - auth: Authentication endpoints
 */

import { authApi } from '~/common/api/auth'
import { usersApi } from '~/common/api/users'
import { walletApi } from '~/common/api/wallet'

export const useApi = () => {
  return {
    authApi,
    usersApi,
    walletApi,
  }
}
