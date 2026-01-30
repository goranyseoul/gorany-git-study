---
name: generate-userflow
description: 클릭 드릴다운 방식의 사용자 플로우 HTML 생성
---

# Generate User Flow

## 개요
전체 플로우 → 클릭 → 세부 플로우 방식의 인터랙티브 다이어그램 생성

## 출력
`docs/요구사항_userflow.html`

---

## 구조

### 1. 전체 플로우 (Overview)
- 버튼 형태로 주요 단계 표시
- 예: `[진입] → [서비스] → [결제]`
- 각 버튼 클릭 시 세부 플로우로 전환

### 2. 세부 플로우 (Detail)
- 각 단계의 상세 Mermaid 다이어그램
- "← 전체 보기" 버튼으로 돌아가기

---

## Mermaid 문법

### 노드
| 문법 | 용도 |
|------|------|
| `A[텍스트]` | 일반 노드 |
| `A{텍스트}` | 분기 노드 |

### 연결
| 문법 | 설명 |
|------|------|
| `A --> B` | 기본 화살표 |
| `A -->｜라벨｜ B` | 라벨 화살표 |

### 스타일
| 요소 | 색상 |
|------|------|
| 시작 | `fill:#22c55e` |
| 액션 | `fill:#3b82f6` |
| 분기 | `fill:#f59e0b` |
| 종료 | `fill:#ef4444` |

---

## 동적 렌더링 패턴

Mermaid는 페이지 로드 시 렌더링되므로, 숨겨진 요소는 동적 렌더링 필요:

```javascript
// startOnLoad: false 설정
mermaid.initialize({ startOnLoad: false, theme: 'dark' });

// 클릭 시 렌더링
const { svg } = await mermaid.render('id', diagramCode);
container.innerHTML = svg;
```
