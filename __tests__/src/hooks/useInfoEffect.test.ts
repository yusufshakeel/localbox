import { renderHook, waitFor } from '@testing-library/react';
import useInfoEffect from '@/hooks/useInfoEffect';
import httpClient from '@/api-clients';
import {InfoApiResponse} from '@/types/api-responses';

describe('useInfoEffect', () => {
  let getSpy: any;

  beforeAll(() => {
    getSpy = jest.spyOn(httpClient, 'get');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  
  it('Should fetch and set info data on mount', async () => {
    const mockData: InfoApiResponse = {
      name: 'localbox',
      version: '0.4.2',
      description: 'Turn your laptop or desktop into a personal local cloud to easily share files with other devices on the same Wi-Fi network.',
      license: 'MIT',
      author: 'Yusuf Shakeel',
      homepage: 'https://github.com/yusufshakeel/localbox#readme',
      licensePage: 'https://github.com/yusufshakeel/localbox/blob/main/LICENSE'
    };

    getSpy.mockResolvedValue({
      statusCode: 200,
      data: mockData
    });

    const { result } = renderHook(() => useInfoEffect());

    // Wait for the effect to resolve
    await waitFor(() => expect(result.current.info).toEqual(mockData));

    // Ensure the API was called with the correct endpoint
    expect(httpClient.get).toHaveBeenCalledWith({ url: '/api/info' });
  });

  it('Should not set info if the API response status code is not 200', async () => {
    getSpy.mockResolvedValue({
      statusCode: 500,
      data: null
    });

    const { result } = renderHook(() => useInfoEffect());

    // Wait to ensure no data is set
    await waitFor(() => expect(result.current.info).toBeUndefined());

    // Ensure the API was called with the correct endpoint
    expect(httpClient.get).toHaveBeenCalledWith({ url: '/api/info' });
  });
});
