import type {
  DepositDTO,
  PaginationParams,
  TransferDTO,
  WithdrawDTO,
} from '~/common/types'

export const useWallet = () => {
  const { walletApi } = useApi()
  const loading = ref(false)

  const getUserWallet = async () => {
    loading.value = true
    try {
      const { data } = await walletApi.getWallet()
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchTransactions = async (params: PaginationParams = {}) => {
    loading.value = true
    try {
      const { data } = await walletApi.getUserTransactions(params)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const depositFunds = async (payload: DepositDTO) => {
    loading.value = true
    try {
      const { data } = await walletApi.deposit(payload)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const withdrawFunds = async (payload: WithdrawDTO) => {
    loading.value = true
    try {
      const { data } = await walletApi.withdraw(payload)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const transferFunds = async (payload: TransferDTO) => {
    loading.value = true
    try {
      const { data } = await walletApi.transfer(payload)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    getUserWallet,
    fetchTransactions,
    depositFunds,
    withdrawFunds,
    transferFunds,
  }
}
