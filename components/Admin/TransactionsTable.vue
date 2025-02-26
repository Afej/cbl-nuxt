<template>
  <div>
    <div
      class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
      <div class="flex gap-4 items-center">
        <USelect
          v-model="selectedType"
          :options="transactionTypeOptions"
          placeholder="Filter by type" />

        <USelect
          v-model="selectedStatus"
          :options="transactionStatusOptions"
          placeholder="Filter by status" />

        <UInput
          v-model.trim="searchQuery"
          placeholder="Search transactions..."
          icon="i-heroicons-magnifying-glass"
          @input="handleSearch" />
      </div>
    </div>

    <UTable :columns="columns" :rows="transactions" :loading="loading">
      <template #createdAt-data="{ row }">
        {{ formatDate(row.createdAt) }}
      </template>
      <template #user-data="{ row }">
        <div class="space-y-1">
          <div class="font-medium">
            {{ (row.userId as User).firstName }}
            {{ (row.userId as User).lastName }}
          </div>
          <div class="text-sm text-gray-500">
            {{ (row.userId as User).email }}
          </div>
        </div>
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
          <span class="capitalize">
            {{ row.status }}
          </span>
        </UBadge>
      </template>
      <template #actions-data="{ row }">
        <UButton
          v-if="
            row.type === TransactionType.TRANSFER &&
            row.status !== TransactionStatus.REVERSED
          "
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
        v-model="currentPage"
        :total="meta.totalPages"
        :loading="loading"
        @update:model-value="handlePageChange" />
    </div>

    <ConfirmationModal
      v-model:show="showConfirmModal"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      :on-confirm="confirmConfig.onConfirm" />
  </div>
</template>

<script lang="ts" setup>
import type {
  WalletTransaction,
  User,
  PageMeta,
  GetTransactionsParams,
} from '~/common/types'
import { TransactionType, TransactionStatus } from '~/common/types'

const toast = useToast()
const { adminTransactions } = useAdmin()

const columns = [
  { key: 'createdAt', label: 'Date' },
  { key: 'user', label: 'User Details' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const loading = ref(false)
const transactions = ref<WalletTransaction[]>([])
const currentPage = ref(1)

const meta = ref<PageMeta>({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
})

const showConfirmModal = ref(false)
const confirmConfig = ref({
  title: '',
  message: '',
  onConfirm: () => {},
})

const searchQuery = ref('')
const selectedType = ref<TransactionType | ''>('')
const selectedStatus = ref<TransactionStatus | ''>('')

// Convert enums to select options
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

const handleSearch = useDebounceFn(() => {
  currentPage.value = 1
  fetchTransactions(1)
}, 500)

watch([selectedType, selectedStatus], () => {
  currentPage.value = 1
  fetchTransactions(1)
})

const fetchTransactions = async (page = 1) => {
  loading.value = true
  try {
    const params: GetTransactionsParams = {
      page,
      limit: 10,
    }

    if (selectedType.value) {
      params.type = selectedType.value
    }

    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    const response = await adminTransactions.getAllTransactions(params)
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
  fetchTransactions(page)
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
    await fetchTransactions(currentPage.value)
    toast.add({ title: 'Transaction reversed successfully', color: 'green' })
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to reverse transaction'),
      color: 'red',
    })
  }
}

onMounted(() => {
  fetchTransactions()
})

defineExpose({
  fetchTransactions,
})
</script>

<style></style>
