export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export enum UserAccountStatus {
  Active = 'active',
  Disabled = 'disabled',
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  accountStatus: UserAccountStatus
  createdAt: string
  updatedAt: string
}

export type CreateUserDTO = Omit<User, '_id' | 'createdAt' | 'updatedAt'> & {
  password: string
  accountStatus?: UserAccountStatus
  role?: UserRole
}

export type UpdateUserDTO = Partial<CreateUserDTO>

export type UpdateProfileDTO = {
  firstName?: string
  lastName?: string
  email?: string
}
