import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as SplashScreen from 'expo-splash-screen'
import { USE_MOCK } from '../config'
import { colors } from '../theme/colors'

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
})

export default function RootLayout() {
  // Mock 모드에서는 항상 인증됨으로 처리
  const isAuthenticated = USE_MOCK ? true : false

  useEffect(() => {
    // Hide splash screen after app is ready
    SplashScreen.hideAsync()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {/* Mock 모드에서는 바로 탭 화면으로 */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="recipe/[id]"
          options={{
            title: '레시피',
            headerBackTitle: '뒤로',
          }}
        />
        <Stack.Screen
          name="inventory/add"
          options={{
            title: '재고 추가',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="inventory/scan"
          options={{
            title: '영수증 스캔',
            presentation: 'fullScreenModal',
            headerShown: false,
          }}
        />
      </Stack>
    </QueryClientProvider>
  )
}
