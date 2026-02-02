# 코딩 스타일 규칙

모든 개발 관련 에이전트가 따르는 코딩 컨벤션

## 핵심 원칙

### 1. Immutability (불변성)

객체를 직접 변경하지 말고, 새 객체를 생성합니다.

```typescript
// ❌ 잘못된 예
function updateUser(user, name) {
  user.name = name  // 직접 변경!
  return user
}

// ✅ 올바른 예
function updateUser(user, name) {
  return { ...user, name }  // 새 객체 반환
}
```

### 2. 명확한 네이밍

```typescript
// ❌ 잘못된 예
const d = new Date()
const fn = (x) => x * 2

// ✅ 올바른 예
const currentDate = new Date()
const doubleNumber = (number) => number * 2
```

### 3. 단일 책임

하나의 함수/컴포넌트는 하나의 역할만

```typescript
// ❌ 잘못된 예: 여러 역할
function processUser(user) {
  // 검증도 하고
  // 저장도 하고
  // 이메일도 보내고...
}

// ✅ 올바른 예: 역할 분리
function validateUser(user) { /* 검증만 */ }
function saveUser(user) { /* 저장만 */ }
function sendWelcomeEmail(user) { /* 이메일만 */ }
```

---

## 파일 구조

| 항목 | 권장 | 최대 |
|------|------|------|
| 파일 크기 | 200-400줄 | 800줄 |
| 함수 크기 | 30줄 이하 | 50줄 |
| 중첩 깊이 | 2-3레벨 | 4레벨 |

```
넘어가면 → 분리!
```

---

## 에러 처리

### 기본 패턴

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  // 1. 로깅 (개발자용)
  console.error('Operation failed:', error)

  // 2. 사용자 친화적 에러 던지기
  throw new Error('작업을 완료할 수 없습니다. 다시 시도해주세요.')
}
```

### 커스텀 에러

```typescript
class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource}을(를) 찾을 수 없습니다.`)
    this.name = 'NotFoundError'
  }
}
```

---

## 유효성 검증

Zod 사용 권장:

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  name: z.string().min(2, '이름은 2글자 이상이어야 합니다'),
  age: z.number().int().min(0).max(150).optional()
})

type User = z.infer<typeof UserSchema>

// 사용
const user = UserSchema.parse(input)  // 실패 시 에러
const result = UserSchema.safeParse(input)  // 실패 시 { success: false, error }
```

---

## TypeScript

### 타입 정의

```typescript
// ✅ interface: 객체 구조
interface User {
  id: string
  name: string
  email: string
}

// ✅ type: 유니온, 복잡한 타입
type Status = 'pending' | 'active' | 'inactive'
type UserWithStatus = User & { status: Status }
```

### 제네릭 활용

```typescript
// API 응답 타입
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

// 사용
const response: ApiResponse<User> = await fetchUser(id)
```

---

## React/컴포넌트

### 컴포넌트 구조

```tsx
// 1. Props 타입 정의
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

// 2. 컴포넌트
export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles[variant]}
    >
      {label}
    </button>
  )
}
```

### 훅 사용

```tsx
// 커스텀 훅으로 로직 분리
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchUser(id)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [id])

  return { user, loading, error }
}
```

---

## 코드 품질 체크리스트

작업 완료 전 확인:

- [ ] 명확한 네이밍
- [ ] 함수 50줄 이하
- [ ] 파일 800줄 이하
- [ ] 중첩 4레벨 이하
- [ ] 에러 핸들링 완료
- [ ] `console.log` 제거 (디버깅용 제외)
- [ ] 하드코딩 값 상수화
- [ ] Immutability 패턴 사용
- [ ] 타입 any 사용 지양
- [ ] 주석은 "왜"를 설명 (무엇을 하는지는 코드가 설명)
