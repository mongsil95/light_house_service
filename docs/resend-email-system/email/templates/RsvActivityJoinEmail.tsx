import { Html, Section, Heading, Text, Img } from "@react-email/components";
import { formatSmartDate, getTimeLeftDisplay, isSameDay } from "@/lib/utils/dateUtils";

interface ParticipantEmailProps {
  userName: string;
  groupName: string;
  activityTitle: string;
  startdate: string;
  enddate: string;
  activityLink: string;
  hostName: string;
  hostEmail: string;
  comment?: string;
}

export function RsvActivityJoinEmail({
  userName,
  groupName,
  activityTitle,
  startdate,
  enddate,
  activityLink,
  hostName,
  hostEmail,
  comment,
}: ParticipantEmailProps) {
  const isSame = isSameDay(startdate, enddate);
  const startInfo = formatSmartDate(startdate);
  const endInfo = formatSmartDate(enddate);

  const timeLeft = getTimeLeftDisplay(enddate);

  let periodText = "";
  if (isSame) {
    periodText = `${startInfo.date} ${startInfo.time} | ${startInfo.relative} 시작`;
  } else {
    periodText = `${startInfo.date} ~ ${endInfo.date} | ${timeLeft}`;
  }

  return (
    <Html>
      <Section
        style={{
          padding: "24px",
          fontFamily: "sans-serif",
          backgroundColor: "#f8fafc",
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
          {userName}님, 반려해변 프로그램 참여를 환영합니다!
        </Heading>
        <Text style={{ fontSize: "15px", lineHeight: "1.6", marginBottom: "18px" }}>
          <b>{activityTitle}</b>에 {userName}님이 함께 동참하게 되어 진심으로 기쁩니다.
          <br />
          깨끗한 바다를 만드는 소중한 실천을 함께해 주셔서 감사합니다.
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
            <b>프로그램</b>: {activityTitle}
          </Text>
          <Text>
            <b>기관명</b>: {groupName}
          </Text>
          <Text>
            <b>일시</b>: {periodText}
          </Text>
        </Section>

        <Section style={{ margin: "24px 0" }}>
          <a
            href={activityLink}
            style={{
              display: "inline-block",
              backgroundColor: "#0ea5e9",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            활동 페이지 가기
          </a>
        </Section>
        <Text style={{ fontSize: "13px", color: "#64748b", marginTop: "28px", lineHeight: "1.5" }}>
          ※ 본 메일은 반려해변 참여 안내를 위해 발송되었습니다.
          <br />※ 문의: <a href={`mailto:${hostEmail}`}>{hostName}</a> 프로그램 주최자, {groupName}
          <br />※ 이메일: {hostEmail}
        </Text>
      </Section>
    </Html>
  );
}
