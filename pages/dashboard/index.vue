<template>
  <div class="text-white">
    <h1 class="text-2xl font-bold mb-8">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Balance Card -->
      <UCard class="bg-gray-800">
        <div class="text-center">
          <h3 class="text-gray-400 mb-2">Current Balance</h3>
          <p class="text-3xl font-bold">${{ formattedNumber(balance) }}</p>
        </div>
      </UCard>

      <!-- Quick Actions -->
      <UCard class="bg-gray-800">
        <div class="space-y-4">
          <h3 class="font-semibold mb-4">Quick Actions</h3>
          <div class="flex gap-2">
            <UButton @click="openModal('deposit')" color="green"
              >Deposit</UButton
            >
            <UButton @click="openModal('withdraw')" color="orange"
              >Withdraw</UButton
            >
            <UButton @click="openModal('transfer')" color="white"
              >Transfer</UButton
            >
          </div>
        </div>
      </UCard>

      <!-- Recent Activity -->
      <UCard class="bg-gray-800">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Recent Activity</h3>
          <NuxtLink
            to="/dashboard/transactions"
            class="hover:underline text-sm">
            See More
          </NuxtLink>
        </div>

        <div v-if="recentTransactions.length" class="space-y-3">
          <div
            v-for="tx in recentTransactions"
            :key="tx._id"
            class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <UBadge :color="getTypeColor(tx.type)" class="capitalize">
                {{ tx.type }}
              </UBadge>
            </div>
            <span :class="getAmountClass(tx.details.amount)">
              ${{ formattedNumber(tx.details.amount) }}
            </span>
          </div>
        </div>
        <p v-else class="text-gray-400">No recent transactions</p>
      </UCard>
    </div>

    <!-- Modals -->
    <TransactionModal
      type="deposit"
      :active-modal="activeModal"
      :is-loading="isTransactionLoading"
      @close="closeModal"
      @submit="handleDeposit">
      <UFormGroup label="Amount" class="text-gray-300">
        <UInput
          v-model.trim="depositAmount"
          type="number"
          min="0"
          step="0.01"
          required />
      </UFormGroup>
    </TransactionModal>

    <TransactionModal
      type="withdraw"
      :active-modal="activeModal"
      :is-loading="isTransactionLoading"
      @close="closeModal"
      @submit="handleWithdrawal">
      <UFormGroup label="Amount" class="text-gray-300">
        <UInput
          v-model.trim="withdrawAmount"
          type="number"
          min="0"
          step="0.01"
          required />
      </UFormGroup>
    </TransactionModal>

    <TransactionModal
      type="transfer"
      :active-modal="activeModal"
      :is-loading="isTransactionLoading"
      @close="closeModal"
      @submit="handleTransfer">
      <UFormGroup label="Receiver's Email" class="text-gray-300">
        <UInput v-model.trim="transferForm.email" type="email" required />
      </UFormGroup>
      <UFormGroup label="Amount" class="text-gray-300 mt-4">
        <UInput
          v-model.trim="transferForm.amount"
          type="number"
          min="0"
          step="0.01"
          required />
      </UFormGroup>
    </TransactionModal>
  </div>
</template>

<script setup lang="ts">
import type { TransactionModalType, WalletTransaction } from '~/common/types'

const {
  getUserWallet,
  fetchTransactions,
  depositFunds,
  transferFunds,
  withdrawFunds,
} = useWallet()
const toast = useToast()

const authStore = useAuthStore()
const { userWallet } = storeToRefs(authStore)

// State
const balance = computed(() => userWallet.value?.balance || 0)
const depositAmount = ref('')
const withdrawAmount = ref('')
const transferForm = reactive({
  amount: '',
  email: '',
})
const recentTransactions = ref<WalletTransaction[]>([])
const activeModal = ref<TransactionModalType | null>(null)

const openModal = (type: TransactionModalType) => {
  activeModal.value = type
}

const closeModal = () => {
  activeModal.value = null
  depositAmount.value = ''
  withdrawAmount.value = ''
  transferForm.amount = ''
  transferForm.email = ''
}

const isTransactionLoading = ref(false)

const fetchWalletData = async () => {
  try {
    const [transactionsData] = await Promise.all([
      authStore.initializeWallet(),
      fetchTransactions({ limit: 5 }),
    ])
    recentTransactions.value = transactionsData.data
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Failed to load wallet data'),
      color: 'red',
    })
  }
}

const handleDeposit = async () => {
  isTransactionLoading.value = true
  try {
    await depositFunds({ amount: Number(depositAmount.value) })
    await fetchWalletData()
    toast.add({ title: 'Deposit successful', color: 'green' })
    closeModal()
  } catch (error) {
    toast.add({ title: getErrorMessage(error, 'Deposit failed'), color: 'red' })
  } finally {
    isTransactionLoading.value = false
  }
}

const handleWithdrawal = async () => {
  if (Number(withdrawAmount.value) > balance.value) {
    toast.add({ title: 'Insufficient funds', color: 'red' })
    return
  }

  isTransactionLoading.value = true
  try {
    await withdrawFunds({ amount: Number(withdrawAmount.value) })
    await fetchWalletData()
    toast.add({ title: 'Withdrawal successful', color: 'green' })
    closeModal()
  } catch (error) {
    toast.add({ title: getErrorMessage('Withdrawal failed'), color: 'red' })
  } finally {
    isTransactionLoading.value = false
  }
}

const handleTransfer = async () => {
  if (Number(transferForm.amount) > balance.value) {
    toast.add({ title: 'Insufficient funds', color: 'red' })
    return
  }

  isTransactionLoading.value = true

  try {
    await transferFunds({
      amount: Number(transferForm.amount),
      receiverEmail: transferForm.email,
    })
    await fetchWalletData()
    toast.add({
      title: 'Transfer successful',
      description: `Sent to ${transferForm.email}`,
      color: 'green',
    })
    closeModal()
  } catch (error) {
    toast.add({
      title: getErrorMessage(error, 'Transfer failed'),
      color: 'red',
    })
  } finally {
    isTransactionLoading.value = false
  }
}

onMounted(fetchWalletData)
</script>
