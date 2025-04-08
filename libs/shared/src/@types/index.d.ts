export interface Pagination {
  totalPage: number
  totalCount: number
  page: number
}

export interface PaginatedData<T> {
  data: T[]
  pagination: Pagination
}
