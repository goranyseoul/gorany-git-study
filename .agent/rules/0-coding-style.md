---
trigger: always_on
author: troll
created: 2026-01-30
---

# Rule: 코딩 스타일

## 적용 범위
모든 개발 관련 에이전트

---

## Immutability (필수)

객체 변경 금지, 새 객체 생성:

```javascript
// ❌ 잘못된 예
function updateUser(user, name) {
  user.name = name  // 변경!
  return user
}

// ✅ 올바른 예
function updateUser(user, name) {
  return { ...user, name }
}
```

---

## 파일 구조

- **파일 크기**: 200-400줄 권장, 800줄 최대
- **함수 크기**: 50줄 이하
- **중첩 깊이**: 4레벨 이하
- **구조**: 기능/도메인별로 구성

---

## 에러 처리

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('사용자 친화적 메시지')
}
```

---

## Input Validation

Zod 사용 권장:

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

---

## 코드 품질 체크리스트

- [ ] 읽기 쉽고 명확한 네이밍
- [ ] 함수 50줄 이하
- [ ] 파일 800줄 이하
- [ ] 중첩 4레벨 이하
- [ ] 에러 핸들링 완료
- [ ] console.log 제거
- [ ] 하드코딩 값 제거
- [ ] Immutability 패턴 사용
