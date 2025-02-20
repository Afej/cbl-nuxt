import type {
  CreateUserDTO,
  PaginationParams,
  UpdateUserDTO,
} from '~/common/types'

export const useAdmin = () => {
  const { walletApi, usersApi } = useApi()
  const loading = ref(false)

  // WALLET RELATED
  const getAllTransactions = async (params: PaginationParams = {}) => {
    loading.value = true
    try {
      const { data } = await walletApi.getAllTransactions(params)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const getTransaction = async (id: string) => {
    loading.value = true
    try {
      const { data } = await walletApi.getTransaction(id)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const reverseTransaction = async (id: string) => {
    loading.value = true
    try {
      const { data } = await walletApi.reverseTransaction(id)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // USERS RELATED
  const getUsers = async (params: PaginationParams = {}) => {
    loading.value = true
    try {
      const { data } = await usersApi.getAllUsers(params)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const getUser = async (userId: string) => {
    loading.value = true
    try {
      const { data } = await usersApi.getUser(userId)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const createUser = async (payload: CreateUserDTO) => {
    loading.value = true
    try {
      const { data } = await usersApi.createUser(payload)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const editUser = async (userId: string, payload: UpdateUserDTO) => {
    loading.value = true
    try {
      const { data } = await usersApi.editUser(userId, payload)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (userId: string) => {
    loading.value = true
    try {
      await usersApi.deleteUser(userId)
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    wallet: {
      getTransaction,
      reverseTransaction,
      getAllTransactions,
    },
    users: {
      getUser,
      getUsers,
      createUser,
      editUser,
      deleteUser,
    },
  }
}
