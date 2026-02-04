# 기술 스펙 문서

> **원본**: [Confluence](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/421036033)  
> **최종 수정**: 2026-02-02  
> **버전**: 1.1

---

## 1. 기술 스택 요약

| 영역 | 기술 |
| --- | --- |
| 플랫폼 | iOS + Android (동시) |
| 프론트엔드 | Flutter |
| 지갑/인증 | Privy |
| 체인 | Ethereum |
| Paymaster | Privy 내장 Paymaster |
| 푸시 알림 | Firebase Cloud Messaging (FCM) + APNs |
| 블록체인 노드 | Alchemy 또는 Infura |
| SMS 인증 | TBD (Twilio, Firebase Auth 등) |

---

## 2. 외부 서비스 연동

### 2.1 Privy

| 용도 | 기능 |
| --- | --- |
| 인증 | 이메일 OTP, Google, Apple OAuth |
| 지갑 | Embedded Wallet 생성 및 관리 |
| 트랜잭션 | 서명 및 전송 |
| Paymaster | 가스비 대납 |

**연동 방식:** Privy Flutter SDK

### 2.2 Alchemy / Infura

| 용도 | 기능 |
| --- | --- |
| RPC | 블록체인 트랜잭션 전송 |
| Webhook | 입금 이벤트 감지 |
| 잔액 조회 | ERC-20 토큰 잔액 |

### 2.3 Firebase

| 용도 | 기능 |
| --- | --- |
| FCM | Android 푸시 알림 |
| Dynamic Links | 레퍼럴 딥링크 생성 |
| Analytics | 이벤트 추적 |

---

## 3. API 엔드포인트

### 3.1 인증 API

| API | 메서드 | 설명 |
| --- | --- | --- |
| /auth/privy/verify | POST | Privy 토큰 검증 |
| /auth/logout | POST | 로그아웃 |

### 3.2 사용자 API

| API | 메서드 | 설명 |
| --- | --- | --- |
| /users/me | GET | 내 정보 조회 |
| /users/me | PATCH | 정보 수정 |
| /users/me/marketing | PATCH | 마케팅 수신 동의 |

### 3.3 지갑 API

| API | 메서드 | 설명 |
| --- | --- | --- |
| /wallet/balance | GET | 잔액 조회 |
| /wallet/transactions | GET | 거래 내역 |
| /wallet/send | POST | 전송 요청 |

### 3.4 배틀패스 API

| API | 메서드 | 설명 |
| --- | --- | --- |
| /battlepass/status | GET | 레벨/XP 현황 |
| /battlepass/claim | POST | 보상 수령 |
| /battlepass/xp | POST | XP 획득 기록 |

### 3.5 친구 초대 API

| API | 메서드 | 설명 |
| --- | --- | --- |
| /referral/code | GET | 내 초대 코드 |
| /referral/apply | POST | 초대 코드 적용 |
| /referral/stats | GET | 초대 현황 |

### 3.6 금캐기 게임 API

| API | 메서드 | 설명 |
| --- | --- | --- |
| /mining/status | GET | 게임 상태 |
| /mining/start | POST | 채굴 시작 |
| /mining/harvest | POST | 금 수확 |

### 3.7 온보딩 퀴즈 API

| API | 메서드 | 설명 |
| --- | --- | --- |
| /onboarding/quiz | GET | 퀴즈 목록 |
| /onboarding/quiz/answer | POST | 답변 제출 |
| /onboarding/quiz/complete | POST | 완료 |

### 3.8 전화번호 인증 API

| API | 메서드 | 설명 |
| --- | --- | --- |
| /phone/send-code | POST | 인증 코드 발송 |
| /phone/verify | POST | 인증 코드 확인 |

### 3.9 Nudge API

| API | 메서드 | 설명 |
| --- | --- | --- |
| /friends | GET | 친구 목록 + 상태 |
| /friends/{id}/nudge | POST | Nudge 발송 |
| /nudges/pending | GET | 미확인 Nudge |
| /nudges/{id}/read | POST | Nudge 확인 |

---

## 4. 데이터 모델

### 4.1 User

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| id | UUID | 사용자 ID |
| privy_id | string | Privy 사용자 ID |
| email | string | 이메일 |
| wallet_address | string | 지갑 주소 |
| phone_verified | boolean | 전화번호 인증 여부 |
| referral_code | string | 내 초대 코드 |
| referred_by | UUID | 초대한 사람 ID |
| created_at | datetime | 가입일 |

### 4.2 Battlepass

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| user_id | UUID | 사용자 ID |
| level | int | 현재 레벨 (1-10) |
| xp | int | 현재 XP |
| claimed_levels | int[] | 보상 수령한 레벨 |

### 4.3 MiningGame

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| user_id | UUID | 사용자 ID |
| status | enum | idle/mining/harvestable |
| started_at | datetime | 채굴 시작 시간 |
| gold_mg | decimal | 보유 금 (mg) |

### 4.4 GoldTransaction

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| id | UUID | 거래 ID |
| user_id | UUID | 사용자 ID |
| type | enum | quiz/mining/battlepass/deposit |
| amount_mg | decimal | 금액 (mg) |
| created_at | datetime | 거래일 |

### 4.5 Nudge

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| id | UUID | Nudge ID |
| sender_id | UUID | 발신자 |
| receiver_id | UUID | 수신자 |
| status | enum | sent/read/success |
| sent_at | datetime | 발송 시간 |
| success_at | datetime | 성공 시간 |

### 4.6 FriendRelation

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| user_id | UUID | 사용자 ID |
| friend_id | UUID | 친구 ID |
| relationship | enum | invited/invited_by |
| created_at | datetime | 관계 생성일 |

---

## 5. 비즈니스 로직

### 5.1 XP 계산

| 액션 | XP |
| --- | --- |
| 친구 1명 가입 | +50 XP |
| $1당 입금 | +5 XP |
| Nudge 발송 | +1 XP |
| Nudge 성공 | +3 XP |

### 5.2 배틀패스 레벨 테이블

| 레벨 | 필요 XP | 누적 XP | 보상 (mg) |
| --- | --- | --- | --- |
| 1 | 50 | 50 | 1 |
| 2 | 50 | 100 | 1 |
| 3 | 100 | 200 | 2 |
| 4 | 100 | 300 | 2 |
| 5 | 200 | 500 | 3 |
| 6 | 250 | 750 | 3 |
| 7 | 250 | 1,000 | 4 |
| 8 | 500 | 1,500 | 5 |
| 9 | 500 | 2,000 | 5 |
| 10 | 1,000 | 3,000 | 8 |

### 5.3 금캐기 게임

- 주기: 60분
- 무료 플레이: 무제한
- 보상: 10% 확률로 랜덤 금 획득

### 5.4 크레딧 시스템

- 신규 가입: 5회 지급
- 추가 획득: 레퍼럴 보상
- 소진 시: 전송 불가 → 레퍼럴 유도

### 5.5 Nudge 조건

- Nudge 가능: 친구 상태가 harvestable 또는 idle
- 쿨다운: 24시간
- XP 지급: 발송 시 +1, 성공 시 +3

---

## 6. 환경 구성

| 환경 | 용도 |
| --- | --- |
| Development | 로컬 개발 |
| Staging | 배포 전 검증 |
| Production | 실 서비스 |

**체인:**
- Dev/Staging: Ethereum Sepolia (테스트넷)
- Production: Ethereum Mainnet

---

## 7. 서버 아키텍처

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Flutter   │ ──> │   API GW    │ ──> │  Backend    │
│     App     │     │  (Gateway)  │     │  Services   │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
              ┌─────▼─────┐           ┌───────▼───────┐         ┌───────▼───────┐
              │  Privy    │           │   Database    │         │   Alchemy     │
              │  (Auth)   │           │   (Postgres)  │         │   (Chain)     │
              └───────────┘           └───────────────┘         └───────────────┘
```
