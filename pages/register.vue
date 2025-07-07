<template>
  <div class="max-w-md mx-auto my-20">
    <UCard class="bg-gray-800 text-white">
      <template #header>
        <h2 class="text-2xl font-bold">Register</h2>
      </template>
      <form @submit.prevent="handleRegister">
        <div class="space-y-6">
          <UFormGroup label="First Name" class="text-gray-300">
            <UInput v-model.trim="firstName" required />
          </UFormGroup>
          <UFormGroup label="Last Name" class="text-gray-300">
            <UInput v-model.trim="lastName" required />
          </UFormGroup>
          <UFormGroup label="Email" class="text-gray-300">
            <UInput v-model.trim="email" type="email" required />
          </UFormGroup>
          <UFormGroup label="Password" class="text-gray-300">
            <CustomPasswordInput v-model.trim="password" required />
          </UFormGroup>
          <UButton type="submit" block :loading="loading"> Register </UButton>
        </div>
      </form>
      <div class="mt-4 text-center">
        <span class="text-gray-400">Already have an account?</span>
        <NuxtLink to="/login" class="text-primary-400 ml-1">Login</NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['guest'],
})

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const toast = useToast()

const authStore = useAuthStore()

const handleRegister = async () => {
  loading.value = true
  try {
    const payload = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    }
    await authStore.register(payload)
    navigateTo('/dashboard')
    toast.add({ title: 'Registration successful', color: 'green' })
  } catch (error: any) {
    toast.add({
      title: getErrorMessage(error, 'Registration failed'),
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>
