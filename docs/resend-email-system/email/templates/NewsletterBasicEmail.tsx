// src/lib/email/templates/NewsletterBasicEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface NewsletterBasicEmailProps {
  data: {
    title: string; // 뉴스레터 제목
    recipientName?: string; // 수신자 이름
    recipientOrganization?: string; // 수신자 소속 단체
    contentHtml: string; // Notion → Markdown → HTML 변환된 본문
    unsubscribeUrl?: string; // 구독 취소 URL
    viewOnlineUrl?: string; // 웹에서 보기 URL
  };
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

export const NewsletterBasicEmail = ({ data }: NewsletterBasicEmailProps) => {
  const {
    title,
    recipientName,
    recipientOrganization,
    contentHtml,
    unsubscribeUrl,
    viewOnlineUrl,
  } = data;

  return (
    <Html>
      <Head />
      <Preview>{title} - 반려해변 뉴스레터</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* 헤더 */}
          <Section style={header}>
            <Img
              src={`${baseUrl}/images/logo-caresea.png`}
              width="150"
              height="50"
              alt="반려해변"
              style={logo}
            />
          </Section>

          {/* 웹에서 보기 링크 */}
          {viewOnlineUrl && (
            <Section style={viewOnline}>
              <Text style={viewOnlineText}>
                이메일이 제대로 보이지 않나요?{" "}
                <Link href={viewOnlineUrl} style={viewOnlineLink}>
                  웹에서 보기
                </Link>
              </Text>
            </Section>
          )}

          {/* 제목 */}
          <Section style={titleSection}>
            <Heading style={h1}>{title}</Heading>
            {recipientName && (
              <Text style={greeting}>
                안녕하세요,{" "}
                {recipientOrganization && `${recipientOrganization} `}
                {recipientName} 님!
              </Text>
            )}
          </Section>

          {/* 본문 (Notion HTML) */}
          <Section style={content}>
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </Section>

          <Hr style={hr} />

          {/* 푸터 */}
          <Section style={footer}>
            <Text style={footerText}>
              이 메일은 <strong>반려해변</strong> 프로젝트 참여 단체에게
              발송되었습니다.
            </Text>
            <Text style={footerText}>
              반려해변 사무국 | (사)이타서울
              <br />
              서울특별시 종로구 사직로8길 34, 401호
              <br />
              이메일: info@caresea.kr | 전화: 02-733-7171
            </Text>

            {/* 소셜 미디어 링크 */}
            <Section style={socialLinks}>
              <Link
                href="https://caresea.kr"
                style={socialLink}
                target="_blank"
              >
                🌊 홈페이지
              </Link>
              <Link
                href="https://www.instagram.com/adopt.a.beach"
                style={socialLink}
                target="_blank"
              >
                📷 인스타그램
              </Link>
              <Link
                href="https://www.youtube.com/@AdoptaBeachKR"
                style={socialLink}
                target="_blank"
              >
                🎥 유튜브
              </Link>
            </Section>

            {unsubscribeUrl && (
              <Text style={unsubscribe}>
                <Link href={unsubscribeUrl} style={unsubscribeLink}>
                  수신거부
                </Link>
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterBasicEmail;

// 스타일
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "30px 40px",
  textAlign: "center" as const,
  backgroundColor: "#0066cc",
};

const logo = {
  margin: "0 auto",
};

const viewOnline = {
  padding: "10px 40px",
  backgroundColor: "#f8f9fa",
  textAlign: "center" as const,
};

const viewOnlineText = {
  margin: 0,
  fontSize: "12px",
  color: "#666666",
};

const viewOnlineLink = {
  color: "#0066cc",
  textDecoration: "underline",
};

const titleSection = {
  padding: "32px 40px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 16px 0",
};

const greeting = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0",
};

const content = {
  padding: "0 40px 32px",
  fontSize: "16px",
  lineHeight: "1.7",
  color: "#333333",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "32px 0",
};

const footer = {
  padding: "0 40px 40px",
};

const footerText = {
  color: "#999999",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "8px 0",
  textAlign: "center" as const,
};

const socialLinks = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const socialLink = {
  color: "#0066cc",
  textDecoration: "none",
  fontSize: "14px",
  margin: "0 12px",
  display: "inline-block",
};

const unsubscribe = {
  color: "#999999",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "16px 0 0 0",
};

const unsubscribeLink = {
  color: "#999999",
  textDecoration: "underline",
};
