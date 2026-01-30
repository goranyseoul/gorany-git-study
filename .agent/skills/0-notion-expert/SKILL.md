# Notion Expert Skill

## 개요
Notion MCP 서버의 모든 API 기능을 체계적으로 활용하기 위한 전문가 스킬입니다.

## 핵심 역량

### 1️⃣ 사용자 및 봇 관리
- 사용자 조회 및 목록 관리
- 봇 사용자 정보 확인

### 2️⃣ 검색 및 조회
- 제목 기반 페이지/데이터베이스 검색
- 필터링 및 정렬 기능

### 3️⃣ 블록 관리
- 블록 조회 및 업데이트
- 자식 블록 추가 및 삭제

### 4️⃣ 페이지 관리
- 페이지 생성, 조회, 업데이트
- 페이지 속성 관리
- 페이지 이동

### 5️⃣ 데이터베이스 (Data Source) 관리
- 데이터베이스 생성, 조회, 업데이트
- 쿼리 및 필터링
- 템플릿 목록 조회

### 6️⃣ 댓글 관리
- 댓글 조회 및 생성

---

## 📚 기능 카탈로그

### 👤 사용자 관리

#### `API-get-user`
특정 사용자의 정보를 조회합니다.

**매개변수:**
- `user_id`: 사용자 UUID

**사용 예시:**
```
사용자 ID로 사용자 정보 확인
```

---

#### `API-get-users`
모든 사용자 목록을 조회합니다.

**매개변수:**
- `page_size`: 반환할 최대 항목 수 (기본값: 100)
- `start_cursor`: (선택) 페이지네이션용 커서

**사용 예시:**
```
워크스페이스의 모든 멤버 조회
```

---

#### `API-get-self`
현재 토큰의 봇 사용자 정보를 조회합니다.

**사용 예시:**
```
봇 연결 상태 확인
봇 권한 확인
```

---

### 🔍 검색

#### `API-post-search`
제목으로 페이지 및 데이터베이스를 검색합니다.

**매개변수:**
- `query`: 검색할 제목 텍스트
- `filter`: (선택) 객체 유형 필터 (`page` 또는 `data_source`)
- `sort`: (선택) 정렬 기준 (`last_edited_time`, `ascending`/`descending`)
- `page_size`: 최대 항목 수 (기본값: 100)
- `start_cursor`: (선택) 페이지네이션용

**사용 예시:**
```
제목에 "프로젝트"가 포함된 모든 페이지 검색
최근 수정된 데이터베이스만 검색
```

---

### 📦 블록 관리

#### `API-get-block-children`
블록의 자식 블록을 조회합니다.

**매개변수:**
- `block_id`: 블록 ID (페이지 ID도 가능)
- `page_size`: 최대 항목 수 (기본값: 100)
- `start_cursor`: (선택) 페이지네이션용

**사용 예시:**
```
페이지의 모든 블록 조회
특정 블록 내부의 하위 블록 확인
```

---

#### `API-patch-block-children`
블록에 자식 블록을 추가합니다.

**매개변수:**
- `block_id`: 대상 블록 ID (페이지 ID도 가능)
- `children`: 추가할 블록 객체 배열
- `after`: (선택) 이 블록 뒤에 추가

**사용 예시:**
```
페이지에 새 텍스트 블록 추가
기존 블록 아래에 리스트 추가
```

---

#### `API-retrieve-a-block`
블록 정보를 조회합니다.

**매개변수:**
- `block_id`: 블록 ID

**사용 예시:**
```
특정 블록의 내용 확인
블록 타입 파악
```

---

#### `API-update-a-block`
블록을 업데이트합니다.

**매개변수:**
- `block_id`: 블록 ID
- `type`: 업데이트할 블록 타입 및 속성
- `archived`: (선택) `true`로 설정하여 삭제, `false`로 복구

**사용 예시:**
```
텍스트 블록 내용 수정
to_do 블록 체크 상태 변경
블록 삭제/복구
```

---

#### `API-delete-a-block`
블록을 삭제합니다.

**매개변수:**
- `block_id`: 삭제할 블록 ID

**사용 예시:**
```
불필요한 블록 제거
```

---

### 📄 페이지 관리

#### `API-retrieve-a-page`
페이지 정보를 조회합니다.

**매개변수:**
- `page_id`: 페이지 ID
- `filter_properties`: (선택) 조회할 속성 ID 목록

**사용 예시:**
```
페이지 메타데이터 확인
특정 속성만 조회하여 성능 향상
```

---

#### `API-patch-page`
페이지 속성을 업데이트합니다.

**매개변수:**
- `page_id`: 페이지 ID
- `properties`: 업데이트할 속성 (제목 등)
- `archived`: (선택) 페이지 아카이브 여부
- `in_trash`: (선택) 휴지통 이동 여부
- `icon`: (선택) 페이지 아이콘 (이모지)
- `cover`: (선택) 페이지 커버 이미지

**사용 예시:**
```
페이지 제목 변경
페이지 아카이브
페이지 아이콘/커버 설정
```

---

#### `API-post-page`
새 페이지를 생성합니다.

**매개변수:**
- `parent`: 부모 페이지 또는 데이터베이스
- `properties`: 페이지 속성 (제목 필수)
- `children`: (선택) 초기 블록 내용
- `icon`: (선택) 페이지 아이콘
- `cover`: (선택) 페이지 커버

**사용 예시:**
```
새 페이지 생성
데이터베이스에 새 항목 추가
초기 내용과 함께 페이지 생성
```

---

#### `API-retrieve-a-page-property`
페이지 속성 항목을 조회합니다 (페이지네이션).

**매개변수:**
- `page_id`: 페이지 ID
- `property_id`: 속성 ID
- `page_size`: 최대 항목 수
- `start_cursor`: (선택) 페이지네이션용

**사용 예시:**
```
긴 속성 값 전체 조회 (예: 긴 텍스트)
관계형 속성의 모든 항목 조회
```

---

#### `API-move-page`
페이지를 다른 위치로 이동합니다.

**매개변수:**
- `page_id`: 이동할 페이지 ID
- `parent`: 새 부모 (페이지 또는 데이터베이스)

**사용 예시:**
```
페이지를 다른 페이지의 하위로 이동
데이터베이스 항목 이동
```

---

### 💬 댓글 관리

#### `API-retrieve-a-comment`
블록 또는 페이지의 댓글을 조회합니다.

**매개변수:**
- `block_id`: 블록 또는 페이지 ID
- `page_size`: 최대 항목 수
- `start_cursor`: (선택) 페이지네이션용

**사용 예시:**
```
페이지의 모든 댓글 조회
토론 내용 확인
```

---

#### `API-create-a-comment`
댓글을 생성합니다.

**매개변수:**
- `parent`: 댓글을 추가할 페이지 (`page_id`)
- `rich_text`: 댓글 내용 (rich text 배열)

**사용 예시:**
```
페이지에 피드백 추가
토론 댓글 작성
```

---

### 🗄️ 데이터베이스 (Data Source) 관리

#### `API-query-data-source`
데이터베이스를 쿼리합니다.

**매개변수:**
- `data_source_id`: 데이터베이스 ID
- `filter`: (선택) 필터 조건
- `sorts`: (선택) 정렬 기준 배열
- `archived`: (선택) 아카이브된 항목 포함 여부
- `in_trash`: (선택) 휴지통 항목 포함 여부
- `page_size`: 최대 항목 수 (기본값: 100)
- `start_cursor`: (선택) 페이지네이션용
- `filter_properties`: (선택) 조회할 속성 ID 목록

**사용 예시:**
```
"상태" 속성이 "완료"인 항목만 조회
최근 생성순으로 정렬된 항목 가져오기
특정 속성만 조회하여 성능 최적화
```

---

#### `API-retrieve-a-data-source`
데이터베이스 정보를 조회합니다.

**매개변수:**
- `data_source_id`: 데이터베이스 ID

**사용 예시:**
```
데이터베이스 스키마 확인
속성 목록 조회
```

---

#### `API-update-a-data-source`
데이터베이스를 업데이트합니다.

**매개변수:**
- `data_source_id`: 데이터베이스 ID
- `title`: (선택) 새 제목
- `description`: (선택) 새 설명
- `properties`: (선택) 속성 스키마 업데이트

**사용 예시:**
```
데이터베이스 제목 변경
새 속성 추가
기존 속성 수정/삭제
```

---

#### `API-create-a-data-source`
새 데이터베이스를 생성합니다.

**매개변수:**
- `parent`: 부모 페이지
- `title`: 데이터베이스 제목
- `properties`: 속성 스키마

**사용 예시:**
```
새 프로젝트 트래커 데이터베이스 생성
태스크 관리 DB 생성
```

---

#### `API-list-data-source-templates`
데이터베이스의 템플릿 목록을 조회합니다.

**매개변수:**
- `data_source_id`: 데이터베이스 ID
- `page_size`: 최대 항목 수 (기본값: 100)
- `start_cursor`: (선택) 페이지네이션용

**사용 예시:**
```
데이터베이스에 설정된 템플릿 확인
```

---

## 🎯 일반적인 워크플로우

### 1. 초기 설정 확인
```
1. API-get-self (봇 연결 확인)
2. API-get-users (워크스페이스 멤버 확인)
```

### 2. 페이지 검색 및 조회
```
1. API-post-search (query="프로젝트")
2. API-retrieve-a-page (page_id="...")
3. API-get-block-children (block_id="...") # 내용 확인
```

### 3. 새 페이지 생성 및 내용 추가
```
1. API-post-page (parent={...}, properties={title: "새 페이지"})
2. API-patch-block-children (block_id="...", children=[...])
```

### 4. 데이터베이스 작업
```
1. API-post-search (filter={value: "data_source"}) # DB 검색
2. API-query-data-source (data_source_id="...", filter={...})
3. API-post-page (parent={database_id: "..."}, properties={...}) # 새 항목 추가
```

### 5. 페이지 업데이트 및 댓글
```
1. API-patch-page (page_id="...", properties={...})
2. API-create-a-comment (parent={page_id: "..."}, rich_text=[...])
```

### 6. 데이터베이스 생성 및 구조화
```
1. API-create-a-data-source (parent={...}, properties={...})
2. API-post-page (parent={database_id: "..."}, properties={...}) # 첫 항목 추가
```

---

## 💡 중요 개념

### Parent 객체
페이지와 데이터베이스는 항상 부모를 필요로 합니다:

```javascript
// 페이지를 부모로
{
  "page_id": "페이지-UUID"
}

// 데이터베이스를 부모로
{
  "database_id": "데이터베이스-UUID"
}
```

### Properties 객체
페이지 속성은 타입별로 다른 구조를 가집니다:

```javascript
// Title 속성
{
  "title": {
    "title": [
      {
        "text": {
          "content": "페이지 제목"
        }
      }
    ]
  }
}

// Rich Text 속성
{
  "설명": {
    "rich_text": [
      {
        "text": {
          "content": "내용"
        }
      }
    ]
  }
}

// Select 속성
{
  "상태": {
    "select": {
      "name": "진행중"
    }
  }
}

// Date 속성
{
  "마감일": {
    "date": {
      "start": "2026-01-27"
    }
  }
}
```

### Block 객체
블록은 타입에 따라 다른 구조를 가집니다:

```javascript
// Paragraph 블록
{
  "type": "paragraph",
  "paragraph": {
    "rich_text": [
      {
        "type": "text",
        "text": {
          "content": "텍스트 내용"
        }
      }
    ]
  }
}

// Heading 블록
{
  "type": "heading_2",
  "heading_2": {
    "rich_text": [
      {
        "type": "text",
        "text": {
          "content": "제목"
        }
      }
    ]
  }
}

// To-do 블록
{
  "type": "to_do",
  "to_do": {
    "rich_text": [
      {
        "type": "text",
        "text": {
          "content": "할 일"
        }
      }
    ],
    "checked": false
  }
}
```

---

## ⚠️ 주의사항

### API 버전
기본 Notion API 버전: `2025-09-03`
- 대부분의 API는 `Notion-Version` 헤더 필요
- 최신 기능은 최신 버전 사용 권장

### 페이지네이션
- `page_size`: 최대 100
- `start_cursor`로 다음 페이지 조회
- `has_more`로 추가 페이지 여부 확인

### 에러 처리
- 400 Bad Request: 잘못된 요청 파라미터
- 401 Unauthorized: 인증 실패
- 403 Forbidden: 권한 부족
- 404 Not Found: 리소스 없음
- 429 Rate Limited: 요청 제한 초과

### 권한 관리
- 봇은 명시적으로 공유된 페이지만 접근 가능
- 연동(Integration)에 적절한 권한 부여 필요
- 관리자 권한 필요 작업 주의

---

## 📋 체크리스트

### 초기 설정
- [ ] Notion 연동(Integration) 생성
- [ ] API 키 발급
- [ ] MCP 서버 설정
- [ ] `API-get-self`로 연결 테스트

### 페이지 작업
- [ ] 부모 페이지/데이터베이스 ID 확인
- [ ] Properties 구조 정의
- [ ] 블록 내용 준비 (선택)
- [ ] 페이지 생성 및 확인

### 데이터베이스 작업
- [ ] 속성 스키마 설계
- [ ] 데이터베이스 생성
- [ ] 필터 및 정렬 조건 정의
- [ ] 쿼리 실행 및 결과 확인

### 블록 작업
- [ ] 대상 페이지/블록 ID 확인
- [ ] 블록 타입 및 구조 정의
- [ ] 블록 추가/수정
- [ ] 변경 사항 확인

---

## 🔗 유용한 패턴

### 1. Epic과 Task 관계형 DB 구조
```
1. Epic DB 생성 (제목, 상태, 우선순위)
2. Task DB 생성 (제목, 상태, Epic 관계형 속성)
3. Relation 속성으로 Epic-Task 연결
```

### 2. 자동화된 페이지 생성
```
1. 템플릿 페이지 조회
2. 블록 내용 복사
3. 새 페이지 생성 시 블록 추가
```

### 3. 대시보드 데이터 수집
```
1. 여러 데이터베이스 쿼리
2. 필터 조건으로 특정 항목만 조회
3. 결과 집계 및 표시
```

### 4. 댓글 기반 협업
```
1. 페이지 댓글 조회
2. 새 댓글 추가
3. 언급(@) 기능 활용
```

---

## 📞 트러블슈팅

### 400 Bad Request
- Properties 구조 확인
- 필수 속성 누락 확인
- JSON 형식 유효성 검사

### 404 Not Found
- 페이지/DB ID 정확성 확인
- 봇에 페이지 공유 여부 확인

### 빈 결과
- 필터 조건 재확인
- 아카이브/휴지통 항목 포함 옵션 확인
- 권한 확인

---

## 🎓 고급 활용

### 1. Relation 속성 활용
```
Epic DB ← Relation → Task DB
↓
필터: Epic이 "FT-001"인 모든 Task 조회
```

### 2. Rollup 속성 활용
```
Epic DB에서 연결된 Task의 완료율 계산
→ Rollup으로 자동 집계
```

### 3. Formula 속성 활용
```
마감일이 지났는지 자동 계산
→ if(prop("마감일") < now(), "지연", "정상")
```

---

**버전:** 1.0.0  
**최종 업데이트:** 2026-01-27
