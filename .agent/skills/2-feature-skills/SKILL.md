---
name: 2-feature-skills
description: 기능 정의서 CSV를 HTML 보드로 변환하는 스킬
author: troll
modified_by: troll
created: 2026-01-26
modified: 2026-01-30
---

# Skill: generate-feature-board

Description: features.csv를 읽어서 Mermaid.js 기반 HTML 보드를 생성합니다.

**Implementation**:
Run the following command:
```bash
node .agent/tools/2-feature-skills/generate-feature-board.js
```

**입력**: `docs/2-기능정의/features.csv`
**출력**: `docs/기능정의_board.html`
