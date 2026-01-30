import { Column, Heading, Html, Img, Row, Section, Text } from "@react-email/components";

interface ContactRescheduleEmailProps {
  data: {
    organization: string;
    name: string;
    phone: string;
    email: string;
    previousDate: string;
    previousTime: string;
    newDate: string;
    newTime: string;
    reason?: string;
    lighthouseContactName?: string;
    lighthouseContactEmail?: string;
  };
}

export function ContactRescheduleEmail({ data }: ContactRescheduleEmailProps) {
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
          📅 무전 예약 일정이 변경되었습니다
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
          <strong>{data.organization}</strong>에서 신청하신 무전 예약 일정이 변경되었습니다.
          <br />
          갑작스러운 일정 변경에 대해 양해 부탁드립니다.
        </Text>

        <Section style={{ borderTop: "2px solid #f59e0b", margin: "24px 0" }} />

        {/* 변경 전/후 일정 비교 */}
        <Section
          style={{
            backgroundColor: "#fef3c7",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #f59e0b",
            marginBottom: "20px",
            borderLeft: "4px solid #d97706",
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
            📝 일정 변경 내역
          </Text>

          {/* 이전 일정 */}
          <Section
            style={{
              backgroundColor: "#fff",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "12px",
              border: "1px solid #fbbf24",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#92400e",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              변경 전 일정
            </Text>
            <Text
              style={{
                fontSize: "14px",
                color: "#78716c",
                margin: "0",
                textDecoration: "line-through",
              }}
            >
              {data.previousDate} {data.previousTime}
            </Text>
          </Section>

          {/* 새 일정 */}
          <Section
            style={{
              backgroundColor: "#ecfdf5",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #10b981",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#065f46",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              변경 후 일정 (확정)
            </Text>
            <Text style={{ fontSize: "16px", color: "#065f46", margin: "0", fontWeight: "600" }}>
              {data.newDate} {data.newTime}
            </Text>
          </Section>

          {data.reason && (
            <Section style={{ marginTop: "12px" }}>
              <Text
                style={{
                  fontSize: "12px",
                  color: "#92400e",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                변경 사유
              </Text>
              <Text
                style={{
                  fontSize: "13px",
                  color: "#57534e",
                  margin: "0",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                }}
              >
                {data.reason}
              </Text>
            </Section>
          )}
        </Section>

        {/* 안내 사항 */}
        <Section
          style={{
            backgroundColor: "#eff6ff",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #3b82f6",
            marginBottom: "24px",
          }}
        >
          <Text
            style={{
              fontSize: "13px",
              color: "#1e3a8a",
              margin: "0",
              lineHeight: "1.5",
            }}
          >
            💡 <strong>안내:</strong> 변경된 일정에 맞춰 연락드리겠습니다. 일정 변경에 대해 다시
            한번 양해 부탁드리며, 추가 문의사항이 있으시면 언제든 연락 주세요.
          </Text>
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
          <br />
          반려해변 등대지기와 함께하는 깨끗한 바다 만들기를 응원합니다! 🌊
        </Text>
      </Section>
    </Html>
  );
}
