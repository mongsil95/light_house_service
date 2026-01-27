// 📁 src/lib/email/templates/AdbGroupManagerEnrollEmail.tsx
import { Html, Section, Heading, Text, Img, Row, Column } from "@react-email/components";

type props = {
  data: {
    groupName?: string; // 그룹 이름
    managerName?: string; // 그룹 관리자 이름
    managerEmail?: string; // 그룹 관리자 이메일
    inviteLink?: string; // 초대 링크
  };
};

export function AdbGroupManagerEnrollEmail({ data }: props) {
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
          src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fadb_logo.png&w=3840&q=75"
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
          반려해변 그룹 관리자 초대 안내
        </Heading>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          안녕하세요,{" "}
          <strong>
            {data.groupName} {data.managerName}
          </strong>{" "}
          관계자님.
        </Text>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          반려해변 플랫폼에서 귀하를 <strong>그룹 관리자</strong>로 초대드립니다. <br />
          아래 초대 링크를 통해 관리자 계정을 설정하고 팀 관리에 참여해 주세요.
        </Text>

        <Section style={{ margin: "24px 0" }}>
          <a
            href={data.inviteLink}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            그룹 관리자 등록하기
          </a>
        </Section>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#2c2c2c",
            marginBottom: "24px",
          }}
        >
          본 초대 링크는 7일 동안 유효하며, 사용 후 자동으로 만료됩니다.
          <br />
          문제가 발생하거나 도움이 필요하시면 아래 문의처로 연락 주세요.
        </Text>

        <Section style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }} />

        <Text
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#2c2c2c",
          }}
        >
          이타서울 | 반려해변 사무국 드림
        </Text>

        <Section style={{ margin: "24px 0" }}>
          <a
            href="https://caresea.kr"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#10b981",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            반려해변 홈페이지 방문하기
          </a>
        </Section>

        <Section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <Row>
            {/* <Column align="center">
              <Img
                src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fgov_logo.png&w=3840&q=75"
                alt="해양수산부"
                width="80"
              />
            </Column> */}
            <Column align="center">
              <Img
                src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fkoem_logo.png&w=3840&q=75"
                alt="해양환경공단"
                width="100"
              />
            </Column>
            <Column align="center">
              <Img
                src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fitaseoul_logo.png&w=3840&q=75"
                alt="이타서울"
                width="80"
              />
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
          ※ 이 메일은 반려해변 그룹 관리 초대를 위해 발송되었습니다. <br />※ 문의:
          itaseoul@itaseoul.org |{" "}
          <a
            href="https://pf.kakao.com/_irYGC"
            style={{ color: "#3b82f6", textDecoration: "underline" }}
          >
            반려해변 문의 카카오채널
          </a>
        </Text>
      </Section>
    </Html>
  );
}
