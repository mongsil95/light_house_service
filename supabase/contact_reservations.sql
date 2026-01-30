


-- 기존 테이블이 있는 경우 컬럼 추가 (테이블이 이미 존재할 때 사용)
-- 아래 SQL을 Supabase SQL Editor에서 실행하세요

ALTER TABLE contact_reservations ADD COLUMN IF NOT EXISTS lighthouse_contact_name TEXT;
ALTER TABLE contact_reservations ADD COLUMN IF NOT EXISTS lighthouse_contact_email TEXT;
ALTER TABLE contact_reservations ADD COLUMN IF NOT EXISTS rescheduled_date TEXT;
ALTER TABLE contact_reservations ADD COLUMN IF NOT EXISTS rescheduled_time TEXT;
ALTER TABLE contact_reservations ADD COLUMN IF NOT EXISTS rescheduled_reason TEXT;
ALTER TABLE contact_reservations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE contact_reservations ADD COLUMN IF NOT EXISTS rejected_reason TEXT;
ALTER TABLE contact_reservations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 업데이트 시간 자동 갱신 함수 (아직 없는 경우)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성: 업데이트 시 updated_at 자동 갱신
DROP TRIGGER IF EXISTS update_contact_reservations_updated_at ON contact_reservations;
CREATE TRIGGER update_contact_reservations_updated_at BEFORE UPDATE ON contact_reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

