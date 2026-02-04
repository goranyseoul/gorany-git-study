# 데이터 이벤트 정의서

> **원본**: [Confluence](https://bugcity.atlassian.net/wiki/spaces/BUGCITY/pages/420773913)  
> **버전**: 1.1

---

## 1. 이벤트 네이밍 컨벤션

### 1.1 형식

```
{category}_{action}_{target}
```

* **category**: screen, button, api, system
* **action**: view, click, success, failure
* **target**: 구체적인 대상

### 1.2 예시

| 이벤트명 | 설명 |
| --- | --- |
| screen_view_home | 홈 화면 조회 |
| button_click_send | 보내기 버튼 클릭 |
| api_success_login | 로그인 API 성공 |
| system_error_crash | 앱 크래시 |

---

## 2. 화면별 이벤트

### 2.1 온보딩

| 이벤트 | 설명 | 파라미터 |
| --- | --- | --- |
| screen_view_intro | 서비스 소개 화면 | - |
| screen_view_quiz | 퀴즈 화면 | step: 1~10 |
| button_click_quiz_answer | 퀴즈 정답 선택 | step, is_correct |
| button_click_quiz_skip | 퀴즈 건너뛰기 | step |
| screen_view_quiz_complete | 퀴즈 완주 축하 | - |

### 2.2 인증

| 이벤트 | 설명 | 파라미터 |
| --- | --- | --- |
| screen_view_login | 로그인 화면 | - |
| button_click_login_email | 이메일 로그인 버튼 | - |
| button_click_login_google | 구글 로그인 버튼 | - |
| button_click_login_apple | 애플 로그인 버튼 | - |
| api_success_login | 로그인 성공 | provider |
| api_failure_login | 로그인 실패 | provider, error |

### 2.3 홈

| 이벤트 | 설명 | 파라미터 |
| --- | --- | --- |
| screen_view_home | 홈 화면 | - |
| button_click_receive | 받기 버튼 | - |
| button_click_send | 보내기 버튼 | - |
| button_click_mining_start | 금 캐기 시작 | - |
| button_click_mining_harvest | 금 수확 | - |

### 2.4 금캐기 게임

| 이벤트 | 설명 | 파라미터 |
| --- | --- | --- |
| mining_start | 채굴 시작 | session_count |
| mining_harvest | 수확 완료 | gold_amount, is_boosted |
| mining_cooldown_view | 쿨타임 화면 노출 | remaining_minutes |

### 2.5 배틀패스 & 친구 초대

| 이벤트 | 설명 | 파라미터 |
| --- | --- | --- |
| screen_view_referral | 친구 초대 화면 | - |
| button_click_copy_link | 초대 링크 복사 | - |
| button_click_share_kakao | 카카오톡 공유 | - |
| api_success_referral_apply | 초대 코드 적용 성공 | code |
| battlepass_level_up | 배틀패스 레벨업 | new_level, total_xp |
| battlepass_reward_claim | 보상 클레임 | level, gold_amount |

### 2.6 친구 Nudge

| 이벤트 | 설명 | 파라미터 |
| --- | --- | --- |
| button_click_nudge_send | Nudge 발송 버튼 클릭 | friend_id |
| api_success_nudge_send | Nudge 발송 성공 | friend_id |
| nudge_success | Nudge 성공 (친구 복귀) | friend_id |

### 2.7 전송

| 이벤트 | 설명 | 파라미터 |
| --- | --- | --- |
| screen_view_send_amount | 금액 입력 화면 | - |
| screen_view_send_address | 주소 입력 화면 | - |
| screen_view_send_confirm | 전송 확인 화면 | amount |
| api_success_send | 전송 성공 | amount, tx_hash |
| api_failure_send | 전송 실패 | amount, error |

---

## 3. 유저 프로퍼티

| 프로퍼티 | 설명 | 값 예시 |
| --- | --- | --- |
| user_level | 배틀패스 레벨 | 1~10 |
| total_xp | 누적 XP | 0~3000+ |
| total_deposit_usd | 누적 입금액 | 0~10000+ |
| total_gold_mg | 누적 금 보유량 | 0~100+ |
| referral_count | 초대한 친구 수 | 0~50+ |
| is_phone_verified | 전화번호 인증 여부 | true/false |
| is_boosted | 5배 부스트 적용 | true/false |
| nudge_sent_count | Nudge 발송 횟수 | 0~100+ |
| nudge_success_count | Nudge 성공 횟수 | 0~100+ |

---

## 4. 퍼널 분석

### 4.1 온보딩 퍼널

```
서비스 소개 → 퀴즈 시작 → 퀴즈 완주 → 로그인 → 홈 도달
```

### 4.2 전환 퍼널

```
홈 도달 → 금 캐기 시작 → 첫 입금 → Lv.5 달성
```

### 4.3 바이럴 퍼널

```
초대 링크 복사 → 친구 가입 → 친구 첫 입금
```

### 4.4 Nudge 퍼널

```
Nudge 발송 → 친구 앱 진입 → 친구 금캐기 시작 → Nudge 성공
```
