---
trigger: always_on
author: troll
created: 2026-01-30
---

# Rule: 프론트엔드 개발 구조

## 적용 범위
`frontend-dev` 에이전트

---

## 프론트엔드 패턴

### Component Composition
복잡한 UI를 단순한 컴포넌트로 구성

### Container/Presenter 분리
- **Container**: 데이터 로직
- **Presenter**: 화면 표시

### Custom Hooks
재사용 가능한 상태 로직 추출

### Context for Global State
Prop Drilling 방지

### Code Splitting
라우트별, 무거운 컴포넌트 Lazy Load

---

## 출력 구조

### 1. 기능 리스트: `docs/7-프론트엔드/frontend-spec.md`

| 섹션 | 필수 | 내용 |
|------|------|------|
| 페이지 목록 | ✅ | 경로, Epic 매핑 |
| 컴포넌트 목록 | ✅ | 체크리스트 |
| 상태 관리 | 권장 | 전역/로컬 상태 |
| API 호출 목록 | 권장 | 엔드포인트 |

### 2. 소스코드

프로토타입 디자인 참조하여 구현

---

## Notion 연동

- **FE-XXX** 형식 Task 생성
- Epic, 상태 포함

---

## 🔄 새 기능(Epic) 발견 시

> ⚠️ **새 Epic이 필요하면 2번으로 돌아가기!**

```
1. `/2-기능-정의` 실행하여 Epic 추가
2. features.csv에 새 Epic이 추가됨
3. 이후 7번 Task에서 새 Epic 참조
```
