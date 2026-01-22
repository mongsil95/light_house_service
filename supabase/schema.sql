-- ============================================
-- 반려해변 라이트하우스 서비스 - 데이터베이스 스키마
-- /adopt-a-beach 관련 테이블
-- ============================================

-- 1. 기관 정보 테이블 (먼저 생성 - 다른 테이블에서 참조됨)
CREATE TABLE IF NOT EXISTS organizations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,  -- 영리기업, 비영리단체, 학교, 공공기관, 개인
  business_number VARCHAR(50),  -- 사업자등록번호 또는 고유번호
  representative_name VARCHAR(100),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 해변 정보 테이블
CREATE TABLE IF NOT EXISTS beaches (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  addr TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,  -- 시/도
  district VARCHAR(100),  -- 군/구
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status VARCHAR(50) DEFAULT 'available',  -- available, adopted
  adopted_by BIGINT REFERENCES organizations(id),
  adopted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 자료 게시판 테이블 (resources)
CREATE TABLE IF NOT EXISTS resources (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  subtitle TEXT,  -- 소제목
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,  -- 가이드, 공지, FAQ, 시설
  author VARCHAR(100) DEFAULT '운영팀',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'published',  -- draft, published, archived
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3-1. 전문가 정보 테이블
CREATE TABLE IF NOT EXISTS experts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  organization VARCHAR(255),
  role VARCHAR(100) DEFAULT '전문가',
  description TEXT,
  email VARCHAR(255),
  specialty TEXT[],  -- 전문 분야 배열
  profile_image VARCHAR(500),  -- 프로필 이미지 URL
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,  -- 표시 순서
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 전문가 Q&A 테이블
CREATE TABLE IF NOT EXISTS qna (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),  -- 입양절차, 활동계획, 기금납부, 기타
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255),
  author_phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending',  -- pending, answered, closed
  views INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  attachment_urls TEXT[],  -- 첨부 파일 URL 배열
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 반려해변 입양 신청서 테이블
CREATE TABLE IF NOT EXISTS adoption_applications (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT REFERENCES organizations(id),
  beach_id BIGINT REFERENCES beaches(id),
  
  -- 신청 정보
  status VARCHAR(50) DEFAULT 'pending',  -- pending, approved, rejected
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 기관 정보
  org_name VARCHAR(255) NOT NULL,
  org_type VARCHAR(50) NOT NULL,
  org_business_number VARCHAR(50),
  org_representative VARCHAR(100),
  org_phone VARCHAR(20),
  org_email VARCHAR(255),
  org_address TEXT,
  
  -- 담당자 정보
  manager_name VARCHAR(100),
  manager_position VARCHAR(100),
  manager_phone VARCHAR(20),
  manager_email VARCHAR(255),
  
  -- 활동 계획
  activity_plan TEXT,
  activity_frequency VARCHAR(100),  -- 연 2회 이상
  expected_participants INTEGER,
  special_notes TEXT,
  
  -- 기금 납부 정보
  fund_amount DECIMAL(10, 2) DEFAULT 3000000,  -- 권장 300만원
  fund_paid BOOLEAN DEFAULT FALSE,
  fund_paid_at TIMESTAMP WITH TIME ZONE,
  receipt_issued BOOLEAN DEFAULT FALSE,
  
  -- 심사 정보
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 첨부파일 테이블
CREATE TABLE IF NOT EXISTS attachments (
  id BIGSERIAL PRIMARY KEY,
  resource_id BIGINT REFERENCES resources(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size VARCHAR(50),
  file_url TEXT NOT NULL,
  file_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Q&A 답변 테이블
CREATE TABLE IF NOT EXISTS qna_answers (
  id BIGSERIAL PRIMARY KEY,
  qna_id BIGINT REFERENCES qna(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  answerer_name VARCHAR(100) DEFAULT '전문가',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 댓글 테이블 (resources, qna 공용)
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  resource_id BIGINT REFERENCES resources(id) ON DELETE CASCADE,
  qna_id BIGINT REFERENCES qna(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  parent_comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,  -- 대댓글용
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_reference CHECK (
    (resource_id IS NOT NULL AND qna_id IS NULL) OR
    (resource_id IS NULL AND qna_id IS NOT NULL)
  )
);

-- 9. 문의 테이블 (일반 문의)
CREATE TABLE IF NOT EXISTS inquiries (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  organization VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',  -- pending, in_progress, completed
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 인덱스 생성
-- ============================================

-- beaches 테이블 인덱스
CREATE INDEX idx_beaches_status ON beaches(status);
CREATE INDEX idx_beaches_city ON beaches(city);
CREATE INDEX idx_beaches_district ON beaches(district);
CREATE INDEX idx_beaches_coords ON beaches(latitude, longitude);

-- adoption_applications 테이블 인덱스
CREATE INDEX idx_adoption_status ON adoption_applications(status);
CREATE INDEX idx_adoption_org ON adoption_applications(organization_id);
CREATE INDEX idx_adoption_beach ON adoption_applications(beach_id);
CREATE INDEX idx_adoption_date ON adoption_applications(application_date DESC);

-- resources 테이블 인덱스
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_published ON resources(published_at DESC);

-- qna 테이블 인덱스
CREATE INDEX idx_qna_status ON qna(status);
CREATE INDEX idx_qna_category ON qna(category);
CREATE INDEX idx_qna_created ON qna(created_at DESC);

-- inquiries 테이블 인덱스
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- ============================================
-- RLS (Row Level Security) 설정
-- ============================================

-- resources 테이블 RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable by everyone"
  ON resources FOR SELECT
  USING (status = 'published');

CREATE POLICY "Resources are insertable by authenticated users"
  ON resources FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- qna 테이블 RLS
ALTER TABLE qna ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public QnA are viewable by everyone"
  ON qna FOR SELECT
  USING (is_public = true);

CREATE POLICY "Anyone can submit QnA"
  ON qna FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update QnA"
  ON qna FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete QnA"
  ON qna FOR DELETE
  USING (true);

-- inquiries 테이블 RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Storage 버킷 및 정책 설정
-- ============================================

-- public-files 버킷 생성 (이미 존재할 경우 무시)
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-files', 'public-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS 정책 설정
-- 1. 누구나 파일 업로드 가능
CREATE POLICY "Anyone can upload files to public-files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'public-files');

-- 2. 누구나 파일 다운로드 가능
CREATE POLICY "Anyone can download files from public-files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public-files');

-- 3. 파일 소유자만 삭제 가능 (선택 사항)
CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'public-files');

-- ============================================
-- 샘플 데이터 삽입
-- ============================================

-- 샘플 자료 게시판 데이터
INSERT INTO resources (title, content, category, author, views, likes, published_at) VALUES
('반려해변이란? - 해변이 우리를 기다려요!', '반려해변 입양이란?\n\n반려해변은 기업, 단체, 학교 등 기관이 특정 해변을 ''입양''하여 지속적으로 관리하고 보호하는 프로그램입니다...', '가이드', '운영팀', 1234, 42, NOW()),
('2025년 반려해변 입양 기관 명단', '2025년 반려해변 입양에 참여해 주신 모든 기관에 감사드립니다...', '공지', '관리자', 2341, 89, NOW()),
('2025년 반려해변 운영 계획 안내', '2025년 반려해변 운영 계획을 안내드립니다...', '공지', '운영팀', 3452, 156, NOW());

-- 샘플 첨부파일 데이터
INSERT INTO attachments (resource_id, file_name, file_size, file_url) VALUES
(1, '2025 반려해변 입양기관 기본안내서.pdf', '24.4MB', '/file/1. 2025 반려해변 입양기관 기본안내서.pdf');

-- ============================================
-- 함수 및 트리거
-- ============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 모든 테이블에 updated_at 트리거 적용
CREATE TRIGGER update_beaches_updated_at BEFORE UPDATE ON beaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adoption_applications_updated_at BEFORE UPDATE ON adoption_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qna_updated_at BEFORE UPDATE ON qna
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- views 자동 증가 함수
CREATE OR REPLACE FUNCTION increment_views()
RETURNS TRIGGER AS $$
BEGIN
  NEW.views = OLD.views + 1;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 마이그레이션: attachment_urls 컬럼 추가
-- ============================================
-- 기존 qna 테이블에 attachment_urls 컬럼이 없는 경우 추가
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'qna' AND column_name = 'attachment_urls'
  ) THEN
    ALTER TABLE qna ADD COLUMN attachment_urls TEXT[];
  END IF;
END $$;

-- ============================================
-- 검색 기록 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS search_history (
  id BIGSERIAL PRIMARY KEY,
  query VARCHAR(500) NOT NULL,
  result_count INTEGER DEFAULT 0,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 검색 기록 인덱스
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
CREATE INDEX IF NOT EXISTS idx_search_history_created ON search_history(created_at DESC);

-- ============================================
-- 배너 광고 문의 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS banner_inquiries (
  id BIGSERIAL PRIMARY KEY,
  organization VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',  -- pending, contacted, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 배너 문의 인덱스
CREATE INDEX IF NOT EXISTS idx_banner_inquiries_status ON banner_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_banner_inquiries_created ON banner_inquiries(created_at DESC);

-- 배너 문의 updated_at 트리거
CREATE TRIGGER update_banner_inquiries_updated_at BEFORE UPDATE ON banner_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
