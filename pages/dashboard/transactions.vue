<template>
  <div>
    <h1 class="text-2xl font-bold mb-8">Transaction History</h1>

    <UCard>
      <UTable
        :columns="columns"
        :rows="transformedTransactions"
        :loading="loading">
        <template #createdAt-data="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
        <template #type-data="{ row }">
          <span class="capitalize">{{ row.type }}</span>
        </template>
        <template #amount-data="{ row }">
          <span :class="getAmountClass(row.type)">
            {{ getAmountPrefix(row.type) }}${{
              formattedNumber(row.details.amount)
            }}
          </span>
        </template>
        <template #status-data="{ row }">
          <UBadge :color="row.details.success ? 'green' : 'red'">
            {{ row.details.success ? 'Success' : 'Failed' }}
          </UBadge>
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
  { key: 'createdAt', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]

const transformedTransactions = computed(() => {
  return transactions.value.map((transaction) => ({
    ...transaction,
    amount: transaction.details.amount,
  }))
})

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
