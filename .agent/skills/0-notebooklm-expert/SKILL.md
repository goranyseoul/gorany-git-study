# NotebookLM Expert Skill

## 개요
NotebookLM MCP 서버의 모든 기능을 체계적으로 활용하기 위한 전문가 스킬입니다.

## 핵심 역량

### 1️⃣ 인증 및 초기 설정
- NotebookLM 인증 관리
- 토큰 갱신 및 세션 관리

### 2️⃣ 노트북 관리
- 노트북 생성, 조회, 삭제, 이름 변경
- AI 기반 노트북 요약 및 주제 추천

### 3️⃣ 소스 관리
- URL, 텍스트, Google Drive 문서 소스 추가
- 소스 상세 조회 및 원본 콘텐츠 추출
- Drive 소스 동기화 및 삭제

### 4️⃣ AI 연구 및 분석
- 웹/Drive 기반 심층 리서치
- 노트북 쿼리를 통한 AI 질의응답
- 채팅 설정 커스터마이징

### 5️⃣ 콘텐츠 생성
- 오디오/비디오 개요 생성
- 인포그래픽, 슬라이드 덱, 리포트 생성
- 플래시카드, 퀴즈, 마인드맵 생성
- 데이터 테이블 생성

---

## 📚 기능 카탈로그

### 🔐 인증 관리

#### `refresh_auth`
인증 토큰을 디스크에서 다시 로드하거나 Chrome 프로필을 사용하여 자동 재인증을 시도합니다.

**사용 시기:**
- `notebooklm-mcp-auth` 실행 후 새 토큰을 불러올 때
- 세션 만료로 재인증이 필요할 때

**반환값:**
- 토큰 갱신 성공 여부

---

#### `save_auth_tokens` (폴백 방법)
NotebookLM 쿠키를 수동으로 저장합니다.

**⚠️ 중요:** 먼저 `notebooklm-mcp-auth` CLI를 실행하고, 실패할 경우에만 이 도구를 사용하세요.

**매개변수:**
- `cookies`: Chrome DevTools에서 가져온 쿠키 헤더
- `request_body`: (선택) CSRF 토큰 추출용
- `request_url`: (선택) 세션 ID 추출용

---

### 📓 노트북 관리

#### `notebook_list`
모든 노트북 목록을 조회합니다.

**매개변수:**
- `max_results`: 반환할 최대 노트북 수 (기본값: 100)

---

#### `notebook_create`
새 노트북을 생성합니다.

**매개변수:**
- `title`: (선택) 노트북 제목

---

#### `notebook_get`
소스를 포함한 노트북 상세 정보를 조회합니다.

**매개변수:**
- `notebook_id`: 노트북 UUID

---

#### `notebook_describe`
AI가 생성한 노트북 요약 및 추천 주제를 조회합니다.

**매개변수:**
- `notebook_id`: 노트북 UUID

**반환값:**
- `summary`: Markdown 형식 요약
- `suggested_topics`: 추천 주제 목록

---

#### `notebook_rename`
노트북의 이름을 변경합니다.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `new_title`: 새 제목

---

#### `notebook_delete`
노트북을 영구적으로 삭제합니다. **복구 불가능!**

**매개변수:**
- `notebook_id`: 노트북 UUID
- `confirm`: 사용자 승인 후 반드시 `True`로 설정

---

### 📄 소스 관리

#### `notebook_add_url`
웹사이트 또는 YouTube URL을 소스로 추가합니다.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `url`: 추가할 URL

---

#### `notebook_add_text`
붙여넣은 텍스트를 소스로 추가합니다.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `text`: 텍스트 콘텐츠
- `title`: (선택) 제목

---

#### `notebook_add_drive`
Google Drive 문서를 소스로 추가합니다.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `document_id`: Drive 문서 ID (URL에서 추출)
- `title`: 표시될 제목
- `doc_type`: `doc` | `slides` | `sheets` | `pdf`

---

#### `source_describe`
AI가 생성한 소스 요약 및 키워드를 조회합니다.

**매개변수:**
- `source_id`: 소스 UUID

**반환값:**
- `summary`: **굵은** 키워드가 포함된 Markdown 요약
- `keywords`: 키워드 목록

---

#### `source_get_content`
소스의 원본 텍스트 콘텐츠를 조회합니다. (AI 처리 없음)

PDF, 웹 페이지, 텍스트, YouTube 트랜스크립트의 원본 텍스트를 반환합니다.  
`notebook_query`보다 훨씬 빠릅니다.

**매개변수:**
- `source_id`: 소스 UUID

**반환값:**
- `content`: 원본 텍스트
- `title`: 제목
- `source_type`: 소스 유형
- `char_count`: 문자 수

---

#### `source_list_drive`
Drive 소스의 유형 및 최신 상태를 조회합니다.

`source_sync_drive` 전에 오래된 소스를 식별하는 데 사용합니다.

**매개변수:**
- `notebook_id`: 노트북 UUID

---

#### `source_sync_drive`
Drive 소스를 최신 콘텐츠와 동기화합니다.

**매개변수:**
- `source_ids`: 동기화할 소스 UUID 목록
- `confirm`: 사용자 승인 후 반드시 `True`로 설정

---

#### `source_delete`
소스를 영구적으로 삭제합니다. **복구 불가능!**

**매개변수:**
- `source_id`: 삭제할 소스 UUID
- `confirm`: 사용자 승인 후 반드시 `True`로 설정

---

### 💬 채팅 및 쿼리

#### `notebook_query`
노트북의 **기존 소스**에 대해 AI에게 질문합니다.

**⚠️ 주의:** 새로운 소스를 찾거나 웹 검색이 필요한 경우 `research_start`를 사용하세요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `query`: 질문 내용
- `source_ids`: (선택) 쿼리할 소스 ID 목록 (기본값: 모두)
- `conversation_id`: (선택) 후속 질문용
- `timeout`: (선택) 요청 타임아웃 (기본값: 120.0초)

---

#### `chat_configure`
노트북 채팅 설정을 구성합니다.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `goal`: `default` | `learning_guide` | `custom`
- `custom_prompt`: `goal=custom`일 때 필수 (최대 10,000자)
- `response_length`: `default` | `longer` | `shorter`

---

### 🔍 리서치

#### `research_start`
웹 또는 Google Drive에서 **새로운 소스를 찾기** 위한 심층 리서치를 시작합니다.

**사용 시기:**
- "X에 대한 심층 리서치"
- "Y에 대한 소스 찾기"
- "Z에 대한 웹 검색"
- "Drive 검색"

**워크플로우:** `research_start` → `research_status` → `research_import`

**매개변수:**
- `query`: 검색할 내용 (예: "양자 컴퓨팅 발전")
- `source`: `web` | `drive`
- `mode`: `fast` (~30초, ~10개 소스) | `deep` (~5분, ~40개 소스, 웹 전용)
- `notebook_id`: (선택) 기존 노트북 (없으면 새로 생성)
- `title`: (선택) 새 노트북 제목

---

#### `research_status`
리서치 진행 상황을 폴링합니다. 완료 또는 타임아웃까지 대기합니다.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `poll_interval`: 폴링 간격 (기본값: 30초)
- `max_wait`: 최대 대기 시간 (기본값: 300초, 0=단일 폴링)
- `compact`: `True`(기본값)이면 보고서를 축약하고 소스를 제한하여 토큰 절약. `False`로 전체 상세 정보 조회.
- `task_id`: (선택) 특정 리서치 태스크 ID

---

#### `research_import`
발견된 소스를 노트북으로 가져옵니다.

`research_status`가 `status="completed"`를 반환한 후 호출하세요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `task_id`: 리서치 태스크 ID
- `source_indices`: (선택) 가져올 소스 인덱스 (기본값: 모두)

---

### 🎨 콘텐츠 생성 Studio

#### `audio_overview_create`
오디오 개요를 생성합니다. 사용자 승인 후 `confirm=True` 필요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `source_ids`: (선택) 소스 ID 목록 (기본값: 모두)
- `format`: `deep_dive` | `brief` | `critique` | `debate`
- `length`: `short` | `default` | `long`
- `language`: BCP-47 코드 (`en`, `es`, `fr`, `de`, `ja`)
- `focus_prompt`: (선택) 포커스 텍스트
- `confirm`: 사용자 승인 후 반드시 `True`

---

#### `video_overview_create`
비디오 개요를 생성합니다. 사용자 승인 후 `confirm=True` 필요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `source_ids`: (선택) 소스 ID 목록 (기본값: 모두)
- `format`: `explainer` | `brief`
- `visual_style`: `auto_select` | `classic` | `whiteboard` | `kawaii` | `anime` | `watercolor` | `retro_print` | `heritage` | `paper_craft`
- `language`: BCP-47 코드
- `focus_prompt`: (선택) 포커스 텍스트
- `confirm`: 사용자 승인 후 반드시 `True`

---

#### `infographic_create`
인포그래픽을 생성합니다. 사용자 승인 후 `confirm=True` 필요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `source_ids`: (선택) 소스 ID 목록 (기본값: 모두)
- `orientation`: `landscape` | `portrait` | `square`
- `detail_level`: `concise` | `standard` | `detailed`
- `language`: BCP-47 코드
- `focus_prompt`: (선택) 포커스 텍스트
- `confirm`: 사용자 승인 후 반드시 `True`

---

#### `slide_deck_create`
슬라이드 덱을 생성합니다. 사용자 승인 후 `confirm=True` 필요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `source_ids`: (선택) 소스 ID 목록 (기본값: 모두)
- `format`: `detailed_deck` | `presenter_slides`
- `length`: `short` | `default`
- `language`: BCP-47 코드
- `focus_prompt`: (선택) 포커스 텍스트
- `confirm`: 사용자 승인 후 반드시 `True`

---

#### `report_create`
리포트를 생성합니다. 사용자 승인 후 `confirm=True` 필요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `source_ids`: (선택) 소스 ID 목록 (기본값: 모두)
- `report_format`: `"Briefing Doc"` | `"Study Guide"` | `"Blog Post"` | `"Create Your Own"`
- `custom_prompt`: `"Create Your Own"` 선택 시 필수
- `language`: BCP-47 코드
- `confirm`: 사용자 승인 후 반드시 `True`

---

#### `flashcards_create`
플래시카드를 생성합니다. 사용자 승인 후 `confirm=True` 필요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `source_ids`: (선택) 소스 ID 목록 (기본값: 모두)
- `difficulty`: `easy` | `medium` | `hard`
- `confirm`: 사용자 승인 후 반드시 `True`

---

#### `quiz_create`
퀴즈를 생성합니다. 사용자 승인 후 `confirm=True` 필요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `source_ids`: (선택) 소스 ID 목록 (기본값: 모두)
- `question_count`: 질문 수 (기본값: 2)
- `difficulty`: 난이도 (기본값: `medium`)
- `confirm`: 사용자 승인 후 반드시 `True`

---

#### `data_table_create`
데이터 테이블을 생성합니다. 사용자 승인 후 `confirm=True` 필요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `description`: 생성할 데이터 테이블 설명
- `source_ids`: (선택) 소스 ID 목록 (기본값: 모두)
- `language`: 언어 코드 (기본값: `"en"`)
- `confirm`: 사용자 승인 후 반드시 `True`

---

#### `mind_map_create`
마인드맵을 생성하고 저장합니다. 사용자 승인 후 `confirm=True` 필요.

**매개변수:**
- `notebook_id`: 노트북 UUID
- `source_ids`: (선택) 소스 ID 목록 (기본값: 모두)
- `title`: 표시될 제목 (기본값: `"Mind Map"`)
- `confirm`: 사용자 승인 후 반드시 `True`

---

#### `studio_status`
Studio 콘텐츠 생성 상태 및 URL을 확인합니다.

**매개변수:**
- `notebook_id`: 노트북 UUID

---

#### `studio_delete`
Studio 아티팩트를 삭제합니다. **복구 불가능!**

**매개변수:**
- `notebook_id`: 노트북 UUID
- `artifact_id`: 아티팩트 UUID (`studio_status`에서 조회)
- `confirm`: 사용자 승인 후 반드시 `True`

---

## 🎯 일반적인 워크플로우

### 1. 새 노트북 만들고 소스 추가하기
```
1. notebook_create (title="프로젝트 리서치")
2. notebook_add_url (url="https://...")
3. notebook_add_text (text="...")
4. notebook_get (확인)
```

### 2. 웹 리서치 수행하기
```
1. research_start (query="AI 트렌드", source="web", mode="fast")
2. research_status (notebook_id="...", max_wait=300)
3. research_import (notebook_id="...", task_id="...")
```

### 3. 노트북에 질문하기
```
1. notebook_query (notebook_id="...", query="주요 인사이트는?")
2. notebook_query (conversation_id="...", query="더 자세히 설명해줘")
```

### 4. 콘텐츠 생성하기
```
1. audio_overview_create (notebook_id="...", format="deep_dive", confirm=True)
2. studio_status (notebook_id="...") # 생성 확인 및 URL 조회
```

### 5. Drive 소스 동기화
```
1. source_list_drive (notebook_id="...") # 오래된 소스 확인
2. source_sync_drive (source_ids=["..."], confirm=True)
```

---

## ⚠️ 주의사항

### 확인 필요 작업
다음 작업은 **사용자 승인 후 `confirm=True`**를 명시적으로 설정해야 합니다:
- `notebook_delete`
- `source_delete`
- `source_sync_drive`
- `studio_delete`
- 모든 콘텐츠 생성 기능 (`audio_overview_create`, `video_overview_create`, 등)

### 쿼리 vs 리서치
- **`notebook_query`**: 노트북에 **이미 있는** 소스에 대해 질문
- **`research_start`**: **새로운 소스를 찾기** 위한 웹/Drive 검색

### 토큰 절약
- `research_status`에서 `compact=True`로 설정하여 긴 보고서 축약
- `source_get_content`는 `notebook_query`보다 빠르고 토큰 효율적

---

## 📋 체크리스트

### 초기 설정
- [ ] `refresh_auth` 또는 `notebooklm-mcp-auth` 실행
- [ ] `notebook_list`로 연결 테스트

### 노트북 작업
- [ ] 노트북 생성/선택
- [ ] 소스 추가 (URL/텍스트/Drive)
- [ ] `notebook_describe`로 요약 확인

### 리서치 작업
- [ ] `research_start`로 검색 시작
- [ ] `research_status`로 진행 상황 확인
- [ ] `research_import`로 소스 가져오기

### 콘텐츠 생성
- [ ] 사용자 승인 받기
- [ ] 생성 기능 실행 (`confirm=True`)
- [ ] `studio_status`로 결과 확인

---

## 🔗 참고 자료

### 언어 코드 (BCP-47)
- `en`: 영어
- `ko`: 한국어
- `ja`: 일본어
- `es`: 스페인어
- `fr`: 프랑스어
- `de`: 독일어

### 타임아웃 설정
- Fast research: ~30초
- Deep research: ~5분
- Query timeout: 기본 120초 (환경 변수 `NOTEBOOKLM_QUERY_TIMEOUT`로 변경 가능)

---

## 📞 트러블슈팅

### 인증 오류
1. `notebooklm-mcp-auth` CLI 실행
2. 성공 후 `refresh_auth` 호출
3. 실패 시 `save_auth_tokens`로 수동 설정

### 리서치 타임아웃
- `max_wait` 값 증가
- `mode="fast"` 사용 (더 빠름)
- `poll_interval` 조정

### 콘텐츠 생성 실패
- `studio_status`로 상태 확인
- `confirm=True` 설정 확인
- 소스가 충분한지 확인

---

**버전:** 1.0.0  
**최종 업데이트:** 2026-01-27
