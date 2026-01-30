---
trigger: notion_task
author: troll
created: 2026-01-30
---

# Rule: Notion 링크 추적

## 적용 범위
Notion Task를 생성하는 모든 에이전트

---

## 파일 구조 (분리)

| 단계 | 파일 | Task 형식 |
|------|------|-----------|
| 2번 | `docs/2-기능정의/features.csv` | FT-XXX (Epic) |
| 5번 | `docs/5-디자인구체화/design-tasks.csv` | DG-XXX |
| 6번 | `docs/6-개발기획/spec-tasks.csv` | SPEC-XXX |
| 7번 | `docs/7-프론트엔드/frontend-tasks.csv` | FE-XXX |
| 8번 | `docs/8-백엔드/backend-tasks.csv` | BE-XXX |

> **토큰 효율**: 각 에이전트는 자기 파일만 읽고 쓰면 됨

---

## CSV 형식

```csv
task_id,task_name,epic_id,notion_url
SPEC-001-1,Google OAuth 로그인,FT-001,https://notion.so/...
```

---

## Task 생성 프로세스

```
1. features.csv에서 Epic 정보 읽기 (notion_url 포함)
2. Notion Task 생성 (본문에 Epic 링크 포함)
3. 반환된 URL을 해당 CSV에 추가
```

---

## Epic 연결

Task 본문에 Epic 링크 포함:

```markdown
### Epic
[FT-001 간편 로그인](https://www.notion.so/FT-001-xxx)
```
