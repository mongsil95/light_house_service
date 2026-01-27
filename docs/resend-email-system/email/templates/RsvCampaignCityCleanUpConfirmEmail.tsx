import { formatSmartDate } from "@/lib/utils/dateUtils";
import { Html, Section, Heading, Text, Img, Row, Column } from "@react-email/components";

interface RsvDPayload {
  group_name: string;
  manager_name: string;
  startdate: string;
  enddate: string;
  link: string;
  comment?: string;
}

export function RsvCampaignCityCleanUpConfirmEmail({ data }: { data: RsvDPayload }) {
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
          style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px", color: "#0084fc" }}
        >
          공동캠페인 신청이 완료되었습니다
        </Heading>
        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
          안녕하세요, {data.group_name} {data.manager_name} 담당자님.
          <br />
          반려해변 공동캠페인 <b>「도시바다 정화」캠페인</b> 신청이 정상적으로 접수되었습니다.
        </Text>
        <Section
          style={{
            backgroundColor: "#fff",
            padding: "12px 20px",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <Text>
            <b>캠페인명</b>: 25 국제연안정화의날 기념 「도시바다 정화」
          </Text>
          <Text>
            <b>기관명</b>: {data.group_name}
          </Text>
          <Text>
            <b>참여기간</b>: {formatSmartDate(data.startdate).date} ~{" "}
            {formatSmartDate(data.enddate).date}
          </Text>
          {data.comment && (
            <Text>
              <b>추가 문의사항</b>: {data.comment}
            </Text>
          )}
        </Section>
        <Section
          style={{
            backgroundColor: "#fef3c7",
            color: "#92400e",
            padding: "14px 16px",
            borderRadius: "6px",
            fontSize: "13px",
            marginBottom: "24px",
          }}
        >
          <b>안내</b>
          <br />
          - 입양기관 소속 누구나(가족포함) 기간 내 자유롭게 개별 참여하실 수 있습니다.
          <br />
          - 1인당 50개 이상 데이터 기록, 최소 10인 이상 참여 시 “1회 필수캠페인”으로 인정됩니다.
          <br />
          - 참여방법/포스터 등은 안내메일과 관리자 페이지를 참고해 주세요.
          <br />
        </Section>
        <Section style={{ margin: "24px 0" }}>
          <a
            href={data.link}
            style={{
              display: "inline-block",
              backgroundColor: "#0084fc",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            관리페이지에서 참여현황 확인
          </a>
        </Section>
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
        <Text style={{ fontSize: "12px", color: "#6b7280", marginTop: "24px", lineHeight: "1.5" }}>
          ※ 본 메일은 반려해변 공동캠페인 참여 안내를 위해 발송되었습니다.
          <br />※ 문의: <a href="mailto:itaseoul@itaseoul.org">itaseoul@itaseoul.org</a>
        </Text>
      </Section>
    </Html>
  );
}
