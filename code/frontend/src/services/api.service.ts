import axios, { AxiosError } from "axios";
import { getAuthorizedAccess } from "./auth.service";

export type Page<T> = {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type PageRequest = {
  number: number;
  size: number;
}


export const setupAxiosInterceptors = (responseCallback: (error: AxiosError<any>) => void) => {
  // 添加请求拦截器
  axios.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    const authorizedAccess = getAuthorizedAccess();
    if (!authorizedAccess || !authorizedAccess.access_token || !authorizedAccess.token_type) {
      window.location.href = '/app/login';
      return config;
    }
    config.headers.Authorization = `${authorizedAccess?.token_type} ${authorizedAccess?.access_token}`;
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加响应拦截器
  axios.interceptors.response.use((response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    error.response && responseCallback(error);
    // 对响应错误做点什么
    console.log(error);
    if (error.response && error.response.status === 401) {
      window.location.href = '/app/login';
    }
    return Promise.reject(error);
  });
}