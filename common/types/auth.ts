import type { User } from './user'

export type LoginDTO = {
  email: string
  password: string
}

export type ChangePasswordDTO = {
  currentPassword: string
  newPassword: string
}

export type LoginResponse = {
  token: string
  user: User
}
