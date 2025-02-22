<template>
  <div>
    <h1 class="text-2xl font-bold mb-8">Admin Dashboard</h1>

    <UTabs :items="tabItems" default-select="users">
      <template #item="{ item }">
        <UCard class="mt-4">
          <template #header>
            <p
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ item.label }}
            </p>
          </template>

          <!-- Users Tab Content -->
          <div v-if="item.key === 'users'" class="space-y-4">
            <UButton
              @click="showAddUserModal = true"
              color="primary"
              icon="i-heroicons-user-plus">
              Add User
            </UButton>

            <UTable
              :columns="userColumns"
              :rows="users"
              :loading="loadingUsers">
              <template #role-data="{ row }">
                <span class="capitalize">
                  {{ row.role }}
                </span>
              </template>
              <template #status-data="{ row }">
                <UBadge
                  :color="
                    row.accountStatus === UserAccountStatus.Active
                      ? 'green'
                      : 'red'
                  ">
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
                v-model="userCurrentPage"
                :total="userMeta.totalPages"
                :loading="loadingUsers"
                @update:model-value="handleUserPageChange" />
            </div>
          </div>

          <!-- Transactions Tab Content -->
          <div v-else-if="item.key === 'transactions'">
            <UTable
              :columns="transactionColumns"
              :rows="transactions"
              :loading="loadingTransactions">
              <template #amount-data="{ row }">
                <span
                  :class="row.amount > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ row.amount > 0 ? '+' : '' }}${{ row.amount }}
                </span>
              </template>
              <template #actions-data="{ row }">
                <UButton
                  v-if="row.type === 'transfer'"
                  size="sm"
                  color="orange"
                  icon="i-heroicons-arrow-path"
                  @click="confirmReverseTransaction(row)">
                  Reverse
                </UButton>
              </template>
            </UTable>

            <div class="flex justify-center mt-4">
              <UPagination
                v-model="transactionCurrentPage"
                :total="transactionMeta.totalPages"
                :loading="loadingTransactions"
                @update:model-value="handleTransactionPageChange" />
            </div>
          </div>
        </UCard>
      </template>
    </UTabs>

    <!-- Add User Modal -->
    <UModal v-model="showAddUserModal">
      <UCard>
        <template #header>
          <h3 class="text-xl font-bold">Add New User</h3>
        </template>
        <form @submit.prevent="handleAddUser" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="First Name">
              <UInput v-model="newUser.firstName" required />
            </UFormGroup>
            <UFormGroup label="Last Name">
              <UInput v-model="newUser.lastName" required />
            </UFormGroup>
          </div>

          <UFormGroup label="Email">
            <UInput v-model="newUser.email" type="email" required />
          </UFormGroup>

          <UFormGroup label="Password">
            <CustomPasswordInput v-model="newUser.password" required />
          </UFormGroup>

          <UFormGroup label="Role">
            <USelect
              v-model="newUser.role"
              :options="Object.values(UserRole)"
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

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-model:show="showConfirmModal"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      :on-confirm="confirmConfig.onConfirm" />
  </div>
</template>

<script setup lang="ts">
import type {
  User,
  CreateUserDTO,
  WalletTransaction,
  PageMeta,
} from '~/common/types'
import { UserRole, UserAccountStatus } from '~/common/types'

const toast = useToast()
const showConfirmModal = ref(false)
const confirmConfig = ref({
  title: '',
  message: '',
  onConfirm: () => {},
})

const tabItems = [
  {
    key: 'users',
    label: 'User Management',
    description: 'Manage system users and their permissions',
  },
  {
    key: 'transactions',
    label: 'Transaction Management',
    description: 'View and manage all system transactions',
  },
]

const userColumns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const showAddUserModal = ref(false)
const addingUser = ref(false)
const loadingUsers = ref(false)
const loadingTransactions = ref(false)

const userCurrentPage = ref(1)
const transactionCurrentPage = ref(1)

const userMeta = ref<PageMeta>({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
})

const transactionMeta = ref<PageMeta>({
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
  role: UserRole.User,
  accountStatus: UserAccountStatus.Active,
})

const users = ref<User[]>([])
const transactions = ref<WalletTransaction[]>([])

const transactionColumns = [
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
  { key: 'actions', label: 'Actions' },
]

const { adminTransactions, adminUsers } = useAdmin()

const fetchUsers = async (page = 1) => {
  loadingUsers.value = true
  try {
    const response = await adminUsers.getUsers({ page, limit: 10 })
    users.value = response.data
    userMeta.value = response.meta
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to load users'),
      color: 'red',
    })
  } finally {
    loadingUsers.value = false
  }
}

const fetchTransactions = async (page = 1) => {
  loadingTransactions.value = true
  try {
    const response = await adminTransactions.getAllTransactions({
      page,
      limit: 10,
    })
    transactions.value = response.data
    transactionMeta.value = response.meta
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to load transactions'),
      color: 'red',
    })
  } finally {
    loadingTransactions.value = false
  }
}

const handleUserPageChange = (page: number) => {
  userCurrentPage.value = page
  fetchUsers(page)
}

const handleTransactionPageChange = (page: number) => {
  transactionCurrentPage.value = page
  fetchTransactions(page)
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
    await fetchUsers(userCurrentPage.value)
    toast.add({ title: 'User deleted successfully', color: 'green' })
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to delete user'),
      color: 'red',
    })
  }
}

const confirmReverseTransaction = (transaction: WalletTransaction) => {
  const { amount } = transaction.details

  confirmConfig.value = {
    title: 'Reverse Transaction',
    message: `Are you sure you want to reverse this transaction of $${amount}?`,

    onConfirm: () => reverseTransaction(transaction._id),
  }
  showConfirmModal.value = true
}

const reverseTransaction = async (id: string) => {
  try {
    await adminTransactions.reverseTransaction(id)
    await fetchTransactions(transactionCurrentPage.value)
    toast.add({ title: 'Transaction reversed successfully', color: 'green' })
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to reverse transaction'),
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
      role: UserRole.User,
      accountStatus: UserAccountStatus.Active,
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

onMounted(() => {
  fetchUsers()
  fetchTransactions()
})
</script>
