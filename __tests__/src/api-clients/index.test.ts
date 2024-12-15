import { HttpClient } from '@/api-clients';
import { API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS } from '@/configs/api-client';

describe('HttpClient', () => {
  let httpClient: HttpClient;
  const fakeAxios = jest.fn();

  beforeAll(() => {
    httpClient = new HttpClient(fakeAxios);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Testing get', () => {
    it('Should return data for a successful GET request', async () => {
      const mockData = { key: 'value' };
      const mockResponse = { status: 200, data: mockData };

      fakeAxios.mockResolvedValue(mockResponse);

      const response = await httpClient.get<typeof mockData>('/mock-endpoint', {q: 'search'});

      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'GET',
        params: {q: 'search'},
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 200,
        data: mockData
      });
    });

    it('Should return an error response for a failed GET request', async () => {
      const mockError = new Error('Request failed');
      fakeAxios.mockRejectedValue(mockError);

      const response = await httpClient.get('/mock-endpoint');

      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/mock-endpoint',
        method: 'GET',
        params: undefined,
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 500,
        error: mockError,
        message: mockError.message
      });
    });

    it('Should handle non-200 status codes gracefully', async () => {
      const mockResponse = {
        status: 404,
        data: null
      };
      fakeAxios.mockResolvedValue(mockResponse);

      const response = await httpClient.get('/non-existent-endpoint');

      expect(fakeAxios).toHaveBeenCalledWith({
        url: '/non-existent-endpoint',
        method: 'GET',
        params: undefined,
        timeout: API_CLIENT_REQUEST_TIMEOUT_IN_MILLISECONDS
      });
      expect(response).toEqual({
        statusCode: 404,
        message: 'Failed to get response'
      });
    });
  });
});
