<template>
  <div>
    <h1 class="text-2xl font-bold mb-8">Admin Dashboard</h1>

    <UTabs :items="tabItems" :default-selected="0" @change="handleTabChange">
      <template #item="{ item }">
        <UCard class="mt-4">
          <template #header>
            <p
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ item.label }}
            </p>
          </template>

          <!-- Users Tab Content -->
          <div v-if="item.key === 'users'">
            <AdminUsersTable ref="usersTableRef" />
          </div>

          <!-- Transactions Tab Content -->
          <div v-else-if="item.key === 'transactions'">
            <AdminTransactionsTable ref="transactionsTableRef" />
          </div>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
const usersTableRef = ref()
const transactionsTableRef = ref()

const tabItems = [
  {
    key: 'users',
    label: 'Users',
    description: 'Manage system users and their permissions',
  },
  {
    key: 'transactions',
    label: 'Transactions',
    description: 'View and manage all system transactions',
  },
]

const handleTabChange = (index: number) => {
  const item = tabItems[index]
  if (item.key === 'users') {
    usersTableRef.value?.fetchUsers()
  } else if (item.key === 'transactions') {
    transactionsTableRef.value?.fetchTransactions()
  }
}

// Initial load of users data
onMounted(() => {
  usersTableRef.value?.fetchUsers()
})
</script>
