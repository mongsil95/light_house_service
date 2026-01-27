import { Html, Section, Heading, Text, Img, Row, Column } from "@react-email/components";
import { bcOfficialPayload } from "@/lib/schema/book/activity-official-beachcleanup";
import { formatHM, formatSmartDate } from "@/lib/utils/dateUtils";

interface RsvOfficialBeachCleanConfirmMunicipalPayload extends bcOfficialPayload {
  selected_date: string;
  selected_time: string;
  group_name: string; // 입양기관 이름
  // manager_name: string;
  municipal_manager_name: string; // 지자체 담당자 이름
  municipal_manager_group: string; // 지자체 담당자 그룹
  title: string;
  partner_group_name: string; // 입양기관 (또는 코디기관) 이름
  beach_name: string;
  beach_addr: string;
  confirmed_by_name: string;
  link: string;
  confirmed_slot?: {
    startdate: string;
    enddate: string;
  };
}

export function RsvOfficialBeachCleanConfirmMunicipal({
  data,
}: {
  data: RsvOfficialBeachCleanConfirmMunicipalPayload;
}) {
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
          style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px", color: "#047857" }}
        >
          반려해변 정화 일정 확정 안내
        </Heading>
        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
          안녕하세요, {data.municipal_manager_group} {data.municipal_manager_name} 담당자님.
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "16px" }}>
          반려해변 입양기관 {data.group_name}에서 아래의 반려해변 정화일정을 확정하였기에
          안내드립니다.
          <br />
          당일 정화활동을 마치고 적치 신고 메일을 발송예정 이오니 참고 부탁드립니다.
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
            <b>활동명</b>: {data.title}
          </Text>
          <Text>
            <b>활동기관</b>: {data.group_name}{" "}
          </Text>
          <Text>
            <b>일정</b>: {formatSmartDate(data.confirmed_slot.startdate).date}{" "}
            {formatHM(data.confirmed_slot.startdate)} ~ {formatHM(data.confirmed_slot.enddate)}
          </Text>
          <Text>
            <b>해변</b>: {data.beach_name}
          </Text>
          <Text>
            <b>주소</b>: {data.beach_addr}
          </Text>
          {/* <Text><b>확정자</b>: {data.confirmed_by_name}</Text> */}
        </Section>
        <Section style={{ margin: "24px 0" }}>
          <a
            href={data.link}
            style={{
              display: "inline-block",
              backgroundColor: "#10b981",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            반려해변 관리 페이지 바로가기
          </a>
        </Section>
        <Section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <Row>
            {/* <Column align="center">
              <Img src="https://team.caresea.kr/logo/gov_logo.png" alt="해양수산부" width="80" />
            </Column> */}
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
          ※ 본 메일은 확정된 반려해변 정화 일정 안내를 위해 발송되었습니다.
          <br />※ 사무국 문의:{" "}
          <a href="mailto:itaseoul@itaseoul.org" style={{ color: "#6b7280" }}>
            itaseoul@itaseoul.org
          </a>
        </Text>
      </Section>
    </Html>
  );
}
