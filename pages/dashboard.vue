<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
})

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.isAdmin) {
    navigateTo('/admin')
  }
})
</script>

<style></style>
