<template>
  <div>
    <h1 class="text-2xl font-bold mb-8">Transaction History</h1>

    <UCard>
      <UTable :columns="columns" :rows="transactions" :loading="loading">
        <template #date-data="{ row }">
          {{ new Date(row.date).toLocaleDateString() }}
        </template>
        <template #amount-data="{ row }">
          <span :class="row.amount > 0 ? 'text-green-600' : 'text-red-600'">
            {{ row.amount > 0 ? '+' : '' }}${{ row.amount }}
          </span>
        </template>
      </UTable>

      <div class="flex justify-center mt-4">
        <UPagination
          v-model="currentPage"
          :total="meta.totalPages"
          :loading="loading"
          @update:model-value="handlePageChange" />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { WalletTransaction } from '~/common/types'
import type { PageMeta } from '~/common/types/global'

const toast = useToast()
const { fetchTransactions } = useWallet()

const transactions = ref<WalletTransaction[]>([])
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

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
]

const getTransactions = async (page = 1) => {
  loading.value = true
  try {
    const response = await fetchTransactions({ page, limit: 10 })
    transactions.value = response.data
    meta.value = response.meta
  } catch {
    toast.add({ title: 'Failed to load transactions', color: 'red' })
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  getTransactions(page)
}

onMounted(() => getTransactions(1))
</script>
