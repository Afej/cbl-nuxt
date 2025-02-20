import api from './index'
import type { PaginationParams, PaginationResponse } from '../types/global'
import type { CreateUserDTO, UpdateUserDTO, User } from '../types'

export const usersApi = {
  getUser: (userId: string) => {
    return api.get<User>(`/users/${userId}`)
  },

  getAllUsers: (params: PaginationParams) => {
    return api.get<PaginationResponse<User[]>>('/users', {
      params,
    })
  },

  createUser: (data: CreateUserDTO) => {
    return api.post<User>('/users', {
      data,
    })
  },

  editUser: (userId: string, data: UpdateUserDTO) => {
    return api.patch<User>(`/users/${userId}`, {
      data,
    })
  },

  deleteUser: (userId: string) => {
    return api.delete(`/users/${userId}`)
  },
}
