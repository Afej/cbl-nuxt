import api from './index'
import type { LoginDTO, ChangePasswordDTO, LoginResponse } from '../types/auth'
import type { UpdateProfileDTO, User } from '../types'

export const authApi = {
  login: (data: LoginDTO) => api.post<LoginResponse>('/auth/login', { data }),
  getAuthUser: () => api.get<User>('/auth/me'),
  updateProfile: (data: UpdateProfileDTO) =>
    api.patch('/auth/update-profile', { data }),
  changePassword: (data: ChangePasswordDTO) =>
    api.patch('/auth/change-password', { data }),
}
