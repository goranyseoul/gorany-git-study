/**
 * 앱 설정
 */

// Mock 모드 설정
// true: 서버 없이 가짜 데이터로 테스트
// false: 실제 서버 연결
export const USE_MOCK = true

// API 서버 주소 (Mock 모드가 아닐 때 사용)
export const API_BASE_URL = 'http://localhost:3000/api/v1'

// 앱 설정
export const APP_CONFIG = {
  // 유통기한 알림 기준 (일)
  EXPIRY_WARNING_DAYS: 7,

  // 페이지네이션 기본값
  DEFAULT_PAGE_SIZE: 20,

  // 이미지 최대 크기 (MB)
  MAX_IMAGE_SIZE_MB: 10,
}
