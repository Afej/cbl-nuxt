import type {
  CreateUserDTO,
  PaginationParams,
  UpdateUserDTO,
} from '~/common/types'

export const useAdmin = () => {
  const { walletApi, usersApi } = useApi()

  // WALLET RELATED
  const getAllTransactions = async (params: PaginationParams = {}) => {
    try {
      const { data } = await walletApi.getAllTransactions(params)
      return data
    } catch (error) {
      throw error
    }
  }

  const getTransaction = async (id: string) => {
    try {
      const { data } = await walletApi.getTransaction(id)
      return data
    } catch (error) {
      throw error
    }
  }

  const reverseTransaction = async (id: string) => {
    try {
      const { data } = await walletApi.reverseTransaction(id)
      return data
    } catch (error) {
      throw error
    }
  }

  // USERS RELATED
  const getUsers = async (params: PaginationParams = {}) => {
    try {
      const { data } = await usersApi.getAllUsers(params)
      return data
    } catch (error) {
      throw error
    }
  }

  const getUser = async (userId: string) => {
    try {
      const { data } = await usersApi.getUser(userId)
      return data
    } catch (error) {
      throw error
    }
  }

  const createUser = async (payload: CreateUserDTO) => {
    try {
      const { data } = await usersApi.createUser(payload)
      return data
    } catch (error) {
      throw error
    }
  }

  const editUser = async (userId: string, payload: UpdateUserDTO) => {
    try {
      const { data } = await usersApi.editUser(userId, payload)
      return data
    } catch (error) {
      throw error
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      await usersApi.deleteUser(userId)
    } catch (error) {
      throw error
    }
  }

  return {
    adminTransactions: {
      getTransaction,
      reverseTransaction,
      getAllTransactions,
    },
    adminUsers: {
      getUser,
      getUsers,
      createUser,
      editUser,
      deleteUser,
    },
  }
}
