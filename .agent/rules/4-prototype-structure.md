---
trigger: always_on
author: troll
created: 2026-01-30
---

# Rule: 프로토타입 구조

## 적용 범위
`prototype` 에이전트 및 프로토타입 관련 작업

---

## 방법 선택 기준

| 조건 | 권장 방법 |
|------|------------|
| MCP 사용 가능 | **Stitch MCP** (A-1) ⭐ |
| 복잡한 UI | Stitch 웹앱 (A-2) |
| Stitch 미사용 | 로컬 모드 (B) |

---

## 필수 참조 문서

작업 시작 전 반드시 읽어야 할 문서:
1. `docs/3-디자인/concept.md`
2. `docs/3-디자인/screens.md`
3. `design-system/[프로젝트]/MASTER.md`

---

## Stitch MCP 사용 시 프로세스

1. `mcp_stitch_list_projects` - 기존 프로젝트 확인
2. `mcp_stitch_create_project` - 필요 시 생성
3. `mcp_stitch_generate_screen_from_text` - 화면 생성 (⚠️ 2-5분 소요)
4. `mcp_stitch_list_screens` - 생성 확인
5. HTML 다운로드 및 저장

### Stitch MCP 출력 구조
```
docs/4-프로토타입/
├── stitch-screens/     # Stitch 생성 화면
│   ├── 01-login.html
│   ├── 02-home.html
│   └── 03-settings.html
└── 검수결과.md
```

---

## 로컬 모드 프로세스

1. 컨셉 문서 읽기
2. 디자인 시스템 참조
3. 템플릿/컴포넌트 활용 (있으면)
4. HTML/CSS/JS 프로토타입 생성
5. 브라우저 검증

### 로컬 모드 출력 구조

```
prototype/
├── index.html
├── styles.css
└── app.js
```

---

## 토큰 절약 원칙

- ❌ 긴 HTML 직접 작성 최소화
- ✅ 템플릿 재사용
- ✅ 컴포넌트 조합
- ✅ 간단한 지시로 수정

---

## 금지 사항

- 컨셉 문서 없이 프로토타입 시작 금지
- 디자인 시스템 무시하고 임의 스타일 적용 금지

---

### Remotion 비디오 (선택)

```
docs/4-프로토타입/
├── media/
│   ├── demo.mp4
│   └── demo.gif
└── remotion-video/   (소스)
    ├── src/
    └── package.json
```

> 설치/렌더링 방법은 `4-prototype-skills/remotion.md` 참조
