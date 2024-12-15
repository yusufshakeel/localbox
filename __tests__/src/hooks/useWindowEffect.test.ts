import { renderHook, act } from '@testing-library/react';
import useWindowEffect from '@/hooks/useWindowEffect';

describe('useWindowEffect', () => {
  beforeEach(() => {
    // Mock window.innerHeight
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800
    });

    // Mock addEventListener and removeEventListener
    jest.spyOn(window, 'addEventListener');
    jest.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should initialize with the current viewport height', () => {
    const { result } = renderHook(() => useWindowEffect());
    expect(result.current.viewportHeight).toBe(800);
  });

  it('Should update viewport height on window resize', () => {
    const { result } = renderHook(() => useWindowEffect());

    act(() => {
      // Update innerHeight dynamically
      Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.viewportHeight).toBe(600);
  });

  it('Should add and remove resize event listener on mount and unmount', () => {
    const { unmount } = renderHook(() => useWindowEffect());

    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});