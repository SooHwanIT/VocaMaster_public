# 추가 보안 취약점 수정 내역 (2차)

## 📋 수정된 보안 이슈 (5가지)

### **1. 🔴 메모리에 비밀번호 저장** ✅ 수정됨
- **문제**: `pendingSignupPassword` 상태에 평문 비밀번호 저장
- **위험성**: XSS 공격 시 메모리에서 비밀번호 노출 가능
- **수정사항**:
  - `pendingSignupPassword` 상태 제거
  - 이메일 인증 후 다시 비밀번호 입력 요구
  - 서명 단계에서 비밀번호는 더 이상 저장하지 않음

### **2. 🟡 프로덕션 환경에서 디버그 로깅** ✅ 수정됨
- **문제**: console.log/error가 프로덕션 빌드에 포함됨
- **위험성**: 민감한 기술 정보, 오류 스택 트레이스 노출
- **수정파일**:
  - `src/components/WriteQuizUI.tsx`
  - `src/components/SettingsView.tsx`
  - `src/components/PlayerView.tsx`
  - `src/components/AuthGate.tsx`
- **수정사항**:
  ```typescript
  // Before
  console.error('Error:', error);
  
  // After
  if (import.meta.env.DEV) {
    console.error('Error:', error);
  }
  ```

### **3. 🟡 localStorage JSON 타입 검증 미흡** ✅ 수정됨
- **문제**: `JSON.parse()` 후 `as QuizSessionSnapshot` 같은 타입 캐스팅
- **위험성**: 손상된 localStorage 데이터로 런타임 에러, 보안 문제
- **수정사항** (src/app/storage.ts):
  ```typescript
  // 안전한 JSON 파싱
  const safeJsonParse = <T = unknown>(json: string | null, fallback: T): T => {
    if (!json) return fallback;
    try {
      return JSON.parse(json) as T;
    } catch {
      return fallback;
    }
  };
  
  // 타입 검증 추가
  if (parsed && typeof parsed === 'object' && 
      'sensitivity' in parsed && 'autoStart' in parsed && 'deviceId' in parsed) {
    return parsed as MicSettings;
  }
  ```

### **4. 🟡 비밀번호 정책 불일치** ✅ 수정됨
- **문제**: 
  - validation.ts: 6자 이상
  - AuthGate.tsx: 8자 + 영문 + 숫자
  - 혼란 야기
- **수정사항** (src/lib/validation.ts):
  ```typescript
  // 통일된 검증 (8자 + 영문 + 숫자)
  export const validatePassword = (password: string): string => {
    if (password.length < 8) {
      throw new Error('비밀번호는 최소 8글자 이상이어야 합니다.');
    }
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      throw new Error('비밀번호는 영문과 숫자를 각각 1개 이상 포함해야 합니다.');
    }
    return password;
  };
  ```

### **5. 🔴 사용자 열거 공격 (User Enumeration)** ✅ 수정됨
- **문제**: "email not confirmed" 같은 내용별 에러로 가입자 유무 파악 가능
- **위험성**: 공격자가 유효한 이메일 목록을 수집 가능
- **수정사항** (src/components/AuthGate.tsx):
  ```typescript
  // Before
  if (message.toLowerCase().includes('email not confirmed')) {
    setErrorMessage('아직 이메일 인증이 완료되지 않았습니다...');
  } else {
    setErrorMessage(message);  // 원본 에러 메시지 노출
  }
  
  // After
  // 모든 인증 실패에 동일한 일반 메시지 사용
  setErrorMessage(
    '로그인 실패했습니다. 이메일과 비밀번호를 다시 확인된 중 ' +
    '일부 실패가 나타난다면 비밀번호 재설정을 시도해두세요.'
  );
  
  // 개발 환경에서만 상세 정보 로깅
  if (import.meta.env.DEV) {
    console.debug('[Auth] Verification failed:', message);
  }
  ```

---

## 📁 생성/수정된 파일

### 신규 헬퍼 함수 (src/lib/validation.ts)
```typescript
// 개발 환경만 로깅
export const isDevelopmentMode = (): boolean => import.meta.env.DEV;
export const secureLog = (category: string, message: string, data?: unknown) => { ... };
export const secureError = (category: string, message: string, error?: unknown) => { ... };
```

### 수정 파일 목록
1. **src/components/AuthGate.tsx**
   - `pendingSignupPassword` 상태 제거
   - 에러 메시지 일반화
   - 개발 환경만 로깅

2. **src/lib/validation.ts**
   - 비밀번호 정책 통일 (8자 + 영문 + 숫자)
   - 보안 헬퍼 함수 추가

3. **src/app/storage.ts**
   - `safeJsonParse()` 함수 추가
   - 깊은 타입 검증 추가

4. **src/components/WriteQuizUI.tsx**
   - 5개 console.log/error → 개발 환경만 사용

5. **src/components/SettingsView.tsx**
   - 4개 console.log/error → 개발 환경만 사용

6. **src/components/PlayerView.tsx**
   - 1개 console.error → 개발 환경만 사용

---

## 🛡️ 추가 보안 권장사항

### 다른 파일도 확인하세요
- `src/hooks/useUserLevel.ts` - XP 시스템 로직
- `src/components/QuizSessionManager.tsx` - 세션 관리
- 기타 컴포넌트의 console 로깅

### Supabase RLS 정책 재확인
```sql
-- 다음 정책들이 올바르게 설정되었는지 확인
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_attempt_logs ENABLE ROW LEVEL SECURITY;
```

### 환경변수 보안
```bash
# .env.local (git에 커밋 금지)
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...

# .env.example (공개)
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 빌드 검사
```bash
# 프로덕션 빌드에서 민감한 정보가 없는지 확인
npm run build
grep -r "console.log\|console.error" dist/

# 정상: 아무것도 출력되지 않음
```

---

## ✅ 체크리스트

- [x] 비밀번호 메모리 저장 제거
- [x] 프로덕션 로깅 제거
- [x] localStorage 타입 안전성 강화
- [x] 비밀번호 정책 통일
- [x] 사용자 열거 공격 방어
- [x] 개발 환경만 디버그 로깅
- [x] import.meta.env 사용 (Vite)
- [ ] 다른 파일들도 검수 필요
- [ ] 보안 감사 (외부 전문가)
- [ ] 침투 테스트

---

## 📝 주의사항

### Vite 환경 변수
이 프로젝트는 **Vite** 기반이므로:
- ❌ `process.env.NODE_ENV` 사용 불가
- ✅ `import.meta.env.DEV` 또는 `import.meta.env.MODE` 사용

### 클라이언트 vs 서버 검증
- **클라이언트**: UX 개선, 기본 검증
- **서버**: 필수, 악의적 요청 완전 차단
- 항상 서버 검증을 신뢰하세요!

### 성능 고려사항
- `safeJsonParse()`: 오버헤드 미미
- 개발 환경 로깅: 프로덕션에서 제거됨
- RLS 정책: 데이터베이스 수준 보호

---

## 🔗 참고 자료

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [OWASP: User Enumeration](https://owasp.org/www-community/attacks/User_Enumeration)
- [MDN: Web Storage Security](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Supabase Security](https://supabase.com/docs/guides/security)
