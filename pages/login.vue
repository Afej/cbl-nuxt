<template>
  <div class="max-w-md mx-auto my-20">
    <UCard class="bg-gray-800 text-white">
      <template #header>
        <h2 class="text-2xl font-bold">Login</h2>
      </template>

      <form @submit.prevent="handleLogin">
        <div class="space-y-4">
          <UFormGroup label="Email" class="text-gray-300">
            <UInput v-model="email" type="email" required />
          </UFormGroup>

          <UFormGroup label="Password" class="text-gray-300">
            <UInput v-model="password" type="password" required />
          </UFormGroup>

          <UButton type="submit" block :loading="loading"> Login </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { UserRole } from '~/common/types'

definePageMeta({
  middleware: ['guest'],
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const toast = useToast()

const authStore = useAuthStore()

async function handleLogin() {
  loading.value = true
  try {
    const payload = {
      email: email.value,
      password: password.value,
    }

    const user = await authStore.login(payload)

    toast.add({ title: 'Logged in successfully', color: 'green' })

    user.role === UserRole.Admin
      ? navigateTo('/admin')
      : navigateTo('/dashboard')
  } catch (error: any) {
    toast.add({
      title: 'Login failed',
      description: `${error.message}`,
      color: 'red',
    })
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>
