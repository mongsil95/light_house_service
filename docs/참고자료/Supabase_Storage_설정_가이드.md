# Supabase Storage 설정 가이드

## 문제 해결: Row-Level Security Policy 에러

QnA 파일 업로드 시 발생하는 `new row violates row-level security policy` 에러를 해결하는 방법입니다.

## 1. Supabase 대시보드에서 Storage 설정

### 1.1 버킷 생성

1. Supabase 대시보드 접속
2. 좌측 메뉴에서 **Storage** 선택
3. **New bucket** 클릭
4. 다음 정보 입력:
   - **Name**: `public-files`
   - **Public bucket**: ✅ 체크
5. **Create bucket** 클릭

### 1.2 Storage 정책 설정

#### 방법 1: SQL Editor 사용 (권장)

1. 좌측 메뉴에서 **SQL Editor** 선택
2. **New query** 클릭
3. 다음 SQL 실행:

```sql
-- 1. Storage 정책 활성화
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. 누구나 파일 업로드 가능
CREATE POLICY "Anyone can upload to public-files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'public-files');

-- 3. 누구나 파일 조회 가능
CREATE POLICY "Anyone can view public-files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'public-files');

-- 4. 누구나 파일 삭제 가능 (선택사항)
CREATE POLICY "Anyone can delete from public-files"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'public-files');

-- 5. 누구나 파일 업데이트 가능 (선택사항)
CREATE POLICY "Anyone can update public-files"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'public-files')
WITH CHECK (bucket_id = 'public-files');
```

#### 방법 2: Storage UI 사용

1. **Storage** → **public-files** 버킷 선택
2. **Policies** 탭 클릭
3. **New Policy** 클릭
4. **For full customization** 선택
5. 정책 추가:

**INSERT 정책:**

- Policy name: `Anyone can upload`
- Target roles: `public`
- USING expression: (비워둠)
- WITH CHECK expression: `bucket_id = 'public-files'`

**SELECT 정책:**

- Policy name: `Anyone can view`
- Target roles: `public`
- USING expression: `bucket_id = 'public-files'`

**DELETE 정책 (선택사항):**

- Policy name: `Anyone can delete`
- Target roles: `public`
- USING expression: `bucket_id = 'public-files'`

## 2. 설정 확인

### 2.1 Storage 정책 확인

```sql
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

### 2.2 버킷 확인

```sql
SELECT * FROM storage.buckets WHERE id = 'public-files';
```

## 3. 테스트

1. 앱에서 QnA 작성 페이지 접속: `/adopt-a-beach/expertsqna/ask`
2. 파일 첨부 후 질문 제출
3. 파일이 정상적으로 업로드되는지 확인

## 4. 보안 고려사항

### 현재 설정 (누구나 업로드 가능)

- 장점: 사용자 인증 없이 바로 사용 가능
- 단점: 스팸 파일 업로드 가능

### 보안 강화 옵션

#### Option 1: 파일 크기 제한

```sql
CREATE POLICY "File size limit 5MB"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'public-files'
  AND (storage.foldername(name))[1] = 'qna-attachments'
  AND octet_length(decode(encode(metadata->'size', 'escape'), 'escape')) < 5242880
);
```

#### Option 2: 파일 타입 제한

```sql
CREATE POLICY "Only allow specific file types"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'public-files'
  AND (
    lower((storage.extension(name))) IN ('jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'hwp')
  )
);
```

#### Option 3: 인증된 사용자만 업로드

```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Anyone can upload to public-files" ON storage.objects;

-- 새 정책 생성 (인증 필요)
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public-files');
```

## 5. 문제 해결

### 여전히 에러가 발생하는 경우

1. **정책 충돌 확인**

```sql
-- 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Anyone can upload to public-files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view public-files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from public-files" ON storage.objects;

-- 다시 생성
CREATE POLICY "Public upload access"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'public-files')
WITH CHECK (bucket_id = 'public-files');
```

2. **캐시 삭제**

- 브라우저 캐시 삭제
- 개발 서버 재시작

3. **Supabase 클라이언트 확인**

```typescript
// lib/supabase.ts에서 올바른 URL과 anon key 확인
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + "...");
```

## 6. 추가 참고자료

- [Supabase Storage 공식 문서](https://supabase.com/docs/guides/storage)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies 예제](https://supabase.com/docs/guides/storage/security/access-control)
