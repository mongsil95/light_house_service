// src/lib/email/templates/Conf25AttendanceOfficeEmail.tsx
import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Conf25AttendanceOfficeEmailProps {
  data: {
    name: string;
    affiliation: string;
    position: string;
    email: string;
    mobile: string;
    attendeeTypeLabel: string;
  };
}

export function Conf25AttendanceOfficeEmail({ data }: Conf25AttendanceOfficeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        [전국대회 일반참여] {data.name} ({data.affiliation}) 신청 알림
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>📊 일반참여 신청 알림</Heading>

          <Text style={text}>전국대회 일반참여 신청이 접수되었습니다.</Text>

          <Section style={infoBox}>
            <Heading as="h2" style={h2}>
              👤 참석자 정보
            </Heading>
            <Text style={infoText}>
              <strong>이름:</strong> {data.name}
              <br />
              <strong>소속:</strong> {data.affiliation}
              <br />
              <strong>직책:</strong> {data.position}
              <br />
              <strong>참석 유형:</strong> {data.attendeeTypeLabel}
              <br />
              <strong>이메일:</strong> {data.email}
              <br />
              <strong>연락처:</strong> {data.mobile}
            </Text>
          </Section>

          <Section style={actionBox}>
            <Heading as="h3" style={h3}>
              🔔 처리 사항
            </Heading>
            <Text style={actionText}>
              • 참석자 명단에 추가
              <br />
              • 좌석 배치 확인
              <br />• 필요시 개별 연락
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

          <Section style={footer}>
            <Text style={footerText}>
              반려해변 사무국 (이타서울)
              <br />
              자동 발송 메일
              <br />
              친절상담 서비스:{" "}
              <Link href="https://lighthouse.caresea.kr" style={link}>
                라이트하우스 (Lighthouse)
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "40px",
  borderRadius: "8px",
  maxWidth: "600px",
};

const h1 = {
  color: "#0c4a6e",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 20px",
};

const h2 = {
  color: "#0c4a6e",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const h3 = {
  color: "#0891b2",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 8px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const infoBox = {
  backgroundColor: "#f0f9ff",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
  borderLeft: "4px solid #0ea5e9",
};

const actionBox = {
  backgroundColor: "#ecfdf5",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
  borderLeft: "4px solid #10b981",
};

const infoText = {
  color: "#1e40af",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

const actionText = {
  color: "#065f46",
  fontSize: "14px",
  lineHeight: "1.8",
  margin: "0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer = {
  textAlign: "center" as const,
};

const link = {
  color: "#3b82f6",
  textDecoration: "underline",
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "1.4",
  margin: "0",
};

export default Conf25AttendanceOfficeEmail;
