---
name: Notion Docs Query
description: Docs 데이터베이스에서 팀/타입/참여자별로 문서를 조회하는 방법
---

# Notion Docs Query Skill

PM agent가 Docs 조회 요청을 받을 때 이 지침을 따릅니다.

## Docs Database 정보

| 항목 | 값 |
|------|------|
| **data_source_id** | `bd97c847-cfab-4a92-9cad-8d20c83079a9` |
| **Workspace** | BugHole |

## 참여자(Participants) User ID 목록

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

## Type 옵션

| Type 값 | 설명 | 색상 |
|---------|------|------|
| `회의록/논의 기록` | 미팅 노트 | default |
| `기획` | 기획 문서 | pink |
| `정책` | 정책 문서 | blue |
| `외부 콘텐츠` | 외부 콘텐츠 | - |
| `워크플로우` | 프로세스 | green |
| `제안` | 제안서 | purple |
| `스터디` | 학습 자료 | red |
| `문서 포맷` | 템플릿 | pink |
| `계정 정보` | 계정 관리 | brown |

## Team 옵션

| Team 값 | 색상 |
|---------|------|
| `Dev` | green |
| `Design` | brown |
| `기획` | pink |
| `Biz` | blue |
| `Marketing` | default |
| `Cmnty` | purple |
| `Service Ops` | yellow |
| `법인 운영` | gray |
| `외부파트너` | orange |

## 주요 속성 ID

| 속성 이름 | 속성 ID | 타입 |
|----------|---------|------|
| Name | `title` | title |
| Team | `Nqf`` | multi_select |
| Type | `XT?u` | select |
| Product/Part | `O\i<` | multi_select |
| date | `vWKk` | date |
| Participants | `S}wl` | people |
| Related to Epics/Projs | `>@\|y` | relation |
| Related to Tasks | `l`YK` | relation |
| Reviewer | `a9d187f0-8682-432b-931b-e2ff09897807` | people |

---

## 쿼리 방법

### 1. 기본 쿼리 구조

```json
{
  "data_source_id": "bd97c847-cfab-4a92-9cad-8d20c83079a9",
  "filter": {
    "and": [
      {
        "property": "Participants",
        "people": { "contains": "<USER_ID>" }
      },
      {
        "property": "Type",
        "select": { "equals": "기획" }
      }
    ]
  },
  "filter_properties": ["title", "Nqf`", "XT?u", "vWKk", ">@|y", "l`YK"],
  "page_size": 3
}
```

### 2. Truncate 방지 규칙

> [!IMPORTANT]
> 응답이 truncate되지 않도록 다음 규칙을 반드시 따르세요.

1. **page_size는 3으로 설정** (최대 5)
2. **filter_properties로 필요한 속성만 지정**
   - 기본: `["title", "Nqf`", "XT?u", "vWKk", ">@|y", "l`YK"]` (Name, Team, Type, date, Epic, Tasks)
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

### 예제 1: 특정 타입의 문서 조회

```json
{
  "data_source_id": "bd97c847-cfab-4a92-9cad-8d20c83079a9",
  "filter": {
    "property": "Type",
    "select": { "equals": "기획" }
  },
  "filter_properties": ["title", "Nqf`", "XT?u", "vWKk", ">@|y", "l`YK"],
  "page_size": 3
}
```

### 예제 2: 특정 Team의 문서 조회

```json
{
  "data_source_id": "bd97c847-cfab-4a92-9cad-8d20c83079a9",
  "filter": {
    "property": "Team",
    "multi_select": { "contains": "Dev" }
  },
  "filter_properties": ["title", "Nqf`", "XT?u", "vWKk", ">@|y", "l`YK"],
  "page_size": 3
}
```

### 예제 3: 참여자로 문서 조회

```json
{
  "data_source_id": "bd97c847-cfab-4a92-9cad-8d20c83079a9",
  "filter": {
    "property": "Participants",
    "people": { "contains": "edbeb417-44a6-428e-ad28-e360b35b9876" }
  },
  "filter_properties": ["title", "Nqf`", "XT?u", "vWKk", ">@|y", "l`YK"],
  "page_size": 3
}
```

---

## 결과 표시 형식

```markdown
## 📄 Docs 목록

| # | 문서 이름 | Type | Team | Date | Epic | Tasks |
|---|-----------|------|------|------|------|-------|
| 1 | [문서 제목] | 기획 | Dev | 01-20 | [Epic명] | 3개 연결 |
| 2 | [문서 제목] | 회의록 | 기획 | 01-25 | - | 1개 연결 |
...

**총 N개**의 문서가 조회되었습니다.
```

### Type 이모지 규칙

| Type | 이모지 |
|------|--------|
| 회의록/논의 기록 | 📝 |
| 기획 | 📋 |
| 정책 | 📜 |
| 워크플로우 | 🔄 |
| 제안 | 💡 |
| 스터디 | 📚 |
| 계정 정보 | 🔐 |

### Relation 표시 규칙

- Epic 연결됨: Epic 페이지 제목 표시
- Tasks 연결됨: "N개 연결" 형식으로 표시
- 연결 없음: `-`
