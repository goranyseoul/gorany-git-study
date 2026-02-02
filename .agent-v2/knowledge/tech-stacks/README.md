# 기술 스택 가이드

프로젝트 특성에 따른 기술 스택 추천

## 빠른 선택 가이드

| 프로젝트 유형 | 프론트엔드 | 백엔드 | DB |
|--------------|-----------|--------|-----|
| MVP/빠른 개발 | Next.js + Tailwind | Supabase | PostgreSQL |
| 기업용 SaaS | React + TypeScript | NestJS | PostgreSQL |
| 모바일 앱 | Flutter | NestJS/FastAPI | PostgreSQL |
| 정적 사이트 | Astro | - | - |
| 실시간 앱 | Next.js | NestJS + Socket.io | PostgreSQL + Redis |

---

## 프론트엔드

### Next.js (추천)
**적합한 경우**: SEO 중요, SSR 필요, 풀스택
```
장점: SSR/SSG, 파일 기반 라우팅, API Routes
단점: 서버 비용, 학습 곡선
```

### React + Vite
**적합한 경우**: SPA, 클라이언트 렌더링
```
장점: 빠른 빌드, 간단한 설정
단점: SEO 어려움
```

### Flutter
**적합한 경우**: 모바일 앱, 크로스 플랫폼
```
장점: 하나의 코드베이스, 네이티브 성능
단점: 웹 성능, 앱 크기
```

---

## 백엔드

### NestJS (추천)
**적합한 경우**: 구조화된 대규모 앱, TypeScript 선호
```
장점: 모듈 구조, DI, 타입 안전성
단점: 보일러플레이트, 학습 곡선
```

### FastAPI
**적합한 경우**: ML/AI 연동, 빠른 API
```
장점: 빠른 성능, 자동 문서화, Python 생태계
단점: 비동기 복잡성
```

### Supabase
**적합한 경우**: MVP, 빠른 개발, 서버리스
```
장점: Auth/DB/Storage 통합, 실시간
단점: 커스터마이징 한계, 비용
```

---

## 데이터베이스

### PostgreSQL (추천)
**적합한 경우**: 대부분의 경우
```
장점: 안정성, JSON 지원, 확장성
```

### MongoDB
**적합한 경우**: 스키마 유연성 필요, 문서형 데이터
```
장점: 유연한 스키마, 수평 확장
단점: 트랜잭션 제한, 조인 어려움
```

### Redis
**적합한 경우**: 캐싱, 세션, 실시간
```
용도: 캐시, 세션 저장소, Pub/Sub
```

---

## 스타일링

### Tailwind CSS (추천)
```
장점: 빠른 개발, 일관성, 번들 크기
단점: 클래스명 길어짐
```

### styled-components
```
장점: CSS-in-JS, 동적 스타일링
단점: 런타임 비용
```

---

## 상태 관리

### Zustand (추천)
```
장점: 간단, 가벼움, 보일러플레이트 없음
적합: 중소규모 앱
```

### Redux Toolkit
```
장점: 표준화, DevTools, 미들웨어
적합: 대규모 앱, 복잡한 상태
```

### TanStack Query
```
장점: 서버 상태 관리, 캐싱
적합: API 중심 앱
```

---

## 인증

### NextAuth.js
```
적합: Next.js 프로젝트
지원: OAuth, Credentials, JWT
```

### Supabase Auth
```
적합: Supabase 사용 시
지원: OAuth, Magic Link, Phone
```

### Passport.js
```
적합: Express/NestJS
지원: 다양한 전략
```

---

## 배포

### Vercel
```
적합: Next.js, 정적 사이트
장점: 쉬운 배포, 프리뷰, Edge
```

### Railway
```
적합: 백엔드, 데이터베이스
장점: 쉬운 설정, 저렴
```

### AWS
```
적합: 대규모, 커스텀 인프라
서비스: EC2, RDS, S3, Lambda
```
