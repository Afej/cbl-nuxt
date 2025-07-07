<template>
  <header class="bg-gray-800 shadow sticky top-0 z-40">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold text-primary-400"
          >CBL</NuxtLink
        >

        <!-- Hamburger for mobile -->
        <button
          class="md:hidden text-white focus:outline-none"
          @click="isMobileMenuOpen = !isMobileMenuOpen">
          <span class="sr-only">Open main menu</span>
          <svg
            v-if="!isMobileMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-7 h-7">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-7 h-7">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Desktop Nav -->
        <div
          v-if="isAuthenticated && !hideDesktopNav"
          class="hidden md:flex gap-4">
          <template v-if="isAdmin">
            <UButton
              to="/admin"
              variant="ghost"
              color="white"
              class="hidden md:block"
              >Admin Panel</UButton
            >
          </template>

          <template v-else>
            <UButton
              to="/dashboard"
              variant="ghost"
              color="white"
              class="hidden md:block"
              >Dashboard</UButton
            >
            <UButton to="/dashboard/transactions" variant="ghost" color="white"
              >Transactions</UButton
            >
          </template>

          <UButton
            :to="isAdmin ? '/admin/profile' : '/dashboard/profile'"
            variant="ghost"
            color="white">
            Profile
          </UButton>
          <UButton @click="authStore.logout" color="red" variant="soft"
            >Logout</UButton
          >
        </div>

        <div v-else-if="!hideDesktopNav" class="hidden md:flex gap-2">
          <UButton to="/login" variant="ghost" color="white">Login</UButton>
          <UButton to="/register" variant="ghost" color="white"
            >Register</UButton
          >
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="fade">
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden mt-4 bg-gray-900 rounded-lg shadow-lg p-4 flex flex-col gap-4 z-50">
          <div v-if="isAuthenticated" class="flex flex-col gap-2">
            <template v-if="isAdmin">
              <UButton to="/admin" variant="ghost" color="white"
                >Admin Panel</UButton
              >
            </template>
            <template v-else>
              <UButton to="/dashboard" variant="ghost" color="white"
                >Dashboard</UButton
              >
              <UButton
                to="/dashboard/transactions"
                variant="ghost"
                color="white"
                >Transactions</UButton
              >
            </template>
            <UButton
              :to="isAdmin ? '/admin/profile' : '/dashboard/profile'"
              variant="ghost"
              color="white"
              >Profile</UButton
            >
            <UButton @click="authStore.logout" color="red" variant="soft"
              >Logout</UButton
            >
          </div>
          <div v-else class="flex flex-col gap-2">
            <UButton to="/login" variant="ghost" color="white">Login</UButton>
            <UButton to="/register" variant="ghost" color="white"
              >Register</UButton
            >
          </div>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { isAuthenticated, isAdmin } = storeToRefs(authStore)
const isMobileMenuOpen = ref(false)
const route = useRoute()

const hideDesktopNav = computed(() =>
  ['/login', '/register'].includes(route.path)
)

watch(
  () => useRoute().path,
  () => {
    isMobileMenuOpen.value = false
  }
)
</script>
