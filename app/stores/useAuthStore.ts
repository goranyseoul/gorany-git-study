import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USE_MOCK } from '../config'
import { authService as realAuthService } from '../services/auth'
import { mockAuthService } from '../mocks/services'

// Mock 모드에 따라 서비스 선택
const authService = USE_MOCK ? mockAuthService : realAuthService

interface User {
  id: string
  email: string
  name: string
  profileImage?: string
  isSupporter: boolean
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (email: string, password: string) => Promise<void>
  loginWithOAuth: (provider: 'kakao' | 'google' | 'apple', token: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<void>
  setUser: (user: User) => void
}

// Storage adapter for Zustand persist
// Mock 모드에서는 AsyncStorage 사용 (Expo Go 호환)
const storage = {
  getItem: async (name: string) => {
    return await AsyncStorage.getItem(name)
  },
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value)
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await authService.login(email, password)
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      loginWithOAuth: async (provider, token) => {
        set({ isLoading: true })
        try {
          const response = await authService.loginWithOAuth(provider, token)
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signup: async (email, password, name) => {
        set({ isLoading: true })
        try {
          const response = await authService.signup(email, password, name)
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          })
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        try {
          const response = await authService.refresh(refreshToken)
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          })
        } catch (error) {
          // Refresh failed, logout user
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          })
          throw error
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
