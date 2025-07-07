import api from './index'
import type {
  LoginDTO,
  ChangePasswordDTO,
  AuthResponse,
  RegisterDTO,
} from '../types/auth'
import type { UpdateProfileDTO, User } from '../types'

export const authApi = {
  register: (data: RegisterDTO) =>
    api.post<AuthResponse>('/auth/register', { data }),
  login: (data: LoginDTO) => api.post<AuthResponse>('/auth/login', { data }),
  getAuthUser: () => api.get<User>('/auth/me'),
  updateProfile: (data: UpdateProfileDTO) =>
    api.patch('/auth/update-profile', { data }),
  changePassword: (data: ChangePasswordDTO) =>
    api.patch('/auth/change-password', { data }),
}
