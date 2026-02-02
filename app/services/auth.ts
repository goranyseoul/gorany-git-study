import { api, ApiResponse } from './api'

interface User {
  id: string
  email: string
  name: string
  profileImage?: string
  isSupporter: boolean
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    })
    return response.data.data
  },

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', {
      email,
      password,
      name,
    })
    return response.data.data
  },

  async loginWithOAuth(
    provider: 'kakao' | 'google' | 'apple',
    accessToken: string
  ): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(`/auth/oauth/${provider}`, {
      accessToken,
    })
    return response.data.data
  },

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await api.post<ApiResponse<TokenResponse>>('/auth/refresh', {
      refreshToken,
    })
    return response.data.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/me')
    return response.data.data
  },

  async updateProfile(data: { name?: string; profileImage?: string }): Promise<User> {
    const response = await api.patch<ApiResponse<User>>('/users/me', data)
    return response.data.data
  },
}
