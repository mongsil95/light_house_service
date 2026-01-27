import { Html, Section, Heading, Text, Img } from "@react-email/components";

interface VolunteerInfoRequestEmailProps {
  name: string; // 사용자 실명
  group_name: string;
  link: string; // 등록 링크 (토큰 포함)
}

export function VolunteerInfoRequestEmail({
  name,
  group_name,
  link,
}: VolunteerInfoRequestEmailProps) {
  return (
    <Html>
      <Section
        style={{
          padding: "24px",
          fontFamily: "sans-serif",
          backgroundColor: "#f9fafb",
          color: "#1f2937",
        }}
      >
        <Img
          src="https://team.caresea.kr/logo/adb_logo.png"
          alt="Adopt-a-Beach Korea Logo"
          width="120"
          style={{ marginBottom: "24px" }}
        />

        <Heading
          style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px", color: "#dc2626" }}
        >
          자원봉사 필수정보 등록 요청
        </Heading>

        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
          안녕하세요, {group_name}의 {name}님.
        </Text>

        <Text style={{ fontSize: "14px", marginBottom: "16px" }}>
          자원봉사 확인서 발급 및 활동 인증을 위해 필수 정보를 등록해 주세요.
          <br />
          등록 항목: 성명, 생년월일, 1365 아이디, 1365 고유번호
        </Text>

        <Section style={{ margin: "24px 0" }}>
          <a
            href={link}
            style={{
              display: "inline-block",
              backgroundColor: "#10b981",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            자원봉사 정보 등록하기
          </a>
        </Section>

        <Section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <Img
            src="https://team.caresea.kr/logo/koem_logo.png"
            alt="해양환경공단"
            width="100"
            style={{ marginRight: "20px", display: "inline-block" }}
          />
          <Img
            src="https://team.caresea.kr/logo/itaseoul_logo.png"
            alt="이타서울"
            width="80"
            style={{ display: "inline-block" }}
          />
        </Section>

        <Text style={{ fontSize: "12px", color: "#6b7280", marginTop: "24px", lineHeight: "1.5" }}>
          ※ 본 메일은 반려해변 자원봉사 정보 등록 요청을 위해 발송되었습니다.
          <br />
          {/* ※ 문의: itaseoul@itaseoul.org */}
        </Text>
      </Section>
    </Html>
  );
}
