---
trigger: always_on
author: troll
created: 2026-01-30
---

# Rule: 백엔드 개발 구조

## 적용 범위
`backend-dev` 에이전트

---

## 백엔드 패턴

### Repository Pattern
데이터 접근 추상화

### Service Layer
비즈니스 로직 분리

### Middleware Pattern
Request/Response 처리

### Event-Driven Architecture
비동기 작업 처리

### CQRS (필요시)
읽기/쓰기 분리

---

## 출력 구조

### 1. 기능 리스트: `docs/8-백엔드/backend-spec.md`

| 섹션 | 필수 | 내용 |
|------|------|------|
| DB 테이블 목록 | ✅ | 테이블명, 설명 |
| API 엔드포인트 목록 | ✅ | 체크리스트 |
| 비즈니스 로직 | 권장 | 주요 플로우 |
| 인증/권한 | 권장 | 접근 제어 |

### 2. API 명세: `docs/8-백엔드/api-spec.md`

Request/Response 정의

### 3. DB 스키마: `prisma/schema.prisma`

---

## Notion 연동

- **BE-XXX** 형식 Task 생성
- Epic, 상태 포함

---

## 🔄 새 기능(Epic) 발견 시

> ⚠️ **새 Epic이 필요하면 2번으로 돌아가기!**

```
1. `/2-기능-정의` 실행하여 Epic 추가
2. features.csv에 새 Epic이 추가됨
3. 이후 8번 Task에서 새 Epic 참조
```
