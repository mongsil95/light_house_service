// 📧 커피챗 예약 확정 이메일 템플릿
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Button,
} from "@react-email/components";

interface CoffeeChatConfirmEmailProps {
  data: {
    name: string;
    organization: string;
    phone: string;
    email: string;
    message: string;
    slot_date: string; // YYYY-MM-DD
    slot_time: string; // HH:MM:SS
    meeting_type: "video" | "phone";
    google_meet_url?: string;
  };
}

export function CoffeeChatConfirmEmail({ data }: CoffeeChatConfirmEmailProps) {
  // 날짜 포맷: 2025-01-15 → 2025년 1월 15일 (수)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  // 시간 포맷: 14:00:00 → 14:00
  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  const isVideo = data.meeting_type === "video";

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* 헤더 */}
          <Section style={styles.header}>
            <Heading style={styles.title}>☕ 등대지기와 차 한잔</Heading>
            <Text style={styles.subtitle}>예약이 확정되었습니다</Text>
          </Section>

          <Hr style={styles.hr} />

          {/* 인사말 */}
          <Section style={styles.section}>
            <Text style={styles.greeting}>
              안녕하세요, <strong>{data.name}</strong>님!
            </Text>
            <Text style={styles.paragraph}>
              등대지기와 차 한잔 예약이{" "}
              <strong style={styles.highlight}>확정</strong>되었습니다. 🎉
            </Text>
          </Section>

          {/* 예약 정보 */}
          <Section style={styles.infoBox}>
            <Heading as="h2" style={styles.infoTitle}>
              📅 예약 정보
            </Heading>
            <table style={styles.table}>
              <tbody>
                <tr>
                  <td style={styles.tableLabel}>날짜</td>
                  <td style={styles.tableValue}>
                    {formatDate(data.slot_date)}
                  </td>
                </tr>
                <tr>
                  <td style={styles.tableLabel}>시간</td>
                  <td style={styles.tableValue}>
                    {formatTime(data.slot_time)} (30분)
                  </td>
                </tr>
                <tr>
                  <td style={styles.tableLabel}>미팅 방식</td>
                  <td style={styles.tableValue}>
                    {isVideo ? "💻 화상 미팅" : "📞 유선 통화"}
                  </td>
                </tr>
                <tr>
                  <td style={styles.tableLabel}>소속</td>
                  <td style={styles.tableValue}>{data.organization}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* 화상 미팅 정보 */}
          {isVideo && data.google_meet_url && (
            <Section style={styles.meetBox}>
              <Heading as="h2" style={styles.meetTitle}>
                💻 화상 미팅 정보
              </Heading>
              <Text style={styles.paragraph}>
                아래 구글 밋 링크로 접속해주세요:
              </Text>
              <Button href={data.google_meet_url} style={styles.button}>
                🔗 구글 밋 입장하기
              </Button>
              <Text style={styles.note}>
                💡 예약 시간 <strong>5분 전</strong>부터 입장 가능합니다.
              </Text>
            </Section>
          )}

          {/* 유선 통화 정보 */}
          {!isVideo && (
            <Section style={styles.phoneBox}>
              <Heading as="h2" style={styles.phoneTitle}>
                📞 유선 통화 안내
              </Heading>
              <Text style={styles.paragraph}>
                예약 시간에 <strong>{data.phone}</strong>로 연락드리겠습니다.
              </Text>
            </Section>
          )}

          {/* 문의 사항 */}
          {data.message && (
            <Section style={styles.section}>
              <Heading as="h3" style={styles.messageTitle}>
                📝 문의 사항
              </Heading>
              <Text style={styles.message}>{data.message}</Text>
            </Section>
          )}

          <Hr style={styles.hr} />

          {/* 푸터 */}
          <Section style={styles.footer}>
            <Text style={styles.paragraph}>
              궁금하신 점이 있으시면 언제든 연락주세요.
              <br />
              감사합니다!
            </Text>
            <Text style={styles.signature}>
              <strong style={styles.brandColor}>반려해변 팀</strong>
            </Text>
            <Text style={styles.contact}>
              이메일:{" "}
              <Link href="mailto:info@adoptabeach.or.kr" style={styles.link}>
                itaseoul@naver.com
              </Link>
              <br />
              웹사이트:{" "}
              <Link href="https://caresea.kr" style={styles.link}>
                https://team.caresea.kr
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// 스타일
const styles = {
  body: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: "#f9fafb",
    padding: "20px",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "30px",
    textAlign: "center" as const,
  },
  title: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 0 10px 0",
  },
  subtitle: {
    color: "#e0e7ff",
    fontSize: "16px",
    margin: 0,
  },
  section: {
    padding: "30px",
  },
  greeting: {
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#1f2937",
    margin: "0 0 10px 0",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#4b5563",
    margin: "10px 0",
  },
  highlight: {
    color: "#667eea",
  },
  infoBox: {
    backgroundColor: "#f3f4f6",
    padding: "20px 30px",
    margin: "0",
  },
  infoTitle: {
    color: "#667eea",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 15px 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  tableLabel: {
    padding: "8px 0",
    color: "#6b7280",
    fontSize: "14px",
    width: "100px",
  },
  tableValue: {
    padding: "8px 0",
    color: "#1f2937",
    fontSize: "16px",
    fontWeight: "bold" as const,
  },
  meetBox: {
    backgroundColor: "#e0e7ff",
    padding: "20px 30px",
    margin: "0",
  },
  meetTitle: {
    color: "#4f46e5",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 15px 0",
  },
  button: {
    display: "inline-block",
    background: "#4f46e5",
    color: "#ffffff",
    padding: "12px 24px",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold" as const,
    margin: "10px 0",
  },
  note: {
    fontSize: "14px",
    color: "#6366f1",
    marginTop: "15px",
  },
  phoneBox: {
    backgroundColor: "#fef3c7",
    padding: "20px 30px",
    margin: "0",
  },
  phoneTitle: {
    color: "#d97706",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 15px 0",
  },
  messageTitle: {
    color: "#4b5563",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 0 10px 0",
  },
  message: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    padding: "15px",
    borderRadius: "6px",
    borderLeft: "4px solid #667eea",
  },
  hr: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "0",
  },
  footer: {
    padding: "30px",
    textAlign: "center" as const,
    backgroundColor: "#f9fafb",
  },
  signature: {
    fontSize: "16px",
    color: "#1f2937",
    margin: "10px 0",
  },
  brandColor: {
    color: "#667eea",
  },
  contact: {
    fontSize: "14px",
    color: "#9ca3af",
    margin: "10px 0",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
  },
};

export default CoffeeChatConfirmEmail;
