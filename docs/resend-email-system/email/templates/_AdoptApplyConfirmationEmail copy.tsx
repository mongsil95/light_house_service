import { Html, Section, Heading, Text, Img } from "@react-email/components";

export function AdoptApplyConfirmationEmail({ data }: { data: any }) {
  return (
    <Html>
      <Section style={{ padding: "24px", fontFamily: "sans-serif", backgroundColor: "#ffffff" }}>
        <Img
          src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fadb_logo.png&w=3840&q=75"
          alt="Adopt-a-Beach Korea Logo"
          width="120"
          style={{ marginBottom: "24px" }}
        />

        <Heading style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
          25 반려해변 입양신청 접수가 성공적으로 완료되었습니다
        </Heading>

        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
          안녕하세요, <strong>{data.name}</strong> 담당자님.
        </Text>

        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
          반려해변 캠페인에 관심을 가지고 신청해주셔서 진심으로 감사드립니다. <br />
          {data.name}의 따뜻한 관심과 참여는 우리 바다와 해변에 큰 힘이 됩니다. <br />
          앞으로의 활동을 진심으로 응원드립니다.
        </Text>

        <Text style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
          📋 신청 요약
        </Text>
        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "8px" }}>
          담당자: {data.managerName} ({data.managerEmail})
        </Text>
        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "8px" }}>
          기관 유형: {data.orgType}
        </Text>
        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "8px" }}>
          주소: {data.address}
        </Text>
        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "8px" }}>
          홈페이지: {data.homepage}
        </Text>
        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "8px" }}>
          해변 선택 수: {data.desiredBeachCount}개
        </Text>
        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
          입양 이력: {data.hasAdoptHistory}
        </Text>

        {data.beaches && data.beaches.length > 0 && (
          <>
            <Text style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
              신청한 해변 목록
            </Text>
            <Text
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
                marginBottom: "16px",
              }}
            >
              {data.beaches.map((beach: any) => `- ${beach.name} (${beach.addr})`).join("\n")}
            </Text>
          </>
        )}

        <Text style={{ fontSize: "14px", lineHeight: "1.6", marginTop: "24px" }}>
          소중한 입양 신청에 진심으로 감사드립니다. <br />
          아래와 같이 심사 및 승인 일정이 진행됩니다. <br />
          <br />• <strong>심사 기간</strong>: 2025년 6월 12일(수) ~ 6월 13일(목)
          <br />• <strong>입양 승인 발표</strong>: 2025년 6월 16일(월) 15:00
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;→ 반려해변 플랫폼 공지사항을 통해 확인하실 수 있습니다. <br />
          <br />
          다시 한 번 함께해 주셔서 감사합니다.
        </Text>

        <Text style={{ fontSize: "14px", fontWeight: "bold", marginTop: "24px" }}>
          이타서울 | 반려해변 사무국 드림
        </Text>

        {/* 반려해변 사이트 가기 버튼  */}
        <Section style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
          <a
            href="https://team.caresea.kr"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#1A73E8",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            반려해변 플랫폼 방문하기
          </a>
        </Section>

        <Section
          style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "40px" }}
        >
          <Img
            src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fgov_logo.png&w=3840&q=75"
            alt="해양수산부"
            width="80"
          />
          <Img
            src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fkoem_logo.png&w=3840&q=75"
            alt="해양환경공단"
            width="80"
          />
          <Img
            src="https://team.caresea.kr/_next/image?url=%2Flogo%2Fitaseoul_logo.png&w=3840&q=75"
            alt="이타서울"
            width="80"
          />
        </Section>
      </Section>
    </Html>
  );
}
