---
trigger: notion_task
author: troll
created: 2026-01-30
---

# Rule: 8 백엔드 Notion 구조

## 적용 범위
`8d-backend-notion` 에이전트

---

## Task 파일

**경로:** `docs/8-백엔드/backend-tasks.csv`

```csv
task_id,task_name,epic_id,status,api_endpoint,notion_url
BE-001,로그인 API,FT-001,Done,/api/auth/login,https://notion.so/...
```

---

## Task ID 형식: BE-XXX

## Notion Task 생성 규칙

1. `backend-spec.md`에서 기능 목록 읽기
2. `api-spec.md`에서 API 엔드포인트 매핑
3. 각 기능에 대해 BE-XXX Task 생성
4. Epic(FT-XXX)과 연결
5. 생성된 URL을 CSV에 기록

## 상태 업데이트
- To Do → In Progress → Done
