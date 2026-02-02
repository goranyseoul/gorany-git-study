# 3b. 백엔드 개발

## 호출
```
@backend [요청사항]
```

## 역할
요구사항을 기반으로 **백엔드 설계 및 구현**을 담당합니다.

---

## 전제 조건

시작 전 확인:
- [ ] `docs/1-요구사항/main.md` 존재 여부

> ⚠️ 없으면: "요구사항 문서가 없습니다. `@requirements`로 먼저 요구사항을 정의해주세요."

---

## 입력
- `docs/1-요구사항/main.md` - 요구사항 문서
- `docs/2-디자인/screens.md` - 화면 구성 (API 엔드포인트 도출용)

---

## 진행 순서

### Step 1: 기술 스택 결정

사용자에게 질문:
1. **프레임워크**: NestJS / Express / FastAPI / Spring?
2. **데이터베이스**: PostgreSQL / MySQL / MongoDB?
3. **인증**: JWT / Session / OAuth?

> 💡 "모르겠다"면 → 프로젝트 특성에 맞춰 추천

### Step 2: 설계 문서 작성

- ERD (데이터베이스 설계)
- API 명세
- 클래스 다이어그램 (선택)

### Step 3: 구현

1. 프로젝트 초기화
2. 데이터베이스 스키마 생성
3. API 엔드포인트 구현
4. 인증/인가 구현
5. 비즈니스 로직 구현

---

## 산출물

### 1. 기술 스택: `docs/3-개발/backend-stack.md`

```markdown
# 백엔드 기술 스택

## 핵심 기술
| 영역 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | NestJS | 구조화된 아키텍처 |
| 언어 | TypeScript | 타입 안정성 |
| DB | PostgreSQL | 관계형 데이터 |
| ORM | Prisma | 타입 안전한 쿼리 |

## 주요 라이브러리
- passport: 인증
- class-validator: 유효성 검증
- swagger: API 문서화
```

### 2. ERD: `docs/3-개발/backend-erd.md`

```markdown
# ERD (Entity Relationship Diagram)

## 엔티티 목록
| 엔티티 | 설명 |
|--------|------|
| User | 사용자 |
| Post | 게시글 |

## ERD 다이어그램
(Mermaid erDiagram)

## 테이블 상세

### User
| 컬럼 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | UUID | ✅ | PK |
| email | VARCHAR(255) | ✅ | 이메일 |
| name | VARCHAR(100) | ✅ | 이름 |
| createdAt | TIMESTAMP | ✅ | 생성일 |
```

### 3. API 명세: `docs/3-개발/backend-api.md`

```markdown
# API 명세

## Base URL
`/api/v1`

## 인증
- Bearer Token (JWT)
- 헤더: `Authorization: Bearer {token}`

## 엔드포인트

### 사용자

#### POST /auth/login
로그인

**Request**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| email | string | ✅ | 이메일 |
| password | string | ✅ | 비밀번호 |

**Response**
| 필드 | 타입 | 설명 |
|------|------|------|
| accessToken | string | JWT 토큰 |
| user | User | 사용자 정보 |
```

### 4. 소스 코드: `server/` 또는 `backend/` 폴더

실제 구현된 백엔드 코드

---

## 코딩 규칙

### API 응답 형식
```typescript
// ✅ 일관된 응답 구조
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}
```

### 에러 처리
```typescript
// ✅ 명확한 에러 핸들링
try {
  const user = await userService.findById(id)
  if (!user) {
    throw new NotFoundException('사용자를 찾을 수 없습니다')
  }
  return user
} catch (error) {
  logger.error('User lookup failed:', error)
  throw error
}
```

### 유효성 검증
```typescript
// ✅ DTO에서 검증
class CreateUserDto {
  @IsEmail()
  email: string

  @MinLength(2)
  @MaxLength(100)
  name: string
}
```

---

## 완료 체크리스트

- [ ] `docs/3-개발/backend-stack.md` 생성됨
- [ ] `docs/3-개발/backend-erd.md` 생성됨
- [ ] `docs/3-개발/backend-api.md` 생성됨
- [ ] 백엔드 코드 구현됨
- [ ] 로컬에서 실행 확인
- [ ] 사용자 확인 완료

---

## 완료 후

```
✅ 백엔드 개발 완료!

📄 생성된 문서:
- docs/3-개발/backend-stack.md
- docs/3-개발/backend-erd.md
- docs/3-개발/backend-api.md

💻 실행 방법:
npm install && npm run start:dev

→ 다음:
  - 프론트엔드가 아직이면: @frontend 프론트엔드 개발 시작해줘
  - 프론트엔드 완료됐으면: @testing 테스트 시작해줘
```
