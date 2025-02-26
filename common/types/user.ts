import type { PaginationParams } from './global'
import type { Wallet, WalletTransaction } from './wallet'

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export enum AccountStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  accountStatus: AccountStatus
  createdAt: string
  updatedAt: string
  transactions?: WalletTransaction[]
  wallet?: Wallet
}

export type CreateUserDTO = Omit<User, '_id' | 'createdAt' | 'updatedAt'> & {
  password: string
  accountStatus?: AccountStatus
  role?: Role
}

export type UpdateUserDTO = Partial<CreateUserDTO>

export type UpdateProfileDTO = {
  firstName?: string
  lastName?: string
  email?: string
}

export type GetUsersParams = PaginationParams & {
  search?: string
  role?: Role
  status?: AccountStatus
}
