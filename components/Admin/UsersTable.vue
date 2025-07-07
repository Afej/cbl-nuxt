<template>
  <div class="space-y-4">
    <div
      class="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <UButton
          @click="showAddUserModal = true"
          color="primary"
          icon="i-heroicons-user-plus">
          Add User
        </UButton>
      </div>

      <div class="flex gap-4 items-center">
        <USelect
          v-model="selectedRole"
          :options="roleOptions"
          placeholder="Filter by role" />

        <USelect
          v-model="selectedStatus"
          :options="statusOptions"
          placeholder="Filter by status" />

        <UInput
          class="hidden md:block"
          v-model.trim="searchQuery"
          placeholder="Search users..."
          icon="i-heroicons-magnifying-glass"
          @input="handleSearch" />

        <UButton
          icon="i-heroicons-arrow-path"
          size="sm"
          color="gray"
          variant="outline"
          class="ml-2"
          @click="resetFilters"
          :title="'Reset filters'" />
      </div>

      <UInput
        class="md:hidden"
        v-model.trim="searchQuery"
        placeholder="Search users..."
        icon="i-heroicons-magnifying-glass"
        @input="handleSearch" />
    </div>

    <UTable :columns="columns" :rows="users" :loading="loading">
      <template #role-data="{ row }">
        <span class="capitalize">
          {{ row.role }}
        </span>
      </template>
      <template #status-data="{ row }">
        <UBadge
          :color="row.accountStatus === AccountStatus.ACTIVE ? 'green' : 'red'">
          <span class="capitalize">
            {{ row.accountStatus }}
          </span>
        </UBadge>
      </template>
      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton
            size="sm"
            color="gray"
            :to="`/admin/users/${row._id}`"
            icon="i-heroicons-eye">
            View
          </UButton>
          <UButton
            size="sm"
            color="red"
            icon="i-heroicons-trash"
            @click="confirmDeleteUser(row)">
            Delete
          </UButton>
        </div>
      </template>
    </UTable>

    <div class="flex justify-center mt-4">
      <UPagination
        v-model="currentPage"
        :total="meta.totalPages"
        :loading="loading"
        @update:model-value="handlePageChange" />
    </div>

    <!-- Add User Modal -->
    <UModal v-model="showAddUserModal" :fullscreen="isMobile">
      <UCard>
        <template #header>
          <h3 class="text-xl font-bold">Add New User</h3>
        </template>
        <form @submit.prevent="handleAddUser" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="First Name">
              <UInput v-model.trim="newUser.firstName" required />
            </UFormGroup>
            <UFormGroup label="Last Name">
              <UInput v-model.trim="newUser.lastName" required />
            </UFormGroup>
          </div>

          <UFormGroup label="Email">
            <UInput v-model.trim="newUser.email" type="email" required />
          </UFormGroup>

          <UFormGroup label="Password">
            <CustomPasswordInput v-model.trim="newUser.password" required />
          </UFormGroup>

          <UFormGroup label="Role">
            <USelect
              v-model="newUser.role"
              :options="roleOptions.filter((option) => option.value !== '')"
              required />
          </UFormGroup>

          <div class="flex justify-end gap-2">
            <UButton @click="showAddUserModal = false" variant="ghost"
              >Cancel</UButton
            >
            <UButton type="submit" color="primary" :loading="addingUser"
              >Add User</UButton
            >
          </div>
        </form>
      </UCard>
    </UModal>

    <ConfirmationModal
      v-model:show="showConfirmModal"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      :on-confirm="confirmConfig.onConfirm" />
  </div>
</template>

<script lang="ts" setup>
import type {
  User,
  CreateUserDTO,
  PageMeta,
  GetUsersParams,
} from '~/common/types'
import { Role, AccountStatus } from '~/common/types'

const toast = useToast()

const showConfirmModal = ref(false)

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 640)

const confirmConfig = ref({
  title: '',
  message: '',
  onConfirm: () => {},
})

const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const showAddUserModal = ref(false)
const addingUser = ref(false)
const loading = ref(false)

const currentPage = ref(1)

const meta = ref<PageMeta>({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
})

const newUser = ref<CreateUserDTO>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: Role.USER,
  accountStatus: AccountStatus.ACTIVE,
})

const users = ref<User[]>([])

const { adminUsers } = useAdmin()

// Convert enum to select options
const roleOptions = [
  { label: 'All Roles', value: '' },
  ...Object.values(Role).map((role) => ({
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
    value: role,
  })),
]

const statusOptions = [
  { label: 'All Statuses', value: '' },
  ...Object.values(AccountStatus).map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    value: status,
  })),
]

const searchQuery = ref('')
const selectedRole = ref<Role | ''>('')
const selectedStatus = ref<AccountStatus | ''>('')

const fetchUsers = async (page = 1) => {
  loading.value = true
  try {
    const params: GetUsersParams = {
      page,
      limit: 10,
    }

    if (selectedRole.value) {
      params.role = selectedRole.value
    }

    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    const response = await adminUsers.getUsers(params)
    users.value = response.data
    meta.value = response.meta
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to load users'),
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}

const handleSearch = useDebounceFn(() => {
  currentPage.value = 1
  fetchUsers(1)
}, 500)

watch([selectedRole, selectedStatus], () => {
  currentPage.value = 1
  fetchUsers(1)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchUsers(page)
}

const confirmDeleteUser = (user: User) => {
  const { _id, firstName, lastName } = user

  confirmConfig.value = {
    title: 'Delete User',
    message: `Are you sure you want to delete ${firstName} ${lastName}?`,
    onConfirm: () => deleteUser(_id),
  }
  showConfirmModal.value = true
}

const deleteUser = async (id: string) => {
  try {
    await adminUsers.deleteUser(id)
    await fetchUsers(currentPage.value)
    toast.add({ title: 'User deleted successfully', color: 'green' })
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to delete user'),
      color: 'red',
    })
  }
}

const handleAddUser = async () => {
  addingUser.value = true
  try {
    await adminUsers.createUser(newUser.value)
    await fetchUsers(1)
    showAddUserModal.value = false
    toast.add({ title: 'User created successfully', color: 'green' })
    newUser.value = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: Role.USER,
      accountStatus: AccountStatus.ACTIVE,
    }
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to create user'),
      color: 'red',
    })
  } finally {
    addingUser.value = false
  }
}

const resetFilters = () => {
  selectedRole.value = ''
  selectedStatus.value = ''
  searchQuery.value = ''
  currentPage.value = 1
  fetchUsers(1)
}

onMounted(() => {
  fetchUsers()
})

defineExpose({
  fetchUsers,
  resetFilters,
})
</script>

<style></style>
