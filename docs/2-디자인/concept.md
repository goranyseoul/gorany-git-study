# 디자인 컨셉

## 스타일

- **분위기**: 친근하고 따뜻한
- **톤앤매너**: 부드럽고 신뢰감 있는, 일상에 자연스럽게 스며드는 느낌
- **키워드**: 따뜻함, 신선함, 가족, 건강

## 레퍼런스

| 앱 | 참고 포인트 |
|----|------------|
| 마켓컬리 | 카드 기반 UI, 깔끔한 상품 목록, 신뢰감 있는 레이아웃 |
| 올리브영 | 친근한 색감, 활기찬 느낌, 하단 탭 네비게이션 |

## 색상 팔레트

| 용도 | 색상 | HEX | 사용처 |
|------|------|-----|--------|
| Primary | 🟡 Sunny Yellow | `#FFD43B` | 주요 버튼, 강조 |
| Primary Dark | 🟠 Warm Orange | `#F59F00` | 버튼 pressed, 액센트 |
| Secondary | 🟢 Fresh Green | `#51CF66` | 신선도, 성공 상태 |
| Background | ⚪ Warm White | `#FFFDF7` | 배경 |
| Surface | 🔲 Light Gray | `#F8F9FA` | 카드 배경 |
| Text Primary | ⚫ Dark | `#212529` | 제목, 본문 |
| Text Secondary | 🔘 Gray | `#868E96` | 보조 텍스트 |
| Danger | 🔴 Red | `#FF6B6B` | 유통기한 임박, 에러 |

### 색상 활용 예시

```
- 유통기한 D-3 이상: 🟢 Fresh Green
- 유통기한 D-1~2: 🟡 Sunny Yellow
- 유통기한 D-day/지남: 🔴 Danger Red
```

## 타이포그래피

| 용도 | 폰트 | 크기 | 굵기 |
|------|------|------|------|
| 대제목 | Pretendard | 24px | Bold (700) |
| 소제목 | Pretendard | 18px | SemiBold (600) |
| 본문 | Pretendard | 16px | Regular (400) |
| 캡션 | Pretendard | 14px | Regular (400) |
| 작은 텍스트 | Pretendard | 12px | Regular (400) |

## 아이콘 스타일

- **스타일**: Rounded, Filled
- **선 두께**: 2px
- **모서리**: 둥근 모서리 (친근한 느낌)
- **추천 라이브러리**: Phosphor Icons, Tabler Icons

## 컴포넌트 스타일

### 버튼
```
- Border Radius: 12px (둥글게)
- Padding: 16px 24px
- Primary: 노랑 배경 + 어두운 텍스트
- Secondary: 흰 배경 + 노랑 테두리
```

### 카드
```
- Border Radius: 16px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Padding: 16px
- Background: #FFFFFF
```

### 입력 필드
```
- Border Radius: 12px
- Border: 1px solid #E9ECEF
- Focus Border: 2px solid #FFD43B
- Padding: 14px 16px
```

## 간격 시스템

| 단위 | 크기 | 사용처 |
|------|------|--------|
| xs | 4px | 아이콘과 텍스트 사이 |
| sm | 8px | 작은 요소 간격 |
| md | 16px | 기본 간격 |
| lg | 24px | 섹션 간격 |
| xl | 32px | 큰 섹션 간격 |

## 무드보드

```
┌─────────────────────────────────────────┐
│  🍳 따뜻한 아침 식탁                      │
│  🥗 신선한 채소들                         │
│  👨‍👩‍👧‍👦 가족이 함께하는 식사              │
│  📱 깔끔하고 직관적인 UI                  │
│  🌤️ 밝고 긍정적인 에너지                 │
└─────────────────────────────────────────┘
```
