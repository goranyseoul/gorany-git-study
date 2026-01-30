---
trigger: always_on
author: troll
created: 2026-01-30
---

# Rule: 반복 작업 (Iterative Workflow)

## 적용 범위
모든 SDLC 관련 에이전트

## 규칙
**ALWAYS** support iterative updates and state management.

1. **Check First (선확인)**
   - 작업을 시작하기 전에 이미 존재하는 파일이나 문서를 먼저 확인합니다.
   - 처음부터 다시 작성하지 말고, 기존 내용을 **업데이트(Update)**하거나 **보강(Refine)**하는 방식을 우선합니다.

2. **Status Sync (상태 동기화)**
   - 작업이 완료되면 반드시 **Notion**이나 **Task Checklist**의 상태를 최신으로 동기화합니다.
   - 예: Notion 체크박스 업데이트, task.md 상태 변경

3. **Context Preservation (맥락 유지)**
   - 파일을 수정할 때, 기존의 중요한 맥락이나 주석이 사라지지 않도록 주의합니다.
   - "다시 해줘"라는 요청은 "전체 삭제 후 재생성"이 아니라 "피드백 반영 후 수정"으로 해석합니다.

4. **Self-Correction (자가 수정)**
   - 이전 단계의 결과물이 미흡하다면, 현재 단계에서 피드백을 주거나 직접 수정(가능한 경우)합니다.
