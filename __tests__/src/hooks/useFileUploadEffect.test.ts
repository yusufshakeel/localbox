import { renderHook, act } from '@testing-library/react';
import useFileUploadEffect, { OptionType } from '@/hooks/useFileUploadEffect';
import httpClient from '@/api-clients';
import {UserType} from '@/types/users';

jest.mock('../../../src/api-clients'); // Mocking httpClient

describe('useFileUploadEffect', () => {
  let postSpy: any;
  let getSpy: any;

  beforeAll(() => {
    getSpy = jest.spyOn(httpClient, 'get');
    postSpy = jest.spyOn(httpClient, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should not upload when file size exceeds the allowed file size', async () => {
    getSpy.mockResolvedValue({
      statusCode: 200,
      data: {
        user: {
          userType: UserType.user
        },
        configs: [
          {
            key: 'FILE_UPLOAD_MAX_SIZE_IN_BYTES',
            value: 1
          }
        ]
      }
    });

    const { result } = renderHook(() => useFileUploadEffect());

    const formData = new FormData();
    formData.append('file', new Blob(['Very big file'], { type: 'text/plain' }));

    await act(async () => {
      await result.current.handleFileUpload(formData);
    });

    expect(result.current.file).toBe('');
    expect(result.current.error).toBe('Allowed file size: 1 Byte');
  });

  it('Should initialize with empty file and error state', () => {
    getSpy.mockResolvedValue();

    const { result } = renderHook(() => useFileUploadEffect());

    expect(result.current.file).toBe('');
    expect(result.current.error).toBe('');
  });

  it('Should handle successful file upload', async () => {
    getSpy.mockResolvedValue({
      statusCode: 200
    });

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
    getSpy.mockResolvedValue({
      statusCode: 200
    });

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
    getSpy.mockResolvedValue({
      statusCode: 200
    });

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
    getSpy.mockResolvedValue({
      statusCode: 200
    });

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
    getSpy.mockResolvedValue({
      statusCode: 200
    });

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
