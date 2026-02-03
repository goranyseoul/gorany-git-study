# Skill Instruction: 4-infographic

Description: 트랜스크립트 기반 브리핑 문서 및 인포그래픽을 생성하고 Notion에 이미지를 삽입합니다.

---

## Step 1: Briefing Doc 작성

트랜스크립트를 분석하여 구조화된 브리핑 문서를 작성합니다.

### 출력 파일
- `docs/meetings/Briefing-YYYY-MM-DD.md`

### 필수 섹션

```markdown
# Meeting Briefing Document
**Date:** YYYY-MM-DD
**Topic:** [회의 주제]

## 1. Executive Summary
[1-2문장 핵심 요약]

## 2. Key Decisions
- [결정사항 1]
- [결정사항 2]

## 3. Action Items
| 담당자 | 할 일 | 기한 |
|--------|-------|------|
| 이름 | 내용 | 날짜 |

## 4. Discussion Points
- [주요 논의 1]
- [주요 논의 2]
```

---

## Step 2: 인포그래픽 생성

`generate_image` 도구를 사용하여 한국어 인포그래픽을 생성합니다.

### 프롬프트 템플릿

```
A professional, clean 1-page business infographic summarizing a meeting in KOREAN.

**Header**: "[회의 제목] (YYYY-MM-DD)"

**Central Visual (Workflow)**:
[핵심 워크플로우 다이어그램]

**Key Pillars**:
1. [주요 결정사항]
2. [액션 아이템]

**Style**: Dark background, neon blue/purple accents, tech-forward aesthetic.
Text must be clear and legible Korean.
```

### 출력 파일
- `docs/meetings/Infographic-*.png`

---

## Step 3: Git 커밋 및 푸시

이미지를 GitHub에 올려 Raw URL을 생성합니다.

```bash
git add docs/meetings/Infographic-*.png docs/meetings/Briefing-*.md docs/meetings/Meeting-SUMMARY-*.md
git commit -m "docs: add meeting infographic and briefing YYYY-MM-DD"
git push origin main
```

### Raw URL 형식
```
https://raw.githubusercontent.com/goranyseoul/gorany-git-study/main/docs/meetings/Infographic-YYYY-MM-DD.png
```

> ⚠️ **Private Repo 주의**: Private Repo의 Raw URL은 인증 없이 접근 불가합니다.
> 이 리포지토리는 **Public**이어야 Notion에서 이미지가 표시됩니다.

---

## Step 4: Notion 이미지 삽입

### 4.1 정확한 페이지 찾기 (Data Source Query)

```json
{
  "data_source_id": "bd97c847-cfab-4a92-9cad-8d20c83079a9",
  "filter": {
    "property": "Name",
    "title": { "contains": "YYYY-MM-DD" }
  },
  "page_size": 5
}
```

### 4.2 이미지 블록 삽입

```json
{
  "block_id": "<page_id>",
  "children": [
    { "type": "divider", "divider": {} },
    {
      "type": "heading_2",
      "heading_2": {
        "rich_text": [{ "type": "text", "text": { "content": "📊 인포그래픽" }}]
      }
    },
    {
      "type": "image",
      "image": {
        "type": "external",
        "external": { "url": "<GitHub Raw URL>" }
      }
    }
  ]
}
```

---

## Troubleshooting

### 이미지가 Notion에서 안 보일 때

| 원인 | 해결책 |
|------|--------|
| Private Repo | Public으로 변경 또는 외부 호스팅 사용 |
| URL 오류 | Raw URL 형식 확인 (`raw.githubusercontent.com`) |
| 캐시 | Notion 페이지 새로고침 |

### 대안: Bookmark 블록으로 링크 제공

```json
{
  "type": "bookmark",
  "bookmark": {
    "url": "<GitHub Raw URL>",
    "caption": [{ "text": { "content": "GitHub에서 원본 이미지 보기" }}]
  }
}
```

---

## Step 5: Notion 속성 업데이트

회의록 트랜스크립트를 분석하여 Participants와 날짜를 추측하여 업데이트합니다.

### Participants 참조 (User ID)
| 이름 | Notion User ID |
|------|----------------|
| 고라니 | `edbeb417-44a6-428e-ad28-e360b35b9876` |
| 트롤 | `f11c3ca3-a653-4a0f-b88f-545e218e7a6d` |
| 용용 | `d642223f-11b2-4a60-b1cf-b0a4ace349ad` |
| 버그 | `ffd3b022-e0da-4f73-b028-b698f588d640` |

### API 호출
```json
{
  "page_id": "<page_id>",
  "properties": {
    "Participants": {
      "people": [
        { "id": "<user_id_1>" },
        { "id": "<user_id_2>" }
      ]
    },
    "date": {
      "date": { "start": "YYYY-MM-DD" }
    }
  }
}
```

---

## Step 6: Slack 알림

미팅 채널(`#0-4-미팅`, ID: `C0650KMG0KD`)에 알림을 전송합니다.

```markdown
📋 **회의록 자동 정리 완료**

**📅 회의일:** YYYY-MM-DD
**📌 주제:** [회의 주제]
**👥 참석자:** [참석자 리스트]

[핵심 요약, 의사결정, 액션 아이템]

📎 **Notion:** [URL]
```
