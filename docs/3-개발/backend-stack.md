# 백엔드 기술 스택

## 핵심 기술

| 영역 | 선택 | 버전 | 이유 |
|------|------|------|------|
| 프레임워크 | NestJS | 10.x | 구조화된 아키텍처, 모듈화 |
| 언어 | TypeScript | 5.0+ | 타입 안정성, 프론트엔드와 통일 |
| 데이터베이스 | PostgreSQL | 15+ | 관계형 데이터, JSON 지원 |
| ORM | Prisma | 5.x | 타입 안전, 마이그레이션 쉬움 |
| 캐시 | Redis | 7.x | 세션, 추천 결과 캐싱 |

## 인증

| 영역 | 선택 | 이유 |
|------|------|------|
| 토큰 | JWT | stateless, 모바일 앱에 적합 |
| 소셜로그인 | OAuth 2.0 | 카카오, 구글, 애플 |
| 보안 | bcrypt | 비밀번호 해싱 |

## 주요 라이브러리

| 라이브러리 | 용도 |
|------------|------|
| `@nestjs/passport` | 인증 |
| `@nestjs/jwt` | JWT 토큰 |
| `passport-kakao` | 카카오 로그인 |
| `passport-google-oauth20` | 구글 로그인 |
| `class-validator` | 요청 유효성 검증 |
| `class-transformer` | DTO 변환 |
| `@nestjs/swagger` | API 문서 자동 생성 |
| `@nestjs/schedule` | 스케줄링 (유통기한 알림) |
| `@nestjs/bull` | 작업 큐 (OCR 처리) |

## 외부 서비스 연동

| 서비스 | 용도 | SDK |
|--------|------|-----|
| Naver Clova OCR | 영수증 텍스트 추출 | REST API |
| Google Cloud Vision | 음식 이미지 인식 | `@google-cloud/vision` |
| AWS S3 | 이미지 저장 | `@aws-sdk/client-s3` |
| Firebase | 푸시 알림 | `firebase-admin` |

## 프로젝트 구조

```
server/
├── src/
│   ├── main.ts                      # 엔트리포인트
│   ├── app.module.ts                # 루트 모듈
│   │
│   ├── common/                      # 공통
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   │
│   ├── config/                      # 설정
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── s3.config.ts
│   │
│   ├── modules/
│   │   ├── auth/                    # 인증
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   └── dto/
│   │   │
│   │   ├── user/                    # 사용자
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── family/                  # 가족 그룹
│   │   │   ├── family.module.ts
│   │   │   ├── family.controller.ts
│   │   │   └── family.service.ts
│   │   │
│   │   ├── inventory/               # 재고 관리
│   │   │   ├── inventory.module.ts
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── recipe/                  # 레시피
│   │   │   ├── recipe.module.ts
│   │   │   ├── recipe.controller.ts
│   │   │   ├── recipe.service.ts
│   │   │   ├── recommendation.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── meal/                    # 식사 기록
│   │   │   ├── meal.module.ts
│   │   │   ├── meal.controller.ts
│   │   │   ├── meal.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── community/               # 커뮤니티
│   │   │   ├── community.module.ts
│   │   │   ├── post.controller.ts
│   │   │   ├── shorts.controller.ts
│   │   │   ├── comment.controller.ts
│   │   │   └── dto/
│   │   │
│   │   ├── ocr/                     # OCR 처리
│   │   │   ├── ocr.module.ts
│   │   │   ├── ocr.service.ts
│   │   │   └── ocr.processor.ts
│   │   │
│   │   └── notification/            # 알림
│   │       ├── notification.module.ts
│   │       ├── notification.service.ts
│   │       └── notification.scheduler.ts
│   │
│   └── prisma/                      # Prisma
│       ├── prisma.module.ts
│       └── prisma.service.ts
│
├── prisma/
│   ├── schema.prisma                # 스키마 정의
│   └── migrations/                  # 마이그레이션
│
├── test/                            # 테스트
│   ├── e2e/
│   └── unit/
│
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

## 환경 변수

```env
# .env.example

# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fridge_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# OAuth - Kakao
KAKAO_CLIENT_ID=""
KAKAO_CLIENT_SECRET=""
KAKAO_CALLBACK_URL=""

# OAuth - Google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL=""

# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="ap-northeast-2"
AWS_S3_BUCKET=""

# Naver Clova OCR
CLOVA_OCR_API_URL=""
CLOVA_OCR_SECRET_KEY=""

# Firebase
FIREBASE_PROJECT_ID=""
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=""
```

## 실행 방법

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 개발 서버 시작
npm run start:dev

# 프로덕션 빌드
npm run build
npm run start:prod
```

## API 문서

개발 서버 실행 후: `http://localhost:3000/api/docs` (Swagger UI)
