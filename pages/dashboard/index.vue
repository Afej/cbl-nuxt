<template>
  <div class="text-white">
    <h1 class="text-2xl font-bold mb-8">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Balance Card -->
      <UCard class="bg-gray-800">
        <div class="text-center">
          <h3 class="text-gray-400 mb-2">Current Balance</h3>
          <p class="text-3xl font-bold">${{ balance.toFixed(2) }}</p>
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
        <h3 class="font-semibold mb-4">Recent Activity</h3>
        <div v-if="recentTransactions.length" class="space-y-2">
          <div
            v-for="tx in recentTransactions"
            :key="tx._id"
            class="flex justify-between items-center">
            <span>{{ tx.type }}</span>
            <span
              :class="
                tx.details.amount > 0 ? 'text-green-500' : 'text-red-500'
              ">
              {{ tx.details.amount > 0 ? '+' : '' }}${{ tx.details.amount }}
            </span>
          </div>
        </div>
        <p v-else class="text-gray-400">No recent transactions</p>
      </UCard>
    </div>

    <!-- Modals -->
    <UModal :model-value="activeModal === 'deposit'" @close="closeModal">
      <UCard class="bg-gray-800">
        <template #header>
          <h3 class="text-xl font-bold">Deposit Money</h3>
        </template>
        <form @submit.prevent="handleDeposit">
          <UFormGroup label="Amount" class="text-gray-300">
            <UInput
              v-model="depositAmount"
              type="number"
              min="0"
              step="0.01"
              required />
          </UFormGroup>
          <div class="flex justify-end gap-2 mt-4">
            <UButton @click="closeModal" variant="ghost" color="white"
              >Cancel</UButton
            >
            <UButton type="submit" color="green">Deposit</UButton>
          </div>
        </form>
      </UCard>
    </UModal>

    <UModal :model-value="activeModal === 'withdraw'" @close="closeModal">
      <UCard class="bg-gray-800">
        <template #header>
          <h3 class="text-xl font-bold">Withdraw Money</h3>
        </template>
        <form @submit.prevent="handleWithdraw">
          <UFormGroup label="Amount" class="text-gray-300">
            <UInput
              v-model="withdrawAmount"
              type="number"
              min="0"
              step="0.01"
              required />
          </UFormGroup>
          <div class="flex justify-end gap-2 mt-4">
            <UButton @click="closeModal" variant="ghost" color="white"
              >Cancel</UButton
            >
            <UButton type="submit" color="orange">Withdraw</UButton>
          </div>
        </form>
      </UCard>
    </UModal>

    <UModal :model-value="activeModal === 'transfer'" @close="closeModal">
      <UCard class="bg-gray-800">
        <template #header>
          <h3 class="text-xl font-bold">Transfer Money</h3>
        </template>
        <form @submit.prevent="handleTransfer">
          <UFormGroup label="Recipient Email" class="text-gray-300">
            <UInput v-model="transferForm.email" type="email" required />
          </UFormGroup>
          <UFormGroup label="Amount" class="text-gray-300 mt-4">
            <UInput
              v-model="transferForm.amount"
              type="number"
              min="0"
              step="0.01"
              required />
          </UFormGroup>

          <div class="flex justify-end gap-2 mt-4">
            <UButton @click="closeModal" variant="ghost" color="white"
              >Cancel</UButton
            >
            <UButton type="submit" color="white">Transfer</UButton>
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { WalletTransaction } from '~/common/types'

type ModalType = 'deposit' | 'withdraw' | 'transfer' | null

const {
  getUserWallet,
  fetchTransactions,
  depositFunds,
  transferFunds,
  withdrawFunds,
} = useWallet()
const toast = useToast()

// State
const balance = ref(0)
const depositAmount = ref('')
const withdrawAmount = ref('')
const transferForm = reactive({
  amount: '',
  email: '',
})
const recentTransactions = ref<WalletTransaction[]>([])
const activeModal = ref<ModalType>(null)

const openModal = (type: ModalType) => {
  activeModal.value = type
}

const closeModal = () => {
  activeModal.value = null
  depositAmount.value = ''
  withdrawAmount.value = ''
  transferForm.amount = ''
  transferForm.email = ''
}

const fetchWalletData = async () => {
  try {
    const [walletData, transactionsData] = await Promise.all([
      getUserWallet(),
      fetchTransactions({ limit: 5 }),
    ])
    balance.value = walletData.balance
    recentTransactions.value = transactionsData.data
  } catch {
    toast.add({ title: 'Failed to load wallet data', color: 'red' })
  }
}

const handleDeposit = async () => {
  try {
    await depositFunds({ amount: Number(depositAmount.value) })
    await fetchWalletData()
    toast.add({ title: 'Deposit successful', color: 'green' })
    closeModal()
  } catch {
    toast.add({ title: 'Deposit failed', color: 'red' })
  }
}

const handleWithdraw = async () => {
  if (Number(withdrawAmount.value) > balance.value) {
    toast.add({ title: 'Insufficient funds', color: 'red' })
    return
  }

  try {
    await withdrawFunds({ amount: Number(withdrawAmount.value) })
    await fetchWalletData()
    toast.add({ title: 'Withdrawal successful', color: 'green' })
    closeModal()
  } catch {
    toast.add({ title: 'Withdrawal failed', color: 'red' })
  }
}

const handleTransfer = async () => {
  if (Number(transferForm.amount) > balance.value) {
    toast.add({ title: 'Insufficient funds', color: 'red' })
    return
  }

  try {
    await transferFunds({
      amount: Number(transferForm.amount),
      recipientEmail: transferForm.email,
    })
    await fetchWalletData()
    toast.add({
      title: 'Transfer successful',
      description: `Sent to ${transferForm.email}`,
      color: 'green',
    })
    transferForm.amount = ''
    transferForm.email = ''
    closeModal()
  } catch {
    toast.add({ title: 'Transfer failed', color: 'red' })
  }
}

onMounted(fetchWalletData)
</script>
