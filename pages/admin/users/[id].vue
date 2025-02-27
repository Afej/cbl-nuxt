<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold">User Details</h1>

      <div class="flex items-center gap-2 justify-between">
        <UButton
          v-if="user"
          class="hidden md:block"
          icon="i-heroicons-pencil-square"
          color="primary"
          variant="soft"
          @click="openEditForm">
          Edit Profile
        </UButton>

        <UButton icon="i-heroicons-arrow-left" variant="ghost" @click="goBack">
          Back
        </UButton>
      </div>
    </div>

    <UCard>
      <!-- Custom Loading Spinner -->
      <div
        v-if="loading"
        class="flex justify-center items-center min-h-[200px]">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="user">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:hidden">
            <UButton
              icon="i-heroicons-pencil-square"
              color="primary"
              variant="soft"
              @click="openEditForm">
              Edit Profile
            </UButton>
          </div>

          <div>
            <h3 class="font-semibold mb-4">Personal Information</h3>
            <div class="space-y-3">
              <div>
                <span class="text-gray-500">First Name:</span>
                <p>{{ user.firstName }}</p>
              </div>
              <div>
                <span class="text-gray-500">Last Name:</span>
                <p>{{ user.lastName }}</p>
              </div>
              <div>
                <span class="text-gray-500">Email:</span>
                <p>{{ user.email }}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold mb-4">Account Information</h3>
            <div class="space-y-3">
              <div>
                <span class="text-gray-500 mr-2">Account Status:</span>
                <UBadge
                  :color="getAccountStatusColor(user.accountStatus)"
                  class="capitalize">
                  {{ user.accountStatus }}
                </UBadge>
              </div>
              <div>
                <span class="text-gray-500 mr-2">Role:</span>
                <UBadge color="blue" class="capitalize">
                  {{ user.role }}
                </UBadge>
              </div>
              <div>
                <span class="text-gray-500 mr-2">Joined:</span>
                <p>{{ formatDate(user.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <UDivider class="my-8" />

        <div>
          <h3 class="font-semibold mb-4">Recent Transactions</h3>
          <UTable
            :columns="transactionColumns"
            :loading="loading"
            :rows="userTransactions">
            <template #createdAt-data="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
            <template #type-data="{ row }">
              <UBadge :color="getTypeColor(row.type)" class="capitalize">
                {{ row.type }}
              </UBadge>
            </template>
            <template #amount-data="{ row }">
              <span :class="getAmountClass(row.details.amount)">
                ${{ getTransactionAmount(row.details.amount) }}
              </span>
            </template>
            <template #description-data="{ row }">
              {{ row.details.description || 'nil' }}
            </template>
            <template #status-data="{ row }">
              <UBadge :color="getStatusColor(row.status)" class="capitalize">
                {{ row.status }}
              </UBadge>
            </template>
          </UTable>
        </div>
      </div>
    </UCard>

    <USlideover
      v-model="isEditing"
      :ui="{ width: 'sm:max-w-xl' }"
      :prevent-close="updating">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6">Edit User Profile</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              class="-my-1"
              @click="isEditing = false" />
          </div>
        </template>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <UFormGroup label="First Name" required>
            <UInput
              v-model="editForm.firstName"
              placeholder="Enter first name"
              required />
          </UFormGroup>

          <UFormGroup label="Last Name" required>
            <UInput
              v-model="editForm.lastName"
              placeholder="Enter last name"
              required />
          </UFormGroup>

          <UFormGroup label="Email" required>
            <UInput
              v-model="editForm.email"
              type="email"
              placeholder="Enter email"
              required />
          </UFormGroup>

          <UFormGroup label="Account Role" required>
            <USelect
              v-model="editForm.role"
              :options="roleOptions"
              placeholder="Select Role"
              required />
          </UFormGroup>

          <UFormGroup label="Account Status" required>
            <USelect
              v-model="editForm.accountStatus"
              :options="accountStatusOptions"
              placeholder="Select status"
              required />
          </UFormGroup>
          <div class="flex justify-end gap-3 mt-6">
            <UButton
              color="gray"
              variant="ghost"
              @click="isEditing = false"
              :disabled="updating">
              Cancel
            </UButton>
            <UButton color="primary" :loading="updating" type="submit">
              Save Changes
            </UButton>
          </div>
        </form>

        <!-- <template #footer> </template> -->
      </UCard>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import { AccountStatus, Role, type User } from '~/common/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { adminUsers } = useAdmin()

const userId = route.params.id as string
const loading = ref(false)
const user = ref<User | null>(null)
const userTransactions = computed(() => user.value?.transactions || [])

const transactionColumns = [
  { key: 'createdAt', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
]

const getAccountStatusColor = (status: AccountStatus) => {
  switch (status) {
    case AccountStatus.ACTIVE:
      return 'green'
    case AccountStatus.DISABLED:
      return 'red'
    default:
      return 'gray'
  }
}

const fetchUserDetails = async () => {
  loading.value = true
  try {
    user.value = await adminUsers.getUser(userId)
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to load user details'),
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(fetchUserDetails)

const isEditing = ref(false)
const updating = ref(false)

const editForm = ref({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  role: user.value?.role || '',
  accountStatus: user.value?.accountStatus || '',
})

// Watch for user data changes to update the form
watch(
  () => user.value,
  (newUser) => {
    if (newUser) {
      editForm.value = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        accountStatus: newUser.accountStatus,
      }
    }
  },
  { immediate: true }
)

const accountStatusOptions = [
  ...Object.values(AccountStatus).map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    value: status,
  })),
]

const roleOptions = [
  ...Object.values(Role).map((role) => ({
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
    value: role,
  })),
]

const openEditForm = () => {
  isEditing.value = true
}

const handleSubmit = async () => {
  updating.value = true
  try {
    const payload = {
      ...editForm.value,
      accountStatus: editForm.value.accountStatus as AccountStatus,
      role: editForm.value.role as Role,
    }

    await adminUsers.editUser(userId, payload)

    await fetchUserDetails()
    isEditing.value = false
    toast.add({ title: 'User updated successfully', color: 'green' })
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to update user'),
      color: 'red',
    })
  } finally {
    updating.value = false
  }
}
</script>
