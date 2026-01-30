import { Column, Heading, Html, Img, Row, Section, Text } from "@react-email/components";

interface ContactAcceptanceEmailProps {
  data: {
    organization: string;
    name: string;
    phone: string;
    email: string;
    preferredDate: string;
    preferredTime: string;
    method: string;
    lighthouseContactName?: string;
    lighthouseContactEmail?: string;
  };
}

export function ContactAcceptanceEmail({ data }: ContactAcceptanceEmailProps) {
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
          ✅ 등대지기가 무전을 받았습니다.
        </Heading>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "24px",
            color: "#2c2c2c",
          }}
        >
          안녕하세요, {data.name}님.
          <br />
          <strong>{data.organization}</strong>에서 보내주신 무전을 등대지기가 받았습니다.
          <br />
          아래 확정된 일정과 담당 등대지기의 정보를 확인해 주세요.
        </Text>

        <Section style={{ borderTop: "2px solid #10b981", margin: "24px 0" }} />

        {/* 확정된 일정 */}
        <Section
          style={{
            backgroundColor: "#ecfdf5",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #10b981",
            marginBottom: "20px",
            borderLeft: "4px solid #059669",
          }}
        >
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "16px",
              color: "#065f46",
            }}
          >
            📅 확정된 일정
          </Text>

          <Section style={{ marginBottom: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#065f46", fontWeight: "600", margin: "0" }}
                >
                  일자
                </Text>
              </Column>
              <Column>
                <Text
                  style={{ fontSize: "16px", color: "#1e293b", margin: "0", fontWeight: "600" }}
                >
                  {data.preferredDate}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ marginBottom: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#065f46", fontWeight: "600", margin: "0" }}
                >
                  시간
                </Text>
              </Column>
              <Column>
                <Text
                  style={{ fontSize: "16px", color: "#1e293b", margin: "0", fontWeight: "600" }}
                >
                  {data.preferredTime}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#065f46", fontWeight: "600", margin: "0" }}
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

          {/* 구글 밋 링크 표시 */}
          {data.method === "구글밋" && (
            <Section
              style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed #10b981" }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  color: "#065f46",
                  fontWeight: "600",
                  margin: "0 0 8px 0",
                }}
              >
                💻 Google Meet 링크
              </Text>
              <a
                href="https://meet.google.com/fkq-ciau-vzp"
                style={{
                  display: "inline-block",
                  fontSize: "14px",
                  color: "#2563eb",
                  textDecoration: "underline",
                  wordBreak: "break-all",
                }}
              >
                https://meet.google.com/fkq-ciau-vzp
              </a>
              <Text
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "8px 0 0 0",
                }}
              >
                * 위 링크로 약속된 시간에 접속해주세요.
              </Text>
            </Section>
          )}
        </Section>

        {/* 준비 사항 */}
        <Section
          style={{
            backgroundColor: "#fff7ed",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #f97316",
            marginBottom: "24px",
          }}
        >
          <Text
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "12px",
              color: "#9a3412",
            }}
          >
            📝 등대지기와 만남 전 준비사항
          </Text>
          <Text
            style={{
              fontSize: "13px",
              color: "#9a3412",
              margin: "0",
              lineHeight: "1.6",
            }}
          >
            • 활동 관련 궁금한 사항을 미리 정리해 주세요
            <br />
            • 해변 정화 활동 계획과 일정을 준비해 주세요
            <br />• 필요한 지원 사항이 있다면 함께 말씀해 주세요
          </Text>
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
          <br />
          반려해변 등대지기와 함께하는 깨끗한 바다 만들기를 응원합니다! 🌊
        </Text>
      </Section>
    </Html>
  );
}
