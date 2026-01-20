# Supabase 환경변수 설정 가이드

## 필요한 환경변수

`.env.local` 파일에 다음 변수들을 추가하세요:

```bash
# Supabase URL (프로젝트 설정 > API에서 확인)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anon Key (공개 키 - 클라이언트 사이드용)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (서버 사이드용 - RLS 우회)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend API Key (이메일 전송용)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# 사이트 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 1. Supabase 키 찾기

### 1.1 Supabase 대시보드 접속

1. [Supabase 대시보드](https://app.supabase.com) 접속
2. 프로젝트 선택

### 1.2 API 키 확인

1. 좌측 메뉴에서 **Settings** (⚙️) 선택
2. **API** 탭 선택
3. 다음 정보 복사:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **절대 공개하지 마세요!**

## 2. 환경변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 위 값들을 입력하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tyqnlllbnvkabdskobnh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...복사한키...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...복사한서비스롤키...
RESEND_API_KEY=re_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. 주의사항

### ⚠️ Service Role Key 보안

- **절대 Git에 커밋하지 마세요**
- `.gitignore`에 `.env.local`이 포함되어 있는지 확인
- 클라이언트 코드에서 직접 사용하지 마세요
- API 라우트 내부에서만 사용

### 환경변수 접두사 규칙

- `NEXT_PUBLIC_`: 브라우저에서 접근 가능 (공개 가능)
- 접두사 없음: 서버 사이드에서만 접근 가능 (비밀 키)

## 4. 서버 재시작

환경변수를 변경한 후에는 **반드시 개발 서버를 재시작**하세요:

```bash
# 서버 중지 (Ctrl+C)
# 서버 재시작
npm run dev
```

## 5. 확인

### 환경변수 로드 확인

```typescript
// 임시로 console.log 추가 (확인 후 삭제)
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Has Service Key:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
```

### API 라우트 테스트

1. QnA 질문 작성 페이지 접속: `/adopt-a-beach/expertsqna/ask`
2. 질문 제출
3. 성공 메시지 확인

## 6. 프로덕션 배포

### Vercel

1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. 모든 환경변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (예: `https://yourdomain.com`)

### 기타 호스팅

각 플랫폼의 환경변수 설정 방법을 참고하세요.

## 7. 문제 해결

### "Supabase client not initialized" 에러

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 환경변수 이름이 정확한지 확인
- 서버 재시작

### "Invalid API key" 에러

- Supabase 대시보드에서 키를 다시 확인
- 복사 시 공백이 포함되지 않았는지 확인

### RLS 에러

- `SUPABASE_SERVICE_ROLE_KEY`가 설정되어 있는지 확인
- API 라우트에서 `createClient()` 함수를 사용하는지 확인
