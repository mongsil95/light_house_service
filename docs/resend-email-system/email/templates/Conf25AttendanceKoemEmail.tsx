// src/lib/email/templates/Conf25AttendanceKoemEmail.tsx
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

interface Conf25AttendanceKoemEmailProps {
  data: {
    name: string;
    affiliation: string;
    position: string;
    email: string;
    mobile: string;
    attendeeTypeLabel: string;
  };
}

export function Conf25AttendanceKoemEmail({ data }: Conf25AttendanceKoemEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        [공단 공유] 전국대회 일반참여 - {data.name} ({data.affiliation})
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>📢 전국대회 일반참여 공유</Heading>

          <Text style={text}>
            안녕하세요, 한민지 대리님.
            <br />
            <br />
            제3회 반려해변 전국대회 일반참여 신청 현황을 공유드립니다.
          </Text>

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

          <Section style={noteBox}>
            <Text style={noteText}>
              📌 <strong>안내사항</strong>
              <br />
              • 일반참여 참석자는 입양단체 소속이 아닌 외부 관계자입니다
              <br />
              • 언론인, 정부/공공기관, 협력기관, 일반 참관객 등이 포함됩니다
              <br />• 별도의 좌석 배치가 필요할 수 있습니다
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
              이메일: itaseoul@naver.com | 전화: 070-8015-4141
              <br />
              친절상담 서비스:{" "}
              <Link href="https://lighthouse.caresea.kr" style={link}>
                라이트하우스 (Lighthouse)
              </Link>
            </Text>
            <Text style={footerNote}>본 메일은 전국대회 운영 협조를 위해 발송되었습니다.</Text>
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
  color: "#7c3aed",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 20px",
};

const h2 = {
  color: "#6d28d9",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const infoBox = {
  backgroundColor: "#faf5ff",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
  borderLeft: "4px solid #a78bfa",
};

const noteBox = {
  backgroundColor: "#fffbeb",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
  borderLeft: "4px solid #fbbf24",
};

const infoText = {
  color: "#5b21b6",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

const noteText = {
  color: "#78350f",
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
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 8px",
};

const footerNote = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "1.4",
  margin: "0",
};

export default Conf25AttendanceKoemEmail;
