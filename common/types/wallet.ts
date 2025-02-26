import type { PaginationParams } from './global'
import type { User } from './user'

export type DepositDTO = {
  amount: number
}

export type WithdrawDTO = {
  amount: number
}

export type TransferDTO = {
  receiverEmail: string
  amount: number
}

export interface Wallet {
  _id: string
  userId: string
  balance: number
  createdAt: string
  updatedAt: string
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  REVERSAL = 'reversal',
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  REVERSED = 'reversed',
  FAILED = 'failed',
}

export interface WalletTransaction {
  _id: string
  userId: string | User // when populated with user details
  walletId: string | Wallet // when populated with wallet details
  type: TransactionType
  status: TransactionStatus
  details: TransactionDetails
  createdAt: string
  updatedAt: string
}

export interface TransactionDetails {
  _id: string
  madeBy?: string
  from?: string
  to?: string
  amount: number
  description: string
  success: boolean
  originalTransactionId?: string
}

export type TransactionModalType = 'deposit' | 'withdraw' | 'transfer'

export type GetTransactionsParams = PaginationParams & {
  search?: string
  status?: string
  type?: TransactionType
}
