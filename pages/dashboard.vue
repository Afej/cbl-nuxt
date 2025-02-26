<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
})

import { Role } from '~/common/types'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

onMounted(() => {
  if (user.value?.role === Role.ADMIN) {
    navigateTo('/admin')
  }
})
</script>

<style></style>
