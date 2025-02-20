export type PageMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginationResponse<T = any> {
  data: T
  meta: PageMeta
}

export type PaginationParams = {
  page?: number
  limit?: number
}
