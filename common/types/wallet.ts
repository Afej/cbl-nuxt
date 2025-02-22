import type { User } from './user'

export type DepositDTO = {
  amount: number
}

export type WithdrawDTO = {
  amount: number
}

export type TransferDTO = {
  recipientEmail: string
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
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
  Transfer = 'transfer',
  Reversal = 'reversal',
}

export interface WalletTransaction {
  _id: string
  userId: string | User // when populated with user details
  walletId: string | Wallet // when populated with wallet details
  type: TransactionType
  details: TransactionDetails
  createdAt: string
  updatedAt: string
}

export interface TransactionDetails {
  _id: string
  madeBy: string
  amount: number
  description: string
  success: boolean
}
