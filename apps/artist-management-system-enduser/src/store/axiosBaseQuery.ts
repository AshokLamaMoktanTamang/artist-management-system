import type { AxiosRequestConfig } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';

import { axios, errorMessageHandler } from '@shared/index';
import { CustomAxiosError } from '@shared/utils/axios';

const axiosBaseQuery = (): BaseQueryFn<{
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}> => {
  return async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result };
    } catch (axiosError) {
      const err = axiosError as CustomAxiosError;

      errorMessageHandler({ ...err, isSuccess: false });
      return {
        error: {
          status: err?.statusCode,
          data: err?.message,
        },
      };
    }
  };
};

export default axiosBaseQuery;
