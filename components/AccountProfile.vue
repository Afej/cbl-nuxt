<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Profile Card -->
      <UCard>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="First Name">
              <UInput v-model.trim="profile.firstName" required />
            </UFormGroup>

            <UFormGroup label="Last Name">
              <UInput v-model.trim="profile.lastName" required />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Email">
              <UInput v-model.trim="profile.email" type="email" required />
            </UFormGroup>

            <UFormGroup label="Role">
              <UInput v-model="profile.role" disabled placeholder="User Role" />
            </UFormGroup>
          </div>

          <div class="text-sm text-gray-500 capitalize">
            Account Status: {{ profile.accountStatus }}
            <br />
            Member since:
            {{ formatDate(profile.createdAt) }}
          </div>

          <div class="flex justify-end gap-4">
            <UButton type="submit" :loading="loading">Update Profile</UButton>
          </div>
        </form>
      </UCard>

      <!-- Security Card -->
      <UCard>
        <h3 class="text-lg font-semibold mb-4">Security Settings</h3>
        <p class="text-gray-600 mb-4">
          Manage your password and security preferences
        </p>
        <UButton @click="isChangePasswordOpen = true">Change Password</UButton>
      </UCard>
    </div>

    <!-- Change Password Modal -->
    <UModal v-model="isChangePasswordOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Change Password</h3>
        </template>

        <form @submit.prevent="changePassword" class="space-y-4">
          <UFormGroup label="Current Password">
            <CustomPasswordInput
              v-model.trim="passwordForm.currentPassword"
              required />
          </UFormGroup>

          <UFormGroup label="New Password">
            <CustomPasswordInput
              v-model.trim="passwordForm.newPassword"
              required />
          </UFormGroup>

          <div class="flex justify-end gap-4">
            <UButton
              color="gray"
              variant="ghost"
              @click="isChangePasswordOpen = false">
              Cancel
            </UButton>
            <UButton type="submit" :loading="passwordLoading">
              Update Password
            </UButton>
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ChangePasswordDTO } from '~/common/types'

const { authApi } = useApi()
const toast = useToast()

const loading = ref(false)
const passwordLoading = ref(false)
const isChangePasswordOpen = ref(false)

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const profile = reactive({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  role: user.value?.role || '',
  accountStatus: user.value?.accountStatus || '',
  createdAt: user.value?.createdAt || '',
})

const passwordForm = reactive<ChangePasswordDTO>({
  currentPassword: '',
  newPassword: '',
})

const fetchProfile = async () => {
  try {
    await authStore.fetchUser()
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to load profile'),
      color: 'red',
    })
  }
}

const updateProfile = async () => {
  loading.value = true
  try {
    const payload = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    }
    await authApi.updateProfile(payload)
    toast.add({ title: 'Profile updated successfully', color: 'green' })
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to update profile'),
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  passwordLoading.value = true
  try {
    await authApi.changePassword(passwordForm)
    toast.add({ title: 'Password changed successfully', color: 'green' })
    isChangePasswordOpen.value = false
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to change password'),
      color: 'red',
    })
  } finally {
    passwordLoading.value = false
  }
}

onMounted(() => {
  fetchProfile
})
</script>
