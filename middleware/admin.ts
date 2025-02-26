import { Role, type User } from '~/common/types'

export default defineNuxtRouteMiddleware((to) => {
  const user = useCookie<User | null>('user').value

  if (user?.role !== Role.ADMIN) {
    return navigateTo('/dashboard')
  }
})
