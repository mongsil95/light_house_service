import { Html, Section, Heading, Text, Img } from "@react-email/components";
import { formatSmartDate, getTimeLeftDisplay, isSameDay } from "@/lib/utils/dateUtils";

interface HostEmailProps {
  hostName: string;
  userName: string;
  userEmail: string;
  activityTitle: string;
  startdate: string;
  enddate: string;
  activityLink: string;
}

export function RsvActivityJoinHostNotifyEmail({
  hostName,
  userName,
  userEmail,
  activityTitle,
  startdate,
  enddate,
  activityLink,
}: HostEmailProps) {
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
          backgroundColor: "#fff7ed",
          color: "#78350f",
        }}
      >
        <Heading
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px", color: "#fb923c" }}
        >
          {hostName}님, {userName} 님이 합류했습니다!
        </Heading>
        <Text style={{ fontSize: "15px", lineHeight: "1.6", marginBottom: "18px" }}>
          [{activityTitle}]에 <b>{userName}</b> ({userEmail})님이 동참했습니다. <br />
          활동 페이지에서 참가 현황을 꼭 확인해주세요.
        </Text>
        <Section
          style={{
            backgroundColor: "#fff",
            padding: "12px 20px",
            borderRadius: "7px",
            border: "1px solid #fed7aa",
            marginBottom: "20px",
          }}
        >
          <Text>
            <b>프로그램</b>: {activityTitle}
          </Text>
          <Text>
            <b>참가자</b>: {userName} ({userEmail})
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
              backgroundColor: "#fb923c",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            활동 페이지에서 확인하기
          </a>
        </Section>
        <Text style={{ fontSize: "13px", color: "#a16207", marginTop: "28px", lineHeight: "1.5" }}>
          사무국 문의: <a href="mailto:itaseoul@itaseoul.org">itaseoul@itaseoul.org</a> <br />
          프로그램 진행상황을 수시로 체크해 주시고, 문의사항이 있을 시 연락주세요! <br />
        </Text>
      </Section>
    </Html>
  );
}
