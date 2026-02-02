export const colors = {
  // Primary - Sunny Yellow
  primary: '#FFD43B',
  primaryLight: '#FFE066',
  primaryDark: '#FFC107',

  // Background
  background: '#FFFDF7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F5',

  // Text
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    muted: '#999999',
    inverse: '#FFFFFF',
  },

  // Status
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',
  info: '#2196F3',
  infoLight: '#E3F2FD',

  // Border
  border: '#E5E5E5',
  borderLight: '#F0F0F0',

  // Diet badges
  diet: {
    diabetes: '#FF7043',
    keto: '#AB47BC',
    vegan: '#66BB6A',
    lowSodium: '#42A5F5',
    highProtein: '#EF5350',
  },

  // Storage location
  storage: {
    refrigerator: '#42A5F5',
    freezer: '#5C6BC0',
    room: '#8D6E63',
  },
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
} as const
