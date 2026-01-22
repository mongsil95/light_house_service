// src/lib/email/templates/AdoptApplyConfirmationEmail.tsx
import {
  Html,
  Section,
  Heading,
  Text,
  Img,
  Row,
  Column,
} from "@react-email/components";
import { ORG_TYPE_OPTIONS } from "@/constants/orgTypes";

export function AdoptApplyConfirmationEmail({ data }: { data: any }) {
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
          25 반려해변 입양신청서가 성공적으로 접수 되었습니다
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
            {data.name} {data.managerName}
          </strong>{" "}
          담당자님.
        </Text>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          반려해변 캠페인에 관심을 가지고 신청해주셔서 진심으로 감사드립니다.
          <br />
          {data.name}의 따뜻한 관심과 참여는 우리 바다와 해변에 큰 힘이 됩니다.
          <br />
          앞으로의 활동을 진심으로 응원드립니다.
        </Text>

        <Section
          style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }}
        />

        <Text
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#000000",
          }}
        >
          기관 정보
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          기관명 : {data.name}
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          기관 유형 :{" "}
          {ORG_TYPE_OPTIONS["adoptorg"].find((o) => o.value === data.orgType)
            ?.label || "-"}
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "16px", color: "#2c2c2c" }}
        >
          입양 이력 : {data.hasAdoptHistory}
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          주소 : {data.address}
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          홈페이지 : {data.homepage}
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          신청담당자 : {data.managerName} ({data.managerEmail})
        </Text>

        <Section
          style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }}
        />

        {data.beaches && data.beaches.length > 0 && (
          <>
            <Text
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "8px",
                color: "#000000",
              }}
            >
              입양 희망 해변
            </Text>
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "3px",
                color: "#2c2c2c",
              }}
            >
              희망 해변 수 : {data.desiredBeachCount}개
            </Text>
            <Text
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                marginBottom: "16px",
                color: "#2c2c2c",
              }}
            >
              {data.beaches
                .map((beach: any) => `- ${beach.name} (${beach.addr})`)
                .join("\n")}
            </Text>
          </>
        )}

        <Section
          style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }}
        />

        <Text
          style={{ fontSize: "14px", lineHeight: "1.6", marginTop: "24px" }}
        >
          소중한 입양 신청에 진심으로 감사드립니다. <br />
          아래와 같이 심사 및 승인 일정이 진행됩니다. <br />
          <br />• <strong>심사 기간</strong>: 2025년 6월 12일(수) ~ 6월 13일(목)
          <br />• <strong>입양 승인 발표</strong>: 2025년 6월 16일(월) 15:00
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;→ 반려해변 플랫폼 공지사항을 통해 확인하실 수
          있습니다. <br />
          <br />
          다시 한 번 함께해 주셔서 감사합니다.
        </Text>

        <Text
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "24px",
            color: "#2c2c2c",
          }}
        >
          이타서울 | 반려해변 사무국 드림
        </Text>

        <Section style={{ textAlign: "center", marginBottom: "40px" }}>
          <a
            href="https://caresea.kr"
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
            반려해변 방문하기
          </a>
        </Section>

        <Section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
          <Row>
            {/* <Column align="center">
              <Img src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fgov_logo.png&w=3840&q=75" alt="해양수산부" width="80" />
            </Column> */}
            <Column align="center">
              <Img
                src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fkoem_logo.png&w=3840&q=75"
                alt="해양환경공단"
                width="80"
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
          ※ 본 이메일은 25 반려해변 입양 신청 확인을 위해 발송되었습니다. <br />
          ※ 일주일 내외로 담당자에게 개별 연락드릴 예정입니다. <br />※ 문의:
          itaseoul@itaseoul.org |{" "}
          <a
            href="https://pf.kakao.com/_irYGC"
            style={{ color: "#3b82f6", textDecoration: "underline" }}
          >
            반려해변 채널
          </a>
        </Text>
      </Section>
    </Html>
  );
}
