import {ApiResponse} from '@/types/api-responses';
import axios from 'axios';
import {API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS} from '@/configs/api-client';

export class HttpClient {
  private readonly apiClient: any;

  constructor(apiClient: any) {
    this.apiClient = apiClient;
  }

  private async apiHandler<T>(req: any) {
    try {
      const response = await req;
      if (response.status >= 200 && response.status < 300) {
        return { statusCode: response.status, data: response.data as T };
      }
      return { statusCode: response.status, message: response.message };
    } catch (error: any) {
      return {
        statusCode: error.status,
        error,
        message: error.response?.data?.message
      };
    }
  }

  public async get<T>({
    url,
    params,
    headers = {'Content-Type': 'application/json'}
  } : { url: string, params?: any, headers?: any }): Promise<ApiResponse<T>> {
    return await this.apiHandler<T>(this.apiClient({
      url,
      method: 'GET',
      params,
      headers,
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };

  public async post<T>({
    url, body, params, onUploadProgress, headers = {'Content-Type': 'application/json'}
  }: {
    url: string,
    body: any,
    params?: any,
    headers?: any,
    onUploadProgress?: any
  }): Promise<ApiResponse<T>> {
    return await this.apiHandler<T>(this.apiClient({
      url,
      method: 'POST',
      params,
      data: body,
      headers,
      onUploadProgress: (progress: any) => onUploadProgress?.(progress),
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };

  public async patch<T>({
    url, body, params, onUploadProgress, headers = {'Content-Type': 'application/json'}
  }: {
    url: string,
    body: any,
    params?: any,
    headers?: any,
    onUploadProgress?: any
  }): Promise<ApiResponse<T>> {
    return await this.apiHandler<T>(this.apiClient({
      url,
      method: 'PATCH',
      params,
      data: body,
      headers,
      onUploadProgress: (progress: any) => onUploadProgress?.(progress),
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };

  public async put<T>({
    url, body, params, onUploadProgress, headers = {'Content-Type': 'application/json'}
  }: {
    url: string,
    body: any,
    params?: any,
    headers?: any,
    onUploadProgress?: any
  }): Promise<ApiResponse<T>> {
    return await this.apiHandler<T>(this.apiClient({
      url,
      method: 'PUT',
      params,
      data: body,
      headers,
      onUploadProgress: (progress: any) => onUploadProgress?.(progress),
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };

  public async delete<T>({
    url, body, params, headers = {'Content-Type': 'application/json'}
  }: {
    url: string,
    body?: any,
    params?: any,
    headers?: any,
  }): Promise<ApiResponse<T>> {
    return await this.apiHandler<T>(this.apiClient({
      url,
      method: 'DELETE',
      params,
      data: body,
      headers,
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };
}

const httpClient = new HttpClient(axios);
export default httpClient;