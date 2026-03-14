# 보안 취약점 수정 내역

## 📋 수정된 보안 이슈

### 🔴 주요 취약점 (CRITICAL)

#### 1. **Row-Level Security (RLS) 미흡** ✅ 수정됨
- **문제**: `getUserProgress()` 함수에서 현재 사용자 필터링 없음
- **위험성**: 다른 사용자의 진도 데이터에 접근 가능
- **수정사항**: 
  ```typescript
  .eq('user_id', userId)  // 추가됨
  .order('created_at', { ascending: false });
  ```

#### 2. **입력값 검증 부재** ✅ 수정됨
- **문제**: 닉네임, 자기소개, 단어 ID 등에 대한 검증 없음
- **위험성**: XSS, SQL Injection 공격 가능성, 데이터 무결성 문제
- **수정사항**:
  - `validateNickname()`: 길이 2-50자 검증
  - `validateBio()`: 길이 0-500자 검증
  - `validateWordId()`: 형식 및 길이 검증
  - `validateEmail()`: 이메일 형식 검증
  - `validatePassword()`: 비밀번호 길이 검증

#### 3. **타입 안전성 미흡** ✅ 수정됨
- **문제**: `data.map((row: any)` - 안전하지 않은 타입 캐스팅
- **위험성**: 예상치 못한 데이터로 인한 런타임 에러
- **수정사항**:
  ```typescript
  const validateWrongWordStatRow = (row: any): ValidatedWrongWordStat | null
  ```
  - 모든 필드 타입 검증
  - null 값 필터링

#### 4. **데이터 검증 미흡** ✅ 수정됨
- **문제**: `logWordAttempt()` 입력값 유효성 체크 없음
- **위험성**: 잘못된 데이터가 DB에 저장될 수 있음
- **수정사항**: 모든 입력값을 `validateWordAttempt()`로 검증

#### 5. **XP 조작 가능성** ✅ 수정됨
- **문제**: XP 양에 대한 합리성 검증 없음
- **위험성**: 클라이언트에서 XP를 조작하여 서버에 보낼 수 있음
- **수정사항**:
  ```typescript
  const validateXPAmount = (xp: number, reason: string): number => {
    const MAX_XP_PER_REASON = {
      'word_correct': 50,
      'word_mastered': 100,
    };
    if (xp > maxAllowed) throw new Error('이상한 XP 양');
  }
  ```

---

### 🟡 중간 수준 취약점 (MEDIUM)

#### 6. **Boolean 타입 검증** ✅ 수정됨
- **문제**: `isCorrect`, `isMastered` 등이 검증 없이 사용됨
- **수정사항**: `Boolean(value)` 명시적 변환

---

## 📁 생성/수정된 파일

### 신규 파일
- **`src/lib/validation.ts`** - 중앙 집중식 입력값 검증 유틸리티
  - `validateNickname()`, `validateBio()`, `validateWordId()`
  - `validateEmail()`, `validatePassword()`
  - `validateXPAmount()`, `validateQuizMode()`
  - `validateWrongWordStatRow()` 등

### 수정 파일
1. **`src/lib/userDb.ts`**
   - `getUserProgress()`: 사용자 필터링 추가
   - `upsertWordProgress()`: 입력값 검증 추가
   - `addXP()`: XP 양 검증 추가
   - `upsertProfile()`: 닉네임, 자기소개 검증 추가

2. **`src/lib/auth.ts`**
   - `signIn()`, `signUp()`: 이메일, 비밀번호 검증 추가
   - `requestPasswordReset()`: 이메일 검증 추가

3. **`src/db.ts`**
   - `logWordAttempt()`: 전체 입력값 검증 추가
   - `getWrongWordStats()`: 안전한 타입 캐스팅으로 변경

---

## 🛡️ 보안 권장사항

### 서버 측 (Supabase)에서 추가로 구현해야 할 사항

#### 1. **Row-Level Security (RLS) 정책**
```sql
-- user_progress 테이블
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_progress_policy ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- word_bookmarks 테이블
ALTER TABLE word_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookmark_policy ON word_bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- word_attempt_logs 테이블
ALTER TABLE word_attempt_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY attempt_logs_policy ON word_attempt_logs
  FOR ALL USING (auth.uid() = user_id);
```

#### 2. **RPC 함수 검증** (add_xp)
```sql
-- add_xp RPC 함수에서 다음 검증 추가:
-- 1. 사용자가 로그인 상태인지 확인
-- 2. XP 양이 합리적인 범위인지 확인
-- 3. word_id가 실제로 존재하는 단어인지 확인
-- 4. 중복 요청(idempotency) 처리
```

#### 3. **Rate Limiting**
- 각 사용자당 API 요청 빈도 제한
- 특히 `addXP()`, `logWordAttempt()` 함수에 대한 제한
- Supabase 함수에서 구현 권장

#### 4. **감사 로그 (Audit Log)**
```sql
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. **데이터 무결성 검증**
- 삭제되지 않은 단어에만 진도 기록 가능
- 중복 진도 기록 방지
- 유효한 데이터셋 범위 확인

---

## ✅ 체크리스트

- [x] 사용자 데이터 격리 (RLS)
- [x] 입력값 검증
- [x] 타입 안전성
- [x] XP 조작 방지 (클라이언트 측)
- [x] 인증 검증
- [ ] 서버 측 RLS 정책 설정 (Supabase console에서 직접 설정 필요)
- [ ] Rate Limiting 구현
- [ ] 감사 로그 구현
- [ ] HTTPS 강제
- [ ] CORS 설정 검토
- [ ] 환경변수 탈취 방지

---

## 📝 주의사항

### 중요: 서버 측 검증 필수
클라이언트 측 검증은 UX 향상이 주 목적입니다. **악의적인 사용자는 항상 이를 우회할 수 있습니다.**
따라서 서버 측 (Supabase RPC, 데이터베이스 정책)에서 반드시 검증을 다시 수행해야 합니다.

### 환경변수 보안
`.env` 파일이 git에 커밋되지 않도록 주의하세요.
```bash
git status  # .env가 무시되는지 확인
```

### 성능 영향
입력값 검증으로 인한 성능 저하는 미미합니다.
우려되는 경우 프로파일링으로 확인하세요.

---

## 📚 참고 자료

- [Supabase Security Documentation](https://supabase.com/docs/guides/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [TypeScript Security Best Practices](https://www.typescriptlang.org/)
