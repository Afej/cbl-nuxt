import type {
  DepositDTO,
  PaginationParams,
  TransferDTO,
  WithdrawDTO,
} from '~/common/types'

export const useWallet = () => {
  const { walletApi } = useApi()

  const getUserWallet = async () => {
    try {
      const { data } = await walletApi.getWallet()
      return data
    } catch (error) {
      throw error
    }
  }

  const fetchTransactions = async (params: PaginationParams = {}) => {
    try {
      const { data } = await walletApi.getUserTransactions(params)
      return data
    } catch (error) {
      throw error
    }
  }

  const depositFunds = async (payload: DepositDTO) => {
    try {
      const { data } = await walletApi.deposit(payload)
      return data
    } catch (error) {
      throw error
    }
  }

  const withdrawFunds = async (payload: WithdrawDTO) => {
    try {
      const { data } = await walletApi.withdraw(payload)
      return data
    } catch (error) {
      throw error
    }
  }

  const transferFunds = async (payload: TransferDTO) => {
    try {
      const { data } = await walletApi.transfer(payload)
      return data
    } catch (error) {
      throw error
    }
  }

  return {
    getUserWallet,
    fetchTransactions,
    depositFunds,
    withdrawFunds,
    transferFunds,
  }
}
