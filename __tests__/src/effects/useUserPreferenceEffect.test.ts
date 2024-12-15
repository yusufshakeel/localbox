import { renderHook, act } from '@testing-library/react';
import useUserPreferencesEffect from '@/effects/useUserPreferencesEffect';
import { USER_PREFERENCE_LOCAL_STORAGE_KEY } from '@/configs/user-preference';
import {localStorageMock} from '../../../__mocks__/localstorage-mock';

describe('useUserPreferencesEffect', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should initialize user preferences if not present in localStorage', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1734252737317);
    const { result } = renderHook(() => useUserPreferencesEffect());

    expect(localStorage.getItem(USER_PREFERENCE_LOCAL_STORAGE_KEY)).toBe(
      JSON.stringify({ updatedAt: 1734252737317 })
    );
    expect(result.current.userPreferences).toEqual({});
  });

  it('Should load existing preferences from localStorage', () => {
    const mockPreferences = { theme: 'dark', updatedAt: Date.now() };
    localStorage.setItem(USER_PREFERENCE_LOCAL_STORAGE_KEY, JSON.stringify(mockPreferences));

    const { result } = renderHook(() => useUserPreferencesEffect());

    expect(result.current.userPreferences).toEqual(mockPreferences);
  });

  it('Should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem(USER_PREFERENCE_LOCAL_STORAGE_KEY, 'HAHA');

    const { result } = renderHook(() => useUserPreferencesEffect());

    expect(result.current.userPreferences).toEqual({});
    expect(localStorage.getItem(USER_PREFERENCE_LOCAL_STORAGE_KEY)).toBe('HAHA');
  });

  it('Should update user preferences in localStorage', () => {
    const { result } = renderHook(() => useUserPreferencesEffect());

    act(() => {
      result.current.setUserPreferences({ theme: 'light' });
    });

    const updatedPreferences = JSON.parse(
      localStorage.getItem(USER_PREFERENCE_LOCAL_STORAGE_KEY) as string
    );
    expect(updatedPreferences.theme).toBe('light');
    expect(updatedPreferences.updatedAt).toEqual(expect.any(Number));
    expect(result.current.userPreferences).toEqual(updatedPreferences);
  });

  it('Should merge new preferences with existing ones', () => {
    const initialPreferences = { theme: 'dark', language: 'en', updatedAt: Date.now() };
    localStorage.setItem(USER_PREFERENCE_LOCAL_STORAGE_KEY, JSON.stringify(initialPreferences));

    const { result } = renderHook(() => useUserPreferencesEffect());

    act(() => {
      result.current.setUserPreferences({ language: 'en' });
    });

    const updatedPreferences = JSON.parse(
      localStorage.getItem(USER_PREFERENCE_LOCAL_STORAGE_KEY) as string
    );
    expect(updatedPreferences).toEqual(
      expect.objectContaining({
        theme: 'dark',
        language: 'en',
        updatedAt: expect.any(Number)
      })
    );
    expect(result.current.userPreferences).toEqual(updatedPreferences);
  });

  it('Should handle errors in setUserPreferences gracefully', () => {
    const initialPreferences = { language: 'en', updatedAt: Date.now() };
    localStorage.setItem(USER_PREFERENCE_LOCAL_STORAGE_KEY, JSON.stringify(initialPreferences));

    // Mock localStorage.setItem to throw an error
    jest.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Failed to set item');
    });

    const { result } = renderHook(() => useUserPreferencesEffect());

    act(() => {
      result.current.setUserPreferences({ theme: 'dark' });
    });

    // Expect the hook to gracefully handle the error without crashing
    expect(result.current.userPreferences).toEqual(initialPreferences); // Remains unchanged
  });
});
