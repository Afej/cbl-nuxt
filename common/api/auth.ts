import api from './index'
import type { LoginDTO, ChangePasswordDTO, LoginResponse } from '../types/auth'
import type { UpdateUserDTO, User } from '../types'

export const authApi = {
  login: (data: LoginDTO) => api.post<LoginResponse>('/auth/login', { data }),
  getAuthUser: () => api.get<User>('/auth/me'),
  updateProfile: (data: UpdateUserDTO) => {},
  changePassword: (data: ChangePasswordDTO) =>
    api.patch('/auth/change-password', { data }),
}
