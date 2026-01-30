---
trigger: file_change
author: troll
created: 2026-01-30
---

# Rule: 자동 커밋

## 적용 범위
모든 에이전트

## 규칙

작업 완료 후 자동으로 Git 커밋을 수행합니다.

### 커밋 타이밍
- 문서 생성/수정 완료 시
- 코드 생성/수정 완료 시
- 사용자 승인 후

### 커밋 메시지 형식
```
[에이전트명] 작업 내용

예시:
[feature-planner] 기능 정의서 생성
[requirements-planner] 요구사항 문서 업데이트
```

---

## 브랜치 전략 (팀 협업 시)

### 혼자 작업
- `main` 브랜치에 직접 커밋

### 팀 협업
- 작업 시작 전: `git checkout -b [브랜치명]`
- 브랜치명 형식: `[에이전트명]/[작업내용]`
  - 예: `feature-planner/add-login-feature`
  - 예: `requirements/update-user-flow`
- 작업 완료 후: PR 생성 요청

### 브랜치 사용 여부
- 사용자가 "브랜치 사용해줘" 또는 "팀 모드"라고 하면 브랜치 생성
- 기본값: main에 직접 커밋
