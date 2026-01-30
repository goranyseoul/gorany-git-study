---
author: troll
modified_by: troll
created: 2026-01-30
modified: 2026-01-30
---

# Rule: 에이전트 파일 메타데이터 필수

## 적용 범위
`.agent/` 폴더 내 모든 `.md` 파일:
- `.agent/skills/**/*.md`
- `.agent/rules/**/*.md`
- `.agent/workflows/**/*.md`

## 규칙

### 필수 메타데이터

모든 대상 파일은 **YAML frontmatter**에 아래 필드 필수:

```yaml
---
author: 작업자이름        # 최초 작성자
modified_by: 작업자이름   # 마지막 수정자
created: YYYY-MM-DD       # 최초 작성일
modified: YYYY-MM-DD      # 마지막 수정일
---
```

### Git 커밋 시

1. 변경 파일 중 `.agent/` 폴더의 `.md` 파일이 있으면:
   - 메타데이터 존재 여부 확인
   - **없으면 반드시 추가** (커밋 전에!)
   
2. 작업자 이름 모르면:
   - **반드시 사용자에게 먼저 물어보기!**
   - "브랜치/파일에 사용할 이름을 알려주세요"
   - ⚠️ **추측 금지!** (시스템 정보, 폴더명 등으로 유추하지 말 것)

3. 수정 시:
   - `modified_by`: 현재 작업자로 변경
   - `modified`: 오늘 날짜로 변경

## 예시

```yaml
---
name: flutter-expert
description: Flutter 앱 개발 전문가
author: troll
modified_by: jw
created: 2026-01-26
modified: 2026-01-30
---
```
