<template>
  <div>
    <h1 class="text-2xl font-bold mb-8">Transaction History</h1>

    <UCard>
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <USelect
          v-model="selectedType"
          :options="transactionTypeOptions"
          placeholder="Filter by type" />

        <USelect
          v-model="selectedStatus"
          :options="transactionStatusOptions"
          placeholder="Filter by status" />
      </div>

      <UTable
        :columns="columns"
        :rows="transformedTransactions"
        :loading="loading">
        <template #createdAt-data="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
        <template #type-data="{ row }">
          <UBadge :color="getTypeColor(row.type)" class="capitalize">
            {{ row.type }}
          </UBadge>
        </template>
        <template #amount-data="{ row }">
          <span :class="getAmountClass(row.details.amount)">
            ${{ formattedNumber(row.details.amount) }}
          </span>
        </template>
        <template #description-data="{ row }">
          {{ row.details.description || 'nil' }}
        </template>
        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)">
            <span class="capitalize">{{ row.status }}</span>
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
import { TransactionType, TransactionStatus } from '~/common/types'
import {
  getAmountClass,
  getTypeColor,
  getStatusColor,
} from '~/utils/transactions'

const toast = useToast()
const { fetchTransactions } = useWallet()

const selectedType = ref<TransactionType | ''>('')
const selectedStatus = ref<TransactionStatus | ''>('')

const transactionTypeOptions = [
  { label: 'All Types', value: '' },
  ...Object.values(TransactionType).map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
    value: type,
  })),
]

const transactionStatusOptions = [
  { label: 'All Statuses', value: '' },
  ...Object.values(TransactionStatus).map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
    value: status,
  })),
]

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
  { key: 'description', label: 'Description' },
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
    const params: any = {
      page,
      limit: 10,
    }

    if (selectedType.value) {
      params.type = selectedType.value
    }

    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }

    const response = await fetchTransactions(params)
    transactions.value = response.data
    meta.value = response.meta
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to load transactions'),
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  getTransactions(page)
}

watch([selectedType, selectedStatus], () => {
  currentPage.value = 1
  getTransactions(1)
})

onMounted(() => getTransactions(1))
</script>
