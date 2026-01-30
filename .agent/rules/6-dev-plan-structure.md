---
trigger: always_on
author: troll
created: 2026-01-30
---

# Rule: 개발 기획 구조

## 적용 범위
`dev-planner` 에이전트

---

## 역할
개발 시작 전 **기능 명세 및 규칙 정의**를 담당합니다.

---

## 입력

### 필수 참조
- `docs/2-기능정의/features.csv` - **notion_url 컬럼 활용**

---

## 출력 구조

### 1. 상세 기능 명세서: `docs/6-개발기획/feature-spec.md`

| 섹션 | 필수 | 내용 |
|------|------|------|
| Epic별 기능 목록 | ✅ | 기능 ID, 설명, **Notion 링크** |
| 입력/출력 | ✅ | 각 기능의 I/O |
| 화면 매핑 | 권장 | 프로토타입 연결 |

### 2. 비즈니스 규칙: `docs/6-개발기획/business-rules.md`

| 섹션 | 필수 | 내용 |
|------|------|------|
| 비즈니스 규칙 | ✅ | 핵심 로직 규칙 |
| 예외 처리 | ✅ | 에러 케이스 정의 |
| 유효성 검증 | 권장 | 입력 검증 규칙 |

---

## Notion 연동 (필수)

### Epic URL 참조
`features.csv`에서 `notion_url` 컬럼을 읽어 Epic과 연결합니다.

### Task 생성 규칙

```
1. features.csv에서 Epic 정보 읽기
2. 각 Epic별 세부 Task 생성
3. Task 본문에 Epic 링크 포함
4. 생성된 Task URL을 feature-spec.md에 기록
```

### Task 형식

| 항목 | 값 |
|------|-----|
| ID | `SPEC-{Epic번호}-{순번}` (예: SPEC-001-1) |
| 제목 | 기능명 |
| Epic 연결 | 본문에 Epic 링크 포함 |

### 예시: Task 본문

```markdown
### Epic
[FT-001 간편 로그인](https://www.notion.so/FT-001-xxx)

### 기능 설명
Google OAuth를 통한 로그인 구현

### 입력/출력
- 입력: 클릭
- 출력: 로그인 완료, 대시보드 이동
```

---

## feature-spec.md 형식

Epic 섹션에 Notion 링크 포함:

```markdown
## [FT-001 간편 로그인](https://www.notion.so/FT-001-xxx)

### 기능 상세

| ID | 기능 | Notion |
|----|------|--------|
| FT-001-1 | Google OAuth | [SPEC-001-1](https://notion.so/...) |
| FT-001-2 | Apple OAuth | [SPEC-001-2](https://notion.so/...) |
```

---

## 🔄 새 기능(Epic) 발견 시

> ⚠️ **새 Epic이 필요하면 2번으로 돌아가기!**

```
1. `/2-기능-정의` 실행하여 Epic 추가
2. features.csv에 새 Epic이 추가됨
3. 이후 6번 Task에서 새 Epic 참조
```
