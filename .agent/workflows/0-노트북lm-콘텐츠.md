---
description: NotebookLM으로 프레젠테이션/콘텐츠 자료 생성
---

# NotebookLM 프레젠테이션/콘텐츠 자료 생성

노트북 소스를 기반으로 오디오, 비디오, 슬라이드, 인포그래픽 등 프레젠테이션 자료를 생성합니다.

## 워크플로우

### 1. 인증 및 노트북 준비

```
mcp_notebooklm-mcp_refresh_auth 호출
mcp_notebooklm-mcp_notebook_get 호출
- notebook_id: 대상 노트북 ID
```

소스가 충분한지 확인 (최소 1개 이상).

### 2. 콘텐츠 유형 선택

사용자에게 생성할 콘텐츠 유형을 선택하게 합니다:

- 🎤 **오디오 개요** (Podcast 스타일)
- 🎬 **비디오 개요** (시각적 설명)
- 📊 **슬라이드 덱** (발표 자료)
- 🖼️ **인포그래픽** (시각 자료)
- 📄 **리포트** (문서 자료)
- 📋 **데이터 테이블** (구조화된 데이터)

### 3-A. 오디오 개요 생성 🎤

```
mcp_notebooklm-mcp_audio_overview_create 호출
- notebook_id: 노트북 ID
- source_ids: null (전체) 또는 특정 소스
- format: "deep_dive" | "brief" | "critique" | "debate"
- length: "short" | "default" | "long"
- language: "ko" | "en" | "ja" | "es" | "fr" | "de"
- focus_prompt: (옵션) "특정 측면에 집중해주세요"
- confirm: True
```

**포맷 선택:**
- `deep_dive`: 심층 대담 (기본, 가장 인기)
- `brief`: 짧은 요약 (빠른 개요)
- `critique`: 비판적 분석
- `debate`: 토론 형식

**예시 요청:**
> "이 논문들로 15분짜리 심층 대담 오디오를 만들어줘"
→ `format="deep_dive"`, `length="long"`

### 3-B. 비디오 개요 생성 🎬

```
mcp_notebooklm-mcp_video_overview_create 호출
- notebook_id: 노트북 ID
- source_ids: null 또는 특정 소스
- format: "explainer" | "brief"
- visual_style: "auto_select" | "classic" | "whiteboard" | "kawaii" | "anime" | "watercolor" | "retro_print" | "heritage" | "paper_craft"
- language: "ko" | "en" | "ja"
- focus_prompt: (옵션)
- confirm: True
```

**비주얼 스타일 추천:**
- `auto_select`: AI가 자동 선택 (안전)
- `whiteboard`: 교육/설명용
- `classic`: 전문적인 프레젠테이션
- `kawaii`: 친근하고 귀여운 스타일
- `anime`: 애니메이션 스타일
- `watercolor`: 예술적/감성적 주제

**예시 요청:**
> "화이트보드 스타일로 설명 비디오 만들어줘"
→ `format="explainer"`, `visual_style="whiteboard"`

### 3-C. 슬라이드 덱 생성 📊

```
mcp_notebooklm-mcp_slide_deck_create 호출
- notebook_id: 노트북 ID
- source_ids: null 또는 특정 소스
- format: "detailed_deck" | "presenter_slides"
- length: "short" | "default"
- language: "ko" | "en"
- focus_prompt: (옵션) "핵심 비즈니스 인사이트 중심으로"
- confirm: True
```

**포맷 선택:**
- `detailed_deck`: 상세한 슬라이드 (읽기 자료)
- `presenter_slides`: 발표자용 슬라이드 (간결)

**예시 요청:**
> "투자자 발표용 간결한 슬라이드 만들어줘"
→ `format="presenter_slides"`, `focus_prompt="비즈니스 가치와 ROI 중심"`

### 3-D. 인포그래픽 생성 🖼️

```
mcp_notebooklm-mcp_infographic_create 호출
- notebook_id: 노트북 ID
- source_ids: null 또는 특정 소스
- orientation: "landscape" | "portrait" | "square"
- detail_level: "concise" | "standard" | "detailed"
- language: "ko" | "en"
- focus_prompt: (옵션)
- confirm: True
```

**방향 선택:**
- `landscape`: 가로형 (프레젠테이션, 웹)
- `portrait`: 세로형 (인쇄, SNS)
- `square`: 정사각형 (Instagram 등)

**예시 요청:**
> "인스타그램용 정사각형 인포그래픽 만들어줘"
→ `orientation="square"`, `detail_level="concise"`

### 3-E. 리포트 생성 📄

```
mcp_notebooklm-mcp_report_create 호출
- notebook_id: 노트북 ID
- source_ids: null 또는 특정 소스
- report_format: "Briefing Doc" | "Study Guide" | "Blog Post" | "Create Your Own"
- custom_prompt: ("Create Your Own" 선택 시 필수)
- language: "ko" | "en"
- confirm: True
```

**리포트 형식:**
- `Briefing Doc`: 임원 브리핑용 (핵심 요약)
- `Study Guide`: 학습 가이드 (교육용)
- `Blog Post`: 블로그 글 (대중용)
- `Create Your Own`: 커스텀 (예: "백서", "제안서")

**예시 요청:**
> "블로그 포스트 형식으로 일반 독자용 글 써줘"
→ `report_format="Blog Post"`, `language="ko"`

**커스텀 리포트 예시:**
> "투자 제안서 형식으로 작성해줘"
→ `report_format="Create Your Own"`, `custom_prompt="벤처 투자자를 위한 기술 평가 보고서. 시장 기회, 기술 혁신성, 팀 역량, 리스크 분석을 포함하여 작성."`

### 3-F. 데이터 테이블 생성 📋

```
mcp_notebooklm-mcp_data_table_create 호출
- notebook_id: 노트북 ID
- description: "생성할 테이블의 구체적인 설명"
- source_ids: null 또는 특정 소스
- language: "ko" | "en"
- confirm: True
```

**예시 요청:**
> "주요 AI 모델들의 성능 비교 테이블 만들어줘"
→ `description="AI 모델별 파라미터 수, 성능 벤치마크, 출시일, 주요 특징을 비교하는 테이블"`

### 4. 생성 상태 확인

```
mcp_notebooklm-mcp_studio_status 호출
- notebook_id: 노트북 ID
```

반환값:
- `artifacts`: 생성된 콘텐츠 목록
  - `artifact_id`: 각 콘텐츠 ID
  - `type`: 콘텐츠 유형
  - `status`: "pending" | "processing" | "completed" | "failed"
  - `url`: NotebookLM URL
  - `download_url`: (오디오/비디오) 다운로드 링크

### 5. 결과 전달

사용자에게 다음을 제공합니다:
- ✅ 생성 완료 알림
- 🔗 각 콘텐츠의 NotebookLM URL
- 📥 다운로드 링크 (오디오/비디오)
- 📊 생성된 콘텐츠 미리보기 (가능한 경우)

## 종합 콘텐츠 패키지 예시

**시나리오: 컨퍼런스 발표 자료 패키지**

**사용자 요청:**
> "AI 윤리에 대한 컨퍼런스 발표 자료 패키지를 만들어줘"

**실행:**

1. 📊 **발표 슬라이드** 생성
   ```
   format="presenter_slides"
   length="default"
   focus_prompt="AI 윤리의 핵심 이슈와 실무 적용 사례"
   ```

2. 🎤 **오디오 스크립트** 생성
   ```
   format="deep_dive"
   length="default" (8분)
   focus_prompt="발표 내용 연습용 대담"
   ```

3. 🖼️ **인포그래픽** 생성
   ```
   orientation="landscape"
   detail_level="standard"
   focus_prompt="AI 윤리 원칙 요약"
   ```

4. 📄 **Briefing Doc** 생성
   ```
   report_format="Briefing Doc"
   focus_prompt="참석자 배포용 핵심 요약"
   ```

5. ✅ 결과:
   ```
   📦 컨퍼런스 발표 패키지 생성 완료!
   
   📊 발표 슬라이드 (15장)
      → https://notebooklm.google.com/...
   
   🎤 연습용 오디오 (8분)
      → https://notebooklm.google.com/...
      📥 다운로드: audio_overview.mp3
   
   🖼️ 핵심 인포그래픽
      → https://notebooklm.google.com/...
   
   📄 배포용 브리핑 문서
      → https://notebooklm.google.com/...
   ```

## 사용 시나리오별 추천

### 📚 학습/교육
- 오디오 (Brief) + 슬라이드 (Detailed Deck)
- 비디오 (Whiteboard) + Study Guide
- 인포그래픽 (Portrait) + 플래시카드

### 💼 비즈니스 발표
- 슬라이드 (Presenter) + Briefing Doc
- 인포그래픽 (Landscape) + 오디오 (Deep Dive)
- 데이터 테이블 + 리포트 (Custom)

### 📱 SNS/마케팅
- 인포그래픽 (Square) + Blog Post
- 비디오 (Kawaii/Anime) + Brief 오디오
- 짧은 슬라이드 + 데이터 테이블

### 📖 연구/분석
- 리포트 (Briefing Doc) + 데이터 테이블
- 오디오 (Critique/Debate) + 상세 슬라이드
- 인포그래픽 (Detailed) + Study Guide

## 고급 팁

### Focus Prompt 활용
명확한 `focus_prompt`로 콘텐츠 품질 향상:

**일반적:**
```
focus_prompt: "핵심 내용 요약"
```

**구체적:**
```
focus_prompt: "비즈니스 의사결정자를 위한 실행 가능한 인사이트와 ROI 분석에 집중. 기술적 세부사항은 최소화."
```

### 언어별 최적화
- **한국어**: 문화적 맥락 고려, 존댓말/반말 선택
- **영어**: 글로벌 청중 대상, 명확한 표현
- **일본어**: 비즈니스 케이고 vs 친근한 톤

### 다운로드 및 공유
- 오디오/비디오: MP3/MP4로 다운로드 가능
- 슬라이드/리포트: NotebookLM에서 복사/내보내기
- 인포그래픽: 스크린샷 또는 공유 링크

### 6. 우수 콘텐츠 아카이브 (Recursive Loop)

특히 성공적인 콘텐츠가 생성되었다면:

```
1. docs/0-리서치/{프로젝트}_content_archive.md에 기록
2. 효과적이었던 focus_prompt 저장
3. 최적 스타일/형식 조합 메모
4. 다음 콘텐츠 생성 시 재활용
```

**Best Practice 예시:**
```markdown
## 성공 케이스: 투자자 발표 패키지
- Slide: presenter_slides + "비즈니스 가치 중심"
- Audio: deep_dive + "ROI 분석 강조"
- Infographic: landscape + standard
→ 결과: 투자 유치 성공!
```

---

## 주의사항

- **생성 시간**: 3~10분 소요 (복잡도에 따라)
- **동시 생성**: 여러 콘텐츠 동시 요청 가능
- **언어 제한**: 일부 기능은 영어가 가장 잘 지원됨
- **확인 필수**: 모든 생성 기능은 `confirm=True` 필요
- **소스 품질**: 양질의 소스가 좋은 콘텐츠의 핵심
- **재활용**: 우수 콘텐츠 패턴은 템플릿화하여 다음에 활용
