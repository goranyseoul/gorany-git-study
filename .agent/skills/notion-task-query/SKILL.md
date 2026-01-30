---
name: Notion Task Query
description: Task 데이터베이스에서 담당자/상태별로 페이지를 조회하는 방법
---

# Notion Task Query Skill

PM agent가 Task 조회 요청을 받을 때 이 지침을 따릅니다.

## Task Database 정보

| 항목 | 값 |
|------|------|
| **data_source_id** | `d443ebd9-448d-400e-96b3-8476df702168` |
| **Workspace** | BugHole |

## 담당자(Assignee) User ID 목록

| 이름 | User ID | 이메일 |
|------|---------|--------|
| 고라니 | `edbeb417-44a6-428e-ad28-e360b35b9876` | gorany@lair.fi |
| 트롤 | `f11c3ca3-a653-4a0f-b88f-545e218e7a6d` | troll@bugcity.io |
| 버그 | `ffd3b022-e0da-4f73-b028-b698f588d640` | bug@bugcity.io |
| 뽀삐 | `4ab3d585-ddfc-4092-b1c4-3a3ce00261e7` | marine@bugcity.io |
| 용용 | `d642223f-11b2-4a60-b1cf-b0a4ace349ad` | yongyong@bugcity.io |
| 마이 | `a45f1fed-37cb-4336-a99e-4ba81254fc73` | my@bugcity.io |
| 굿보이 | `2f2780e2-317b-4b26-bf21-4c646909ef86` | goodboy@bugcity.io |
| 키키 | `182d872b-594c-81a9-b8fc-00023fbbcba7` | kiki@lair.fi |
| Lucy S | `1f8d872b-594c-81fe-b90f-000272d0ecc8` | lucy@lair.fi |
| . Miho | `f82ba902-c3db-45d6-8612-55bd66072d44` | miho@bugcity.io |

## Status 옵션

| Status 값 | 의미 | 색상 |
|-----------|------|------|
| `Not started` | 시작 전 | default (회색) |
| `In progress` | 진행 중 | blue |
| `Review` | 검토 중 | pink |
| `Done` | 완료 | brown |
| `Drop/Hold` | 중단/보류 | gray |
| `Backlog` | 백로그 | yellow |

## 주요 속성 ID

| 속성 이름 | 속성 ID | 타입 |
|----------|---------|------|
| Name | `title` | title |
| Status | `zj:G` | status |
| Priority | `0e7d62e1-c630-4b3c-b1ab-f84bc87147ea` | select |
| Date | `pNeG` | date |
| Assignee | `RhTb` | people |
| Product/Part | `nzQG` | multi_select |
| Related to Epic | `gLX~` | relation |

---

## 쿼리 방법

### 1. 기본 쿼리 구조

```json
{
  "data_source_id": "d443ebd9-448d-400e-96b3-8476df702168",
  "filter": {
    "and": [
      {
        "property": "Assignee",
        "people": {
          "contains": "<USER_ID>"
        }
      },
      {
        "or": [
          { "property": "Status", "status": { "equals": "Not started" } },
          { "property": "Status", "status": { "equals": "In progress" } }
        ]
      }
    ]
  },
  "filter_properties": ["title", "zj:G", "pNeG", "gLX~"],
  "page_size": 3
}
```

### 2. Truncate 방지 규칙

> [!IMPORTANT]
> 응답이 truncate되지 않도록 다음 규칙을 반드시 따르세요.

1. **page_size는 3으로 설정** (최대 5)
2. **filter_properties로 필요한 속성만 지정**
   - 기본: `["title", "zj:G", "pNeG", "gLX~"]` (Name, Status, Date, Epic)
   - 우선순위 포함: `["title", "zj:G", "pNeG", "gLX~", "0e7d62e1-c630-4b3c-b1ab-f84bc87147ea"]`
3. **페이지네이션으로 모든 결과 조회**

### 3. 페이지네이션 처리

```
1. 첫 번째 쿼리 실행 (start_cursor 없이)
2. 응답에서 has_more 확인
3. has_more가 true면:
   - next_cursor 값을 start_cursor로 사용
   - 동일한 쿼리 다시 실행
4. has_more가 false가 될 때까지 반복
5. 모든 결과 취합하여 사용자에게 테이블로 표시
```

---

## 예제 쿼리

### 예제 1: 고라니의 진행 중인 Task 조회

```json
{
  "data_source_id": "d443ebd9-448d-400e-96b3-8476df702168",
  "filter": {
    "and": [
      {
        "property": "Assignee",
        "people": { "contains": "edbeb417-44a6-428e-ad28-e360b35b9876" }
      },
      {
        "or": [
          { "property": "Status", "status": { "equals": "Not started" } },
          { "property": "Status", "status": { "equals": "In progress" } }
        ]
      }
    ]
  },
  "filter_properties": ["title", "zj:G", "pNeG", "gLX~"],
  "page_size": 3
}
```

### 예제 2: 특정 상태의 모든 Task 조회 (담당자 무관)

```json
{
  "data_source_id": "d443ebd9-448d-400e-96b3-8476df702168",
  "filter": {
    "property": "Status",
    "status": { "equals": "In progress" }
  },
  "filter_properties": ["title", "zj:G", "RhTb"],
  "page_size": 3
}
```

### 예제 3: 여러 담당자의 Task 조회

여러 담당자를 OR로 조합:

```json
{
  "filter": {
    "and": [
      {
        "or": [
          { "property": "Assignee", "people": { "contains": "USER_ID_1" } },
          { "property": "Assignee", "people": { "contains": "USER_ID_2" } }
        ]
      },
      {
        "property": "Status",
        "status": { "equals": "In progress" }
      }
    ]
  }
}
```

---

## 결과 표시 형식

조회 결과는 다음 형식의 테이블로 표시합니다:

```markdown
## 📋 [담당자명]님의 Task 목록

| # | Task 이름 | Status | Date | Epic |
|---|-----------|--------|------|------|
| 1 | [Task 제목] | ⚪ Not started | 01-20 ~ 01-25 | [Epic 이름] |
| 2 | [Task 제목] | 🔵 In progress | 01-23 | - |
...

**총 N개**의 Task가 조회되었습니다.
```

### Date 표시 규칙

- 시작일만 있는 경우: `01-23`
- 시작일~종료일: `01-20 ~ 01-25`
- 날짜 없음: `-`

### Epic 표시 규칙

- Epic이 연결된 경우: Epic 페이지 제목 표시
- Epic 없음: `-`
- Epic 제목을 가져오려면 relation ID로 별도 페이지 조회 필요

### Status 이모지 규칙

| Status | 이모지 |
|--------|--------|
| Not started | ⚪ |
| In progress | 🔵 |
| Review | 🟣 |
| Done | ✅ |
| Drop/Hold | ⏸️ |
| Backlog | 📋 |
