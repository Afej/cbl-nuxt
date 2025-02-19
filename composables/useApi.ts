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

export const useApi = () => {
  return {
    auth: authApi,
  }
}
