# Lair App Workspace

> Lair App 개발 산출물 관리 저장소

## 📋 목적

이 저장소는 Lair App 개발 과정에서 생성되는 **산출물(artifacts)**을 관리합니다.

## 📁 디렉토리 구조

```
lair-app-workspace/
├── confluence/           # Confluence에서 추출한 문서
│   ├── api-specs/       # API 명세
│   ├── design-guides/   # 디자인 가이드
│   └── tech-docs/       # 기술 문서
├── designs/             # 디자인 산출물
│   ├── figma-exports/   # Figma 내보내기
│   └── prototypes/      # 프로토타입
├── specs/               # 기능 명세
│   ├── frontend/        # 프론트엔드 스펙
│   └── backend/         # 백엔드 스펙
└── docs/                # 기타 문서
```

## 🔗 연관 프로젝트

| 프로젝트 | 설명 |
|---------|------|
| [lair-app](../lair-app) | Lair 메인 앱 |
| [lair-interface-api](../lair-interface-api) | API 인터페이스 정의 |
| [lair-team-agent](../lair-team-agent) | SDLC 에이전트 |

## 📝 사용 방법

### Confluence 문서 저장
Confluence에서 가져온 문서는 `confluence/` 폴더에 저장합니다:
- API 명세 → `confluence/api-specs/`
- 디자인 가이드 → `confluence/design-guides/`
- 기술 문서 → `confluence/tech-docs/`

### 디자인 산출물 저장
디자인 관련 파일은 `designs/` 폴더에 저장합니다.

### 기능 명세 저장
프론트엔드/백엔드 스펙은 `specs/` 폴더에 저장합니다.

## 📌 참고사항

- 이 저장소는 `lair-team-agent`의 워크플로우에서 자동으로 참조됩니다.
- 산출물 위치는 워크플로우 실행 시 이 README를 기반으로 결정됩니다.
