import { Column, Heading, Html, Img, Row, Section, Text } from "@react-email/components";

interface ContactReservationEmailProps {
  data: {
    organization: string;
    name: string;
    phone: string;
    email: string;
    content: string;
    method: string;
    preferredDate: string;
    preferredTime: string;
  };
}

export function ContactReservationEmail({ data }: ContactReservationEmailProps) {
  return (
    <Html>
      <Section
        style={{
          padding: "24px",
          fontFamily:
            "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
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
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#1e3a8a",
          }}
        >
          🔔 새로운 무전 예약 신청
        </Heading>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "24px",
            color: "#2c2c2c",
          }}
        >
          안녕하세요, 관리자님.
          <br />
          새로운 무전 예약 신청이 접수되었습니다.
        </Text>

        <Section style={{ borderTop: "2px solid #3b82f6", margin: "24px 0" }} />

        {/* 신청자 정보 */}
        <Section
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
            borderLeft: "4px solid #3b82f6",
          }}
        >
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "16px",
              color: "#1e3a8a",
            }}
          >
            👤 신청자 정보
          </Text>

          <Section style={{ marginBottom: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#64748b", fontWeight: "600", margin: "0" }}
                >
                  기관/단체명
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>
                  {data.organization}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ marginBottom: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#64748b", fontWeight: "600", margin: "0" }}
                >
                  이름
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>{data.name}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ marginBottom: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#64748b", fontWeight: "600", margin: "0" }}
                >
                  전화번호
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>
                  {data.phone}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#64748b", fontWeight: "600", margin: "0" }}
                >
                  이메일
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>
                  {data.email}
                </Text>
              </Column>
            </Row>
          </Section>
        </Section>

        {/* 예약 정보 */}
        <Section
          style={{
            backgroundColor: "#fffbeb",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #fcd34d",
            marginBottom: "20px",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "16px",
              color: "#92400e",
            }}
          >
            📅 예약 정보
          </Text>

          <Section style={{ marginBottom: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#92400e", fontWeight: "600", margin: "0" }}
                >
                  희망 일자
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>
                  {data.preferredDate}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ marginBottom: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#92400e", fontWeight: "600", margin: "0" }}
                >
                  희망 시간
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>
                  {data.preferredTime}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#92400e", fontWeight: "600", margin: "0" }}
                >
                  연락 방법
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>
                  {data.method}
                </Text>
              </Column>
            </Row>
          </Section>
        </Section>

        {/* 문의 내용 */}
        <Section
          style={{
            backgroundColor: "#f1f5f9",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            marginBottom: "20px",
          }}
        >
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "12px",
              color: "#334155",
            }}
          >
            💬 문의 내용
          </Text>
          <Text
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#475569",
              whiteSpace: "pre-wrap",
              margin: "0",
            }}
          >
            {data.content}
          </Text>
        </Section>

        <Section style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }} />

        {/* 신청 시간 및 상태 */}
        <Section
          style={{
            backgroundColor: "#fff",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            marginBottom: "24px",
          }}
        >
          <Text style={{ fontSize: "13px", color: "#64748b", margin: "0 0 8px 0" }}>
            신청 시간: {new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
          </Text>
          <Text style={{ fontSize: "13px", color: "#64748b", margin: "0" }}>
            상태: <span style={{ color: "#f59e0b", fontWeight: "600" }}>대기중</span>
          </Text>
        </Section>

        {/* 관리자 페이지 버튼 */}
        <Section style={{ textAlign: "center", marginBottom: "24px" }}>
          <a
            href={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin`}
            style={{
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              padding: "14px 32px",
              textDecoration: "none",
              borderRadius: "8px",
              display: "inline-block",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            관리자 페이지에서 확인하기
          </a>
        </Section>

        {/* 안내 사항 */}
        <Section
          style={{
            backgroundColor: "#ecfdf5",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #10b981",
            marginBottom: "24px",
          }}
        >
          <Text
            style={{
              fontSize: "13px",
              color: "#065f46",
              margin: "0",
              lineHeight: "1.5",
            }}
          >
            💡 <strong>안내:</strong> 신청자에게 빠른 시일 내에 연락하여 일정을 확정해 주세요.
          </Text>
        </Section>

        <Section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <Row>
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
