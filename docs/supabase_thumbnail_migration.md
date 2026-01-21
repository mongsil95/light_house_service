# Resources 테이블에 썸네일 컬럼 추가

Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- resources 테이블에 thumbnail_url 컬럼 추가
ALTER TABLE resources
ADD COLUMN thumbnail_url TEXT;

-- Storage bucket 생성 (이미 없다면)
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책 설정 (누구나 읽기 가능)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

-- Storage 정책 설정 (인증된 사용자만 업로드 가능)
CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thumbnails');

-- Storage 정책 설정 (인증된 사용자만 삭제 가능)
CREATE POLICY "Authenticated users can delete thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'thumbnails');
```

실행 후 확인:

1. Supabase Dashboard → Table Editor → resources → 새로운 `thumbnail_url` 컬럼 확인
2. Supabase Dashboard → Storage → `thumbnails` 버킷 확인
