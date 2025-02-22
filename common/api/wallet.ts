import api from './index'
import type {
  DepositDTO,
  TransferDTO,
  Wallet,
  WalletTransaction,
  WithdrawDTO,
} from '../types/wallet'
import type { PaginationParams, PaginationResponse } from '../types/global'

export const walletApi = {
  // Deposit funds
  deposit: (data: DepositDTO) => {
    return api.post<Wallet>('/wallet/deposit', { data })
  },

  // Withdraw funds
  withdraw: (data: WithdrawDTO) => {
    return api.post<Wallet>('/wallet/withdraw', { data })
  },

  // Transfer funds
  transfer: (data: TransferDTO) => {
    return api.post<WalletTransaction>('/wallet/transfer', {
      data,
    })
  },

  // Get wallet balance and details
  getWallet: () => {
    return api.get<Wallet>('/wallet')
  },

  // Get user wallet transaction history
  getUserTransactions: (params: PaginationParams) => {
    return api.get<PaginationResponse<WalletTransaction[]>>(
      '/wallet/transactions',
      { params }
    )
  },

  // ADMIN
  // Get single transaction
  getTransaction: (transactionId: string) => {
    return api.get<WalletTransaction>(`/wallet/transactions/${transactionId}`)
  },

  // Get all wallets transaction history
  getAllTransactions: (params: PaginationParams) => {
    return api.get<PaginationResponse<WalletTransaction[]>>(
      '/wallet/transactions/all',
      { params }
    )
  },

  // reverse transfer transaction
  reverseTransaction: (transactionId: string) => {
    return api.put<WalletTransaction>(
      `/wallet/transactions/${transactionId}/reverse`
    )
  },
}
