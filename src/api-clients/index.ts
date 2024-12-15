import {ApiResponse} from '@/types/api-responses';
import axios from 'axios';
import {API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS} from '@/configs/api-client';

export class HttpClient {
  private apiClient: any;
  constructor(apiClient: any) {
    this.apiClient = apiClient;
  }

  public async get<T>(
    url: string,
    params?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.apiClient({
        url,
        method: 'GET',
        params,
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });

      if (response.status === 200) {
        return { statusCode: 200, data: response.data as T };
      }

      return { statusCode: response.status, message: 'Failed to get response' };
    } catch (error: any) {
      return { statusCode: 500, error, message: error.message };
    }
  }
}

const httpClient = new HttpClient(axios);
export default httpClient;