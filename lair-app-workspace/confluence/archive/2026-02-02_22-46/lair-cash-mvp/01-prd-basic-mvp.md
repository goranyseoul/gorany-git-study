# 기본 기능 MVP - PRD (제품 요구사항 문서)

> **원본**: [Confluence](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/420773890)  
> **최종 수정**: 2026-02-02  
> **버전**: 1.1

---

## 1. 배경 및 목적

### 배경

한국의 많은 투자자들이 환율 하락 우려 속에 달러 자산에 관심을 갖고 있지만, 기존 금융 상품은 진입장벽이 높고, 크립토 금융은 복잡하다.

| 진입장벽 | 현재 상황 |
| --- | --- |
| 복잡한 용어 | DeFi, 스테이킹, 이자농사 등 암호화폐 전문용어 |
| 가스비 | ETH 등 가스 토큰을 별도 구매/출금해야 함 |
| 지갑 생성 | 시드구문 12개 백업 필요 |
| 신뢰 부족 | 거래소 해킹, 러그풀 등 불안 |

### 목적

**"퀴즈 풀고 금 받기"** — 달러와 금의 가치를 쉽게 배우고, 게임처럼 재미있게 금을 모으며, 자연스럽게 달러 예치로 전환시킨다.

### 핵심 가설

> 블록체인/금융에 익숙하지 않은 일반인에게 ① 퀴즈로 금융 지식을 알려주고 ② 게임처럼 금을 모으는 경험을 제공하면, 달러 예치까지 자연스럽게 전환할 수 있다.

---

## 2. 포함 범위

### 기본 기능

| 기능 | 설명 |
| --- | --- |
| 온보딩 퀴즈 | 10단계 퀴즈, 완주 시 금 10mg 지급 |
| 계정 | 이메일, Google, Apple 로그인 (Privy) |
| 지갑 | 자동 생성 (Privy 임베디드 지갑) |
| 수취 (Receive) | QR 코드 + 주소 복사 |
| 전송 (Send) | 금액/주소 입력 → 생체 인증 → 전송 |
| 가스비 대납 | Paymaster 적용, 크레딧 차감 |

### 게임화 기능

| 기능 | 설명 |
| --- | --- |
| 금캐기 게임 | 무료 플레이, 쿨타임 영구 증가 |
| 배틀패스 | 10레벨, XP 획득 → 금 보상 |
| 친구 초대 | 초대 링크 공유, +50 XP |
| 친구 Nudge | 이탈 친구 복귀 유도, +1/+3 XP |

### 기타 기능

| 기능 | 설명 |
| --- | --- |
| 푸시 알림 | 금캐기 수확, Nudge, 마케팅 푸시 |
| 전화번호 인증 | 어뷰징 방지 (1인 1계정) |
| 설정 | 프로필, 푸시 설정, 로그아웃 |

---

## 3. 성공 지표 (KPI)

| 지표 | 목표 | 측정 방법 |
| --- | --- | --- |
| 온보딩 완료율 | 45%+ | 앱 진입 → 홈 도달 |
| 퀴즈 완주율 | 70%+ | 퀴즈 시작 → 10단계 완료 |
| 첫 입금 전환율 | 15%+ | 가입 → $100 입금 |
| Lv.5 달성률 | 20%+ | 전체 유저 중 |
| Nudge 성공률 | 30%+ | Nudge 발송 → 친구 금캐기 시작 |

---

## 4. XP 획득 구조

| 행동 | XP | 비고 |
| --- | --- | --- |
| 친구 1명 가입 | +50 XP | 고정 |
| $1당 입금 | +5 XP | 입금 시점 |
| Nudge 발송 | +1 XP | 발송 즉시 |
| Nudge 성공 | +3 XP | 친구 24시간 내 금캐기 |

---

## 5. 관련 문서

### 기능 정의서

| 기능 | 링크 |
| --- | --- |
| 계정 | [PRD](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/420708354) |
| 수취 | [PRD](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/420806658) |
| 전송 | [PRD](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/420839425) |
| 가스비 대납 | [PRD](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/420839447) |
| 배틀패스 | [PRD](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/428015617) |
| 금캐기 게임 | [PRD](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/428048386) |
| 온보딩 | [PRD](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/428113922) |
| 홈 화면 | [PRD](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/428277762) |
| 친구 초대 & 배틀패스 | [PRD](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/421462017) |
| 친구 Nudge | [PRD](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/431226881) |

### 기타 문서

| 문서 | 링크 |
| --- | --- |
| 기술 스펙 문서 | [링크](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/421036033) |
| 데이터 이벤트 정의서 | [링크](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/420773913) |

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
| --- | --- | --- |
| 0.1 | 2026-01-12 | 초안 작성 |
| 1.0 | 2026-01-30 | 전면 개편 |
| 1.1 | 2026-02-02 | Nudge 기능 추가 |
