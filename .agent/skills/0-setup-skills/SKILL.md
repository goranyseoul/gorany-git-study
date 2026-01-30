---
name: 0-setup-skills
description: 개발 환경 설치 스킬
author: troll
modified_by: troll
created: 2026-01-26
modified: 2026-01-30
---

# Skill: install-all

Description: 모든 개발 환경을 한 번에 설치합니다.

**Implementation**:
```bash
bash .agent/tools/0-setup-skills/setup.sh
```

---

# Skill: check-environment

Description: 설치된 환경을 확인합니다.

**Implementation**:
```bash
node -v && git --version && gh --version
```

---

# Skill: github-login

Description: GitHub에 로그인합니다.

**Implementation**:
```bash
gh auth login
```

---

# Skill: install-notebooklm-mcp

Description: NotebookLM MCP 서버를 설치하고 인증합니다.

**Implementation**:
```bash
# 1. 설치
pip install notebooklm-mcp-server

# 2. 인증 (Chrome 브라우저에서 Google 로그인 필요)
notebooklm-mcp-auth
```

**Note**: 인증 후 쿠키가 `~/.notebooklm-mcp/auth.json`에 저장됩니다.

**설정 파일** (`~/.gemini/settings.json`):
```json
"notebooklm-mcp": {
  "command": "notebooklm-mcp",
  "args": []
}
```
