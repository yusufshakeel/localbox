import {ApiResponse} from '@/types/api-responses';
import axios from 'axios';
import {API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS} from '@/configs/api-client';

export const HttpClient = (apiClient: any) => {
  const apiHandler = async <T>(req: any) => {
    try {
      const response = await req;
      if (response.status >= 200 && response.status < 300) {
        return { statusCode: response.status, data: response.data as T };
      }
      return { statusCode: response.status, message: response.message || 'Failed to get response' };
    } catch (error: any) {
      return {
        statusCode: error.status,
        error,
        message: error.response?.data?.message
      };
    }
  };

  const get = async <T>({
    url,
    params,
    headers = {'Content-Type': 'application/json'}
  } : { url: string, params?: any, headers?: any }): Promise<ApiResponse<T>> => {
    return await apiHandler<T>(apiClient({
      url,
      method: 'GET',
      params,
      headers,
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };

  const post = async <T>({
    url, body, params, onUploadProgress, headers = {'Content-Type': 'application/json'}
  }: {
    url: string,
    body: any,
    params?: any,
    headers?: any,
    onUploadProgress?: any
  }): Promise<ApiResponse<T>> => {
    return await apiHandler<T>(apiClient({
      url,
      method: 'POST',
      params,
      data: body,
      headers,
      onUploadProgress: (progress: any) => onUploadProgress?.(progress),
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };

  const patch = async <T>({
    url, body, params, onUploadProgress, headers = {'Content-Type': 'application/json'}
  }: {
    url: string,
    body: any,
    params?: any,
    headers?: any,
    onUploadProgress?: any
  }): Promise<ApiResponse<T>> => {
    return await apiHandler<T>(apiClient({
      url,
      method: 'PATCH',
      params,
      data: body,
      headers,
      onUploadProgress: (progress: any) => onUploadProgress?.(progress),
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };

  const put = async <T>({
    url, body, params, onUploadProgress, headers = {'Content-Type': 'application/json'}
  }: {
    url: string,
    body: any,
    params?: any,
    headers?: any,
    onUploadProgress?: any
  }): Promise<ApiResponse<T>> => {
    return await apiHandler<T>(apiClient({
      url,
      method: 'PUT',
      params,
      data: body,
      headers,
      onUploadProgress: (progress: any) => onUploadProgress?.(progress),
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };

  const deleteApi = async <T>({
    url, body, params, onUploadProgress, headers = {'Content-Type': 'application/json'}
  }: {
    url: string,
    body: any,
    params?: any,
    headers?: any,
    onUploadProgress?: any
  }): Promise<ApiResponse<T>> => {
    return await apiHandler<T>(apiClient({
      url,
      method: 'DELETE',
      params,
      data: body,
      headers,
      onUploadProgress: (progress: any) => onUploadProgress?.(progress),
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };

  return {get, post, patch, put, deleteApi};
};

const httpClient = HttpClient(axios);
export default httpClient;