import { Column, Heading, Html, Img, Row, Section, Text } from "@react-email/components";

interface ContactRejectionEmailProps {
  data: {
    organization: string;
    name: string;
    phone: string;
    email: string;
    preferredDate: string;
    preferredTime: string;
    method: string;
    reason: string;
  };
}

export function ContactRejectionEmail({ data }: ContactRejectionEmailProps) {
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
            color: "#dc2626",
          }}
        >
          무전 예약 안내
        </Heading>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "24px",
            color: "#2c2c2c",
          }}
        >
          안녕하세요, <strong>{data.name}</strong>님.
          <br />
          <br />
          {data.organization}에서 신청하신 무전 예약에 대해 안내드립니다.
        </Text>

        <Section style={{ borderTop: "2px solid #dc2626", margin: "24px 0" }} />

        {/* 신청 정보 */}
        <Section
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "16px",
              color: "#374151",
            }}
          >
            📋 신청하신 내용
          </Text>

          <Section>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#64748b", fontWeight: "600", margin: "0" }}
                >
                  조직명
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>
                  {data.organization}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ marginTop: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#64748b", fontWeight: "600", margin: "0" }}
                >
                  담당자
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>{data.name}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ marginTop: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#64748b", fontWeight: "600", margin: "0" }}
                >
                  연락처
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>
                  {data.phone}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ marginTop: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#64748b", fontWeight: "600", margin: "0" }}
                >
                  희망 일시
                </Text>
              </Column>
              <Column>
                <Text style={{ fontSize: "14px", color: "#1e293b", margin: "0" }}>
                  {data.preferredDate} {data.preferredTime}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ marginTop: "12px" }}>
            <Row>
              <Column style={{ width: "140px" }}>
                <Text
                  style={{ fontSize: "14px", color: "#64748b", fontWeight: "600", margin: "0" }}
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

        {/* 거절 안내 */}
        <Section
          style={{
            backgroundColor: "#fef2f2",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #fca5a5",
            marginBottom: "20px",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "12px",
              color: "#991b1b",
            }}
          >
            ⚠️ 예약 진행이 어려운 상황입니다
          </Text>

          <Text
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#7f1d1d",
              margin: "0",
            }}
          >
            죄송하지만 현재 상황으로는 무전 예약 진행이 어려운 점 양해 부탁드립니다.
          </Text>

          <Section
            style={{
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #fca5a5",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: "#64748b",
                fontWeight: "600",
                margin: "0 0 8px 0",
              }}
            >
              사유
            </Text>
            <Text
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#1e293b",
                margin: "0",
                whiteSpace: "pre-wrap",
              }}
            >
              {data.reason}
            </Text>
          </Section>
        </Section>

        {/* 안내 사항 */}
        <Section
          style={{
            backgroundColor: "#ecfdf5",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #86efac",
            marginBottom: "24px",
          }}
        >
          <Text
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#065f46",
              margin: "0",
            }}
          >
            💡 <strong>다른 문의 방법</strong>
            <br />
            <br />• 웹사이트의 다른 자료들을 통해 궁금증을 해결하실 수 있습니다.
            <br />• 추후 다시 무전 예약을 신청하실 수 있습니다.
          </Text>
        </Section>

        <Section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <Row>
            <Column align="center">
              <Img src="https://team.caresea.kr/logo/itaseoul_logo.png" alt="이타서울" width="80" />
            </Column>
          </Row>
        </Section>

        {/* Footer */}
        <Section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
          <Text
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              margin: "0",
              textAlign: "center",
            }}
          >
            © 2026 반려해변 등대지기 | Adopt-a-Beach Korea
            <br />이 메일은 무전 예약 신청에 대한 자동 발송 메일입니다.
          </Text>
        </Section>
      </Section>
    </Html>
  );
}
