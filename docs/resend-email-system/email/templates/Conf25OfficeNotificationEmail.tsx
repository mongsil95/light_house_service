// src/lib/email/templates/Conf25OfficeNotificationEmail.tsx
import { Html, Section, Heading, Text, Img, Row, Column } from "@react-email/components";

interface Conf25OfficeNotificationEmailProps {
  data: {
    name: string;
    affiliation: string;
    email: string;
    organizationName: string;
    generatedUsername: string;
    isManager: boolean;
    totalParticipants: number;
    totalTickets: number;
  };
}

export function Conf25OfficeNotificationEmail({ data }: Conf25OfficeNotificationEmailProps) {
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
          src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fadb_logo.png&w=3840&q=75"
          alt="반려해변 로고"
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
          [사무국 공유] 전국대회 참가자 등록 알림
        </Heading>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          새로운 참가자가 등록되었습니다.
        </Text>

        <Section style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }} />

        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#000000",
          }}
        >
          참가자 정보
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}>
          이름: {data.name}
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}>
          소속: {data.affiliation}
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}>
          이메일: {data.email}
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}>
          계정 ID: {data.generatedUsername}
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "16px", color: "#2c2c2c" }}>
          참가 구분: {data.isManager ? "관리자 (팀 대표)" : "팀원"}
        </Text>

        <Section style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }} />

        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#000000",
          }}
        >
          조직 정보
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}>
          조직명: {data.organizationName}
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}>
          현재 등록 인원: {data.totalParticipants}명
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "16px", color: "#2c2c2c" }}>
          할당 티켓: {data.totalTickets}매
        </Text>

        <Section style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }} />

        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginTop: "24px" }}>
          <strong>📋 관리 정보</strong>
          <br />
          <br />
          • 대회 일시: 2025년 12월 15일 (월) 오후 1시 ~ 5시
          <br />
          • 장소: 온드림 소사이어티 1층
          <br />• 참가자 관리: <span style={{ color: "#3b82f6" }}>team.caresea.kr/admin</span>
          <br />
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
          반려해변 사무국 시스템
        </Text>

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
          ※ 본 이메일은 전국대회 참가자 등록 시 사무국에 자동 발송됩니다.
        </Text>
      </Section>
    </Html>
  );
}
