import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getItem, setItem } from './storage';
import { PaginatedData } from '../@types';
import logout from './logout';

interface AxiosBaseResponse {
  isSuccess: boolean;
  statusCode: number;
}

export interface CustomAxiosError extends AxiosBaseResponse {
  message: string;
  error: string;
}

export type PostRefreshTokenResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  statusCode: number;
};

interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

const refreshAndRetryQueue: RetryQueueItem[] = [];
let isRefreshing = false;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.isSuccess && response?.data?.data) {
      if (response.data.pagination) {
        const paginatedResponseData: PaginatedData<any> = {
          data: response.data.data,
          pagination: response.data.pagination,
        };
        return paginatedResponseData;
      }
      return response.data.data;
    }
    return null;
  },

  (error) => {
    if (!error.response) {
      const error = {
        response: {
          data: { message: 'Seems like its trouble in connecting!' },
        },
      };
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        originalRequest._retry = true;
        const refreshToken = getItem('refresh-token');

        if (!refreshToken) return Promise.reject(error.response.data);

        isRefreshing = true;

        return axios
          .post(`${originalRequest.baseURL}auth/refresh-token`, {
            refreshToken,
          })
          .then((res: AxiosResponse<PostRefreshTokenResponse, any>): any => {
            if (res.status === 200) {
              setItem('token', res.data.data.accessToken);
              setItem('refresh-token', res.data.data.refreshToken);

              originalRequest.headers.Authorization =
                'Bearer ' + res.data.data.accessToken;
              refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                config.headers &&
                  (config.headers.Authorization =
                    'Bearer ' + res.data.data.accessToken);

                axiosInstance
                  .request(config)
                  .then((response) => resolve(response))
                  .catch((err) => reject(err));
              });
              refreshAndRetryQueue.length = 0;
              return axiosInstance(originalRequest);
            }
          })
          .catch(() => {
            logout();
            return;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise<void>((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    if (
      error &&
      error.response &&
      error.response.status &&
      error.response.status === 403
    ) {
      logout();
      return;
    }

    return Promise.reject(error.response.data);
  }
);

export default axiosInstance;
