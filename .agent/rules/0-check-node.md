---
trigger: tool_use
author: troll
created: 2026-01-30
---

# Rule: Node.js 설치 확인

## 적용 범위
Node.js 도구를 사용하는 모든 에이전트

## 규칙

도구 실행 전 Node.js 설치 여부 확인:

1. **확인**: `node -v` 실행
2. **조치 (미설치 시)**:
   - macOS: `brew install node` 제안
   - 기타: Node.js 설치 안내
3. **언어**: 한국어로 설명

## 예시 응답 (미설치 시)
"Node.js가 설치되어 있지 않습니다. 도구 실행을 위해 설치하겠습니다."
