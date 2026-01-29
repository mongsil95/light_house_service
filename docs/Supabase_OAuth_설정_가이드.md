# Supabase Google OAuth 설정 가이드

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성 및 OAuth 클라이언트 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 또는 새 프로젝트 생성
3. 왼쪽 메뉴에서 **"API 및 서비스" > "사용자 인증 정보"** 선택
4. **"사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"** 클릭
5. 애플리케이션 유형: **웹 애플리케이션** 선택
6. 이름: `등대지기 관리자` (또는 원하는 이름)
7. **승인된 자바스크립트 원본** 추가:
   ```
   http://localhost:3000
   https://your-production-domain.com
   ```
8. **승인된 리디렉션 URI** 추가:

   ```
   https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback
   ```

   > 💡 `<YOUR_SUPABASE_PROJECT_REF>`는 Supabase 프로젝트 설정에서 확인 가능

9. **만들기** 클릭
10. 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사 (나중에 사용)

### 1.2 OAuth 동의 화면 구성

1. **"API 및 서비스" > "OAuth 동의 화면"** 선택
2. User Type: **외부** 선택 (또는 조직 내부용이면 **내부**)
3. 앱 정보:
   - 앱 이름: `등대지기 관리`
   - 사용자 지원 이메일: 관리자 이메일
   - 앱 로고: (선택사항)
4. 범위: 기본 범위만 사용 (email, profile)
5. 테스트 사용자 추가 (개발 중일 경우):
   - 관리자 이메일 주소 추가

---

## 2. Supabase 설정

### 2.1 Authentication Providers 설정

1. [Supabase Dashboard](https://app.supabase.com/) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **"Authentication" > "Providers"** 선택
4. **Google** 찾아서 활성화
5. Google OAuth 설정:
   - **Client ID**: Google Cloud Console에서 복사한 클라이언트 ID 입력
   - **Client Secret**: Google Cloud Console에서 복사한 클라이언트 보안 비밀번호 입력
6. **Save** 클릭

### 2.2 Site URL 설정

1. **"Authentication" > "URL Configuration"** 선택
2. **Site URL** 설정:
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://your-production-domain.com`
3. **Redirect URLs** 추가:
   ```
   http://localhost:3000/**
   https://your-production-domain.com/**
   ```

### 2.3 Email Auth 설정 (선택사항)

1. **"Authentication" > "Providers"** > **Email**
2. 필요시 이메일 인증 활성화/비활성화

---

## 3. 환경변수 설정

프로젝트의 `.env.local` 파일에 다음 환경변수가 설정되어 있는지 확인:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
```

> 이 값들은 Supabase Dashboard > **Settings** > **API**에서 확인 가능

---

## 4. 필수 패키지 설치

터미널에서 다음 명령어 실행:

```bash
npm install @supabase/ssr @supabase/supabase-js
```

또는

```bash
yarn add @supabase/ssr @supabase/supabase-js
```

> 💡 `@supabase/ssr`은 Next.js App Router를 위한 최신 Supabase 패키지입니다.

---

## 5. 관리자 계정 설정

### 5.1 첫 번째 관리자 계정 생성

1. Google OAuth가 활성화된 후, 브라우저에서 `/admin/login` 접속
2. **Google로 로그인** 버튼 클릭
3. Google 계정으로 로그인

### 5.2 관리자 권한 부여 (선택사항)

특정 이메일만 관리자로 제한하려면:

1. Supabase에 `admin_users` 테이블 생성:

   ```sql
   CREATE TABLE admin_users (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );
   ```

2. 관리자 이메일 추가:

   ```sql
   INSERT INTO admin_users (id, email)
   SELECT id, email FROM auth.users
   WHERE email = 'your-admin@example.com';
   ```

3. `middleware.ts`를 수정하여 admin_users 테이블 확인 (필요시)

---

## 6. 테스트

### 6.1 로그인 테스트

1. 브라우저에서 `http://localhost:3000/admin/login` 접속
2. **Google로 로그인** 버튼 클릭
3. Google 계정 선택 및 권한 승인
4. `/admin` 페이지로 리디렉트되는지 확인

### 6.2 보호된 경로 테스트

1. 로그아웃 상태에서 `/admin` 접속 시도
2. `/admin/login`으로 리디렉트되는지 확인

### 6.3 로그아웃 테스트

1. 관리자 페이지에서 **로그아웃** 버튼 클릭
2. 로그인 페이지로 이동하는지 확인

---

## 7. 프로덕션 배포 시 체크리스트

- [ ] Google Cloud Console에서 프로덕션 도메인을 승인된 자바스크립트 원본에 추가
- [ ] Google Cloud Console에서 프로덕션 리디렉션 URI 추가
- [ ] Supabase Site URL을 프로덕션 도메인으로 업데이트
- [ ] Supabase Redirect URLs에 프로덕션 도메인 추가
- [ ] 환경변수 확인 (Vercel, Netlify 등 배포 플랫폼)
- [ ] OAuth 동의 화면을 게시 상태로 전환 (Google Cloud Console)

---

## 8. 문제 해결

### 에러: "redirect_uri_mismatch"

- Google Cloud Console의 리디렉션 URI가 정확한지 확인
- Supabase 프로젝트 REF가 올바른지 확인
- URI에 후행 슬래시(/)가 없는지 확인

### 에러: "Access blocked: This app's request is invalid"

- OAuth 동의 화면이 올바르게 구성되었는지 확인
- 테스트 사용자로 추가된 계정인지 확인 (게시되지 않은 앱의 경우)

### 로그인 후 리디렉션이 작동하지 않음

- Supabase Site URL이 올바른지 확인
- `middleware.ts`가 올바르게 설정되어 있는지 확인

---

## 9. 참고 자료

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 가이드](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
