# 프론트엔드 기술 스택

## 핵심 기술

| 영역 | 선택 | 버전 | 이유 |
|------|------|------|------|
| 프레임워크 | React Native | 0.73+ | 크로스플랫폼 (iOS/Android) |
| 개발도구 | Expo | SDK 50+ | 카메라, 푸시알림 등 네이티브 기능 쉽게 접근 |
| 언어 | TypeScript | 5.0+ | 타입 안정성, 백엔드와 언어 통일 |
| 상태관리 | Zustand | 4.5+ | 가볍고 간단, 보일러플레이트 최소화 |
| 네비게이션 | React Navigation | 6.x | 탭/스택 네비게이션, 딥링크 지원 |

## 주요 라이브러리

| 라이브러리 | 용도 |
|------------|------|
| `expo-camera` | 영수증/음식 촬영 |
| `expo-image-picker` | 갤러리 이미지 선택 |
| `expo-notifications` | 푸시 알림 (유통기한 알림) |
| `@tanstack/react-query` | 서버 상태 관리, 캐싱 |
| `axios` | API 호출 |
| `react-hook-form` | 폼 처리 |
| `zod` | 유효성 검증 |
| `date-fns` | 날짜 처리 (유통기한 계산) |
| `react-native-reanimated` | 애니메이션 (쇼츠 UI) |
| `expo-av` | 비디오 재생 (쇼츠) |

## 스타일링

| 영역 | 선택 | 이유 |
|------|------|------|
| 스타일링 | NativeWind (Tailwind) | 빠른 개발, 일관된 디자인 시스템 |
| 아이콘 | `@expo/vector-icons` | 다양한 아이콘 세트 |
| 폰트 | Pretendard | 한글 가독성 |

## 디자인 토큰

```typescript
// theme/colors.ts
export const colors = {
  primary: '#FFD43B',      // Sunny Yellow
  primaryDark: '#FFC107',
  background: '#FFFDF7',
  surface: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    muted: '#999999',
  },
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  border: '#E5E5E5',
}

// theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}
```

## 프로젝트 구조

```
app/
├── (tabs)/                    # 탭 네비게이션
│   ├── index.tsx             # 홈 (재고 현황)
│   ├── recipes.tsx           # 레시피
│   ├── shorts.tsx            # 쇼츠
│   ├── lounge.tsx            # 라운지
│   └── my.tsx                # MY페이지
├── (auth)/                    # 인증 플로우
│   ├── login.tsx
│   ├── signup.tsx
│   └── onboarding/
│       ├── body-info.tsx     # 신체정보 입력
│       ├── diet-preference.tsx # 식단 선호도
│       └── food-selection.tsx  # 음식 취향
├── recipe/
│   └── [id].tsx              # 레시피 상세
├── inventory/
│   ├── add.tsx               # 재고 추가
│   └── scan.tsx              # 영수증 스캔
└── _layout.tsx               # 루트 레이아웃

components/
├── common/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   └── Avatar.tsx
├── inventory/
│   ├── InventoryCard.tsx
│   ├── ExpiryBadge.tsx
│   └── ScannerOverlay.tsx
├── recipe/
│   ├── RecipeCard.tsx
│   ├── IngredientList.tsx
│   ├── SubstituteChip.tsx
│   └── NutritionCompare.tsx
├── community/
│   ├── PostCard.tsx
│   ├── ShortsPlayer.tsx
│   └── CommentSection.tsx
└── feedback/
    └── CookingFeedbackModal.tsx

stores/
├── useAuthStore.ts           # 인증 상태
├── useInventoryStore.ts      # 재고 상태
├── useUserPreferenceStore.ts # 사용자 선호도
└── useFamilyStore.ts         # 가족 공유 상태

hooks/
├── useCamera.ts              # 카메라 훅
├── useOCR.ts                 # OCR 처리 훅
├── useRecipeRecommend.ts     # 레시피 추천 훅
└── useExpiry.ts              # 유통기한 알림 훅

services/
├── api.ts                    # API 클라이언트
├── auth.ts                   # 인증 서비스
├── inventory.ts              # 재고 API
├── recipe.ts                 # 레시피 API
└── community.ts              # 커뮤니티 API
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npx expo start

# iOS 시뮬레이터
npx expo run:ios

# Android 에뮬레이터
npx expo run:android
```
