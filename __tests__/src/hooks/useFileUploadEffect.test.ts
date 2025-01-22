import { renderHook, act } from '@testing-library/react';
import useFileUploadEffect, { OptionType } from '@/hooks/useFileUploadEffect';
import httpClient from '@/api-clients';

jest.mock('../../../src/api-clients'); // Mocking httpClient

describe('useFileUploadEffect', () => {
  let postSpy: any;

  beforeAll(() => {
    postSpy = jest.spyOn(httpClient, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should initialize with empty file and error state', () => {
    const { result } = renderHook(() => useFileUploadEffect());

    expect(result.current.file).toBe('');
    expect(result.current.error).toBe('');
  });

  it('Should handle successful file upload', async () => {
    const mockResponse = {
      statusCode: 200,
      data: {
        uploadedFileName: 'uploaded-file.png'
      }
    };
    postSpy.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileUploadEffect());

    const formData = new FormData();
    formData.append('file', new Blob(['file contents'], { type: 'image/png' }));

    await act(async () => {
      await result.current.handleFileUpload(formData);
    });

    expect(result.current.file).toBe('uploaded-file.png');
    expect(result.current.error).toBe('');
  });

  it('Should handle failed file upload due to server error', async () => {
    const mockError = new Error('Failed to upload file');
    postSpy.mockRejectedValue(mockError);

    const { result } = renderHook(() => useFileUploadEffect());

    const formData = new FormData();
    formData.append('file', new Blob(['file contents'], { type: 'image/png' }));

    await act(async () => {
      await result.current.handleFileUpload(formData);
    });

    expect(result.current.file).toBe('');
    expect(result.current.error).toBe(`An error occurred: ${mockError.message}`);
  });

  it('Should handle failed file upload due to server response status', async () => {
    const mockResponse = {
      statusCode: 500,
      data: null
    };
    postSpy.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileUploadEffect());

    const formData = new FormData();
    formData.append('file', new Blob(['file contents'], { type: 'image/png' }));

    await act(async () => {
      await result.current.handleFileUpload(formData);
    });

    expect(result.current.file).toBe('');
    expect(result.current.error).toBe('Failed to upload file');
  });

  it('Should handle failed file upload due to server response status >= 400', async () => {
    const mockResponse = {
      statusCode: 400,
      message: 'File too large'
    };
    postSpy.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileUploadEffect());

    const formData = new FormData();
    formData.append('file', new Blob(['file contents'], { type: 'image/png' }));

    await act(async () => {
      await result.current.handleFileUpload(formData);
    });

    expect(result.current.file).toBe('');
    expect(result.current.error).toBe('File too large');
  });

  it('Should respect the provided directory option', async () => {
    const mockResponse = {
      statusCode: 200,
      data: {
        uploadedFileName: 'uploaded-file.png'
      }
    };
    const mockOption: OptionType = { dir: 'images' };
    postSpy.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileUploadEffect(mockOption));

    const formData = new FormData();
    formData.append('file', new Blob(['file contents'], { type: 'image/png' }));

    await act(async () => {
      await result.current.handleFileUpload(formData);
    });

    expect(result.current.file).toBe('uploaded-file.png');
    expect(result.current.error).toBe('');
    expect(httpClient.post).toHaveBeenCalledWith({
      url: '/api/upload',
      body: formData,
      params: { dir: 'images' },
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: expect.any(Function)
    });
  });
});
