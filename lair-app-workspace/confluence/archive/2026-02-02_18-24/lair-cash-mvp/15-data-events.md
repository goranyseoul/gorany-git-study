# 데이터 이벤트 정의서

> **원본**: [Confluence](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/420773913)  
> **최종 수정**: 2026-02-02  
> **버전**: 1.1

---

## 1. 이벤트 네이밍 규칙

| 규칙 | 설명 | 예시 |
| --- | --- | --- |
| snake_case | 소문자 + 언더스코어 | `quiz_complete` |
| {기능}_{액션} | 기능명_동작 | `mining_start`, `deposit_confirm` |

---

## 2. 온보딩 이벤트

### 2.1 앱 진입

| 이벤트명 | 설명 | 속성 |
| --- | --- | --- |
| `app_open` | 앱 실행 | `is_first_open`, `source` |
| `onboarding_start` | 서비스 소개 화면 진입 | |
| `onboarding_cta_click` | "금 캐러 가기" 버튼 클릭 | |

### 2.2 퀴즈

| 이벤트명 | 설명 | 속성 |
| --- | --- | --- |
| `quiz_start` | 퀴즈 시작 | |
| `quiz_step_view` | 퀴즈 단계 진입 | `step` (1-10) |
| `quiz_answer_select` | 답변 선택 | `step`, `answer`, `is_correct` |
| `quiz_step_complete` | 단계 완료 (정답) | `step` |
| `quiz_complete` | 10단계 완주 | `total_time_seconds` |
| `quiz_reward_view` | 완주 축하 화면 | `reward_mg` (10) |

### 2.3 로그인

| 이벤트명 | 설명 | 속성 |
| --- | --- | --- |
| `login_view` | 로그인 화면 진입 | |
| `login_method_select` | 로그인 방식 선택 | `method` (google/apple/email) |
| `login_success` | 로그인 성공 | `method`, `is_new_user` |
| `login_fail` | 로그인 실패 | `method`, `error_type` |

---

## 3. 지갑 이벤트

| 이벤트명 | 설명 | 속성 |
| --- | --- | --- |
| `wallet_view` | 홈 화면 진입 | `balance_usd`, `balance_gold_mg` |
| `receive_view` | 받기 화면 진입 | |
| `receive_address_copy` | 주소 복사 | |
| `send_view` | 보내기 화면 진입 | |
| `send_amount_input` | 금액 입력 | `amount` |
| `send_confirm_view` | 전송 확인 화면 | `amount`, `to_address` |
| `send_success` | 전송 성공 | `amount`, `tx_hash` |
| `send_fail` | 전송 실패 | `error_type` |

---

## 4. 배틀패스 이벤트

| 이벤트명 | 설명 | 속성 |
| --- | --- | --- |
| `battlepass_view` | 배틀패스 화면 진입 | `level`, `xp` |
| `battlepass_level_up` | 레벨업 | `new_level`, `xp` |
| `battlepass_claim` | 보상 수령 | `level`, `reward_mg` |
| `battlepass_xp_earned` | XP 획득 | `amount`, `source` |

**source enum:**
- `referral` - 친구 초대
- `deposit` - 달러 입금
- `nudge_send` - Nudge 발송
- `nudge_success` - Nudge 성공

---

## 5. 금캐기 게임 이벤트

| 이벤트명 | 설명 | 속성 |
| --- | --- | --- |
| `mining_view` | 게임 카드 표시 | `status` |
| `mining_start` | 채굴 시작 | |
| `mining_harvest` | 금 수확 | `reward_mg`, `had_bonus` |
| `mining_reminder_view` | 리마인더 표시 | |

---

## 6. 친구 초대 이벤트

| 이벤트명 | 설명 | 속성 |
| --- | --- | --- |
| `referral_view` | 친구 초대 화면 진입 | `total_friends`, `pending_count` |
| `referral_link_copy` | 초대 링크 복사 | |
| `referral_link_share` | 초대 링크 공유 | `channel` |
| `referral_code_input` | 초대 코드 입력 | |
| `referral_reward_received` | 초대 보상 수령 | `xp_earned` |
| `referral_friends_section_view` | 내 친구들 섹션 표시 | `friend_count` |

---

## 7. 친구 Nudge 이벤트

| 이벤트명 | 설명 | 속성 |
| --- | --- | --- |
| `nudge_button_view` | Nudge 버튼 표시 | `friend_id`, `is_available` |
| `nudge_send` | Nudge 발송 | `friend_id`, `friend_status` |
| `nudge_success` | Nudge 성공 | `friend_id`, `time_to_success_seconds` |
| `nudge_receive` | Nudge 수신 | `sender_id` |
| `nudge_banner_click` | Nudge 배너 클릭 | |

---

## 8. 전화번호 인증 이벤트

| 이벤트명 | 설명 | 속성 |
| --- | --- | --- |
| `phone_verify_view` | 인증 화면 진입 | `trigger` |
| `phone_code_request` | 인증 코드 요청 | |
| `phone_code_input` | 인증 코드 입력 | |
| `phone_verify_success` | 인증 성공 | |
| `phone_verify_fail` | 인증 실패 | `error_type` |

---

## 9. 달러로 금캐기 이벤트

| 이벤트명 | 설명 | 속성 |
| --- | --- | --- |
| `gold_mining_view` | 상세 화면 진입 | |
| `gold_mining_product_view` | 상품 선택 | `product_type`, `duration`, `apr` |
| `deposit_confirm_view` | 예치 확인 화면 | `amount`, `product_type` |
| `deposit_success` | 예치 성공 | `amount`, `expected_reward_mg` |
| `deposit_fail` | 예치 실패 | `error_type` |

---

## 10. User Properties

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `user_id` | string | 사용자 ID |
| `signup_date` | date | 가입일 |
| `login_method` | string | 로그인 방식 |
| `phone_verified` | boolean | 전화번호 인증 여부 |
| `total_deposit_usd` | number | 총 입금액 |
| `total_gold_mg` | number | 총 보유 금 |
| `battlepass_level` | number | 배틀패스 레벨 |
| `total_referrals` | number | 초대한 친구 수 |
| `total_nudge_sent` | number | 발송한 Nudge 수 |
| `total_nudge_success` | number | 성공한 Nudge 수 |

---

## 11. 퍼널 분석

### 11.1 온보딩 퍼널

```
onboarding_start
  → quiz_start
    → quiz_complete
      → login_success
        → home_view
```

### 11.2 입금 퍼널

```
home_view
  → receive_view
    → receive_address_copy
      → 외부 입금
        → balance_update_event
```

### 11.3 배틀패스 퍼널

```
battlepass_view
  → referral_link_share
    → referral_reward_received
      → battlepass_level_up
        → battlepass_claim
```

### 11.4 친구 Nudge 퍼널

```
referral_friends_section_view
  → nudge_button_view (available)
    → nudge_send
      → nudge_success
```

**핵심 지표:**

| 지표 | 계산 방식 | 목표 |
| --- | --- | --- |
| DAU Nudge 참여율 | unique(nudge_send.user_id) / DAU | 20%+ |
| Nudge 성공률 | nudge_success / nudge_send | 30%+ |
| Nudge XP 기여도 | xp_from_nudge / total_xp | 5-10% |
