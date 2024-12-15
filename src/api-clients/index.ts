import {ApiResponse} from '@/types/api-responses';
import axios from 'axios';
import {API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS} from '@/configs/api-client';

export class HttpClient {
  private apiClient: any;

  constructor(apiClient: any) {
    this.apiClient = apiClient;
  }

  private apiHandler = async <T>(req: any) => {
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

  public async get<T>(
    url: string,
    params?: any,
    headers: any = {'Content-Type': 'application/json'}
  ): Promise<ApiResponse<T>> {
    return await this.apiHandler<T>(this.apiClient({
      url,
      method: 'GET',
      params,
      headers,
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  }

  public async post<T>(
    url: string,
    body: any,
    params?: any,
    headers: any = {'Content-Type': 'application/json'}
  ): Promise<ApiResponse<T>> {
    return await this.apiHandler<T>(this.apiClient({
      url,
      method: 'POST',
      params,
      data: body,
      headers,
      timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
    }));
  }
}

const httpClient = new HttpClient(axios);
export default httpClient;