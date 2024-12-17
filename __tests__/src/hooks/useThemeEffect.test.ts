import { renderHook, act } from '@testing-library/react';
import useThemeEffect from '@/hooks/useThemeEffect';
import {
  WEBSITE_THEME_LIGHT,
  WEBSITE_THEME_DARK
} from '@/constants';
import { THEME_CURRENT_APP_THEME } from '@/configs/theme';

describe('useThemeEffect Hook', () => {
  const mockSetUserPreferences = jest.fn();

  beforeEach(() => {
    document.body.removeAttribute('data-bs-theme');
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeAttribute('data-bs-theme');
    jest.clearAllMocks();
  });

  it('Should initialize with light theme when userPreferences is empty', () => {
    const { result } = renderHook(() =>
      useThemeEffect({
        userPreferences: {},
        setUserPreferences: mockSetUserPreferences
      })
    );

    expect(result.current.theme).toBe(WEBSITE_THEME_LIGHT);
    expect(document.body.getAttribute('data-bs-theme')).toBe(WEBSITE_THEME_LIGHT);
  });

  it('Should initialize with theme from userPreferences', () => {
    const userPreferences = { [THEME_CURRENT_APP_THEME]: WEBSITE_THEME_DARK };

    const { result } = renderHook(() =>
      useThemeEffect({
        userPreferences,
        setUserPreferences: mockSetUserPreferences
      })
    );

    expect(result.current.theme).toBe(WEBSITE_THEME_DARK);
    expect(document.body.getAttribute('data-bs-theme')).toBe(WEBSITE_THEME_DARK);
  });

  it('Should toggle theme from light to dark and update user preferences', () => {
    const userPreferences = { [THEME_CURRENT_APP_THEME]: WEBSITE_THEME_LIGHT };

    const { result } = renderHook(() =>
      useThemeEffect({
        userPreferences,
        setUserPreferences: mockSetUserPreferences
      })
    );

    // Initial state check
    expect(result.current.theme).toBe(WEBSITE_THEME_LIGHT);
    expect(document.body.getAttribute('data-bs-theme')).toBe(WEBSITE_THEME_LIGHT);

    // Toggle to dark theme
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(WEBSITE_THEME_DARK);
    expect(document.body.getAttribute('data-bs-theme')).toBe(WEBSITE_THEME_DARK);
    expect(mockSetUserPreferences).toHaveBeenCalledWith({
      [THEME_CURRENT_APP_THEME]: WEBSITE_THEME_DARK
    });
  });

  it('Should toggle theme from dark to light and update user preferences', () => {
    const userPreferences = { [THEME_CURRENT_APP_THEME]: WEBSITE_THEME_DARK };

    const { result } = renderHook(() =>
      useThemeEffect({
        userPreferences,
        setUserPreferences: mockSetUserPreferences
      })
    );

    // Initial state check
    expect(result.current.theme).toBe(WEBSITE_THEME_DARK);
    expect(document.body.getAttribute('data-bs-theme')).toBe(WEBSITE_THEME_DARK);

    // Toggle to light theme
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(WEBSITE_THEME_LIGHT);
    expect(document.body.getAttribute('data-bs-theme')).toBe(WEBSITE_THEME_LIGHT);
    expect(mockSetUserPreferences).toHaveBeenCalledWith({
      [THEME_CURRENT_APP_THEME]: WEBSITE_THEME_LIGHT
    });
  });
});
