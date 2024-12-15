import {ApiResponse} from '@/types/api-responses';
import axios from 'axios';
import {API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS} from '@/configs/api-client';

export const HttpClient = (apiClient: any) => {
  const apiHandler = async <T>(req: any) => {
    try {
      const response = await req;
      if (response.status === 200) {
        return { statusCode: 200, data: response.data as T };
      }
      return { statusCode: response.status, message: 'Failed to get response' };
    } catch (error: any) {
      return { statusCode: 500, error, message: error.message };
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
    url, body, params, headers = {'Content-Type': 'application/json'}
  }: {
    url: string,
    body: any,
    params?: any,
    headers?: any
  }): Promise<ApiResponse<T>> => {
    return await apiHandler<T>(apiClient({
      url,
      method: 'POST',
      params,
      data: body,
      headers,
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  };

  return {get, post};
};

const httpClient = HttpClient(axios);
export default httpClient;