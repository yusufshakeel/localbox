import { renderHook, waitFor } from '@testing-library/react';
import useServeIpAddressEffect from '@/hooks/useServeIpAddressEffect';
import httpClient from '@/api-clients';
import { IpApiResponse } from '@/types/api-responses';

describe('useServeIpAddressEffect', () => {
  const mockIp = '192.168.1.1';
  const mockPort = '3000';
  const mockResponse: IpApiResponse = { ip: mockIp };
  let getSpy: any;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: new URL(`http://${mockIp}:${mockPort}`),
      writable: true
    });

    getSpy = jest.spyOn(httpClient, 'get');

    getSpy.mockResolvedValue({
      statusCode: 200,
      data: mockResponse
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should fetch the IP and set the ip, port, and localServerAddress', async () => {
    const { result } = renderHook(() => useServeIpAddressEffect());

    await waitFor(() => expect(result.current.ip).toEqual(mockIp));
    expect(result.current.port).toEqual(mockPort);
    expect(result.current.localServerAddress).toEqual(`http://${mockIp}:${mockPort}`);

    expect(httpClient.get).toHaveBeenCalledWith({ url: '/api/ip' });
  });

  it('Should handle missing port in window.location and set the localServerAddress correctly', async () => {
    // Simulate no port in the URL
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost')
    });

    const { result } = renderHook(() => useServeIpAddressEffect());

    await waitFor(() => expect(result.current.ip).toEqual(mockIp));
    expect(result.current.port).toEqual('');
    expect(result.current.localServerAddress).toEqual(`http://${mockIp}`);

    expect(httpClient.get).toHaveBeenCalledWith({ url: '/api/ip' });
  });

  it('Should not set ip if the API response is not 200', async () => {
    getSpy.mockResolvedValue({
      statusCode: 500,
      data: null
    });

    const { result } = renderHook(() => useServeIpAddressEffect());

    await waitFor(() => expect(result.current.ip).toEqual(''));
    expect(result.current.port).toEqual('');
    expect(result.current.localServerAddress).toEqual('');

    expect(httpClient.get).toHaveBeenCalledWith({ url: '/api/ip' });
  });
});
