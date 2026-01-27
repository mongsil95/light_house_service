// src/lib/email/templates/Conf25DailyReportEmail.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Link,
  Row,
  Column,
} from "@react-email/components";

interface DailyReportData {
  today: string;
  newApplicants: Array<{
    unified_id: string;
    name: string;
    affiliation: string;
    email: string;
    mobile: string | null;
    attendee_type: string;
    attendance_category: "ticket_holder" | "general_public";
    group_name: string | null;
    created_at: string;
  }>;
  totalStats: {
    total: number;
    ticketHolders: number;
    generalPublicApproved: number;
    generalPublicTotal: number;
    checkedIn: number;
  };
  dailyBreakdown: Array<{
    date: string;
    newCount: number;
    cumulative: number;
  }>;
  adminPageUrl: string;
}

export function Conf25DailyReportEmail({ data }: { data: DailyReportData }) {
  const getCategoryLabel = (category: string) => {
    return category === "ticket_holder" ? "참여기관" : "일반 참가자";
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      team_manager: "팀 관리자",
      team_member: "팀원",
      press: "언론인",
      official: "정부/공공기관",
      ngo: "NGO/단체",
      npo: "NPO/비영리단체",
      impact: "임팩트 조직",
      researcher: "연구자",
      student: "학생",
      partner: "협력기관",
      guest: "일반 참관객",
      other: "기타",
    };
    return typeMap[type] || type;
  };

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* 헤더 */}
          <Section style={styles.header}>
            <Heading style={styles.title}>📊 제3회 반려해변 전국대회 일일 리포트</Heading>
            <Text style={styles.subtitle}>{data.today} 기준</Text>
          </Section>

          {/* 전체 통계 요약 */}
          <Section style={styles.statsSection}>
            <Heading style={styles.sectionTitle}>📈 전체 현황</Heading>
            <Row>
              <Column style={styles.statBox}>
                <Text style={styles.statLabel}>총 참가자</Text>
                <Text style={styles.statValue}>{data.totalStats.total}명</Text>
              </Column>
              <Column style={styles.statBox}>
                <Text style={styles.statLabel}>참여기관</Text>
                <Text style={styles.statValue}>{data.totalStats.ticketHolders}명</Text>
              </Column>
              <Column style={styles.statBox}>
                <Text style={styles.statLabel}>일반 참가자 (승인/접수)</Text>
                <Text style={styles.statValue}>
                  {data.totalStats.generalPublicApproved}/{data.totalStats.generalPublicTotal}명
                </Text>
              </Column>
              <Column style={styles.statBox}>
                <Text style={styles.statLabel}>현장 체크인</Text>
                <Text style={styles.statValue}>{data.totalStats.checkedIn}명</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={styles.divider} />

          {/* 오늘 신규 신청자 */}
          <Section style={styles.newApplicantsSection}>
            <Heading style={styles.sectionTitle}>
              🆕 오늘 신규 신청자 ({data.newApplicants.length}명)
            </Heading>
            {data.newApplicants.length === 0 ? (
              <Text style={styles.emptyText}>오늘은 신규 신청자가 없습니다.</Text>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>시간</th>
                    <th style={styles.tableHeader}>이름</th>
                    <th style={styles.tableHeader}>소속</th>
                    <th style={styles.tableHeader}>이메일</th>
                    <th style={styles.tableHeader}>연락처</th>
                    <th style={styles.tableHeader}>유형</th>
                    <th style={styles.tableHeader}>카테고리</th>
                  </tr>
                </thead>
                <tbody>
                  {data.newApplicants.map((applicant, index) => (
                    <tr
                      key={applicant.unified_id}
                      style={{
                        ...styles.tableRow,
                        backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                      }}
                    >
                      <td style={styles.tableCell}>
                        {new Date(applicant.created_at).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td style={styles.tableCell}>{applicant.name}</td>
                      <td style={styles.tableCell}>
                        {applicant.group_name || applicant.affiliation}
                      </td>
                      <td style={styles.tableCell}>{applicant.email}</td>
                      <td style={styles.tableCell}>{applicant.mobile || "-"}</td>
                      <td style={styles.tableCell}>{getTypeLabel(applicant.attendee_type)}</td>
                      <td style={styles.tableCell}>
                        {getCategoryLabel(applicant.attendance_category)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Section>

          <Hr style={styles.divider} />

          {/* 일별 추이 */}
          <Section style={styles.dailyBreakdownSection}>
            <Heading style={styles.sectionTitle}>📅 최근 7일 추이</Heading>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>날짜</th>
                  <th style={styles.tableHeader}>신규 신청</th>
                  <th style={styles.tableHeader}>누적 합계</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyBreakdown.map((day, index) => (
                  <tr
                    key={day.date}
                    style={{
                      ...styles.tableRow,
                      backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                    }}
                  >
                    <td style={styles.tableCell}>{day.date}</td>
                    <td style={{ ...styles.tableCell, fontWeight: "600" }}>+{day.newCount}명</td>
                    <td style={styles.tableCell}>{day.cumulative}명</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Hr style={styles.divider} />

          {/* CTA 버튼 */}
          <Section style={styles.ctaSection}>
            <Link href={data.adminPageUrl} style={styles.ctaButton}>
              🔗 관리자 페이지 바로가기
            </Link>
            <Text style={styles.ctaSubtext}>상세한 참가자 정보와 출석 현황을 확인하세요</Text>
          </Section>

          {/* 푸터 */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>이 메일은 매일 오전 9시에 자동으로 발송됩니다.</Text>
            <Text style={styles.footerText}>반려해변 사무국 | info@caresea.kr</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// 스타일 정의
const styles = {
  body: {
    backgroundColor: "#f3f4f6",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    margin: 0,
    padding: "40px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    maxWidth: "800px",
    margin: "0 auto",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 30px",
    textAlign: "center" as const,
  },
  title: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 10px 0",
  },
  subtitle: {
    color: "#ffffff",
    fontSize: "16px",
    margin: 0,
    opacity: 0.9,
  },
  statsSection: {
    padding: "30px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    margin: "0 0 20px 0",
  },
  statBox: {
    textAlign: "center" as const,
    padding: "15px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 8px 0",
    fontWeight: "500",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#667eea",
    margin: 0,
  },
  divider: {
    borderColor: "#e5e7eb",
    margin: "0",
  },
  newApplicantsSection: {
    padding: "30px",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center" as const,
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "13px",
  },
  tableHeaderRow: {
    backgroundColor: "#f9fafb",
  },
  tableHeader: {
    padding: "12px",
    textAlign: "left" as const,
    fontWeight: "600",
    color: "#374151",
    borderBottom: "2px solid #e5e7eb",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  tableCell: {
    padding: "12px",
    color: "#4b5563",
  },
  dailyBreakdownSection: {
    padding: "30px",
  },
  ctaSection: {
    padding: "30px",
    textAlign: "center" as const,
    backgroundColor: "#f9fafb",
  },
  ctaButton: {
    display: "inline-block",
    backgroundColor: "#667eea",
    color: "#ffffff",
    padding: "14px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
  },
  ctaSubtext: {
    marginTop: "12px",
    color: "#6b7280",
    fontSize: "13px",
  },
  footer: {
    padding: "20px 30px",
    textAlign: "center" as const,
    borderTop: "1px solid #e5e7eb",
  },
  footerText: {
    color: "#9ca3af",
    fontSize: "12px",
    margin: "4px 0",
  },
};
