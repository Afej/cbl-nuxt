<template>
  <header class="bg-gray-800 shadow">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold text-primary-400"
          >CBL</NuxtLink
        >

        <div v-if="isAuthenticated" class="flex gap-4">
          <template v-if="isAdmin">
            <UButton to="/admin" variant="ghost" color="white"
              >Admin Panel</UButton
            >
          </template>
          <template v-else>
            <UButton to="/dashboard" variant="ghost" color="white"
              >Dashboard</UButton
            >
            <UButton to="/transactions" variant="ghost" color="white"
              >Transactions</UButton
            >
          </template>

          <UButton to="/profile" variant="ghost" color="white">Profile</UButton>
          <UButton @click="authStore.logout" color="red" variant="soft"
            >Logout</UButton
          >
        </div>

        <div v-else>
          <UButton to="/login" variant="ghost" color="white">Login</UButton>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const { isAuthenticated, isAdmin } = storeToRefs(authStore)
</script>
