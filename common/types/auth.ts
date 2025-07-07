import type { User } from './user'

export type LoginDTO = {
  email: string
  password: string
}

export type RegisterDTO = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type ChangePasswordDTO = {
  currentPassword: string
  newPassword: string
}

export type AuthResponse = {
  token: string
  user: User
}
