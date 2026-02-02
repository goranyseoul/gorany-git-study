import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthStore } from '../../stores/useAuthStore';
import * as authService from '../../services/auth';

// Mock auth service
jest.mock('../../services/auth');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
    jest.clearAllMocks();
  });

  describe('login', () => {
    // TC-AUTH-003: 이메일 로그인 성공
    it('should login successfully and update state', async () => {
      const mockResponse = {
        accessToken: 'mock-token',
        user: { id: 'user-1', email: 'test@example.com', name: '테스트' },
      };
      mockedAuthService.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockResponse.user);
      expect(result.current.accessToken).toBe(mockResponse.accessToken);
    });

    // TC-AUTH-004: 로그인 실패
    it('should handle login failure', async () => {
      mockedAuthService.login.mockRejectedValue(
        new Error('비밀번호가 일치하지 않습니다'),
      );

      const { result } = renderHook(() => useAuthStore());

      await expect(
        act(async () => {
          await result.current.login('test@example.com', 'wrongpassword');
        }),
      ).rejects.toThrow('비밀번호가 일치하지 않습니다');

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('logout', () => {
    // TC-AUTH-007: 로그아웃
    it('should clear state on logout', () => {
      // Set initial authenticated state
      useAuthStore.setState({
        user: { id: 'user-1', email: 'test@example.com', name: '테스트' },
        accessToken: 'mock-token',
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.accessToken).toBeNull();
    });
  });

  describe('OAuth login', () => {
    // TC-AUTH-005: 카카오 로그인
    it('should handle Kakao OAuth login', async () => {
      const mockResponse = {
        accessToken: 'mock-token',
        user: { id: 'user-1', email: 'kakao@example.com', name: '카카오유저' },
      };
      mockedAuthService.loginWithOAuth.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loginWithOAuth('kakao', 'kakao-oauth-token');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(mockedAuthService.loginWithOAuth).toHaveBeenCalledWith(
        'kakao',
        'kakao-oauth-token',
      );
    });

    // TC-AUTH-006: 구글 로그인
    it('should handle Google OAuth login', async () => {
      const mockResponse = {
        accessToken: 'mock-token',
        user: { id: 'user-1', email: 'google@example.com', name: '구글유저' },
      };
      mockedAuthService.loginWithOAuth.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.loginWithOAuth('google', 'google-oauth-token');
      });

      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
