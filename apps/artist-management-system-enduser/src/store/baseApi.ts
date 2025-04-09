import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '@/store/axiosBaseQuery'

const baseApi = createApi({
  reducerPath: 'baseApiReducer',
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
})

export default baseApi
