// src/lib/email/templates/Conf25AttendeeEmail.tsx
import {
  Html,
  Section,
  Heading,
  Text,
  Img,
  Row,
  Column,
  Link,
} from "@react-email/components";

interface Conf25AttendeeEmailProps {
  data: {
    name: string;
    affiliation: string;
    position: string;
    email: string;
    mobile: string;
    attendeeType?: string;
    attendeeTypeLabel: string;
    ticketImage?: string | null; // Base64 티켓 이미지
    ticketNumber?: string;
    beachName?: string;
  };
}

export function Conf25AttendeeEmail({ data }: Conf25AttendeeEmailProps) {
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
          alt="반려해변 로고"
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
          🎉 제3회 반려해변 전국대회 참가가 승인되었습니다
        </Heading>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          안녕하세요, <strong>{data.name}</strong>님.
        </Text>

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            marginBottom: "16px",
            color: "#2c2c2c",
          }}
        >
          맑은 바다를 만드는 반려해변 활동에 관심을 가져주셔서 감사합니다.
          <br />
          <strong>{data.affiliation}</strong>의{" "}
          <strong>{data.attendeeTypeLabel}</strong>으로
          <br />
          2025 반려해변 전국대회 참가가 승인되었습니다.
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
          참가자 정보
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          이름: {data.name}
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          소속: {data.affiliation}
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          직책: {data.position}
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          참석 유형: {data.attendeeTypeLabel}
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          이메일: {data.email}
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "16px", color: "#2c2c2c" }}
        >
          연락처: {data.mobile}
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
          대회 정보
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          행사명: 제3회 반려해변 전국대회 (2025년)
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          주제: 함께 만든 맑은 해변
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          일시: 2025년 12월 15일 (월) 오후 1시 ~ 5시
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "3px", color: "#2c2c2c" }}
        >
          장소: 온드림 소사이어티 1층
        </Text>
        <Text
          style={{ fontSize: "14px", marginBottom: "16px", color: "#2c2c2c" }}
        >
          주소: 서울특별시 중구 명동길 73
        </Text>

        <Section
          style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }}
        />

        {/* 티켓 이미지 섹션 */}
        {data.ticketImage && (
          <>
            <Text
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#000000",
              }}
            >
              🎫 참가 티켓
            </Text>
            {data.ticketNumber && (
              <Text
                style={{
                  fontSize: "13px",
                  textAlign: "center",
                  color: "#6b7280",
                  marginBottom: "12px",
                  marginTop: "8px",
                }}
              >
                티켓 번호:{" "}
                <strong style={{ color: "#0084FC" }}>
                  {data.ticketNumber}
                </strong>
              </Text>
            )}
            <Text
              style={{
                fontSize: "14px",
                textAlign: "center",
                color: "#dc2626",
                marginBottom: "8px",
                fontWeight: "700",
                marginTop: "12px",
              }}
            >
              ⚠️ 중요: 행사 당일 모바일 티켓을 꼭 지참해 주세요
            </Text>
            <Text
              style={{
                fontSize: "13px",
                textAlign: "center",
                color: "#059669",
                marginBottom: "4px",
                lineHeight: "1.5",
                fontWeight: "600",
              }}
            >
              📎 티켓 이미지는 이메일 하단 첨부파일에서 다운로드하실 수 있습니다
            </Text>
            <Text
              style={{
                fontSize: "13px",
                textAlign: "center",
                color: "#6b7280",
                marginBottom: "24px",
                lineHeight: "1.5",
              }}
            >
              첨부파일을 저장하여, 입구에서 보여주세요
            </Text>
            <Section
              style={{ borderTop: "1px dashed #d1d5db", margin: "24px 0" }}
            />
          </>
        )}

        <Text
          style={{ fontSize: "14px", lineHeight: "1.6", marginTop: "24px" }}
        >
          <strong>📋 중요 안내사항</strong>
          <br />
          <br />
          • 초대된 인원만 입장 가능합니다
          <br />
          • 참석자는 텀블러를 지참해 주세요 (다회용기 사용)
          <br />
          • 주차 공간이 제한적이니 대중교통을 이용해 주세요
          <br />
          • 협소한 공간으로 인해 모든 분을 모시지 못하는 점 양해 부탁드립니다
          <br />
          • 자세한 일정은 행사 1주일 전 별도 안내 예정입니다
          <br />
          <br />
          <strong>💡 친절상담 서비스 안내</strong>
          <br />
          행사 관련 궁금한 사항이 있으시면{" "}
          <Link
            href="https://lighthouse.caresea.kr"
            style={{
              color: "#0084FC",
              textDecoration: "underline",
              fontWeight: "600",
            }}
          >
            라이트하우스 (Lighthouse)
          </Link>
          에서 친절하게 상담해 드립니다.
          <br />
        </Text>

        {/* 25반려해변 전국대회 친절상담 서비스 - 강조 섹션 */}
        <Section
          style={{
            marginTop: "32px",
            marginBottom: "32px",
            padding: "20px",
            backgroundColor: "#f0f9ff",
            borderRadius: "8px",
            border: "2px solid #0084FC",
          }}
        >
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#0084FC",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            💬 25반려해변 전국대회 친절상담 서비스
          </Text>
          <Text
            style={{
              fontSize: "14px",
              color: "#1f2937",
              marginBottom: "16px",
              textAlign: "center",
              lineHeight: "1.6",
            }}
          >
            전국대회 관련 모든 궁금한 사항을 <strong>등대지기</strong>가
            친절하게 안내해 드립니다.
            <br />
            참가 준비, 일정, 장소, 주차 등 무엇이든 편하게 문의하세요!
          </Text>
          <Section style={{ textAlign: "center" }}>
            <Link
              href="https://lighthouse.caresea.kr"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                backgroundColor: "#0084FC",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              🏖️ 등대지기 상담하기
            </Link>
          </Section>
        </Section>

        <Text
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            marginTop: "24px",
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
          ※ 본 이메일은 반려해변 전국대회 참가 승인 안내를 위해 발송되었습니다.
          <br />※ 문의: itaseoul@itaseoul.org |{" "}
          <Link
            href="https://pf.kakao.com/_irYGC"
            style={{ color: "#3b82f6", textDecoration: "underline" }}
          >
            반려해변 채널
          </Link>
          <br />※ 친절상담 서비스:{" "}
          <Link
            href="https://lighthouse.caresea.kr"
            style={{ color: "#3b82f6", textDecoration: "underline" }}
          >
            라이트하우스 (Lighthouse)
          </Link>
        </Text>
      </Section>
    </Html>
  );
}

export default Conf25AttendeeEmail;
