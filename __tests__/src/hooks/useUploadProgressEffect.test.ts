import { renderHook, act } from '@testing-library/react';
import useUploadProgressEffect from '@/hooks/useUploadProgressEffect';

describe('useUploadProgressEffect', () => {
  it('Should initialize progress to 0', () => {
    const { result } = renderHook(() => useUploadProgressEffect());

    expect(result.current.progress).toBe(0);
  });

  it('Should update progress based on the upload progress event', () => {
    const { result } = renderHook(() => useUploadProgressEffect());

    const progressEvent = {
      loaded: 500,
      total: 1000
    };

    act(() => {
      result.current.onUploadProgress(progressEvent);
    });

    expect(result.current.progress).toBe(50);

    act(() => {
      result.current.onUploadProgress({ loaded: 1000, total: 1000 });
    });

    expect(result.current.progress).toBe(100);
  });

  it('Should not update progress if total is undefined or zero', () => {
    const { result } = renderHook(() => useUploadProgressEffect());

    const progressEvent = { loaded: 500 };

    act(() => {
      result.current.onUploadProgress(progressEvent);
    });

    expect(result.current.progress).toBe(0);

    act(() => {
      result.current.onUploadProgress({ loaded: 500, total: 0 });
    });

    expect(result.current.progress).toBe(0);
  });

  it('Should allow manual setting of progress', () => {
    const { result } = renderHook(() => useUploadProgressEffect());

    act(() => {
      result.current.setProgress(75);
    });

    expect(result.current.progress).toBe(75);
  });
});
