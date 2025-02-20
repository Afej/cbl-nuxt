export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token').value

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login']

  if (!token && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
})
