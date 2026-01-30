---
trigger: notion_task
author: troll
created: 2026-01-30
---

# Rule: 7 프론트엔드 Notion 구조

## 적용 범위
`7d-frontend-notion` 에이전트

---

## Task 파일

**경로:** `docs/7-프론트엔드/frontend-tasks.csv`

```csv
task_id,task_name,epic_id,status,notion_url
FE-001,로그인 페이지,FT-001,Done,https://notion.so/...
```

---

## Task ID 형식: FE-XXX

## Notion Task 생성 규칙

1. `frontend-spec.md`에서 기능 목록 읽기
2. 각 기능에 대해 FE-XXX Task 생성
3. Epic(FT-XXX)과 연결
4. 생성된 URL을 CSV에 기록

## 상태 업데이트
- To Do → In Progress → Done
