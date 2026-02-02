# API 명세

## Base URL
```
/api/v1
```

## 인증
- Bearer Token (JWT)
- 헤더: `Authorization: Bearer {token}`

## 공통 응답 형식

```typescript
// 성공
{
  "success": true,
  "data": { ... }
}

// 에러
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}

// 페이지네이션
{
  "success": true,
  "data": {
    "items": [...],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

---

## 1. 인증 (Auth)

### POST /auth/signup
회원가입

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | string | ✅ | 이메일 |
| password | string | ✅ | 비밀번호 (8자 이상) |
| name | string | ✅ | 이름 |

**Response**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "name": "..." },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### POST /auth/login
로그인

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | string | ✅ | 이메일 |
| password | string | ✅ | 비밀번호 |

### POST /auth/oauth/{provider}
소셜 로그인 (kakao, google, apple)

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| accessToken | string | ✅ | OAuth 액세스 토큰 |

### POST /auth/refresh
토큰 갱신

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| refreshToken | string | ✅ | 리프레시 토큰 |

### POST /auth/logout
로그아웃

---

## 2. 사용자 (User)

### GET /users/me
내 정보 조회

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "profileImage": "https://...",
    "isSupporter": false,
    "preference": {
      "height": 170,
      "weight": 65,
      "dietTypes": ["diabetes"],
      "allergies": ["땅콩"],
      "targetCalories": 1800
    }
  }
}
```

### PATCH /users/me
내 정보 수정

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | | 이름 |
| profileImage | string | | 프로필 이미지 URL |

### PUT /users/me/preference
선호도 설정 (온보딩)

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| height | number | | 키 (cm) |
| weight | number | | 몸무게 (kg) |
| age | number | | 나이 |
| gender | string | | 성별 (male, female) |
| activityLevel | string | | 활동량 (low, medium, high) |
| dietTypes | string[] | | 식단 유형 |
| allergies | string[] | | 알러지 |
| dislikedFoods | string[] | | 싫어하는 음식 |
| favoriteFoods | string[] | | 좋아하는 음식 |

---

## 3. 가족 (Family)

### POST /families
가족 그룹 생성

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | ✅ | 가족 이름 |

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "우리집",
    "inviteCode": "ABC123",
    "members": [{ "userId": "...", "name": "홍길동", "role": "owner" }]
  }
}
```

### POST /families/join
가족 그룹 참여

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| inviteCode | string | ✅ | 초대 코드 |

### GET /families/:id
가족 정보 조회

### GET /families/:id/members
가족 구성원 목록

### DELETE /families/:id/members/:userId
가족 구성원 삭제

---

## 4. 재고 (Inventory)

### GET /inventory
재고 목록 조회

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| category | string | 카테고리 필터 |
| storage | string | 보관위치 (냉장, 냉동, 실온) |
| expiringSoon | boolean | 유통기한 임박 (7일 이내) |
| familyId | string | 가족 공유 재고만 |

**Response**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "우유",
        "category": "유제품",
        "quantity": 1,
        "unit": "개",
        "expiryDate": "2024-01-15",
        "daysUntilExpiry": 3,
        "storageLocation": "냉장",
        "imageUrl": "https://..."
      }
    ],
    "summary": {
      "total": 25,
      "expiringSoon": 3,
      "expired": 1
    }
  }
}
```

### POST /inventory
재고 추가

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | ✅ | 품목명 |
| category | string | ✅ | 카테고리 |
| quantity | number | ✅ | 수량 |
| unit | string | ✅ | 단위 |
| purchaseDate | string | | 구매일 (YYYY-MM-DD) |
| expiryDate | string | | 유통기한 (YYYY-MM-DD) |
| price | number | | 가격 |
| storageLocation | string | | 보관위치 |
| familyId | string | | 가족 공유 시 |

### POST /inventory/scan
영수증 OCR 스캔

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| imageUrl | string | ✅ | 영수증 이미지 URL |

**Response**
```json
{
  "success": true,
  "data": {
    "items": [
      { "name": "서울우유 1L", "quantity": 2, "price": 5800 },
      { "name": "계란 30구", "quantity": 1, "price": 8900 }
    ],
    "store": "이마트",
    "purchaseDate": "2024-01-10",
    "totalAmount": 14700
  }
}
```

### PATCH /inventory/:id
재고 수정

### DELETE /inventory/:id
재고 삭제

### POST /inventory/:id/consume
재고 소비 (수량 차감)

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| quantity | number | ✅ | 소비 수량 |

---

## 5. 레시피 (Recipe)

### GET /recipes
레시피 목록

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| q | string | 검색어 |
| dietType | string | 식단 유형 필터 |
| difficulty | string | 난이도 |
| maxTime | number | 최대 조리시간 |
| useInventory | boolean | 재고 기반 추천 |
| page | number | 페이지 |
| limit | number | 페이지당 개수 |

### GET /recipes/recommended
맞춤 레시피 추천

**Response**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "닭가슴살 샐러드",
        "imageUrl": "https://...",
        "cookingTime": 15,
        "difficulty": "easy",
        "matchRate": 85,
        "dietBadges": ["저탄고지", "고단백"],
        "missingIngredients": ["방울토마토"]
      }
    ]
  }
}
```

### GET /recipes/:id
레시피 상세

**Response**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "닭가슴살 샐러드",
    "description": "다이어트에 좋은 고단백 샐러드",
    "imageUrl": "https://...",
    "cookingTime": 15,
    "difficulty": "easy",
    "servings": 2,
    "nutrition": {
      "calories": 350,
      "protein": 35,
      "carbs": 15,
      "fat": 12
    },
    "ingredients": [
      {
        "name": "닭가슴살",
        "amount": 200,
        "unit": "g",
        "inInventory": true,
        "substitute": null
      },
      {
        "name": "설탕",
        "amount": 1,
        "unit": "큰술",
        "inInventory": true,
        "substitute": {
          "name": "알룰로스",
          "reason": "당뇨 식단에 적합",
          "nutritionDiff": { "calories": -15, "carbs": -4 }
        }
      }
    ],
    "steps": [
      { "order": 1, "description": "닭가슴살을 삶아주세요", "imageUrl": "..." }
    ]
  }
}
```

### GET /recipes/:id/customized
맞춤형 레시피 (대체 재료 적용)

---

## 6. 식사 기록 (Meal)

### GET /meals
식사 기록 목록

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| date | string | 특정 날짜 (YYYY-MM-DD) |
| startDate | string | 시작일 |
| endDate | string | 종료일 |
| type | string | 식사 종류 |

### POST /meals
식사 기록 추가

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| type | string | ✅ | breakfast, lunch, dinner, snack |
| imageUrl | string | | 식사 사진 |
| recipeId | string | | 사용한 레시피 |
| mealTime | string | ✅ | 식사 시간 |
| memo | string | | 메모 |

### POST /meals/:id/analyze
음식 사진 AI 분석

**Response**
```json
{
  "success": true,
  "data": {
    "foods": [
      { "name": "흰쌀밥", "portion": "1공기", "calories": 300 },
      { "name": "된장찌개", "portion": "1그릇", "calories": 120 }
    ],
    "totalNutrition": {
      "calories": 520,
      "protein": 18,
      "carbs": 85,
      "fat": 12
    }
  }
}
```

### POST /meals/:id/feedback
식사 피드백 등록

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| tasteRating | number | ✅ | 맛 평점 (1-5) |
| portionFeedback | string | | too_little, just_right, too_much |
| comment | string | | 코멘트 |

### GET /meals/stats
식사 통계

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| period | string | week, month |

---

## 7. 커뮤니티 (Community)

### GET /posts
라운지 게시글 목록

**Query Parameters**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| sort | string | latest, popular |
| page | number | 페이지 |

### POST /posts
게시글 작성

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| content | string | ✅ | 내용 |
| imageUrls | string[] | | 이미지 URL 배열 |
| recipeId | string | | 연결된 레시피 |

### GET /shorts
쇼츠 목록

### POST /shorts
쇼츠 업로드

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | string | ✅ | 제목 |
| videoUrl | string | ✅ | 비디오 URL |
| thumbnailUrl | string | ✅ | 썸네일 URL |
| recipeId | string | | 연결된 레시피 |

### POST /posts/:id/like
게시글 좋아요

### DELETE /posts/:id/like
게시글 좋아요 취소

### GET /posts/:id/comments
댓글 목록

### POST /posts/:id/comments
댓글 작성

---

## 8. 알림 (Notification)

### GET /notifications
알림 목록

**Response**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "type": "expiry_warning",
        "title": "유통기한 임박",
        "body": "우유의 유통기한이 3일 남았습니다",
        "isRead": false,
        "createdAt": "2024-01-10T09:00:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

### PATCH /notifications/:id/read
알림 읽음 처리

### PATCH /notifications/read-all
전체 읽음 처리

---

## 9. 파일 업로드

### POST /upload/image
이미지 업로드

**Request**
- Content-Type: multipart/form-data
- 필드: file (이미지 파일)

**Response**
```json
{
  "success": true,
  "data": {
    "url": "https://s3.../image.jpg"
  }
}
```

### POST /upload/video
비디오 업로드 (쇼츠용)

---

## 에러 코드

| 코드 | HTTP | 설명 |
|------|------|------|
| AUTH_INVALID_CREDENTIALS | 401 | 잘못된 이메일/비밀번호 |
| AUTH_TOKEN_EXPIRED | 401 | 토큰 만료 |
| AUTH_UNAUTHORIZED | 403 | 권한 없음 |
| USER_NOT_FOUND | 404 | 사용자 없음 |
| USER_ALREADY_EXISTS | 409 | 이미 가입된 이메일 |
| FAMILY_NOT_FOUND | 404 | 가족 그룹 없음 |
| FAMILY_INVALID_CODE | 400 | 잘못된 초대 코드 |
| INVENTORY_NOT_FOUND | 404 | 재고 아이템 없음 |
| RECIPE_NOT_FOUND | 404 | 레시피 없음 |
| OCR_FAILED | 500 | OCR 처리 실패 |
| VALIDATION_ERROR | 400 | 유효성 검증 실패 |
