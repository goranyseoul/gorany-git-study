# 기술 스펙 문서

> **원본**: [Confluence](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/421036033)  
> **버전**: 1.1

---

## 1. 기술 스택

### 1.1 프론트엔드 (모바일 앱)

| 항목 | 기술 |
| --- | --- |
| 프레임워크 | Flutter |
| 상태관리 | Riverpod |
| 라우팅 | GoRouter |
| HTTP | Dio |
| 인증 | Privy SDK |
| 푸시 알림 | Firebase Cloud Messaging |
| 분석 | Amplitude |

### 1.2 백엔드

| 항목 | 기술 |
| --- | --- |
| 프레임워크 | NestJS |
| 언어 | TypeScript |
| DB | PostgreSQL |
| ORM | Prisma |
| 캐시 | Redis |
| 인증 | JWT + Privy |
| 블록체인 | ethers.js (Ethereum) |

### 1.3 인프라

| 항목 | 기술 |
| --- | --- |
| 클라우드 | AWS |
| 컨테이너 | Docker + ECS |
| CI/CD | GitHub Actions |
| 모니터링 | Datadog |

---

## 2. API 엔드포인트

### 2.1 인증 (Auth)

| 메서드 | 엔드포인트 | 설명 |
| --- | --- | --- |
| POST | /auth/privy/verify | Privy 토큰 검증 |
| POST | /auth/refresh | 토큰 갱신 |
| POST | /auth/logout | 로그아웃 |

### 2.2 사용자 (Users)

| 메서드 | 엔드포인트 | 설명 |
| --- | --- | --- |
| GET | /users/me | 내 정보 조회 |
| PATCH | /users/me | 내 정보 수정 |
| POST | /users/phone/verify | 전화번호 인증 요청 |
| POST | /users/phone/confirm | 인증 코드 확인 |

### 2.3 지갑 (Wallet)

| 메서드 | 엔드포인트 | 설명 |
| --- | --- | --- |
| GET | /wallet/address | 지갑 주소 조회 |
| GET | /wallet/balance | 잔액 조회 (USDC/USDT, 금) |
| POST | /wallet/send | 전송 요청 |
| GET | /wallet/transactions | 거래 내역 |

### 2.4 크레딧 (Credit)

| 메서드 | 엔드포인트 | 설명 |
| --- | --- | --- |
| GET | /credit/balance | 크레딧 잔액 |
| POST | /credit/use | 크레딧 사용 |
| GET | /credit/history | 사용 내역 |

### 2.5 금캐기 (Mining)

| 메서드 | 엔드포인트 | 설명 |
| --- | --- | --- |
| GET | /mining/status | 현재 상태 |
| POST | /mining/start | 채굴 시작 |
| POST | /mining/harvest | 수확 |
| GET | /mining/history | 채굴 내역 |

### 2.6 배틀패스 (Battlepass)

| 메서드 | 엔드포인트 | 설명 |
| --- | --- | --- |
| GET | /battlepass/status | 레벨/XP 상태 |
| POST | /battlepass/claim/{level} | 보상 클레임 |
| GET | /battlepass/xp/history | XP 획득 내역 |

### 2.7 레퍼럴 (Referral)

| 메서드 | 엔드포인트 | 설명 |
| --- | --- | --- |
| GET | /referral/code | 내 초대 코드 |
| POST | /referral/apply | 초대 코드 적용 |
| GET | /referral/stats | 초대 현황 |

### 2.8 친구 (Friends)

| 메서드 | 엔드포인트 | 설명 |
| --- | --- | --- |
| GET | /friends | 친구 목록 + 상태 |
| POST | /friends/{id}/nudge | Nudge 발송 |

---

## 3. 데이터 모델

### 3.1 User

```typescript
interface User {
  id: string;
  email: string;
  nickname: string;
  phone?: string;
  isPhoneVerified: boolean;
  walletAddress: string;
  referralCode: string;
  referredBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 Wallet Balance

```typescript
interface WalletBalance {
  usdc: number;      // USDC 잔액
  usdt: number;      // USDT 잔액
  gold: number;      // 금 잔액 (mg)
  usdValue: number;  // USD 환산 총액
}
```

### 3.3 Mining Session

```typescript
interface MiningSession {
  id: string;
  userId: string;
  sessionNumber: number;    // 회차
  status: 'mining' | 'harvestable' | 'harvested';
  goldAmount: number;       // 0.1 또는 0.5 mg
  isBoosted: boolean;       // 5배 부스트 여부
  cooldownMinutes: number;  // 쿨타임
  startedAt: Date;
  harvestableAt: Date;
  harvestedAt?: Date;
}
```

### 3.4 Battlepass

```typescript
interface BattlepassStatus {
  level: number;           // 1~10
  currentXp: number;       // 현재 레벨 내 XP
  totalXp: number;         // 누적 XP
  nextLevelXp: number;     // 다음 레벨 필요 XP
  claimedLevels: number[]; // 클레임한 레벨 목록
  totalGoldEarned: number; // 누적 획득 금
}
```

### 3.5 Friend

```typescript
interface Friend {
  id: string;
  nickname: string;        // 마스킹 (김**)
  relation: 'invited' | 'invited_by';
  status: 'mining' | 'harvestable' | 'idle';
  canNudge: boolean;       // Nudge 가능 여부
  lastNudgedAt?: Date;     // 마지막 Nudge 시간
}
```

---

## 4. 에러 코드

### 4.1 공통

| 코드 | 설명 |
| --- | --- |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

### 4.2 비즈니스 에러

| 코드 | 설명 |
| --- | --- |
| AUTH_001 | Privy 토큰 검증 실패 |
| WALLET_001 | 잔액 부족 |
| WALLET_002 | 유효하지 않은 주소 |
| CREDIT_001 | 크레딧 부족 |
| MINING_001 | 이미 채굴 중 |
| MINING_002 | 수확 불가 상태 |
| PHONE_001 | 인증 코드 불일치 |
| PHONE_002 | 이미 사용된 번호 |
| REFERRAL_001 | 유효하지 않은 코드 |
| NUDGE_001 | 24시간 내 Nudge 불가 |

---

## 5. Privy 연동

### 5.1 설정

| 항목 | 값 |
| --- | --- |
| App ID | 환경변수 (PRIVY_APP_ID) |
| Secret | 환경변수 (PRIVY_APP_SECRET) |
| 지원 체인 | Ethereum |
| 지갑 타입 | Embedded Wallet |
| Paymaster | 활성화 |

### 5.2 인증 플로우

```
1. 앱: Privy SDK 로그인 (이메일/Google/Apple)
2. 앱: Privy 토큰 획득
3. 앱 → 서버: POST /auth/privy/verify (Privy 토큰)
4. 서버: Privy 토큰 검증
5. 서버 → 앱: JWT 토큰 발급
6. 앱: JWT로 이후 API 호출
```
