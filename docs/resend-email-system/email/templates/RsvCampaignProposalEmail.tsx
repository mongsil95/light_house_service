import { Html, Section, Heading, Text, Img, Row, Column } from "@react-email/components";
import { formatHM, formatKoreanDate, formatSmartDate } from "@/lib/utils/dateUtils";

interface CampaignProposalEmailPayload {
  group_name: string; // 제안자(기관)
  beach_name: string; // 장소명
  meet_addr?: string;
  title: string;
  description?: string;
  startdate: string; // YYYY-MM-DD hh:mm:ss
  enddate: string; // YYYY-MM-DD hh:mm:ss
  max_participants: number;
  comment?: string;
  link?: string; // 관리페이지 링크 (선택)
}

export function RsvCampaignProposalEmail({ data }: { data: CampaignProposalEmailPayload }) {
  const labelStyle = {
    display: "inline-block",
    minWidth: "90px",
    color: "#6b7280",
    fontWeight: 400 as const,
    fontSize: "14px",
    marginRight: "12px",
    verticalAlign: "top",
  };
  const valueStyle = {
    color: "#1f2937",
    fontWeight: 700 as const,
    fontSize: "15px",
    verticalAlign: "top",
  };

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
          src="https://team.caresea.kr/logo/adb_logo.png"
          alt="Adopt-a-Beach Korea Logo"
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
          해양보호 캠페인 승인 요청
        </Heading>
        <Text style={{ fontSize: "14px", marginBottom: "16px" }}>
          안녕하세요, 사무국 담당자님.
          <br />
          아래와 같이 해양보호 캠페인을 신청합니다. 승인 요청드립니다.
        </Text>
        {/* 정보 블록 영역 - <table> 없이 구조화! */}
        <Section
          style={{
            backgroundColor: "#fff",
            padding: "14px 18px",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <Text style={{ fontSize: "0" }}>
            <span style={labelStyle}>제안기관</span>
            <span style={valueStyle}>{data.group_name}</span>
          </Text>
          <Text style={{ fontSize: "0" }}>
            <span style={labelStyle}>활동명</span>
            <span style={valueStyle}>{data.title}</span>
          </Text>
          <Text style={{ fontSize: "0" }}>
            <span style={labelStyle}>설명</span>
            <span style={valueStyle}>{data.description || "-"}</span>
          </Text>
          <Text style={{ fontSize: "0" }}>
            <span style={labelStyle}>장소명</span>
            <span style={valueStyle}>{data.beach_name}</span>
          </Text>
          {data.meet_addr && (
            <Text style={{ fontSize: "0" }}>
              <span style={labelStyle}>집결주소</span>
              <span style={valueStyle}>{data.meet_addr}</span>
            </Text>
          )}
          <Text style={{ fontSize: "0" }}>
            <span style={labelStyle}>시작일</span>
            <span style={valueStyle}>
              {formatSmartDate(data.startdate).date +
                " " +
                formatSmartDate(data.startdate).time +
                " " +
                formatSmartDate(data.startdate).relative}
            </span>
          </Text>
          <Text style={{ fontSize: "0" }}>
            <span style={labelStyle}>종료일</span>
            <span style={valueStyle}>
              {formatSmartDate(data.enddate).date +
                " " +
                formatSmartDate(data.enddate).time +
                " " +
                formatSmartDate(data.enddate).relative}
            </span>
          </Text>
          <Text style={{ fontSize: "0" }}>
            <span style={labelStyle}>예상 인원</span>
            <span style={valueStyle}>{data.max_participants}명</span>
          </Text>
          <Text style={{ fontSize: "0" }}>
            <span style={labelStyle}>기타 메모</span>
            <span style={valueStyle}>{data.comment || "없음"}</span>
          </Text>
        </Section>
        {data.link && (
          <Section style={{ margin: "24px 0" }}>
            <a
              href={data.link}
              style={{
                display: "inline-block",
                backgroundColor: "#3b82f6",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              관리페이지에서 승인 처리하기
            </a>
          </Section>
        )}
        <Section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <Row>
            <Column align="center">
              <Img
                src="https://team.caresea.kr/logo/koem_logo.png"
                alt="해양환경공단"
                width="120"
              />
            </Column>
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
          }}
        >
          ※ 본 메일은 해양보호 캠페인 승인 요청을 위해 발송되었습니다.
          <br />※ 문의: itaseoul@itaseoul.org
        </Text>
      </Section>
    </Html>
  );
}
