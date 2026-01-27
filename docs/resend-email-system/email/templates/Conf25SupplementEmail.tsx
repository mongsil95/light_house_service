// src/lib/email/templates/Conf25SupplementEmail.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Heading,
  Link,
  Button,
} from "@react-email/components";

interface Conf25SupplementEmailProps {
  data: {
    name: string;
    email: string;
    affiliation?: string;
    reason: string;
    editUrl?: string; // ✅ A안: 수정 링크 추가
  };
}

export function Conf25SupplementEmail({ data }: Conf25SupplementEmailProps) {
  const applyUrl = data.editUrl || "https://conf25.caresea.kr";

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>제3회 반려해변 전국대회</Heading>
            <Text style={subheading}>신청 내용 보완 요청</Text>
          </Section>

          <Hr style={hr} />

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>
              안녕하세요, <strong>{data.name}</strong>님.
            </Text>
            <Text style={paragraph}>
              맑은 바다를 만드는 반려해변 활동에 관심을 가져주셔서 감사합니다.
              <br />
              2025년 반려해변 전국대회에 참가 신청해주셔서 감사합니다.
            </Text>

            <Section style={infoBox}>
              <Heading as="h2" style={infoBoxTitle}>
                📋 신청 내용 검토 결과
              </Heading>
              <Text style={infoBoxContent}>
                신청서 검토 중 일부 내용에 대한 보완이 필요하여 연락드립니다.
              </Text>
            </Section>

            <Section style={reasonBox}>
              <Heading as="h3" style={reasonTitle}>
                💬 보완이 필요한 사항
              </Heading>
              <Text style={reasonText}>{data.reason}</Text>
            </Section>

            <Section style={highlightBox}>
              <Text style={highlightText}>
                위 내용을 보완하신 후, 아래 버튼을 클릭하여 신청 내용을 수정해주시기 바랍니다.
              </Text>
              <Section style={buttonSection}>
                <Button href={applyUrl} style={button}>
                  신청 내용 보완하기
                </Button>
              </Section>
              {data.editUrl && (
                <Text style={noteText}>※ 수정 링크는 7일간 유효하며, 1회만 사용 가능합니다.</Text>
              )}
            </Section>

            <Text style={paragraph}>
              보완 후 신청하시면 신속하게 검토하여 승인 여부를 안내드리겠습니다.
            </Text>

            <Text style={{ ...paragraph, marginBottom: "32px" }}>
              궁금하신 사항이 있으시면 언제든지 문의해주세요.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* 25반려해변 전국대회 친절상담 서비스 - 강조 섹션 */}
          <Section
            style={{
              marginTop: "32px",
              marginBottom: "32px",
              padding: "20px",
              backgroundColor: "#f0f9ff",
              borderRadius: "8px",
              border: "2px solid #0084FC",
            }}
          >
            <Text
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#0084FC",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              💬 25반려해변 전국대회 친절상담 서비스
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: "#1f2937",
                marginBottom: "16px",
                textAlign: "center",
                lineHeight: "1.6",
              }}
            >
              전국대회 관련 모든 궁금한 사항을 <strong>등대지기</strong>가 친절하게 안내해 드립니다.
              <br />
              참가 준비, 일정, 장소, 주차 등 무엇이든 편하게 문의하세요!
            </Text>
            <Section style={{ textAlign: "center" as const }}>
              <Link
                href="https://lighthouse.caresea.kr"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  backgroundColor: "#0084FC",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                🏖️ 등대지기 상담하기
              </Link>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>반려해변 운영국</strong>
              <br />
              이메일: info@caresea.kr
              <br />
              웹사이트: www.caresea.kr
              <br />
              친절상담 서비스:{" "}
              <Link href="https://lighthouse.caresea.kr" style={link}>
                라이트하우스 (Lighthouse)
              </Link>
            </Text>
            <Text style={footerNote}>
              본 메일은 반려해변 전국대회 신청자에게 발송되는 자동 메일입니다.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  marginBottom: "64px",
  borderRadius: "8px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 32px 0",
  textAlign: "center" as const,
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1a1a1a",
  margin: "0 0 8px",
};

const subheading = {
  fontSize: "16px",
  color: "#666666",
  margin: "0",
};

const hr = {
  border: "none",
  borderTop: "1px solid #e6e6e6",
  margin: "24px 32px",
};

const content = {
  padding: "0 32px",
};

const greeting = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#1a1a1a",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#4a5568",
  margin: "0 0 16px",
};

const infoBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fbbf24",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const infoBoxTitle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#d97706",
  margin: "0 0 12px",
};

const infoBoxContent = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#92400e",
  margin: "0",
};

const reasonBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const reasonTitle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#374151",
  margin: "0 0 12px",
};

const reasonText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#4b5563",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const highlightBox = {
  backgroundColor: "#eff6ff",
  border: "2px solid #3b82f6",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const highlightText = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#1e40af",
  margin: "0 0 16px",
  fontWeight: "600",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const noteText = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "#6b7280",
  margin: "12px 0 0",
  textAlign: "center" as const,
};

const footer = {
  padding: "0 32px 32px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#6b7280",
  margin: "0 0 8px",
};

const link = {
  color: "#3b82f6",
  textDecoration: "underline",
};

const footerNote = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0",
};

export default Conf25SupplementEmail;
