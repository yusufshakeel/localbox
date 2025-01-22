import { HttpClient } from '@/api-clients';
import { API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS } from '@/configs/api-client';

describe('HttpClient', () => {
  const fakeAxios = jest.fn();
  const httpClient = new HttpClient(fakeAxios);
  class FakeError extends Error {
    private status: number;
    private response: { data: { message: string } };
    constructor() {
      super();
      this.status = 500;
      this.response = {
        data: {
          message: 'Something went wrong'
        }
      };
    }
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Testing get', () => {
    it('Should return data for a successful GET request', async () => {
      const mockData = { key: 'value' };
      const mockResponse = { status: 200, data: mockData };

      fakeAxios.mockResolvedValue(mockResponse);

      const response = await httpClient.get<typeof mockData>({
        url: '/mock-endpoint',
        params: {q: 'search'},
        headers: {'Content-Type': 'application/json'}
      });

      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'GET',
        params: {q: 'search'},
        headers: { 'Content-Type': 'application/json' },
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 200,
        data: mockData
      });
    });

    it('Should return an error response for a failed GET request', async () => {
      const mockError = new FakeError();
      fakeAxios.mockRejectedValue(mockError);

      const response = await httpClient.get({ url: '/mock-endpoint' });

      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'GET',
        params: undefined,
        headers: { 'Content-Type': 'application/json' },
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 500,
        error: 'Something went wrong',
        message: 'Something went wrong'
      });
    });

    it('Should handle non-200 status codes gracefully', async () => {
      const mockResponse = {
        status: 404,
        data: null,
        message: 'Something went wrong'
      };
      fakeAxios.mockResolvedValue(mockResponse);

      const response = await httpClient.get({ url: '/non-existent-endpoint' });

      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/non-existent-endpoint',
        method: 'GET',
        params: undefined,
        headers: { 'Content-Type': 'application/json' },
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 404,
        message: 'Something went wrong'
      });
    });
  });

  describe('Testing post', () => {
    it('Should return data for a successful POST request', async () => {
      const mockData = { key: 'value' };
      const mockResponse = { status: 200, data: mockData };

      fakeAxios.mockResolvedValue(mockResponse);

      const response = await httpClient.post<typeof mockData>({
        url: '/mock-endpoint',
        body: {name: 'yusuf'},
        params: {dir: 'uploads'}
      });

      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'POST',
        data: {name: 'yusuf'},
        params: {dir: 'uploads'},
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress: expect.any(Function),
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 200,
        data: mockData
      });
    });

    it('Should be able to call custom onUploadProgress function', async () => {
      const mockData = { key: 'value' };
      const mockResponse = { status: 200, data: mockData };

      let flag = false;
      const onUploadProgress = () => {
        flag = true;
      };

      fakeAxios.mockImplementation(async (args: any) => {
        args?.onUploadProgress?.();
        return mockResponse;
      });

      const response = await httpClient.post<typeof mockData>({
        url: '/mock-endpoint',
        body: {name: 'yusuf'},
        params: {dir: 'uploads'},
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress
      });

      expect(flag).toBeTruthy();
      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'POST',
        data: {name: 'yusuf'},
        params: {dir: 'uploads'},
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress: expect.any(Function),
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 200,
        data: mockData
      });
    });
  });

  describe('Testing put', () => {
    it('Should return data for a successful PUT request', async () => {
      const mockData = { key: 'value' };
      const mockResponse = { status: 200, data: mockData };

      fakeAxios.mockResolvedValue(mockResponse);

      const response = await httpClient.put<typeof mockData>({
        url: '/mock-endpoint',
        body: {name: 'yusuf'},
        params: {dir: 'uploads'}
      });

      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'PUT',
        data: {name: 'yusuf'},
        params: {dir: 'uploads'},
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress: expect.any(Function),
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 200,
        data: mockData
      });
    });

    it('Should be able to call custom onUploadProgress function', async () => {
      const mockData = { key: 'value' };
      const mockResponse = { status: 200, data: mockData };

      let flag = false;
      const onUploadProgress = () => {
        flag = true;
      };

      fakeAxios.mockImplementation(async (args: any) => {
        args?.onUploadProgress?.();
        return mockResponse;
      });

      const response = await httpClient.put<typeof mockData>({
        url: '/mock-endpoint',
        body: {name: 'yusuf'},
        params: {dir: 'uploads'},
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress
      });

      expect(flag).toBeTruthy();
      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'PUT',
        data: {name: 'yusuf'},
        params: {dir: 'uploads'},
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress: expect.any(Function),
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 200,
        data: mockData
      });
    });
  });

  describe('Testing patch', () => {
    it('Should return data for a successful PATCH request', async () => {
      const mockData = { key: 'value' };
      const mockResponse = { status: 200, data: mockData };

      fakeAxios.mockResolvedValue(mockResponse);

      const response = await httpClient.patch<typeof mockData>({
        url: '/mock-endpoint',
        body: {name: 'yusuf'},
        params: {dir: 'uploads'}
      });

      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'PATCH',
        data: {name: 'yusuf'},
        params: {dir: 'uploads'},
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress: expect.any(Function),
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 200,
        data: mockData
      });
    });

    it('Should be able to call custom onUploadProgress function', async () => {
      const mockData = { key: 'value' };
      const mockResponse = { status: 200, data: mockData };

      let flag = false;
      const onUploadProgress = () => {
        flag = true;
      };

      fakeAxios.mockImplementation(async (args: any) => {
        args?.onUploadProgress?.();
        return mockResponse;
      });

      const response = await httpClient.patch<typeof mockData>({
        url: '/mock-endpoint',
        body: {name: 'yusuf'},
        params: {dir: 'uploads'},
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress
      });

      expect(flag).toBeTruthy();
      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'PATCH',
        data: {name: 'yusuf'},
        params: {dir: 'uploads'},
        headers: { 'Content-Type': 'application/json' },
        onUploadProgress: expect.any(Function),
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 200,
        data: mockData
      });
    });
  });

  describe('Testing delete', () => {
    it('Should return data for a successful DELETE request', async () => {
      const mockData = { key: 'value' };
      const mockResponse = { status: 200, data: mockData };

      fakeAxios.mockResolvedValue(mockResponse);

      const response = await httpClient.delete<typeof mockData>({
        url: '/mock-endpoint',
        body: {name: 'yusuf'},
        params: {dir: 'uploads'}
      });

      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'DELETE',
        data: {name: 'yusuf'},
        params: {dir: 'uploads'},
        headers: { 'Content-Type': 'application/json' },
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 200,
        data: mockData
      });
    });
  });
});
