<template>
  <div class="max-w-md mx-auto my-20">
    <UCard class="bg-gray-800 text-white">
      <template #header>
        <h2 class="text-2xl font-bold">Login</h2>
      </template>

      <form @submit.prevent="handleLogin">
        <div class="space-y-6">
          <UFormGroup label="Email" class="text-gray-300">
            <UInput v-model.trim="email" type="email" required />
          </UFormGroup>

          <UFormGroup label="Password" class="text-gray-300">
            <CustomPasswordInput v-model.trim="password" required />
          </UFormGroup>

          <UButton type="submit" block :loading="loading"> Login </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { Role } from '~/common/types'

definePageMeta({
  middleware: ['guest'],
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const toast = useToast()

const authStore = useAuthStore()

const handleLogin = async () => {
  loading.value = true
  try {
    const payload = {
      email: email.value,
      password: password.value,
    }

    const user = await authStore.login(payload)

    navigateTo(user.role === Role.ADMIN ? '/admin' : '/dashboard')

    toast.add({ title: 'Logged in successfully', color: 'green' })
  } catch (error: any) {
    toast.add({
      title: getErrorMessage(error, 'Login failed'),
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>
