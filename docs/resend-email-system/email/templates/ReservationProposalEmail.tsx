import { Html, Section, Heading, Text, Img, Row, Column } from "@react-email/components";
import { bcOfficialPayload } from "@/lib/schema/book/activity-official-beachcleanup";
import { formatSmartDate } from "@/lib/utils/dateUtils";
interface ReservationProposalEmailPayload extends bcOfficialPayload {
  partner_manager_name: string; // 파트너 담당자 이름
  partner_manager_email: string; // 파트너 담당자 이메일
  partner_group_name: string; // 파트너 그룹 이름
  partner_group_account_id: string; // 파트너 그룹 계정 ID
  comment?: string; // 선택적 메모
  link: string;

  group_name: string; // 그룹 이름

  group_manager_name: string; // 그룹 매니저 이름
  group_manager_email: string; // 그룹 매니저 이메일
  group_manager_mobile: string; // 그룹 매니저 휴대폰
  group_manager_tel: string; // 그룹 매니저 내선

  beach_name: string; // 해변 이름
}
export function ReservationProposalEmail({ data }: { data: ReservationProposalEmailPayload }) {
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
          style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px", color: "#00298a" }}
        >
          해변정화 일정을 제안드립니다
        </Heading>
        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
          안녕하세요, {data.partner_group_name} {data.partner_manager_name} 관계자님.
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "16px" }}>
          {data.group_name} 에서 아래와 같이 정화활동을 제안드립니다.
          <br />
          제안 일정중 하나를 확정해주시고, 만약 조율이 필요한 경우 회신 부탁드립니다.
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
            <b>설명</b>: {data.description || "-"}
          </Text>
          <Text>
            <b>해변</b>: {data.beach_name}
          </Text>
          <Text>
            <b>인원</b>: {data.max_participants}명
          </Text>

          {data.meet_addr && (
            <Text>
              <b>현장 위치</b>: {data.meet_addr}
            </Text>
          )}
        </Section>
        {/* memo */}
        {data.comment && (
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
              <b>공유 내용</b>: {data.comment}
            </Text>
          </Section>
        )}

        {/* 제안사 정보 섹션  */}
        <Text style={{ fontWeight: "bold", marginBottom: "8px" }}>제안기관 정보</Text>
        <Section
          style={{
            backgroundColor: "#f3f4f6",
            padding: "12px 20px",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <Text>
            <b>제안기관</b>: {data.group_name}
          </Text>
          <Text>
            <b>담당자</b>: {data.group_manager_name} ({data.group_manager_email})
          </Text>
          {/* 내선 휴대폰  */}
          <Text>
            <b>내선</b>: {data.group_manager_tel || "-"}
          </Text>
          <Text>
            <b>모바일</b>: {data.group_manager_mobile || "-"}
          </Text>
          {/* 일정 조율이 필요하시면 언제든지 연락주세요. */}
          <Text style={{ marginTop: "8px", fontSize: "12px", color: "#0055ff" }}>
            ※ 제안 일정 외 조율이 필요하시면 언제든지 연락주세요.
          </Text>
        </Section>

        <Text style={{ fontWeight: "bold", marginBottom: "8px" }}>제안 일정</Text>
        <ul style={{ fontSize: "14px", paddingLeft: "20px" }}>
          {data.slots.map((slot, i) => (
            <li key={`${slot.startdate}-${i}`}>
              {formatSmartDate(slot.startdate).date} {formatSmartDate(slot.startdate).time} ~{" "}
              {formatSmartDate(slot.enddate).time} {formatSmartDate(slot.startdate).relative}
            </li>
          ))}
        </ul>
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
            반려해변 계정에서 예약 확인하기
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
          ※ 본 메일은 해변정화 일정 제안 확인을 위해 발송되었습니다.
          <br />
          ※ 1주일 내 회신을 부탁드립니다. <br />※ 사무국 문의: itaseoul@itaseoul.org
        </Text>
      </Section>
    </Html>
  );
}
