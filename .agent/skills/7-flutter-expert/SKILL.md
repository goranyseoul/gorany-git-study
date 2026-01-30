---
name: flutter-expert
description: Flutter 앱 개발 전문가. Clean Architecture, BLoC, Material 3, 테스트 가이드라인.
allowed-tools: Read, Write, Edit, Glob, Grep
author: troll
modified_by: troll
created: 2026-01-26
modified: 2026-01-30
---

# Flutter Expert

> Flutter 앱 개발을 위한 베스트 프랙티스와 패턴.

---

## 1. Best Practices

| 원칙 | 설명 |
|------|------|
| Clean Architecture | BLoC 패턴으로 구현 |
| Flutter 3.x | Material 3 디자인 사용 |
| 상태 관리 | BLoC/Cubit 권장 |
| 의존성 주입 | GetIt 사용 |
| 에러 처리 | Either 타입 활용 |
| 라우팅 | GoRouter 사용 |
| 지역화 | l10n 기법 적용 |

---

## 2. Project Structure

```
lib/
  core/
    constants/      # 앱 상수
    theme/          # 테마 정의
    utils/          # 유틸리티
    widgets/        # 공통 위젯
  features/
    feature_name/
      data/
        datasources/
        models/
        repositories/
      domain/
        entities/
        repositories/
        usecases/
      presentation/
        bloc/
        pages/
        widgets/
  l10n/             # 다국어 지원
  main.dart
test/
  unit/
  widget/
  integration/
```

---

## 3. Coding Guidelines

| 번호 | 가이드라인 |
|------|-----------|
| 1 | Null safety 철저히 적용 |
| 2 | Either 타입으로 에러 처리 |
| 3 | 적절한 네이밍 컨벤션 |
| 4 | 위젯 컴포지션 활용 |
| 5 | GoRouter로 라우팅 |
| 6 | 폼 유효성 검사 |
| 7 | BLoC으로 상태 관리 |
| 8 | GetIt으로 의존성 주입 |
| 9 | 에셋 관리 체계화 |
| 10 | 테스트 습관화 |

---

## 4. Widget Guidelines

| 원칙 | 설명 |
|------|------|
| 작은 위젯 | 위젯은 작고 집중적으로 |
| const 생성자 | 가능하면 const 사용 |
| 위젯 키 | 적절한 Key 사용 |
| 레이아웃 원칙 | 올바른 레이아웃 구조 |
| 생명주기 | 적절한 lifecycle 메서드 |
| 에러 경계 | Error boundary 구현 |
| 성능 최적화 | 불필요한 rebuild 방지 |
| 접근성 | Accessibility 고려 |

---

## 5. State Management (BLoC)

### BLoC vs Cubit

| 선택 | 사용 시점 |
|------|----------|
| **Cubit** | 단순 상태, 이벤트 불필요 |
| **BLoC** | 복잡한 상태, 이벤트 기반 |

### BLoC 구조

```dart
// Event
abstract class UserEvent {}
class LoadUser extends UserEvent {}

// State
abstract class UserState {}
class UserInitial extends UserState {}
class UserLoaded extends UserState { final User user; }

// BLoC
class UserBloc extends Bloc<UserEvent, UserState> {
  UserBloc() : super(UserInitial());
}
```

---

## 6. Performance Guidelines

| 영역 | 최적화 방법 |
|------|------------|
| 이미지 | 적절한 캐싱 사용 |
| ListView | ListView.builder 사용 |
| Build | 불필요한 rebuild 방지 |
| 상태 | 세분화된 상태 관리 |
| 메모리 | 적절한 dispose 처리 |
| 네이티브 | 필요시 Platform Channel |

---

## 7. Testing Guidelines

| 레벨 | 테스트 대상 |
|------|------------|
| Unit | 비즈니스 로직 |
| Widget | UI 컴포넌트 |
| Integration | 기능 전체 흐름 |

### 테스트 원칙

- 적절한 모킹 전략 (Mockito)
- 테스트 커버리지 도구 활용
- 일관된 테스트 네이밍
- CI/CD 파이프라인 통합

---

## 8. 의존성 주입 (GetIt)

```dart
// service_locator.dart
final getIt = GetIt.instance;

void setupLocator() {
  // Services
  getIt.registerLazySingleton<ApiService>(() => ApiServiceImpl());
  
  // Repositories
  getIt.registerLazySingleton<UserRepository>(
    () => UserRepositoryImpl(getIt<ApiService>())
  );
  
  // BLoCs
  getIt.registerFactory<UserBloc>(
    () => UserBloc(getIt<UserRepository>())
  );
}
```

---

## 9. 라우팅 (GoRouter)

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomePage(),
    ),
    GoRoute(
      path: '/user/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return UserPage(id: id);
      },
    ),
  ],
);
```

---

## 10. Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| 거대한 위젯 | 작은 위젯으로 분리 |
| setState 남발 | BLoC/Cubit 사용 |
| 하드코딩 문자열 | l10n 사용 |
| 무분별한 StatefulWidget | 필요할 때만 사용 |
| build 내 무거운 연산 | 외부로 분리 |

---

> **Remember:** Flutter는 선언적 UI 프레임워크. 상태가 변하면 UI가 자동으로 반영됨을 활용하세요.
