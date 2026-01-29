import { Column, Heading, Html, Img, Row, Section, Text } from "@react-email/components";

interface AdoptionGuide2026EmailProps {
  data: {
    organization: string;
    email: string;
  };
}

export function AdoptionGuide2026Email({ data }: AdoptionGuide2026EmailProps) {
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
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#00298a",
          }}
        >
          2026년 반려해변 사전 안내서
        </Heading>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          안녕하세요, <strong>{data.organization}</strong> 담당자님.
          <br />
          반려해변 등대지기입니다.
        </Text>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          2026년 반려해변 활동에 관심을 가져주셔서 진심으로 감사드립니다.
          <br />
          맑고 깨끗한 바다를 만들어가는 여정에 함께해 주셔서 기쁩니다.
        </Text>

        <Section style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }} />

        <Text
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "12px",
            color: "#000000",
          }}
        >
          📎 2026년 반려해변 사전 안내서
        </Text>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          첨부파일로 <strong>2026년 반려해변 사전 안내서</strong>를 보내드립니다.
          <br />
          입양 절차, 필수 활동 등 2026년 반려해변에 대한 내용이 포함되어 있으니 꼼꼼히 확인해 주시기
          바랍니다.
        </Text>

        <Section
          style={{
            backgroundColor: "#fff",
            padding: "16px 20px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <Text style={{ fontSize: "14px", marginBottom: "8px", color: "#2c2c2c" }}>
            <strong>주요 내용</strong>
          </Text>
          <Text style={{ fontSize: "14px", marginBottom: "4px", color: "#4b5563" }}>
            • 반려해변 소개
          </Text>
          <Text style={{ fontSize: "14px", marginBottom: "4px", color: "#4b5563" }}>
            • 입양 일정 및 절차
          </Text>
          <Text style={{ fontSize: "14px", marginBottom: "4px", color: "#4b5563" }}>
            • 입양시 필수 활동 안내
          </Text>
          <Text style={{ fontSize: "14px", marginBottom: "4px", color: "#4b5563" }}>
            • 활동 진행 안내
          </Text>
        </Section>

        <Section style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }} />

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          반려해변과 함께 아름다운 바다를 지켜나가길 기대합니다.
        </Text>

        <Text
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            marginTop: "24px",
            marginBottom: "24px",
            color: "#2c2c2c",
          }}
        >
          감사합니다.
          <br />
          등대지기 드림
        </Text>

        <Section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <Row>
            <Column align="center">
              <Img
                src="https://team.caresea.kr/logo/koem_logo.png"
                alt="해양환경공단"
                width="120"
              />
            </Column>
            <Column align="center">
              <Img src="https://team.caresea.kr/logo/itaseoul_logo.png" alt="이타서울" width="80" />
            </Column>
          </Row>
        </Section>

        <Text
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "24px",
            lineHeight: "1.5",
            borderTop: "1px dashed #d1d5db",
            paddingTop: "16px",
          }}
        >
          ※ 본 메일은 발송 전용 메일입니다.
        </Text>
      </Section>
    </Html>
  );
}
