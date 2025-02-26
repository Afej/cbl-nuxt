import { type User, Role } from '~/common/types'

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token').value
  const user = useCookie<User | null>('user').value

  if (!token) return

  // check user role & Redirect authenticated users away from guest routes
  if (user?.role !== Role.ADMIN) {
    return navigateTo('/dashboard')
  } else {
    return navigateTo('/admin')
  }
})
