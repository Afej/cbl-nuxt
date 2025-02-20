import { UserRole, type User } from '~/common/types'

export default defineNuxtRouteMiddleware((to) => {
  const user = useCookie<User | null>('user').value

  if (user?.role !== UserRole.Admin) {
    return navigateTo('/dashboard')
  }
})
