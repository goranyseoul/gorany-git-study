# UI 패턴 가이드

디자인 단계에서 참조하는 UI/UX 패턴 모음

## 제품 유형별 추천 스타일

| 제품 유형 | 추천 스타일 | 색상 팔레트 | 핵심 고려사항 |
|----------|------------|------------|--------------|
| SaaS | Glassmorphism + Flat | Trust Blue + Accent | CTAs 명확히 |
| E-commerce | Vibrant + Motion | Brand + Green (구매) | 전환율 최적화 |
| 대시보드 | Data-Dense + Dark | Dark + Status Colors | 데이터 가독성 |
| 의료/헬스 | Neumorphism + Accessible | Calm Blue + Green | 접근성 필수 |
| 교육 | Claymorphism + 인터랙션 | Playful Colors | 연령대별 적합성 |
| 핀테크 | Glassmorphism + Dark | Trust Blue + Vibrant | 보안 인식 |

## 랜딩 페이지 패턴

### Hero-Centric
- **특징**: 큰 헤드라인 + CTA
- **적합**: 서비스 소개, B2C
- **구조**: Hero → Features → Social Proof → CTA

### Feature-Rich Showcase
- **특징**: 기능 중심 나열
- **적합**: B2B SaaS, 복잡한 제품
- **구조**: Hero → Feature Grid → Demo → Pricing

### Storytelling-Driven
- **특징**: 스토리 흐름
- **적합**: 브랜드, 에이전시
- **구조**: Hook → Problem → Solution → Results

## 대시보드 패턴

### Data-Dense
- **특징**: 많은 정보 밀도
- **적합**: 분석 도구, 모니터링

### Executive Summary
- **특징**: 핵심 KPI 중심
- **적합**: 경영진용, 리포트

### Drill-Down
- **특징**: 개요 → 상세 탐색
- **적합**: 복잡한 데이터 분석

## 모바일 패턴

### Tab Bar Navigation
- **특징**: 하단 탭 5개 이하
- **적합**: 대부분의 앱

### Gesture-Based
- **특징**: 스와이프, 핀치
- **적합**: 미디어, 지도

### Card-Based
- **특징**: 카드 리스트
- **적합**: 피드, 컨텐츠

## 컴포넌트 패턴

### 폼
- 인라인 유효성 검증
- 명확한 에러 메시지
- 진행 상태 표시

### 모달
- 하나의 액션에 집중
- 닫기 방법 명확히
- 배경 딤 처리

### 테이블
- 정렬/필터 제공
- 페이지네이션 or 무한스크롤
- 반응형 고려

## 접근성 체크리스트

- [ ] 색상 대비 4.5:1 이상
- [ ] 터치 타겟 44px 이상
- [ ] 키보드 네비게이션 가능
- [ ] 스크린 리더 호환
- [ ] 포커스 상태 표시
