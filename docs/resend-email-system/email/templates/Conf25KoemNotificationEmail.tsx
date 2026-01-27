// src/lib/email/templates/Conf25KoemNotificationEmail.tsx
import { Html, Section, Heading, Text, Img, Row, Column } from "@react-email/components";

interface Conf25KoemNotificationEmailProps {
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

export function Conf25KoemNotificationEmail({ data }: Conf25KoemNotificationEmailProps) {
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
          [공단 공유] 전국대회 참가자 등록 알림
        </Heading>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          안녕하세요, 해양환경공단 담당자님.
          <br />
          제3회 반려해변 전국대회에 새로운 참가자가 등록되었습니다.
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

        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#000000",
          }}
        >
          대회 정보
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}>
          행사명: 제3회 반려해변 전국대회 (2025년)
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}>
          일시: 2025년 12월 15일 (월) 오후 1시 ~ 5시
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}>
          장소: 온드림 소사이어티 1층
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "16px", color: "#2c2c2c" }}>
          주소: 서울특별시 중구 명동길 73
        </Text>

        <Section style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }} />

        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginTop: "24px" }}>
          <strong>📊 현황 통계</strong>
          <br />
          <br />
          • 총 참가 조직 수는 별도 관리 페이지에서 확인 가능합니다
          <br />
          • 실시간 현황: team.caresea.kr/admin/conf25
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
          해양환경공단 | 반려해변 사무국
        </Text>

        <Section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <Row>
            {/* <Column align="center">
              <Img
                src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fgov_logo.png&w=3840&q=75"
                alt="해양수산부"
                width="80"
              />
            </Column> */}
            <Column align="center">
              <Img
                src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fkoem_logo.png&w=3840&q=75"
                alt="해양환경공단"
                width="80"
              />
            </Column>
            <Column align="center">
              <Img
                src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fitaseoul_logo.png&w=3840&q=75"
                alt="이타서울"
                width="80"
              />
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
          ※ 본 이메일은 전국대회 참가자 등록 시 해양환경공단 담당자에게 자동 발송됩니다.
          <br />※ 담당자: 한민지 | 문의: itaseoul@itaseoul.org
        </Text>
      </Section>
    </Html>
  );
}
