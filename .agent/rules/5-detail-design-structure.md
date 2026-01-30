---
trigger: always_on
---

# Rule: 세부 디자인 구조

## 적용 범위
`design-refiner` 에이전트 (5번 디자인 구체화)

---

## 프로세스

### 1. 디자인 확인
- Figma 또는 Stitch 결과물 확인

### 2. 기능 검증 (필수!)
- `docs/2-기능정의/features.csv`와 비교
- 디자인에서 추가된 기능이 있는지 확인

### 3. 기능 추가 발견 시
> **3,4번은 재실행하지 않음!**

1. `docs/2-기능정의/features.csv`에 직접 추가
2. 해당 기능 Notion 페이지도 생성
3. 바로 6번 개발 기획으로 진행

### 4. Figma 없을 때
- 바로 6번 개발 기획으로 진행

---

## ⚠️ 3번 디자인 문서 동기화 (필수!)

5번 실행 시 **반드시** 3번 디자인 문서를 업데이트합니다:

### 업데이트 대상
- `docs/3-디자인/screens.md` - 화면별 구성요소 체크리스트
- `docs/3-디자인/concept.md` - 컨셉 변경사항 반영

### 업데이트 내용
1. 디자인 변경으로 추가/삭제된 구성요소 반영
2. 화면별 완료 상태 (✅/❌) 업데이트
3. 요약 테이블 갱신

---

## 📋 디자인 Task 출력 (필수!)

5번 완료 시 **`docs/5-디자인구체화/design-tasks.md`** 파일을 생성합니다.

> ⚠️ **Epic은 2번에서 이미 생성됨!**
> 5번에서는 **기존 Epic에 연결할 디자인 Task만 생성**합니다.
> `features.csv`의 `notion_url`을 참조하여 Epic과 연결합니다.

### 파일 형식

```markdown
# 디자인 Task 목록

> 기존 Epic(FT-XXX)에 연결할 디자인 작업

---

## FT-001 간편 로그인
**Epic URL**: https://www.notion.so/FT-001-xxx

| Task ID | Task 이름 | 화면 | 타입 | 설명 |
|---------|-----------|------|------|------|
| DG-001-D01 | Google 로그인 버튼 | 01-sign-in | UI | OAuth 버튼 디자인 |
| DG-001-D02 | Apple 로그인 버튼 | 01-sign-in | UI | Apple Sign-In 버튼 |
| DG-001-D03 | 이메일 입력 폼 | 01-sign-in | UI | 폼 레이아웃 |

---

## FT-002 노션 연결
**Epic URL**: https://www.notion.so/FT-002-xxx

| Task ID | Task 이름 | 화면 | 타입 | 설명 |
|---------|-----------|------|------|------|
| DG-002-D01 | 연결 버튼 | notion-connect | UI | OAuth 시작 버튼 |
| DG-002-D02 | 페이지 선택 UI | notion-connect | UI | 체크박스 목록 |

---

(모든 Epic에 대해 반복)
```

### 생성 규칙
1. `features.csv`에서 기존 Epic 정보 읽기 (ID, notion_url)
2. `screens.md`의 구성요소를 **디자인 Task**로 분해
3. Task ID 형식: `{Epic ID}-D{순번}` (D = Design, 예: FT-001-D01)
4. 타입: UI, 애니메이션, 아이콘 등

### Notion 연동
- Epic URL로 상위 Epic 페이지 참조
- Task 데이터베이스에 Epic 관계형(Relation) 연결

---

## 기능 검증 체크리스트

```
[ ] 디자인에 있는 모든 화면이 features.csv에 있는가?
[ ] 새로 추가된 기능이 있는가?
  → 있으면 features.csv에 추가 (2번 워크플로우 재실행 또는 직접 추가)
[ ] 삭제된 기능이 있는가?
  → 있으면 features.csv에서 제거
[ ] 3번 디자인 문서(screens.md)가 최신인가?
[ ] design-tasks.md가 생성되었는가?
```

---

## 중요: 3,4번 스킵

5번에서 기능 업데이트해도 **3번 컨셉, 4번 프로토타입은 재실행하지 않음**.
이미 Figma 디자인이 있기 때문.
단, **3번 문서(screens.md)는 반드시 업데이트**합니다.

---

## 📋 Notion Task 생성 규칙

Task 페이지 생성 시 **반드시 상세 내용도 함께 추가**합니다.

### 필수 포함 내용
```
### 설명
(구체적인 UI 요소 설명)

### 화면
(관련 HTML 파일명)

### 상태
✅ 디자인 완료 / ❌ 미완료
```

### API 호출 방식
`post-page` 호출 시 `children` 파라미터에 블록 배열을 포함:
- heading_3: 설명, 화면, 상태
- paragraph: 각 섹션 내용

---

## 🔄 새 기능(Epic) 발견 시

> ⚠️ **새 Epic이 필요하면 2번으로 돌아가기!**

```
1. `/2-기능-정의` 실행하여 Epic 추가
2. features.csv에 새 Epic이 추가됨
3. 이후 5번 Task에서 새 Epic 참조
```
