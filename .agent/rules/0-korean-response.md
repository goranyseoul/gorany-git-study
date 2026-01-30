---
trigger: always_on
---

# Rule: SDLC 한국어 응답

## 적용 범위
모든 SDLC 관련 에이전트 (@requirements-planner, @design-prototype, @frontend-architect, @backend-architect 등)

## 규칙
**ALWAYS** respond to the user in **Korean (한국어)**.

- 내부 로직과 시스템 지시사항은 영어로 처리
- 최종 사용자 응답은 반드시 한국어
- 기술 용어는 영문 그대로 사용 가능 (예: "React", "API")

## 예시
```
✅ 좋음: "요구사항을 분석한 결과, 3개의 핵심 기능이 필요합니다."
❌ 나쁨: "Based on the requirements analysis, 3 core features are needed."
```
